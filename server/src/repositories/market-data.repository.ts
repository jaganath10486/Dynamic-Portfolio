import YahooFinance from 'yahoo-finance2';
import { getYahooSymbol, getNseCodeByYahooSymbol } from '@utils/ticker-mapper';
import { ExternalApiError } from '@errors/external-api.error';

const yahooFinance = new YahooFinance();

class MarketDataRepository {
  private static instance: MarketDataRepository;

  private constructor() {}

  public static getInstance(): MarketDataRepository {
    if (!MarketDataRepository.instance) {
      MarketDataRepository.instance = new MarketDataRepository();
    }
    return MarketDataRepository.instance;
  }

  public async fetchBatch(nseCodes: string[]): Promise<Map<string, number | null>> {
    const result = new Map<string, number | null>(nseCodes.map((code) => [code, null]));

    const symbolEntries = nseCodes
      .map((code) => ({ code, symbol: getYahooSymbol(code) }))
      .filter((entry): entry is { code: string; symbol: string } => entry.symbol !== null);

    if (symbolEntries.length === 0) return result;

    try {
      const raw: unknown = await yahooFinance.quote(symbolEntries.map((e) => e.symbol));
      const quotesArray = (Array.isArray(raw) ? raw : [raw]) as Array<{
        symbol?: string;
        regularMarketPrice?: number | null;
      }>;

      for (const quote of quotesArray) {
        if (!quote?.symbol || !quote?.regularMarketPrice) continue;
        const nseCode = getNseCodeByYahooSymbol(quote.symbol);
        if (nseCode) result.set(nseCode, quote.regularMarketPrice);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new ExternalApiError(`Yahoo Finance batch fetch failed: ${message}`);
    }

    return result;
  }
}

export default MarketDataRepository;
