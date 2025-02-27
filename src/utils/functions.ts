"use client";
import millify from "millify";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { FormatNumberOptions } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateAddress = (walletAddress: string, len = 4) => {
  return walletAddress.slice(0, len) + "..." + walletAddress.slice(-len);
};

export const formatNumber = (
  value: string | number | null | undefined,
  {
    prefix = "",
    suffix = "",
    thousandSeparator = true,
    decimalScale = 2,
    isPercentage = false,
    truncateTinyValue = false,
    useMillify = false,
    placeholder = "N/A",
  }: FormatNumberOptions = {}
): string => {
  if (value === undefined || value === null) return placeholder;

  let numberValue = Number(value);

  if (isPercentage && suffix === "") {
    suffix = "%";
  }

  if (numberValue === 0) {
    return `${prefix}0${suffix}`;
  }

  if (truncateTinyValue && numberValue < 0.0001) {
    return `${prefix}${isPercentage ? "<0.01" : "<0.0001"}${suffix}`;
  }



  if (Math.abs(numberValue) < 1e-6) {
    numberValue = 0;
  }

  if (isPercentage) {
    numberValue *= 100;
  }

  if (useMillify) {
    return prefix + millify(numberValue, { precision: decimalScale }) + suffix;
  }

  let formattedValue = numberValue.toFixed(decimalScale);
  formattedValue = parseFloat(formattedValue).toString();

  if (thousandSeparator) {
    const parts = formattedValue.split(".");
    const separator = typeof thousandSeparator === "string" ? thousandSeparator : ",";
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    formattedValue = parts.join(".");
  }

  return `${prefix}${formattedValue}${suffix}`;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as { message: string }).message;
  }

  return "An unknown error occurred";
};

export const getTokenBalance = async (walletAddress: string | undefined, tokenAddress: string | null) => {
  console.log(walletAddress, tokenAddress)
  return 0;
}

export const formatNumberWithCommas = (value: string): string => {
  if (!value) return ""; // Handle empty or null input

  // Remove any existing commas before formatting
  const numericValue = value.replace(/,/g, "");

  // Split the number into integer and decimal parts
  const [integer, decimal] = numericValue.split(".");

  // Add commas to the integer part
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return the formatted number with the decimal part (if it exists)
  return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
};

export function formatDuration(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    // Less than a minute ago
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    // Less than an hour ago
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    // Less than a day ago
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}