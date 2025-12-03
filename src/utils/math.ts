/* eslint-disable @typescript-eslint/no-explicit-any */
import { costReportOptions, decision1688Data } from "@/services/constants";
import type {
  BasicProjectInfo,
  EstimateCostCategory,
  EstimateCostRow,
} from "@/types";
import { formatNumberWithDots } from "./formatters";

const round = (num: number, decimals = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

const dot2Percent = (num: number, fractionDigits: number = 3): string => {
  return num.toFixed(fractionDigits).replace(".", ",");
};

const getInterpolatedRate = (
  rates: { costMilestone: number; rate: number }[] | undefined,
  cost: number
): number => {
  if (!rates || rates.length === 0) return 0;

  const costInBillion = cost / 1_000_000_000;

  if (costInBillion <= rates[0].costMilestone) {
    return rates[0].rate;
  }

  if (costInBillion >= rates[rates.length - 1].costMilestone) {
    return rates[rates.length - 1].rate;
  }

  for (let i = 0; i < rates.length - 1; i++) {
    const lowerBound = rates[i];
    const upperBound = rates[i + 1];

    if (
      costInBillion > lowerBound.costMilestone &&
      costInBillion <= upperBound.costMilestone
    ) {
      const Gt = costInBillion;
      const Gb = lowerBound.costMilestone;
      const Ga = upperBound.costMilestone;
      const Nb = lowerBound.rate;
      const Na = upperBound.rate;

      const Nt = Nb - ((Nb - Na) / (Ga - Gb)) * (Gt - Gb);
      return round(Nt, 4);
    }
  }

  return rates[rates.length - 1].rate;
};

const getRate = (
  tableKey: string,
  money: number,
  projectForm: string
): number => {
  const tableData = decision1688Data[tableKey as keyof typeof decision1688Data];
  if (!tableData) return 0;

  let rates;
  if (projectForm === "baoCaoKTKT" && tableData.economicTechnicalReportRates) {
    rates = tableData.economicTechnicalReportRates;
  } else {
    rates = tableData.investmentProjectRates || tableData.rates;
  }

  return getInterpolatedRate(rates, money);
};

interface KFactorRule {
  condition: (inputs: BasicProjectInfo) => boolean;
  note: string;
  value: number;
}

interface KFactorCalculator {
  rules: KFactorRule[];
  specialCase?: (
    inputs: BasicProjectInfo
  ) => Array<{ note?: string; value?: number }>;
}

const kFactorCalculators: Record<string, KFactorCalculator> = {
  quanLyDuAn: {
    rules: [
      {
        condition: (inputs) => inputs.geographicLocation === "island",
        note: "Địa điểm đảo",
        value: 1.35,
      },
      {
        condition: (inputs) => inputs.projectScope === "multiProvince",
        note: "Phạm vi nhiều tỉnh",
        value: 1.25,
      },
      {
        condition: (inputs) => inputs.equipmentRatio === "high",
        note: "Tỷ lệ thiết bị cao",
        value: 0.8,
      },
    ],
    specialCase: (inputs) => {
      if (inputs.projectSpecificity === "special") {
        return [{ note: "Phạm vi đặc thù", value: 0 }];
      }
      return [];
    },
  },

  lapBaoCaoNghienCuuKhaThi: {
    rules: [
      {
        condition: (inputs) => inputs.geographicLocation === "island",
        note: "Địa điểm đảo",
        value: 1.2,
      },
      {
        condition: (inputs) => inputs.projectScope === "multiProvince",
        note: "Phạm vi nhiều tỉnh",
        value: 1.3,
      },
      {
        condition: (inputs) => inputs.equipmentRatio === "high",
        note: "Tỷ lệ thiết bị cao",
        value: 0.7,
      },
      {
        condition: (inputs) => inputs.projectTypeDetail === "renovation",
        note: "Cải tạo",
        value: 1.2,
      },
      {
        condition: (inputs) => inputs.projectTypeDetail === "template",
        note: "Mẫu",
        value: 0.36,
      },
    ],
    specialCase: (inputs) => {
      if (inputs.projectSpecificity === "special") {
        return [{ note: "Phạm vi đặc thù", value: 0 }];
      }
      return [];
    },
  },

  thamTraBaoCaoNghienCuuKhaThi: {
    rules: [
      {
        condition: (inputs) => inputs.geographicLocation === "island",
        note: "Địa điểm đảo",
        value: 1.2,
      },
      {
        condition: (inputs) => inputs.projectScope === "multiProvince",
        note: "Phạm vi nhiều tỉnh",
        value: 1.1,
      },
      {
        condition: (inputs) => inputs.equipmentRatio === "high",
        note: "Tỷ lệ thiết bị cao",
        value: 0.7,
      },
    ],
    specialCase: (inputs) => {
      if (inputs.projectSpecificity === "special") {
        return [{ note: "Phạm vi đặc thù", value: 0 }];
      }
      return [];
    },
  },

  lapBaoCaoKTKT: {
    rules: [
      {
        condition: (inputs) => inputs.geographicLocation === "island",
        note: "Địa điểm đảo",
        value: 1.35,
      },
      {
        condition: (inputs) => inputs.projectScope === "multiProvince",
        note: "Phạm vi nhiều tỉnh",
        value: 1.3,
      },
      {
        condition: (inputs) => inputs.equipmentRatio === "high",
        note: "Tỷ lệ thiết bị cao",
        value: 0.7,
      },
      {
        condition: (inputs) => inputs.projectTypeDetail === "renovation",
        note: "Cải tạo",
        value: 1.2,
      },
      {
        condition: (inputs) => inputs.projectTypeDetail === "template",
        note: "Mẫu",
        value: 0.36,
      },
    ],
    specialCase: (inputs) => {
      if (inputs.projectSpecificity === "special") {
        return [{ note: "Phạm vi đặc thù", value: 0 }];
      }
      return [];
    },
  },

  thamTraBaoCaoKTKT: {
    rules: [
      {
        condition: (inputs) => inputs.geographicLocation === "island",
        note: "Địa điểm đảo",
        value: 1.2,
      },
      {
        condition: (inputs) => inputs.projectScope === "multiProvince",
        note: "Phạm vi nhiều tỉnh",
        value: 1.1,
      },
      {
        condition: (inputs) => inputs.equipmentRatio === "high",
        note: "Tỷ lệ thiết bị cao",
        value: 0.7,
      },
    ],
    specialCase: (inputs) => {
      if (inputs.projectSpecificity === "special") {
        return [{ note: "Phạm vi đặc thù", value: 0 }];
      }
      return [];
    },
  },

  lapKeHoachThue: {
    rules: [
      {
        condition: (inputs) => inputs.geographicLocation === "island",
        note: "Địa điểm đảo",
        value: 1.2,
      },
      {
        condition: (inputs) => inputs.projectScope === "multiProvince",
        note: "Phạm vi nhiều tỉnh",
        value: 1.3,
      },
      {
        condition: (inputs) => inputs.equipmentRatio === "high",
        note: "Tỷ lệ thiết bị cao",
        value: 0.7,
      },
      {
        condition: (inputs) => inputs.projectTypeDetail === "renovation",
        note: "Cải tạo",
        value: 1.2,
      },
      {
        condition: (inputs) => inputs.projectTypeDetail === "template",
        note: "Mẫu",
        value: 0.36,
      },
    ],
    specialCase: (inputs) => {
      if (inputs.projectSpecificity === "special") {
        return [{ note: "Phạm vi đặc thù", value: 0 }];
      }
      return [];
    },
  },

  thamTraKeHoachThue: {
    rules: [
      {
        condition: (inputs) => inputs.geographicLocation === "island",
        note: "Địa điểm đảo",
        value: 1.2,
      },
      {
        condition: (inputs) => inputs.projectScope === "multiProvince",
        note: "Phạm vi nhiều tỉnh",
        value: 1.1,
      },
      {
        condition: (inputs) => inputs.equipmentRatio === "high",
        note: "Tỷ lệ thiết bị cao",
        value: 0.7,
      },
    ],
    specialCase: (inputs) => {
      if (inputs.projectSpecificity === "special") {
        return [{ note: "Phạm vi đặc thù", value: 0 }];
      }
      return [];
    },
  },

  thamDinhGia: {
    rules: [],
    specialCase: () => [
      { note: "Chi phí thẩm định giá cần lập dự toán chi tiết", value: 0 },
    ],
  },
};

export const calculateKFactor = (
  costType: string,
  basicInfo: BasicProjectInfo
): Array<{ note?: string; value?: number }> => {
  const calculator = kFactorCalculators[costType];
  if (!calculator) {
    return [{ note: "Loại chi phí không được hỗ trợ", value: 1.0 }];
  }

  if (calculator.specialCase) {
    const specialResult = calculator.specialCase(basicInfo);
    if (specialResult.length > 0) {
      return specialResult;
    }
  }

  const kFactors: Array<{ note?: string; value?: number }> = [];

  calculator.rules.forEach((rule) => {
    if (rule.condition(basicInfo)) {
      kFactors.push({
        note: rule.note,
        value: rule.value,
      });
    }
  });

  return kFactors;
};

interface CalculationResult {
  costName: string;
  costDesc: string;
  costType: string;
  costBeforeTax: number;
  vatAmount: number;
  totalCost: number;
  baseCost: number;
  rate: number;
  formula: string;
  note: string;
  kFactor: Array<{ note?: string; value?: number }>;
}

const getKNote = (
  kInfo: Array<{ note?: string; value?: number }>,
  kFactor: number
): string => {
  const kNumbers =
    kInfo.length > 1
      ? `${kInfo
          .map((k) => dot2Percent(k.value || 1))
          .join(" * ")} = ${dot2Percent(kFactor)}`
      : `${kInfo[0].value}`;

  const noteText = kInfo
    .map((k) => `    - ${dot2Percent(k.value || 1)} : ${k.note}`)
    .join(" <br> ");

  return `
    - Hệ số K: ${kNumbers} <br>
    Trong đó: <br>
    ${noteText}
  `;
};

const calculateStandardCost = (
  costType: any,
  category: EstimateCostCategory,
  basicInfo: BasicProjectInfo,
  kFactor: number,
  kInfo: Array<{ note?: string; value?: number }>
): Partial<CalculationResult> => {
  const { vat, money } = category;
  const { projectType, projectForm } = basicInfo;
  const symbolMoney = projectType == "a" ? "Gpc" : "Gpm";
  const baseLabel =
    projectType == "a" ? "Chi phí phần cứng" : "Chi phí phần mềm";
  const tableKey = `table${costType.tableKey}${projectType}`;
  const rate = getRate(tableKey, money, projectForm);

  let formula = `${dot2Percent(rate)}%`;
  const moneyFormatted = formatNumberWithDots(money);

  let finalRate = rate;
  if (costType.value === "lapBaoCaoKTKT" && projectType === "a") {
    finalRate *= 1.65;
    formula += ` x 1.65`;
  }
  const noteText = `
    - ${baseLabel} trước thuế (${symbolMoney}): ${moneyFormatted} đồng <br>
    - Hệ số ${dot2Percent(rate)}%: Bảng số ${
    costType.tableKey
  }${projectType} - Quyết định số 1688/QĐ-BTTTT. <br>
    ${kFactor === 1 ? "" : getKNote(kInfo, kFactor)}
  `;

  if (
    costType.value === "quanLyDuAn" &&
    projectType === "a" &&
    projectForm === "baoCaoKTKT"
  ) {
    finalRate *= 0.84;
    formula += ` x 0.84`;
  }

  const costBeforeTax = money * (finalRate / 100);
  formula += ` x ${symbolMoney} + ${vat}% VAT ${
    kFactor === 1 ? "" : `x ${dot2Percent(kFactor)}`
  }`;

  return {
    costBeforeTax,
    rate: finalRate,
    formula,
    note: noteText,
  };
};

const calculateAdjustedCost = (
  costType: any,
  category: EstimateCostCategory,
  basicInfo: BasicProjectInfo,
  kFactor: number
): Partial<CalculationResult> => {
  const { money, vat } = category;
  const { projectType, projectForm } = basicInfo;

  let rate = 0;
  // Kế hoạch thuê dịch vụ: phân nhánh theo loại hạng mục và ngưỡng 15 tỷ
  let formula = "";
  const symbolMoney = projectType == "a" ? "Gpc" : "Gpm";
  if (costType.value === "lapKeHoachThue") {
    if (projectType === "a") {
      // Hạ tầng: dùng 2a và nhân 1.65
      rate = getRate("table2a", money, projectForm);
      formula = `${dot2Percent(rate)}%`;
      rate *= 1.65;
      formula += ` x 1.65`;
    } else if (projectType === "b") {
      // Phần mềm: <= 15t dùng 2b; > 15t dùng 3b; không nhân 1.65
      const key = money > 15_000_000_000 ? "table3b" : "table2b";
      rate = getRate(key, money, projectForm);
      formula = `${dot2Percent(rate)}%`;
    } else {
      rate = getRate(
        `table${costType.tableKey}${projectType}`,
        money,
        projectForm
      );
      formula = `${dot2Percent(rate)}%`;
    }
  } else {
    // Mặc định logic cũ cho adjusted
    rate = getRate(
      `table${costType.tableKey}${projectType}`,
      money,
      projectForm
    );
    formula = `${dot2Percent(rate)}%`;
    rate *= 1.65;
    formula += ` x 1.65`;
  }
  formula += ` x ${symbolMoney} + ${vat}% VAT ${
    kFactor === 1 ? "" : `x ${dot2Percent(kFactor)}`
  }`;
  const costBeforeTax = money * (rate / 100);

  return {
    formula,
    costBeforeTax,
    rate,
  };
};

const calculateCompositeCost = (
  _costType: any,
  category: EstimateCostCategory,
  basicInfo: BasicProjectInfo,
  kFactor: number,
  kInfo: Array<{ note?: string; value?: number }>
): Partial<CalculationResult> => {
  const { vat, money } = category;
  const { projectType } = basicInfo;
  const projectForm = projectDocType || "";
  const rate4 = getRate(`table4${projectType}`, money, projectForm);
  const rate5 = getRate(`table5${projectType}`, money, projectForm);
  const rate6 = getRate(`table6${projectType}`, money, projectForm);

  const costPart4 = 0.4 * money * (rate4 / 100);
  const costPart5 = 0.7 * money * (rate5 / 100);
  const costPart6 = 0.7 * money * (rate6 / 100);

  const costBeforeTax = costPart4 + costPart5 + costPart6;
  const moneyFormatted = formatNumberWithDots(money);
  const symbolMoney = projectType == "a" ? "Gpc" : "Gpm";
  const baseLabel =
    projectType == "a" ? "Chi phí phần cứng" : "Chi phí phần mềm";
  const typeLabel =
    _costType?.value === "thamTraBaoCaoKTKT"
      ? "thẩm tra báo cáo kinh tế - kỹ thuật"
      : "thẩm tra kế hoạch thuê dịch vụ";

  const formula = `
    [40% x (${dot2Percent(rate4)}% x ${symbolMoney}) + 70% x (${dot2Percent(
    rate5
  )}% x ${symbolMoney}) + 70% x (${dot2Percent(
    rate6
  )}% x ${symbolMoney})] + ${vat}% VAT ${
    kFactor === 1 ? "" : `x ${dot2Percent(kFactor)}`
  }
  `;

  const note = `
    - ${baseLabel} trước thuế (${symbolMoney}): ${moneyFormatted} đồng <br>
    - Trường hợp ${typeLabel}, đề cương và dự toán chi tiết, chi phí thẩm tra bao gồm: 70% định mức chi phí thẩm tra thiết kế thi công, 70% định mức chi phí thẩm tra dự toán và 40% định mức chi phí thẩm tra tính hiệu quả và khả thi của dự án trong Quyết định số 1688/QĐ-BTTTT ngày 11 tháng 10 năm 2019 của Bộ Thông tin và Truyền thông. <br>
    - Hệ số ${dot2Percent(
      rate4
    )}%: Định mức chi phí thẩm tra tính hiệu quả và tính khả thi của dự án đầu tư (Bảng số 4${projectType} - Quyết định số 1688/QĐ-BTTTT). <br>
    - Hệ số ${dot2Percent(
      rate5
    )}%: Định mức chi phí thẩm tra thiết kế thi công (Bảng số 5${projectType} - Quyết định số 1688/QĐ-BTTTT). <br>
    - Hệ số ${dot2Percent(
      rate6
    )}%: Định mức chi phí thẩm tra dự toán (Bảng số 6${projectType} - Quyết định số 1688/QĐ-BTTTT). <br>
    ${kFactor === 1 ? "" : getKNote(kInfo, kFactor)}
  `;

  return {
    costBeforeTax,
    formula,
    note,
  };
};

const calculateCostPerCategory = (
  field: string | number,
  category: EstimateCostCategory,
  basicInfo: BasicProjectInfo = {
    projectType: "",
    projectForm: "",
    costReportOptions: [],
    calculationType: "standard",
  }
): CalculationResult => {
  const { money } = category;

  const costType = costReportOptions.find((c) => c.value === field);

  if (!costType) {
    return {
      costName: "",
      costDesc: "",
      costType: "Không xác định",
      note: "Loại tính toán không được hỗ trợ.",
      totalCost: 0,
      formula: "",
      kFactor: [],
      costBeforeTax: 0,
      vatAmount: 0,
      baseCost: money,
      rate: 0,
    } as unknown as CalculationResult;
  }

  if (costType.calculationType === "manual") {
    return {
      costName: costType.label,
      costDesc: costType.decs || "",
      costType: costType.value,
      note: "Chi phí này lấy theo báo giá",
      totalCost: 0,
      formula: "",
      kFactor: [],
      costBeforeTax: 0,
      vatAmount: 0,
      baseCost: money,
      rate: 0,
    };
  }

  const kInfo = calculateKFactor(
    costType.value as keyof typeof kFactorCalculators,
    basicInfo
  );
  const kFactor = kInfo.reduce((acc, curr) => acc * (curr.value || 1), 1);

  const result: Partial<CalculationResult> = {
    costType: costType.label,
    costDesc: costType.decs || "",
    baseCost: money,
    kFactor: kInfo,
  };

  switch (costType.calculationType) {
    case "standard":
      Object.assign(
        result,
        calculateStandardCost(costType, category, basicInfo, kFactor, kInfo)
      );
      break;
    case "adjusted":
      Object.assign(
        result,
        calculateAdjustedCost(costType, category, basicInfo, kFactor)
      );
      break;
    case "composite":
      Object.assign(
        result,
        calculateCompositeCost(costType, category, basicInfo, kFactor, kInfo)
      );
      break;
    default:
      return {
        costName: costType.label,
        costType: costType.value,
        costDesc: costType.decs || "",
        note: "Loại tính toán không được hỗ trợ.",
        totalCost: 0,
        formula: "",
        kFactor: [],
        costBeforeTax: 0,
        vatAmount: 0,
        baseCost: money,
        rate: 0,
      } as CalculationResult;
  }

  const MIN_COST_BEFORE_TAX: Record<string, number> = {
    lapBaoCaoKTKT: 10_000_000,
    lapBaoCaoNghienCuuKhaThi: 10_000_000,
    thamTraBaoCaoKTKT: 2_000_000,
    thamTraBaoCaoNghienCuuKhaThi: 2_000_000,
    thamTraKeHoachThue: 2_000_000,
  };
  const typeKey = costType.value as string;
  if (result.costBeforeTax !== undefined) {
    const min = MIN_COST_BEFORE_TAX[typeKey];
    if (min && (result.costBeforeTax as number) < min) {
      result.costBeforeTax = min;
    }
  }

  const costBeforeTax = result.costBeforeTax || 0;
  const vatAmount = costBeforeTax * (category.vat / 100);
  const totalCost = (costBeforeTax + vatAmount) * kFactor;

  return {
    costName: costType.label,
    costDesc: costType.decs,
    ...result,
    costBeforeTax,
    vatAmount,
    totalCost,
  } as CalculationResult;
};

export const calculateCost = (
  field: string | number,
  row: EstimateCostRow,
  categories: EstimateCostCategory[],
  basicInfo: BasicProjectInfo = {
    projectType: "",
    projectForm: "",
    costReportOptions: [],
    calculationType: "standard",
  }
): CalculationResult => {
  const calResult = categories.map((cat) =>
    calculateCostPerCategory(
      field,
      { ...cat, vat: row.vat },
      {
        ...basicInfo,
        projectType: cat.costType,
      }
    )
  );

  if (calResult.length == 1) {
    return calResult[0];
  } else {
    const newResult: CalculationResult = {
      costType: "Tổng chi phí",
      note: "",
      totalCost: 0,
      formula: "",
      kFactor: [],
      costBeforeTax: 0,
      vatAmount: 0,
      baseCost: 0,
      rate: 0,
      costName: calResult[0].costName,
      costDesc: calResult[0].costDesc,
    };

    newResult.formula = calResult
      .map((result) => `[${result.formula}]`)
      .join(" + ");
    newResult.kFactor = calResult.flatMap((result) => result.kFactor);
    newResult.costBeforeTax = calResult.reduce(
      (acc, result) => acc + result.costBeforeTax,
      0
    );
    newResult.vatAmount = calResult.reduce(
      (acc, result) => acc + result.vatAmount,
      0
    );
    newResult.totalCost = calResult.reduce(
      (acc, result) => acc + result.totalCost,
      0
    );
    newResult.baseCost = calResult.reduce(
      (acc, result) => acc + result.baseCost,
      0
    );
    newResult.rate = calResult.reduce((acc, result) => acc + result.rate, 0);

    newResult.note = calResult.map((result) => result.note).join(" <br> ");
    return newResult;
  }
};
