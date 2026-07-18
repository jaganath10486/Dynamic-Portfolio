import "./styles/loading.scss";
import React from "react";

export default function PortfolioLoading() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="pl-root">
          <div className="pl-header">
            <div className="pl-skel pl-title-skel" />
            <div className="pl-skel pl-sub-skel" />
          </div>

          <div className="pl-cards">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="pl-skel pl-card-skel" />
            ))}
          </div>

          <div className="pl-skel pl-chart-skel" />

          <div className="pl-table-skel">
            <div
              className="pl-skel pl-row-skel"
              style={{ width: "100%", height: "48px" }}
            />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="pl-skel pl-row-skel" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
