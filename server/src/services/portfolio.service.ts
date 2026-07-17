import { portfolioHoldings } from '@data/portfolio-data';
import { isNseOpen } from '@utils/market-hours';
import { getGoogleFinancePath } from '@utils/ticker-mapper';
import { Utilities } from '@utils/utils';
import { CacheStructureKey, CacheTTL } from '@constants/cache.constants';
import CacheService from '@services/cache.service';
import MarketDataRepository from '@repositories/market-data.repository';
import FundamentalsRepository from '@repositories/fundamentals.repository';
import { ExternalApiError } from '@errors/external-api.error';
import type {
  HoldingDto,
  SectorSummaryDto,
  SectorMetricsDto,
  PortfolioHoldingsDto,
  PortfolioSummaryDto,
  IPortfolioHolding,
} from '@interfaces/portfolio.interface';
import { Sector } from '@enums/sector.enum';

interface FundamentalsData {
  peRatio: number | null;
  latestEarnings: number | null;
}

class PortfolioService {
  private static instance: PortfolioService;
  private readonly cache: CacheService;
  private readonly marketDataRepo: MarketDataRepository;
  private readonly fundamentalsRepo: FundamentalsRepository;

  private constructor() {
    this.cache = CacheService.getInstance();
    this.marketDataRepo = MarketDataRepository.getInstance();
    this.fundamentalsRepo = FundamentalsRepository.getInstance();
  }

