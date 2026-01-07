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

export type CustomFilterProps = {
  filters: {
    // allow backend-driven values for this specialized filter
    type?: string;
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
  };
  onChange: (filters: CustomFilterProps["filters"]) => void;
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

export function CustomFilterBar({ filters, onChange }: CustomFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      <Select
        value={filters.type ?? ""}
        onValueChange={(v) => onChange({ ...filters, type: v })}
        placeholder="Select type"
        options={[
          { label: "All", value: "" },
          { label: "Savings (Deposit)", value: "savings_deposit" },
          { label: "Savings (Withdrawal)", value: "savings_withdrawal" },
          { label: "Contribution (Deposit)", value: "contribution_deposit" },
          { label: "Contribution (Withdrawal)", value: "contribution_withdrawal" },
        ]}
        className="min-w-[240px] rounded-md p-1 bg-[#fff] dark:bg-[#071121ff] border border-[#e5e7eb] dark:border-[#222c3c]"
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

export default CustomFilterBar;
