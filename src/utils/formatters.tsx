import React from "react";
import dayjs, { type Dayjs } from "dayjs";

export type PrimitiveOrArray = string | string[];

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

export function formatCurrencyVND(input: string): string {
  const digits = input.replace(/[^0-9]/g, "");
  const value = Number(digits || 0);
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

export function truncate(text: string, max = 150): string {
  if (text.length <= max) return text;
  return `${text.substring(0, max)}...`;
}

// Pluggable registry types
export type FieldFormatter = (value: PrimitiveOrArray) => React.ReactNode;
export type FormatterRegistry = Record<string, FieldFormatter>;

// Default registry
export const defaultFormatters: FormatterRegistry = {
  costEstimates: (value) => (
    <span className="font-semibold text-red-800">{formatCurrencyVND(String(value))}</span>
  ),
  projectName: (value) => <span className="font-bold text-red-800">{String(value)}</span>,
  receiver: (value) => <span className="uppercase tracking-wide">{String(value)}</span>,
  investor: (value) => <span className="uppercase tracking-wide">{String(value)}</span>,
  objective: (value) => <div className="whitespace-pre-wrap">{truncate(String(value), 300)}</div>,
  implementation: (value) => <div className="whitespace-pre-wrap">{truncate(String(value), 300)}</div>,
  necessity: (value) => <div className="whitespace-pre-wrap">{truncate(String(value), 300)}</div>,
  costEstimatesNote: (value) => <div className="whitespace-pre-wrap">{truncate(String(value), 300)}</div>,
  timeDev: (value) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">{String(value)}</span>
  ),
};

export function renderWithRegistry(
  key: string,
  value: PrimitiveOrArray,
  registry: FormatterRegistry = defaultFormatters
): React.ReactNode {
  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <div key={index} className="mb-1 pl-2">
        <span className="text-blue-600 mr-2">•</span>
        {item}
      </div>
    ));
  }
  const formatter = registry[key];
  if (formatter) return formatter(value);
  return <span className="whitespace-pre-wrap">{String(value)}</span>;
}

export type PlainData = Record<string, unknown>;

export function buildDocxData(
  raw: PlainData,
  transforms: Array<(d: PlainData) => void> = []
): PlainData {
  const data: PlainData = { ...raw };
  console.log(data);
  for (const apply of transforms) apply(data);
  return data;
}

export function applyLegalIndicesToText(field: string, legalList: string[]) {
  return (data: PlainData) => {
    const value = data[field];
    if (Array.isArray(value)) {
      const indices = value as unknown as number[];
      data[field] = indices.map((i) => legalList[i]).join("\n");
    }
  };
}

export function applyYearRange(field: string) {
  return (data: PlainData) => {
    const value = data[field] as
      | [Dayjs | Date | string | null | undefined, Dayjs | Date | string | null | undefined]
      | undefined;
    if (value) data[field] = formatYearRangeFromPicker(value);
  };
}

export function applyMoneyFields(fields: Array<{ numberField: string; wordsField?: string }>) {
  return (data: PlainData) => {
    for (const { numberField, wordsField } of fields) {
      const val = data[numberField];
      if (val != null) {
        const formatted = formatNumberWithDots(val as number | string);
        data[numberField] = formatted;
        if (wordsField) data[wordsField] = numberToVietnameseMoney(val as number | string);
      }
    }
  };
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

export function formatAdditionalstimate(
  selectedItems: string[],
  itemAmounts: number[]
) {
  const itemLabels: { [key: string]: string } = {
    'lapThamTraBCKTKT': 'Lập/ thẩm tra báo cáo kinh tế kỹ thuật',
    'lapBCNCKT': 'Lập báo cáo nghiên cứu khả thi',
    'lapKeHoachThueDV': 'Lập kế hoạch thuê dịch vụ',
    'chiPhiQuanLyDuAn': 'Chi phí quản lý dự án',
    'chiPhiThamDinhGia': 'Chi phí thẩm định giá'
  };

  const lines = selectedItems?.map((item, index) =>
    `- ${itemLabels[item] || item}: ${formatCurrencyVND(String(itemAmounts[index] || 0))}`
  ).join('\n') || '';

  return lines;
}