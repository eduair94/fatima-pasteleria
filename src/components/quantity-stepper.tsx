"use client";

import { Icon } from "@/components/icon";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label: string;
}) {
  const dimension = size === "sm" ? 34 : 44;

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-full border border-line-300 bg-cream-50"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex items-center justify-center border-0 bg-transparent text-brown-900 transition-colors hover:bg-cream-200 disabled:cursor-not-allowed disabled:text-brown-300 disabled:hover:bg-transparent"
        style={{ width: dimension, height: dimension }}
        aria-label="Quitar uno"
      >
        <Icon name="minus" size={size === "sm" ? 16 : 18} />
      </button>
      <span
        className="tnum text-center font-semibold"
        style={{ minWidth: size === "sm" ? 26 : 34, fontSize: size === "sm" ? 14 : 16 }}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex items-center justify-center border-0 bg-transparent text-brown-900 transition-colors hover:bg-cream-200 disabled:cursor-not-allowed disabled:text-brown-300 disabled:hover:bg-transparent"
        style={{ width: dimension, height: dimension }}
        aria-label="Agregar uno"
      >
        <Icon name="plus" size={size === "sm" ? 16 : 18} />
      </button>
    </div>
  );
}
