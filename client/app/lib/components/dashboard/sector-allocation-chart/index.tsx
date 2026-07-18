"use client";

import { memo } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import type { SectorMetricsInterface } from "@interfaces/portfolio.interface";
import { formatCurrency, formatPct } from "@utils/format.utils";
import "./styles.scss";

interface Props {
  sectors: SectorMetricsInterface[];
}

const SECTOR_COLORS: Record<string, string> = {
  Financial: "#3b82f6",
  Technology: "#8b5cf6",
  Consumer: "#f59e0b",
  Power: "#10b981",
  Pipes: "#ef4444",
  Others: "#64748b",
};

const DEFAULT_COLOR = "#94a3b8";

function getColor(name: string, index: number): string {
  return (
    SECTOR_COLORS[name] ??
    Object.values(SECTOR_COLORS)[index % Object.values(SECTOR_COLORS).length] ??
    DEFAULT_COLOR
  );
}

function SectorAllocationChart({ sectors }: Props) {
  if (!sectors.length) return null;

  const total = sectors.reduce((s, x) => s + x.totalInvestment, 0);
  const coloredSectors = sectors.map((s, i) => ({
    ...s,
    fill: getColor(s.sectorName, i),
  }));

  return (
    <div className="sac-wrap">
      <h3 className="sac-title">Sector Allocation</h3>
      <div className="sac-inner">
        <div className="sac-chart">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={coloredSectors}
                dataKey="totalInvestment"
                nameKey="sectorName"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={90}
                paddingAngle={3}
                strokeWidth={0}
                opacity={0.9}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(148,163,184,0.15)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="sac-legend">
          {sectors.map((s, i) => (
            <div key={s.sectorName} className="sac-legend-item">
              <span
                className="sac-legend-dot"
                style={{ background: getColor(s.sectorName, i) }}
              />
              <div className="sac-legend-body">
                <div className="sac-legend-name">{s.sectorName}</div>
                <div className="sac-legend-meta">
                  <span>{((s.totalInvestment / total) * 100).toFixed(1)}%</span>
                  <span
                    className={
                      s.gainLossPct >= 0
                        ? "sac-legend-gl--positive"
                        : "sac-legend-gl--negative"
                    }
                  >
                    {formatPct(s.gainLossPct)}
                  </span>
                </div>
              </div>
              <div className="sac-legend-val">
                {formatCurrency(s.totalInvestment)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(SectorAllocationChart);
