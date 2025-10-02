"use client";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
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
  actionOptions?: TableActionOption[] | ((row: T) => TableActionOption[]);
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
          borderRadius: "0px",
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
                backgroundColor: "#f9fdf9", // <-- Add a background color for the header row
                ".dark &": {
                  backgroundColor: "#1a1a1a", // <-- Dark mode header background
                },
              }}
            >
              {showCheckbox && (
                <TableCell
                  sx={{
                    backgroundColor: "#f9fdf9", // <-- Match header background
                    width: 48,
                    textAlign: "center",
                    ".dark &": {
                      backgroundColor: "#f9fdf9",
                    },
                  }}
                >
                  <Checkbox
                    sx={{
                      color: "#33ef3fff",
                      "&.Mui-checked": { color: "#33ef3fff" },
                      margin: "0 auto",
                      display: "block",
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
                    whiteSpace: "nowrap",
                    minWidth: column.minWidth,
                    backgroundColor: "#f9fdf9", // <-- Match header background
                    ".dark &": {
                      color: "black",
                      backgroundColor: "#f9fdf9f6",
                    },
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {showDownload && <TableCell sx={{ backgroundColor: "#f9fdf9" }} />}
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
                          borderRadius: "0px",
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
                  sx={(theme) => ({
                    background: index % 2 === 0 ? "#f5fff8ff" : "#ecf8efff",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      background: (theme) => (theme.palette.mode === "dark" ? "#6366f1" : "#6366f1"),
                      boxShadow: "0 4px 16px rgba(99,102,241,0.10)",
                    },
                    ".dark &": {
                      background: "#071121ff",
                      // background: "#0a0e1a",
                    },
                  })}
                >
                  {showCheckbox && (
                    <TableCell>
                      <Checkbox
                        sx={{
                          color: "#33ef3fff",
                          "&.Mui-checked": { color: "#33ef3fff" },
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
                          ".dark &": {
                            color: "#dadddaa1",
                          },
                        }}
                      >
                        {column.id === "ActionButton" ? (
                          <TableMoreDetails
                            options={
                              typeof actionOptions === "function"
                                ? actionOptions(row) // ✅ per-row actions
                                : actionOptions || []
                            }
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
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
          sx={{
            py: 3,
            px: 2,
            background: "#fff",
            ".dark &": {
              background: "transparent !important",
            },
          }}
        >
          <Pagination
            count={totalPage}
            page={page + 1} // MUI Pagination is 1-based, your page is 0-based
            onChange={(_, value) => setPage(value - 1)}
            color="secondary"
            variant="outlined"
            shape="circular"
            size="small"
            showFirstButton
            showLastButton
            sx={{
              "& .Mui-selected": {
                backgroundColor: "#14e664ff !important",
                font: "bold",
                color: "#000 !important",
                borderColor: "#14e664ff !important",
              },
              "& .MuiPaginationItem-root": {
                fontFamily: montserrat.style.fontFamily,
                // backgroundColor: "#14e664ff !important",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#e0f5e8ff !important",
                color: "#fff !important",
              },
              ".dark & .Mui-selected": {
                backgroundColor: "#d5510fb4 !important",
                color: "#dddadaa1 !important",
              },
              ".dark & .MuiPaginationItem-root": {
                backgroundColor: "#15012eff !important",
                color: "#dddadaa1 !important",
              },
              ".dark & .MuiPaginationItem-root:hover": {
                backgroundColor: "#6366f1 !important",
                borderColor: "none !important",
                color: "#fff !important",
              },
            }}
          />
          <span
            style={{
              fontFamily: montserrat.style.fontFamily,
              fontSize: "0.8rem",
              color: "#14e664ff",
            }}
            className="dark:text-[#dddadaa1] font-semibold"
          >
            Page {page + 1} of {totalPage}
          </span>
        </Stack>
      )}
    </div>
  );
}

export default BaseTable;
