export interface HoldingInterface {
  sector: string;
  particulars: string;
  purchasePrice: number;
  qty: number;
  investment: number;
  portfolioPct: number;
  nseCode: string;
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  gainLossPct: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
}

export interface SectorMetricsInterface {
  sectorName: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  gainLossPct: number;
}

export interface PortfolioHoldingsInterface {
  isMarketOpen: boolean;
  holdings: HoldingInterface[];
}

export interface PortfolioSummaryInterface {
  isMarketOpen: boolean;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPct: number;
  sectors: SectorMetricsInterface[];
}
