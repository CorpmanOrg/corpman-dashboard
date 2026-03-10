"use client";

import React, { useMemo, useRef } from "react";

type OtpCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  length?: number;
  disabled?: boolean;
  error?: string;
  onComplete?: (value: string) => void;
};

export default function OtpCodeInput({
  value,
  onChange,
  onBlur,
  length = 6,
  disabled = false,
  error,
  onComplete,
}: OtpCodeInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = useMemo(() => {
    const clean = value.replace(/\D/g, "").slice(0, length);
    return Array.from({ length }, (_, i) => clean[i] ?? "");
  }, [value, length]);

  const emit = (nextDigits: string[]) => {
    const next = nextDigits.join("");
    onChange(next);
    if (next.length === length && !next.includes("")) {
      onComplete?.(next);
    }
  };

  const setDigit = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    emit(next);

    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];

      if (next[index]) {
        next[index] = "";
        emit(next);
        return;
      }

      if (index > 0) {
        refs.current[index - 1]?.focus();
        next[index - 1] = "";
        emit(next);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      refs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      refs.current[index + 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;

    const next = Array.from({ length }, (_, i) => pasted[i] ?? "");
    emit(next);

    const focusIndex = Math.min(pasted.length, length - 1);
    refs.current[focusIndex]?.focus();
  };

  return (
    <div onPaste={onPaste}>
      <div className="mt-4 flex items-center justify-between gap-2 sm:gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            disabled={disabled}
            onBlur={onBlur}
            onChange={(e) => setDigit(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            className={`h-11 w-11 sm:h-12 sm:w-12 min-w-0 rounded-xl border text-center text-base sm:text-lg font-semibold outline-none transition ${
              error
                ? "border-red-300 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 bg-white text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200"
            }`}
          />
        ))}
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
