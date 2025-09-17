"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

const categories = [
  { label: "Deposit", value: "deposit" },
  { label: "Withdrawal", value: "withdrawal" },
];

const types = [
  { label: "Contributions", value: "contributions" },
  { label: "Savings", value: "savings" },
  { label: "Loans", value: "loans" },
];

const DisputeResolution = () => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [complaint, setComplaint] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your API call or logic here
    alert(`Dispute submitted!\nCategory: ${category}\nType: ${type}\nComplaint: ${complaint}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg py-4 bg-transparent rounded space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            {types.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Complaint</label>
        <textarea
          className="w-full border rounded px-3 py-2 min-h-[100px]"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Describe your complaint..."
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full font-semibold"
      >
        Submit Dispute
      </button>
    </form>
  );
};

export default DisputeResolution;
