"use client";

import { memo, useMemo } from "react";
import type { HoldingInterface } from "@interfaces/portfolio.interface";
import { formatCurrency, formatPct } from "@utils/format.utils";
import { ChevronRight } from "lucide-react";
import "./styles.scss";

const SECTOR_COLORS: Record<string, string> = {
  Financial: "#3b82f6",
  Technology: "#8b5cf6",
  Consumer: "#f59e0b",
  Power: "#10b981",
  Pipes: "#ef4444",
  Others: "#64748b",
};

const DEFAULT_COLOR = "#94a3b8";

interface SectorGroupRowProps {
  sectorName: string;
  holdings: HoldingInterface[];
  isExpanded: boolean;
  onToggle: () => void;
  colSpan: number;
}

function SectorGroupRow({
  sectorName,
  holdings,
  isExpanded,
  onToggle,
  colSpan,
}: SectorGroupRowProps) {
  const metrics = useMemo(() => {
    const totalInvested = holdings.reduce((s, h) => s + h.investment, 0);
    const totalValue = holdings.reduce(
      (s, h) => s + (h.presentValue ?? h.investment),
      0,
    );
    const gainLoss = totalValue - totalInvested;
    const gainLossPct =
      totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;
    return { totalInvested, totalValue, gainLoss, gainLossPct };
  }, [holdings]);

  const color = SECTOR_COLORS[sectorName] ?? DEFAULT_COLOR;
  const isGain = metrics.gainLoss >= 0;

  return (
    <tr className="sgr-row" onClick={onToggle}>
      <td className="sgr-td" colSpan={colSpan}>
        <div className="sgr-inner">
          <div className="sgr-left">
            <span
              className={`sgr-caret${isExpanded ? " sgr-caret--expanded" : ""}`}
            >
              <ChevronRight size={12} />
            </span>
            <span className="sgr-dot" style={{ background: color }} />
            <span className="sgr-name">{sectorName}</span>
            <span className="sgr-count">
              {holdings.length} stock{holdings.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="sgr-right">
            <div className="sgr-metric">
              <span className="sgr-metric-label">Invested</span>
              <span className="sgr-metric-val">
                {formatCurrency(metrics.totalInvested)}
              </span>
            </div>
            <div
              className="sgr-met
            ric"
            >
              <span className="sgr-metric-label">Value</span>
              <span className="sgr-metric-val">
                {formatCurrency(metrics.totalValue)}
              </span>
            </div>
            <div className="sgr-metric">
              <span className="sgr-metric-label">Gain / Loss</span>
              <span
                className={`sgr-metric-val${isGain ? " sgr-metric-val--positive" : " sgr-metric-val--negative"}`}
              >
                {formatCurrency(metrics.gainLoss)}{" "}
                <span className="sgr-pct">
                  ({formatPct(metrics.gainLossPct)})
                </span>
              </span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default memo(SectorGroupRow);
