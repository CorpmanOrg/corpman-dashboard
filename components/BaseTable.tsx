"use client";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Checkbox, Skeleton } from "@mui/material";
import TableMoreDetails from "./TableMoreDetails";
import { Megaphone } from "lucide-react";
import { TableActionOption } from "@/types/types";
import { montserrat } from "@/app/fonts";

// ---- Types ----
export interface Column<T> {
  id: keyof T | "ActionButton"; // allow action buttons too
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any, row: T, rowIndex: number) => React.ReactNode;
}

export interface BaseTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  totalPage: number;
  isLoading?: boolean;

  // optional features
  actionOptions?: TableActionOption[];
  actionItemOnClick?: (option: TableActionOption, columnId: string, row: T) => void;
  skeletonVariant?: "rectangular" | "text" | "circular";
  showDownload?: boolean;
  showCheckbox?: boolean;
  checkboxOnChange?: (row: T | T[], action?: "select-all" | "clear-all") => void;
  selectedRows?: (string | number)[];
  genData?: "pdf" | "csv";
  rowName?: string;
  search?: string;
  filterKey?: string;
}

// ---- Component ----
function BaseTable<T extends { id?: string | number }>({
  rows,
  columns,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  totalPage,
  isLoading = false,
  actionOptions,
  actionItemOnClick,
  skeletonVariant = "rectangular",
  showDownload,
  showCheckbox,
  checkboxOnChange,
  selectedRows = [],
  genData,
}: BaseTableProps<T>) {
  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="w-full overflow-hidden mt-4">
      <TableContainer
        sx={{
          maxHeight: 540,
          borderRadius: "18px",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
              : "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          border: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          },
        }}
      >
        <Table stickyHeader aria-label="modern table">
          <TableHead>
            <TableRow
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(90deg, #334155 0%, #6366f1 100%)"
                    : "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)",
              }}
            >
              {showCheckbox && (
                <TableCell sx={{ backgroundColor: "transparent" }}>
                  <Checkbox
                    sx={{
                      color: "#6366f1",
                      "&.Mui-checked": { color: "#06b6d4" },
                    }}
                    checked={rows.length > 0 && selectedRows.length === rows.length}
                    onChange={(event) => checkboxOnChange?.(rows, event.target.checked ? "select-all" : "clear-all")}
                  />
                </TableCell>
              )}
              {columns.map((column, id) => (
                <TableCell
                  key={id}
                  align={column.align}
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    textTransform: "capitalize",
                    letterSpacing: "0.03em",
                    color: "#222",
                    borderBottom: "none",
                    fontFamily: montserrat.style.fontFamily,
                    whiteSpace: "nowrap", // <-- Prevent header text wrapping
                    minWidth: column.minWidth, // <-- Respect minWidth from column definition
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {showDownload && <TableCell sx={{ backgroundColor: "transparent" }} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              [...Array(10).keys()].map((tr) => (
                <TableRow key={tr}>
                  {columns.map((_, idx) => (
                    <TableCell key={idx}>
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{
                          bgcolor: "#e0e7ff",
                          borderRadius: "10px",
                        }}
                        height={28}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2}>
                  <div className="px-10 py-10 flex flex-col items-center justify-center">
                    <h1 className="font-semibold mb-1 text-lg text-gray-600">No Records Found</h1>
                    <Megaphone style={{ width: 120, height: 120, color: "#6366f1" }} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows?.map((row, index) => (
                <TableRow
                  key={row?.id ?? index}
                  hover
                  sx={{
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? index % 2 === 0
                          ? "#1e293b"
                          : "#334155"
                        : index % 2 === 0
                        ? "#f3f4f6"
                        : "#e0e7ff",
                    color: (theme) => (theme.palette.mode === "dark" ? "#fff" : "#374151"),
                    transition: "all 0.25s ease",
                    "&:hover": {
                      background: (theme) => (theme.palette.mode === "dark" ? "#6366f1" : "#dbeafe"),
                      boxShadow: "0 4px 16px rgba(99,102,241,0.10)",
                    },
                  }}
                >
                  {showCheckbox && (
                    <TableCell>
                      <Checkbox
                        sx={{
                          color: "#6366f1",
                          "&.Mui-checked": { color: "#06b6d4" },
                        }}
                        checked={row.id ? selectedRows.includes(row.id) : false}
                        onChange={() => checkboxOnChange?.(row)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column, idx) => {
                    const value = row[column.id as keyof T];
                    return (
                      <TableCell
                        key={idx}
                        align={column.align}
                        sx={{
                          fontSize: "0.95rem",
                          color: "#374151",
                          borderBottom: "none",
                          fontFamily: montserrat.style.fontFamily,
                          whiteSpace: "nowrap", // <-- Prevent cell text wrapping
                          minWidth: column.minWidth, // <-- Respect minWidth from column definition
                        }}
                      >
                        {column.id === "ActionButton" ? (
                          <TableMoreDetails
                            options={actionOptions || []}
                            itemOnClick={(itm) => actionItemOnClick?.(itm, String(column.id), row)}
                          />
                        ) : column.format ? (
                          column.format(value, row, index)
                        ) : (
                          String(value ?? "")
                        )}
                      </TableCell>
                    );
                  })}
                  {showDownload && <TableCell />}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {rows.length > 0 && (
        <TablePagination
          component="div"
          page={page}
          rowsPerPage={rowsPerPage}
          count={totalPage}
          rowsPerPageOptions={[10, 50, 100]}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </div>
  );
}

export default BaseTable;
