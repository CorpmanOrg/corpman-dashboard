"use client";
import React from "react";
import { Loader2 } from "lucide-react";

interface RouteLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const RouteLoader: React.FC<RouteLoaderProps> = ({ isLoading, message = "Loading..." }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-300">
      <div className="flex flex-col items-center space-y-4">
        {/* Logo or Brand */}
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">CM</span>
        </div>

        {/* Animated Spinner */}
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          <div className="absolute inset-0 w-8 h-8 border-2 border-green-200 rounded-full animate-pulse"></div>
        </div>

        {/* Loading Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{message}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we prepare your dashboard</p>
        </div>

        {/* Progress Dots */}
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteLoader;
