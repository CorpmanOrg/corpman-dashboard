import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Option = { label: string; value: string };

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export type TransactionFilterProps = {
  filters: {
    type?: "credit" | "debit";
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
  };
  onChange: (filters: TransactionFilterProps["filters"]) => void;
};

export function Select({ value, onValueChange, options, placeholder, className }: SelectProps) {
  return (
    <select value={value} onChange={(e) => onValueChange(e.target.value)} className={className}>
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function TransactionFilterBar({ filters, onChange }: TransactionFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      <Select
        value={filters.type ?? ""}
        onValueChange={(v) => onChange({ ...filters, type: v as "credit" | "debit" })}
        placeholder="Select type"
        options={[
          { label: "All", value: "" },
          { label: "Credit", value: "credit" },
          { label: "Debit", value: "debit" },
        ]}
        className="min-w-[140px] rounded-md p-1 bg-[#fff] dark:bg-[#071121ff] border border-[#e5e7eb] dark:border-[#222c3c]"
      />
      <Input
        name="minAmount"
        type="number"
        placeholder="Min Amount"
        value={filters.minAmount ?? ""}
        onChange={(e) => onChange({ ...filters, minAmount: Number(e.target.value) })}
      />
      <Input
        name="maxAmount"
        type="number"
        placeholder="Max Amount"
        value={filters.maxAmount ?? ""}
        onChange={(e) => onChange({ ...filters, maxAmount: Number(e.target.value) })}
      />
      <Input
        name="startDate"
        type="date"
        value={filters.startDate ?? ""}
        onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
      />
      <Input
        name="endDate"
        type="date"
        value={filters.endDate ?? ""}
        onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
      />
      <Button variant="outline" onClick={() => onChange({})}>
        Reset
      </Button>
    </div>
  );
}
