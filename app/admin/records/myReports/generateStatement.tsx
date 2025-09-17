"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

const GenerateStatement = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your API call or logic here
    alert(`Generating statement from ${startDate} to ${endDate}`);
  };

  return (
    <div className="py-4 max-w-md">
      <form onSubmit={handleGenerate} className="flex flex-col gap-y-4 gap-x-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-6 w-full">
          Generate
        </button>
      </form>
    </div>
  );
};

export default GenerateStatement;
