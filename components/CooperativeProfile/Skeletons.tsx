"use client";
import React from "react";

export function CooperativeSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-shimmer" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 w-1/3 rounded animate-shimmer" />
            <div className="h-4 bg-gray-200 w-1/2 rounded animate-shimmer" />
            <div className="h-3 bg-gray-200 w-2/3 rounded animate-shimmer" />
          </div>
          <div className="w-24 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-shimmer" />
            <div className="h-8 bg-gray-200 rounded animate-shimmer" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded animate-shimmer" />
        <div className="h-32 bg-gray-200 rounded animate-shimmer" />
        <div className="h-32 bg-gray-200 rounded animate-shimmer" />
      </div>
    </div>
  );
}