  public static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService();
    }
    return PortfolioService.instance;
  }

  // Returns a flat holdings list — frontend handles grouping
  public async getPortfolioHoldings(): Promise<PortfolioHoldingsDto> {
    const totalInvestment = portfolioHoldings.reduce(
      (sum, h) => sum + h.purchasePrice * h.qty,
      0,
    );

    const [cmpMap, fundamentalsData] = await Promise.all([
      this.fetchAllCmps(),
      this.fetchAllFundamentals(),
    ]);

    const holdings = portfolioHoldings.map((h) =>
      this.buildHoldingDto(h, cmpMap, fundamentalsData, totalInvestment),
    );

    return { isMarketOpen: isNseOpen(), holdings };
  }

  // Groups holdings by sector server-side for the summary cards
  public async getPortfolioSummary(): Promise<PortfolioSummaryDto> {
    const { isMarketOpen, holdings } = await this.getPortfolioHoldings();

    const sectorGroups = this.groupBySector(holdings);

    const sectors: SectorMetricsDto[] = sectorGroups.map(
      ({ holdings: h, ...metrics }) => metrics,
    );

    const totalInvestment = Utilities.roundToTwo(
      sectors.reduce((sum, s) => sum + s.totalInvestment, 0),
    );
    const totalPresentValue = Utilities.roundToTwo(
      sectors.reduce((sum, s) => sum + s.totalPresentValue, 0),
    );
    const totalGainLoss = Utilities.roundToTwo(totalPresentValue - totalInvestment);
    const totalGainLossPct = Utilities.roundToTwo((totalGainLoss / totalInvestment) * 100);

    return {
      isMarketOpen,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      totalGainLossPct,
      sectors,
    };
  }

  private async fetchAllCmps(): Promise<Map<string, number | null>> {
    const result = new Map<string, number | null>();
    const missedNseCodes: string[] = [];

    // Step 1: Check cache for each ticker's CMP
    await Promise.all(
      portfolioHoldings.map(async (h) => {
        const cacheKey = `${CacheStructureKey.MarketCmp}:${h.nseCode}`;
        const cached = await this.cache.get(cacheKey);

        if (cached !== null) {
          result.set(h.nseCode, parseFloat(cached));
        } else {
          result.set(h.nseCode, null);
          missedNseCodes.push(h.nseCode);
        }
      }),
    );

    if (missedNseCodes.length === 0) return result;

    // Step 2: Batch-fetch from Yahoo Finance for all cache misses
    let freshCmpData: Map<string, number | null>;
    try {
      freshCmpData = await this.marketDataRepo.fetchBatch(missedNseCodes);
    } catch (err) {
      // Yahoo Finance unavailable — serve with isDataStale: true for all affected tickers
      if (err instanceof ExternalApiError) {
        console.warn('[CMP] Yahoo Finance unavailable, all prices marked stale:', err.message);
      } else {
        console.error('[CMP] Unexpected error fetching market data:', err);
      }
      return result;
    }
    const freshEntries = Array.from(freshCmpData.entries());

    // Step 3: Populate result map and back-fill cache with fresh prices
    await Promise.all(
      freshEntries.map(async ([nseCode, cmp]) => {
        result.set(nseCode, cmp);
        if (cmp !== null) {
          await this.cache.set(
            `${CacheStructureKey.MarketCmp}:${nseCode}`,
            cmp.toString(),
            CacheTTL.CmpSeconds,
          );
        }
      }),
    );

    return result;
  }

  // Per-ticker: cache-first, then Google Finance scrape
  private async fetchFundamentalsForTicker(h: IPortfolioHolding): Promise<FundamentalsData> {
    const cacheKey = `${CacheStructureKey.FundamentalsData}:${h.nseCode}`;

    const cached = await this.cache.getJson<FundamentalsData>(cacheKey);
    if (cached !== null) return cached;

    const googlePath = getGoogleFinancePath(h.nseCode);
    if (!googlePath) return { peRatio: null, latestEarnings: null };

    let fresh: FundamentalsData;
    try {
      fresh = await this.fundamentalsRepo.scrape(googlePath);
    } catch (err) {
      // Google Finance unavailable for this ticker — return nulls, don't crash the whole response
      if (err instanceof ExternalApiError) {
        console.warn(`[Fundamentals] Scrape degraded for ${h.nseCode}:`, err.message);
      } else {
        console.error(`[Fundamentals] Unexpected error for ${h.nseCode}:`, err);
      }
      return { peRatio: null, latestEarnings: null };
    }

    await this.cache.setJson(cacheKey, fresh, CacheTTL.FundamentalsSeconds);
    return fresh;
  }

  // All tickers: fans out fetchFundamentalsForTicker in parallel
  private async fetchAllFundamentals(): Promise<Map<string, FundamentalsData>> {
    const entries = await Promise.all(
      portfolioHoldings.map(async (h) => {
        const data = await this.fetchFundamentalsForTicker(h);
        return [h.nseCode, data] as const;
      }),
    );
    return new Map(entries);
  }

  private buildHoldingDto(
    h: IPortfolioHolding,
    cmpMap: Map<string, number | null>,
    fundamentalsMap: Map<string, FundamentalsData>,
    totalInvestment: number,
  ): HoldingDto {
    const investment = Utilities.roundToTwo(h.purchasePrice * h.qty);
    const cmp = cmpMap.get(h.nseCode) ?? null;
    const presentValue = cmp !== null ? Utilities.roundToTwo(cmp * h.qty) : null;
    const gainLoss = presentValue !== null ? Utilities.roundToTwo(presentValue - investment) : null;
    const gainLossPct = gainLoss !== null ? Utilities.roundToTwo((gainLoss / investment) * 100) : null;
    const portfolioPct = Utilities.roundToTwo((investment / totalInvestment) * 100);
    const fundamentals = fundamentalsMap.get(h.nseCode);

    return {
      sector: h.sector,
      particulars: h.particulars,
      purchasePrice: h.purchasePrice,
      qty: h.qty,
      investment,
      portfolioPct,
      nseCode: h.nseCode,
      cmp,
      presentValue,
      gainLoss,
      gainLossPct,
      peRatio: fundamentals?.peRatio ?? null,
      latestEarnings: fundamentals?.latestEarnings ?? null,
      isDataStale: cmp === null,
    };
  }

  private groupBySector(holdings: HoldingDto[]): SectorSummaryDto[] {
    const sectorMap = new Map<Sector, HoldingDto[]>();

    for (const holding of holdings) {
      const { sector } = holding;
      const existing = sectorMap.get(sector) ?? [];
      sectorMap.set(sector, [...existing, holding]);
    }

    return Array.from(sectorMap.entries()).map(([sectorName, sectorHoldings]) => {
      const totalInvestment = Utilities.roundToTwo(
        sectorHoldings.reduce((sum, h) => sum + h.investment, 0),
      );
      const totalPresentValue = Utilities.roundToTwo(
        sectorHoldings.reduce((sum, h) => sum + (h.presentValue ?? 0), 0),
      );
      const gainLoss = Utilities.roundToTwo(totalPresentValue - totalInvestment);
      const gainLossPct = Utilities.roundToTwo((gainLoss / totalInvestment) * 100);

      return { sectorName, totalInvestment, totalPresentValue, gainLoss, gainLossPct, holdings: sectorHoldings };
    });
  }
}

export default PortfolioService;
