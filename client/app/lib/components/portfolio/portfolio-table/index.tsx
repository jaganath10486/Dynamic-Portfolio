"use client";

import { useState, useMemo, useCallback, useEffect, Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type Row,
} from "@tanstack/react-table";
import type { HoldingInterface } from "@interfaces/portfolio.interface";
import GainLossCell from "@components/portfolio/gain-loss-cell";
import SectorGroupRow from "@components/portfolio/sector-group-row";
import StockRow from "@components/portfolio/stock-row";
import { formatCurrency } from "@utils/format.utils";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import "./styles.scss";

interface PortfolioTableProps {
  holdings: HoldingInterface[];
  isRefreshing: boolean;
}

function PortfolioTable({ holdings, isRefreshing }: PortfolioTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(
    () => new Set(holdings.map((h) => h.sector)),
  );

  useEffect(() => {
    setExpandedSectors((prev) => {
      const next = new Set(prev);
      holdings.forEach((h) => next.add(h.sector));
      return next;
    });
  }, [holdings]);

  const columns = useMemo<ColumnDef<HoldingInterface>[]>(
    () => [
      {
        id: "particulars",
        accessorKey: "particulars",
        header: "Particulars",
        size: 190,
        cell: (info) => (
          <div className="pt-stock-cell">
            <span className="pt-stock-name">{info.getValue<string>()}</span>
            <span className="pt-nse-code">{info.row.original.nseCode}</span>
          </div>
        ),
      },
      {
        id: "purchasePrice",
        accessorKey: "purchasePrice",
        header: "Purchase Price",
        size: 110,
        cell: (info) => (
          <span className="pt-number">
            {formatCurrency(info.getValue<number>())}
          </span>
        ),
      },
      {
        id: "qty",
        accessorKey: "qty",
        header: "Qty",
        size: 60,
        cell: (info) => (
          <span className="pt-number">{info.getValue<number>()}</span>
        ),
      },
      {
        id: "investment",
        accessorKey: "investment",
        header: "Investment",
        size: 110,
        cell: (info) => (
          <span className="pt-number pt-number-primary">
            {formatCurrency(info.getValue<number>())}
          </span>
        ),
      },
      {
        id: "portfolioPct",
        accessorKey: "portfolioPct",
        header: "Portfolio %",
        size: 80,
        cell: (info) => (
          <span className="pt-number">
            {info.getValue<number>().toFixed(1)}%
          </span>
        ),
      },
      {
        id: "cmp",
        accessorKey: "cmp",
        header: "CMP",
        size: 105,
        cell: (info) => {
          const row = info.row.original;
          if (row.cmp === null) {
            return <span className="pt-null">-</span>;
          }
          return <span className={`pt-number`}>{formatCurrency(row.cmp)}</span>;
        },
      },
      {
        id: "presentValue",
        accessorKey: "presentValue",
        header: "Present Value",
        size: 115,
        cell: (info) => (
          <span className="pt-number pt-number-primary">
            {formatCurrency(info.getValue<number | null>())}
          </span>
        ),
      },
      {
        id: "gainLoss",
        accessorKey: "gainLoss",
        header: "Gain / Loss",
        size: 140,
        cell: (info) => {
          const row = info.row.original;
          return <GainLossCell value={row.gainLoss} pct={row.gainLossPct} />;
        },
      },
      {
        id: "peRatio",
        accessorKey: "peRatio",
        header: "P/E (TTM)",
        size: 82,
        cell: (info) => {
          const v = info.getValue<number | null>();
          return v !== null ? (
            <span className="pt-number">{v.toFixed(1)}×</span>
          ) : (
            <span className="pt-null">—</span>
          );
        },
      },
      {
        id: "latestEarnings",
        accessorKey: "latestEarnings",
        header: "Latest Earnings",
        size: 115,
        cell: (info) => {
          const v = info.getValue<number | null>();
          return v !== null ? (
            <span className="pt-number">{formatCurrency(v)}</span>
          ) : (
            <span className="pt-null">—</span>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: holdings,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const groupedRows = useMemo(() => {
    const result = new Map<string, Row<HoldingInterface>[]>();
    for (const row of table.getRowModel().rows) {
      const sector = row.original.sector;
      if (!result.has(sector)) result.set(sector, []);
      result.get(sector)?.push(row);
    }
    return [...result.entries()];
  }, [holdings, sorting]);

  const toggleSector = useCallback((sector: string) => {
    setExpandedSectors((prev) => {
      const next = new Set(prev);
      if (next.has(sector)) next.delete(sector);
      else next.add(sector);
      return next;
    });
  }, []);

  const colSpan = columns.length;

  return (
    <div className="pt-wrap">
      <div className="pt-table-meta">
        <span className="pt-row-count">
          {holdings.length} holding{holdings.length !== 1 ? "s" : ""}
        </span>
        {isRefreshing && (
          <span className="pt-refreshing-badge">Refreshing…</span>
        )}
      </div>

      <div className="tbl-wrap">
        <div className="tbl-scroll">
          <table className="tbl">
            <thead className="tbl-head">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        className={
                          canSort ? "tbl-th tbl-th--sortable" : "tbl-th"
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          width:
                            header.getSize() !== 150
                              ? header.getSize()
                              : undefined,
                        }}
                      >
                        <div className="tbl-th-inner">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                          {canSort && (
                            <span
                              className={
                                sorted
                                  ? "tbl-sort-icon tbl-sort-icon--active"
                                  : "tbl-sort-icon"
                              }
                            >
                              {sorted === "asc" ? (
                                <ArrowUp size={10} />
                              ) : sorted === "desc" ? (
                                <ArrowDown size={10} />
                              ) : (
                                <ArrowUpDown size={10} />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {groupedRows.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="tbl-empty">
                    No holdings to display.
                  </td>
                </tr>
              ) : (
                groupedRows.map(([sector, rows]) => (
                  <Fragment key={sector}>
                    <SectorGroupRow
                      sectorName={sector}
                      holdings={rows.map((r) => r.original)}
                      isExpanded={expandedSectors.has(sector)}
                      onToggle={() => toggleSector(sector)}
                      colSpan={colSpan}
                    />
                    {expandedSectors.has(sector) &&
                      rows.map((row) => <StockRow key={row.id} row={row} />)}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PortfolioTable;
