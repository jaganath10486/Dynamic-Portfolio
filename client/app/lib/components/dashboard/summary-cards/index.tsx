"use client";

import { memo, useMemo } from "react";
import type {
  PortfolioSummaryInterface,
  SectorMetricsInterface,
} from "@interfaces/portfolio.interface";
import { formatCurrency, formatPct } from "@utils/format.utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import "./styles.scss";

interface SummaryCardsProps {
  summary: PortfolioSummaryInterface | null;
}

function SummaryCards({ summary }: SummaryCardsProps) {
  const { best, worst } = useMemo(() => {
    if (!summary?.sectors?.length) return { best: null, worst: null };
    const sorted = [...summary.sectors].sort(
      (a, b) => a.gainLossPct - b.gainLossPct,
    );
    return { best: sorted[sorted.length - 1], worst: sorted[0] };
  }, [summary]);

  if (!summary) {
    return null;
  }

  const isGain = summary.totalGainLoss >= 0;

  return (
    <div className="sc-grid">
      <SummaryCard
        label="Portfolio Value"
        primary={formatCurrency(summary.totalPresentValue)}
        secondary={`Invested ${formatCurrency(summary.totalInvestment)}`}
        variant="neutral"
      />
      <SummaryCard
        label="Total Gain / Loss"
        primary={formatCurrency(summary.totalGainLoss)}
        secondary={formatPct(summary.totalGainLossPct)}
        variant={isGain ? "gain" : "loss"}
        indicator={isGain ? "up" : "down"}
      />
      <SectorCard label="Best Sector" sector={best} />
      <SectorCard label="Worst Sector" sector={worst} />
    </div>
  );
}

export default memo(SummaryCards);

interface SummaryCardProps {
  label: string;
  primary: string;
  secondary: string;
  variant: "neutral" | "gain" | "loss";
  indicator?: "up" | "down";
}

function SummaryCard({
  label,
  primary,
  secondary,
  variant,
  indicator,
}: SummaryCardProps) {
  const cardClass =
    variant === "neutral" ? "sc-card" : `sc-card sc-card--${variant}`;
  return (
    <div className={cardClass}>
      <div className="sc-card-header">
        <span className="sc-label">{label}</span>
        {indicator && (
          <span className={`sc-indicator sc-indicator--${indicator}`}>
            {indicator === "up" ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )}
          </span>
        )}
      </div>
      <div className="sc-primary">{primary}</div>
      <div className="sc-secondary">{secondary}</div>
    </div>
  );
}

interface SectorCardProps {
  label: string;
  sector: SectorMetricsInterface | null;
}

function SectorCard({ label, sector }: SectorCardProps) {
  if (!sector) {
    return (
      <div className="sc-card">
        <div className="sc-label">{label}</div>
        <div className="sc-primary sc-muted">—</div>
      </div>
    );
  }
  const isGain = sector.gainLossPct >= 0;
  return (
    <div className={`sc-card sc-card--${isGain ? "gain" : "loss"}`}>
      <div className="sc-card-header">
        <span className="sc-label">{label}</span>
      </div>
      <div className="sc-primary">{sector.sectorName}</div>
      <div className="sc-secondary">
        {formatPct(sector.gainLossPct)}{" "}
        <span className="sc-dim">({formatCurrency(sector.gainLoss)})</span>
      </div>
    </div>
  );
}
