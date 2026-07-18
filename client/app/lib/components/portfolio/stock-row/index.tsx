"use client";

import { memo } from "react";
import { flexRender, type Row } from "@tanstack/react-table";
import type { HoldingInterface } from "@interfaces/portfolio.interface";

interface StockRowProps {
  row: Row<HoldingInterface>;
}

function StockRow({ row }: StockRowProps) {
  return (
    <tr className={`tbl-tr `}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="tbl-td">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

export default memo(StockRow);
