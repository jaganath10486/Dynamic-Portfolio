"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  HoldingInterface,
  PortfolioHoldingsInterface,
  PortfolioSummaryInterface,
} from "@interfaces/portfolio.interface";
import { useHome } from "@contexts/home.context";
import MarketStatusIndicator from "@components/dashboard/market-status-indicator";
import LastUpdatedTimestamp from "@components/dashboard/last-updated-timestamp";
import SummaryCards from "@components/dashboard/summary-cards";
import SectorAllocationChart from "@components/dashboard/sector-allocation-chart";
import PortfolioTable from "@components/portfolio/portfolio-table";
import PortfolioService from "@services/portfolio.service";
import { TriangleAlert, RefreshCw, Info, Search, X } from "lucide-react";
import Button from "@ui/button";
import "./styles.scss";

const REFRESH_INTERVAL_MS = 15_000;

interface PortfolioClientProps {
  initialHoldings: PortfolioHoldingsInterface | null;
  initialSummary: PortfolioSummaryInterface | null;
  initialError: string | null;
}

export default function PortfolioClient({
  initialHoldings,
  initialSummary,
  initialError,
}: PortfolioClientProps) {
  const { addToast } = useHome();

  const [holdings, setHoldings] = useState<HoldingInterface[]>(
    initialHoldings?.holdings ?? [],
  );
  const [summary, setSummary] = useState<PortfolioSummaryInterface | null>(
    initialSummary,
  );
  const [isMarketOpen, setIsMarketOpen] = useState(
    initialHoldings?.isMarketOpen ?? false,
  );
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(initialError);
  const [search, setSearch] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<Set<string>>(
    new Set(),
  );

  const allSectors = useMemo(
    () => (summary?.sectors ?? []).map((s) => s.sectorName).sort(),
    [summary],
  );

  const fetchData = useCallback(
    async (searchText: string, sectors: Set<string>) => {
      setIsRefreshing(true);
      try {
        const portfolioService = new PortfolioService();
        const params: Record<string, string> = {};
        if (searchText) params.searchText = searchText;
        if (sectors.size > 0) params.sectors = [...sectors].join(",");

        const [holdingsRes, summaryRes] = await Promise.all([
          portfolioService.getPortfolioHoldings(params),
          portfolioService.getPortfolioSummary(),
        ]);

        if (holdingsRes.success) {
          setHoldings(holdingsRes.data.holdings);
          setIsMarketOpen(holdingsRes.data.isMarketOpen);
        }
        if (summaryRes.success) {
          setSummary(summaryRes.data);
        }

        if (!holdingsRes.success || !summaryRes.success) {
          const msg = !holdingsRes.success
            ? holdingsRes.message
            : summaryRes.message;
          addToast({
            message: msg || "Partial data refresh failed",
            type: "warning",
            position: "top-right",
            duration: 4000,
          });
        }

        setLastUpdated(new Date());
        setFetchError(null);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to refresh portfolio data";
        setFetchError(msg);
        addToast({
          message: msg,
          type: "error",
          position: "top-right",
          duration: 5000,
        });
      } finally {
        setIsRefreshing(false);
      }
    },
    [addToast],
  );

  const refresh = useCallback(
    () => fetchData(search, selectedSectors),
    [fetchData, search, selectedSectors],
  );

  useEffect(() => {
    if (!isMarketOpen) return;
    const id = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isMarketOpen, refresh]);

  const handleSearchChange = useCallback(
    (q: string) => {
      setSearch(q);
      fetchData(q, selectedSectors);
    },
    [fetchData, selectedSectors],
  );

  const handleSectorToggle = useCallback(
    (sector: string) => {
      setSelectedSectors((prev) => {
        const next = new Set(prev);
        if (next.has(sector)) next.delete(sector);
        else next.add(sector);
        fetchData(search, next);
        return next;
      });
    },
    [fetchData, search],
  );

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setSelectedSectors(new Set());
    fetchData("", new Set());
  }, [fetchData]);

  const hasFilters = search.length > 0 || selectedSectors.size > 0;
  const hasSectors = (summary?.sectors?.length ?? 0) > 0;

  if (fetchError && holdings.length === 0) {
    return (
      <div className="pc-error-state">
        <div className="pc-error-icon">
          <TriangleAlert size={40} strokeWidth={1.5} />
        </div>
        <h2 className="pc-error-title">Unable to load portfolio</h2>
        <p className="pc-error-msg">{fetchError}</p>
        <Button
          className="pc-retry-btn"
          onClick={refresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Retrying…" : "Try again"}
        </Button>
      </div>
    );
  }

  return (
    <div className="pc-container">
      <div className="pc-header">
        <div className="pc-header-left">
          <h1 className="pc-title">Portfolio</h1>
          <p className="pc-subtitle">
            Live holdings with market data and fundamentals
          </p>
        </div>
        <div className="pc-header-right">
          <MarketStatusIndicator isOpen={isMarketOpen} />
          <LastUpdatedTimestamp
            lastUpdated={lastUpdated}
            isRefreshing={isRefreshing}
          />
          <Button
            className="pc-refresh-btn"
            onClick={refresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={15} className={isRefreshing ? "pc-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {fetchError && holdings.length > 0 && (
        <div className="pc-inline-error">
          <Info size={14} />
          {fetchError}
        </div>
      )}

      {!isMarketOpen && holdings.length > 0 && (
        <div className="pc-market-closed-notice">
          Market is currently closed. Prices shown are from the last trading
          session.
        </div>
      )}

      <SummaryCards summary={summary} />

      {hasSectors && (
        <div className="pc-bottom-row">
          <div className="pc-chart-col">
            <SectorAllocationChart sectors={summary!.sectors} />
          </div>
        </div>
      )}

      <div className="pc-controls">
        <div className="pc-search-wrap">
          <Search size={16} className="pc-search-icon" />
          <input
            className="pc-search"
            type="text"
            placeholder="Search stocks, sectors…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {search && (
            <Button
              className="pc-search-clear"
              onClick={() => handleSearchChange("")}
            >
              <X size={12} />
            </Button>
          )}
        </div>
        <div className="pc-sector-pills">
          {allSectors.map((sector) => (
            <Button
              key={sector}
              className={
                selectedSectors.has(sector)
                  ? "pc-sector-pill pc-sector-pill--active"
                  : "pc-sector-pill"
              }
              onClick={() => handleSectorToggle(sector)}
            >
              {sector}
            </Button>
          ))}
          {hasFilters && (
            <Button className="pc-clear-btn" onClick={handleClearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

      <PortfolioTable holdings={holdings} isRefreshing={isRefreshing} />
    </div>
  );
}
