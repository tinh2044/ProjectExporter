import type { EstimateCostRow } from "@/types";
import dayjs, { type Dayjs } from "dayjs";

/**
 * Format RangePicker value (2 dates) to: "Năm {yyyy} - Năm {yyyy}"
 */
export function formatYearRangeFromPicker(
  range: [Dayjs | Date | string | null | undefined, Dayjs | Date | string | null | undefined]
): string {
  const [start, end] = (Array.isArray(range) ? range : [null, null]) as [
    Dayjs | Date | string | null | undefined,
    Dayjs | Date | string | null | undefined
  ];
  const d1 = start != null ? dayjs(start) : null;
  const d2 = end != null ? dayjs(end) : null;
  if (!d1 || !d2 || !d1.isValid() || !d2.isValid()) return "";
  return `Năm ${d1.format("YYYY")} - Năm ${d2.format("YYYY")}`;
}

/**
 * Format number to VND-style plain dots: 000.000.000.000 (no currency symbol)
 */
export function formatNumberWithDots(input: number | string): string {
  const digits = String(input ?? "").replace(/[^0-9-]/g, "");
  if (!digits) return "0";
  const isNegative = digits.startsWith("-");
  const abs = isNegative ? digits.slice(1) : digits;
  const withDots = abs.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return isNegative ? `-${withDots}` : withDots;
}

// Money number to Vietnamese words
function threeDigitsToWords(n: number): string {
  const ones = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const hundreds = Math.floor(n / 100), tens = Math.floor((n % 100) / 10), units = n % 10;

  const parts: string[] = [];
  if (hundreds > 0) {
    parts.push(`${ones[hundreds]} trăm`);
  }

  if (tens > 1) {
    parts.push(`${ones[tens]} mươi`);
    if (units === 1) parts.push("mốt");
    else if (units === 4) parts.push("tư");
    else if (units === 5) parts.push("lăm");
    else if (units > 0) parts.push(ones[units]);
  } else if (tens === 1) {
    parts.push("mười");
    if (units === 5) parts.push("lăm");
    else if (units > 0) parts.push(ones[units]);
  } else if (tens === 0) {
    if (hundreds > 0 && units > 0) parts.push("lẻ");
    if (units > 0) parts.push(ones[units]);
  }

  return parts.join(" ").trim();
}

export function numberToVietnameseMoney(input: number | string): string {
  const num = Number(String(input).replace(/[^0-9-]/g, ""));
  if (!isFinite(num)) return "";
  if (num === 0) return "Không đồng";

  const isNegative = num < 0;
  let n = Math.abs(Math.trunc(num));

  const scales = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ", "tỷ tỷ"];
  const words: string[] = [];

  let scaleIndex = 0;
  while (n > 0 && scaleIndex < scales.length) {
    const chunk = n % 1000;
    if (chunk > 0) {
      const chunkWords = threeDigitsToWords(chunk);
      const label = scales[scaleIndex];
      words.unshift(label ? `${chunkWords} ${label}` : chunkWords);
    }
    n = Math.floor(n / 1000);
    scaleIndex += 1;
  }

  let result = words.join(", ");
  // Capitalize first letter
  result = result.charAt(0).toUpperCase() + result.slice(1);
  if (isNegative) result = `Âm ${result}`;
  return `${result} đồng`;
}

/**
 * Find index in item of small array in large array
 * @param largeArray - Large array to search
 * @param smallArray - Small array containing elements to find
 * @returns Array of indices in large array
 */
export function findIndicesInArray<T>(largeArray: T[], smallArray: T[]): number[] {
  const indices: number[] = [];
  
  for (const item of smallArray) {
    const index = largeArray.findIndex(largeItem => largeItem === item);
    if (index !== -1) {
      indices.push(index);
    }
  }
  
  return indices;
}

/**
 * Find index in item of small array in large array (compare by property)
 * @param largeArray - Large array to search
 * @param smallArray - Small array containing elements to find
 * @param key - Property to compare
 * @returns Array of indices in large array
 */
export function findIndicesByKey<T, K extends keyof T>(
  largeArray: T[], 
  smallArray: T[], 
  key: K
): number[] {
  const indices: number[] = [];
  
  for (const item of smallArray) {
    const index = largeArray.findIndex(largeItem => largeItem[key] === item[key]);
    if (index !== -1) {
      indices.push(index);
    }
  }
  
  return indices;
}

export function formatAdditionalEstimate(
  estimateData: EstimateCostRow[]
) {
  const lines =
    estimateData
      ?.map(
        (item) =>
          `- ${item.costName}: ${formatNumberWithDots(
            String(item.moneyBeforeTax || 0)
          )} đồng`
      )
      .join("\n") || "";
  return lines;
}