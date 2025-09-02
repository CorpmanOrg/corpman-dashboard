"use client";
import React, { useEffect, useState } from "react";
import { fetchReportSummary, fetchReportTrends, fetchTopUsers } from "@/utils/ApiFactory/reporting";
import { ReportSummary, ReportTrend, TopUserReport } from "@/types/types";
import { StatCard } from "@/components/Statistics/MainStatisticsCard.tsx";
import { LineCharts } from "@/components/Charts/LineCharts";
import { PieCharts } from "@/components/Charts/PieCharts";
import BaseTable, { Column } from "@/components/BaseTable";
import { Button } from "@/components/ui/button";
import { ChevronDown, TrendingUp, Users } from "lucide-react";
import { downloadPDF } from "@/components/Download/PDF/pdf";
import { downloadCSV } from "@/components/Download/CSV/csv";
import { downloadExcel } from "@/components/Download/XLSX/xlsx";
import { downloadImage } from "@/components/Download/HtmlToCanvas/htCnvs";

const REPORT_TYPES = [
  { label: "Transactions", value: "transactions" },
  { label: "Loans", value: "loans" },
  { label: "Investments", value: "investments" },
  { label: "Withdrawals", value: "withdrawals" },
  { label: "Savings", value: "savings" },
  { label: "Top Users", value: "topUsers" },
];

const EXPORT_TYPES = [
  { label: "PDF", value: "pdf" },
  { label: "Excel", value: "excel" },
  { label: "CSV", value: "csv" },
  { label: "Image", value: "image" },
];

export default function ReportingPage() {
  const [summaries, setSummaries] = useState<ReportSummary[]>([]);
  const [trends, setTrends] = useState<ReportTrend[]>([]);
  const [topUsers, setTopUsers] = useState<TopUserReport[]>([]);
  const [selectedReport, setSelectedReport] = useState(REPORT_TYPES[0].value);
  const [selectedExport, setSelectedExport] = useState(EXPORT_TYPES[0].value);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  useEffect(() => {
    fetchReportSummary().then(setSummaries);
    fetchReportTrends().then(setTrends);
    fetchTopUsers().then(setTopUsers);
  }, []);

  // Table columns for top users
  const topUserColumns: Column<TopUserReport>[] = [
    { id: "name", label: "User Name", minWidth: 120 },
    { id: "amount", label: "Amount", minWidth: 100, format: (v) => `₦${v.toLocaleString()}` },
    { id: "category", label: "Category", minWidth: 100 },
  ];

  // Example: Filtered data for export (replace with your actual data logic)
  let exportRows: any[] = [];
  let exportColumns: any[] = [];
  let filename = "";

  if (selectedReport === "topUsers") {
    exportRows = topUsers;
    exportColumns = topUserColumns;
    filename = "top-users-report";
  } else if (selectedReport === "transactions") {
    exportRows = summaries.filter((s) => s.category === selectedReport);
    exportRows = exportRows.filter((tx) => (!startDate || tx.date >= startDate) && (!endDate || tx.date <= endDate));
    exportColumns = [
      { label: "Category", id: "category" },
      { label: "Total", id: "total" },
      { label: "Count", id: "count" },
      { label: "Growth (%)", id: "growth" },
    ];
    filename = `${selectedReport}-report`;
  } else {
    // For summary-based reports
    exportRows = summaries.filter((s) => s.category === selectedReport);
    exportColumns = [
      { label: "Category", id: "category" },
      { label: "Total", id: "total" },
      { label: "Count", id: "count" },
      { label: "Growth (%)", id: "growth" },
    ];
    filename = `${selectedReport}-report`;
  }

  // Export handler
  const handleExport = () => {
    switch (selectedExport) {
      case "pdf":
        downloadPDF(exportRows, exportColumns, `${filename}.pdf`);
        break;
      case "excel":
        downloadExcel(exportRows, `${filename}.xlsx`);
        break;
      case "csv":
        downloadCSV(exportRows, exportColumns, `${filename}.csv`);
        break;
      case "image":
        // For image, you need to pass the id of the element you want to capture
        downloadImage("report-table", `${filename}.png`);
        break;
      default:
        break;
    }
  };

  const defaultReport = REPORT_TYPES[0].value;
  const defaultExport = EXPORT_TYPES[0].value;

  // Reset handler
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSelectedReport(defaultReport);
    setSelectedExport(defaultExport);
  };

  const handleCheckboxChange = (rowOrRows: any | any[], action?: "select-all" | "clear-all") => {
    if (action === "select-all") {
      setSelectedRows(Array.isArray(rowOrRows) ? rowOrRows.map((r) => r.id) : []);
    } else if (action === "clear-all") {
      setSelectedRows([]);
    } else {
      // Toggle single row
      const row = rowOrRows as any;
      setSelectedRows((prev) =>
        row.id && prev.includes(row.id) ? prev.filter((id) => id !== row.id) : row.id ? [...prev, row.id] : prev
      );
    }
  };

  // To get selected row data:
  const selectedRowData = topUsers.filter((r) => selectedRows.includes(r.id));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reporting Dashboard</h2>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaries.map((summary) => (
          <StatCard
            key={summary.category}
            icon={<TrendingUp />}
            title={summary.category.charAt(0).toUpperCase() + summary.category.slice(1)}
            value={`₦${summary.total.toLocaleString()} (${summary.count})`}
          />
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends.map((trend) => (
          <div key={trend.category} className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">{trend.category} Trend</h3>
            <LineCharts data={trend.data} />
          </div>
        ))}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-2">Category Breakdown</h3>
          <PieCharts data={summaries.map((s) => ({ label: s.category, value: s.total }))} />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Top Users</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {REPORT_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={selectedExport}
            onChange={(e) => setSelectedExport(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {EXPORT_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={handleExport}>
            Export
          </Button>
          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <div id="report-table">
          <BaseTable<TopUserReport>
            rows={topUsers}
            columns={topUserColumns}
            page={0}
            setPage={() => {}}
            rowsPerPage={topUsers.length}
            setRowsPerPage={() => {}}
            totalPage={1}
            showDownload={false}
            showCheckbox={true}
            rowName="Top Users"
            checkboxOnChange={handleCheckboxChange}
            selectedRows={selectedRows}
          />
        </div>
      </div>
    </div>
  );
}
