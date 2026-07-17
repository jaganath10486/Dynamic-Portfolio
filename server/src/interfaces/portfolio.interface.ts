import { Sector } from '@enums/sector.enum';

//portfolio holding interface(excel)
export interface IPortfolioHolding {
  particulars: string;
  sector: Sector;
  purchasePrice: number;
  qty: number;
  nseCode: string;
}

//portfolio holding interface(the data that is sent to the client)
export interface HoldingDto {
  sector: Sector;
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
  isDataStale: boolean;
}

//portfolio section holding interface(the data that is sent to the client)
export interface SectorSummaryDto {
  sectorName: Sector;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  gainLossPct: number;
  holdings: HoldingDto[];
}

export interface SectorMetricsDto {
  sectorName: Sector;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  gainLossPct: number;
}

export interface PortfolioHoldingsDto {
  isMarketOpen: boolean;
  holdings: HoldingDto[];
}

export interface PortfolioSummaryDto {
  isMarketOpen: boolean;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPct: number;
  sectors: SectorMetricsDto[];
}
