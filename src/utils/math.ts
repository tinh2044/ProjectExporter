/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  costReportOptions, 
  decision1688Data,
  projectSpecificityOptions,
  geographicLocationOptions,
  projectScopeOptions,
  equipmentRatioOptions,
  projectTypeOptions,
  projectPhaseOptions
} from "@/services/constants";
import type { BasicProjectInfo, EstimateCostCategory } from "@/types";
import { formatNumberWithDots } from "./formatters";

const round = (num:number, decimals = 0) => {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
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


// Helper function to create option maps from constants
const createOptionMap = (options: Array<{value: string; label: string}>): Record<string, string> => {
  return options.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {} as Record<string, string>);
};

// Dynamic option maps created from constants
const optionMaps: Record<string, Record<string, string>> = {
  projectSpecificity: createOptionMap(projectSpecificityOptions),
  geographicLocation: createOptionMap(geographicLocationOptions),
  projectScope: createOptionMap(projectScopeOptions),
  equipmentRatio: createOptionMap(equipmentRatioOptions),
  projectTypeDetail: createOptionMap(projectTypeOptions),
  projectPhase: createOptionMap(projectPhaseOptions)
};

// Helper function to get option labels
const getOptionLabel = (field: string, value: string): string => {
  return optionMaps[field]?.[value] || value;
};

export const kCalculators = {
  quanLyDuAn: (inputs: BasicProjectInfo): Array<{note?: string; value?: number}> => {
    const kFactors: Array<{note?: string; value?: number}> = [];
    
    // Base factor
    // kFactors.push({ note: "Hệ số cơ bản", value: 1.0 });
    
    if (inputs.projectSpecificity === 'special') {
      return [{ note: getOptionLabel('projectSpecificity', 'special'), value: 0 }];
    }
    
    if (inputs.geographicLocation === 'island') {
      kFactors.push({ 
        note: getOptionLabel('geographicLocation', 'island'), 
        value: 1.35 
      });
    }
    
    if (inputs.projectScope === 'multiProvince') {
      kFactors.push({ 
        note: getOptionLabel('projectScope', 'multiProvince'), 
        value: 1.25 
      });
    }
    
    if (inputs.equipmentRatio === 'high') {
      kFactors.push({ 
        note: getOptionLabel('equipmentRatio', 'high'), 
        value: 0.8 
      });
    }
    
    if (inputs.projectPhase === 'ktkt') {
      kFactors.push({ 
        note: getOptionLabel('projectPhase', 'ktkt'), 
        value: 0.84 
      });
    }
    
    return kFactors;
  },
  
  lapBaoCaoNghienCuuKhaThi: (inputs: BasicProjectInfo): Array<{note?: string; value?: number}> => {
    const kFactors: Array<{note?: string; value?: number}> = [];
    
    // kFactors.push({ note: "Hệ số cơ bản", value: 1.0 });
    
    if (inputs.projectSpecificity === 'special') {
      return [{ note: getOptionLabel('projectSpecificity', 'special'), value: 0 }];
    }
    
    if (inputs.geographicLocation === 'island') {
      kFactors.push({ 
        note: getOptionLabel('geographicLocation', 'island'), 
        value: 1.2 
      });
    }
    
    if (inputs.projectScope === 'multiProvince') {
      kFactors.push({ 
        note: getOptionLabel('projectScope', 'multiProvince'), 
        value: 1.3 
      });
    }
    
    if (inputs.equipmentRatio === 'high') {
      kFactors.push({ 
        note: getOptionLabel('equipmentRatio', 'high'), 
        value: 0.7 
      });
    }
    
    if (inputs.projectTypeDetail === 'renovation') {
      kFactors.push({ 
        note: getOptionLabel('projectTypeDetail', 'renovation'), 
        value: 1.2 
      });
    }
    
    if (inputs.projectTypeDetail === 'template') {
      kFactors.push({ 
        note: getOptionLabel('projectTypeDetail', 'template'), 
        value: 0.36 
      });
    }
    
    if (inputs.projectPhase === 'ktkt') {
      kFactors.push({ 
        note: getOptionLabel('projectPhase', 'ktkt'), 
        value: 0.84 
      });
    }
    
    return kFactors;
  },
  
  thamTraBaoCaoNghienCuuKhaThi: (inputs: BasicProjectInfo): Array<{note?: string; value?: number}> => {
    const kFactors: Array<{note?: string; value?: number}> = [];
    
    // kFactors.push({ note: "Hệ số cơ bản", value: 1.0 });
    
    if (inputs.projectSpecificity === 'special') {
      return [{ note: getOptionLabel('projectSpecificity', 'special'), value: 0 }];
    }
    
    if (inputs.geographicLocation === 'island') {
      kFactors.push({ 
        note: getOptionLabel('geographicLocation', 'island'), 
        value: 1.2 
      });
    }
    
    if (inputs.projectScope === 'multiProvince') {
      kFactors.push({ 
        note: getOptionLabel('projectScope', 'multiProvince'), 
        value: 1.1 
      });
    }
    
    if (inputs.equipmentRatio === 'high') {
      kFactors.push({ 
        note: getOptionLabel('equipmentRatio', 'high'), 
        value: 0.7 
      });
    }
    
    return kFactors;
  },
  
  lapBaoCaoKTKT: (inputs: BasicProjectInfo): Array<{note?: string; value?: number}> => {
    const kFactors: Array<{note?: string; value?: number}> = [];
    
    // kFactors.push({ note: "Hệ số cơ bản", value: 1.0 });
    
    if (inputs.projectSpecificity === 'special') {
      return [{ note: getOptionLabel('projectSpecificity', 'special'), value: 0 }];
    }
    
    if (inputs.geographicLocation === 'island') {
      kFactors.push({ 
        note: getOptionLabel('geographicLocation', 'island'), 
        value: 1.2 
      });
    }
    
    if (inputs.projectScope === 'multiProvince') {
      kFactors.push({ 
        note: getOptionLabel('projectScope', 'multiProvince'), 
        value: 1.3 
      });
    }
    
    if (inputs.equipmentRatio === 'high') {
      kFactors.push({ 
        note: getOptionLabel('equipmentRatio', 'high'), 
        value: 0.7 
      });
    }
    
    if (inputs.projectTypeDetail === 'renovation') {
      kFactors.push({ 
        note: getOptionLabel('projectTypeDetail', 'renovation'), 
        value: 1.2 
      });
    }
    
    if (inputs.projectTypeDetail === 'template') {
      kFactors.push({ 
        note: getOptionLabel('projectTypeDetail', 'template'), 
        value: 0.36 
      });
    }
    
    if (inputs.projectPhase === 'ktkt') {
      kFactors.push({ 
        note: getOptionLabel('projectPhase', 'ktkt'), 
        value: 0.84 
      });
    }
    
    return kFactors;
  },
  
  thamTraBaoCaoKTKT: (inputs: BasicProjectInfo): Array<{note?: string; value?: number}> => {
    const kFactors: Array<{note?: string; value?: number}> = [];
    
    // kFactors.push({ note: "Hệ số cơ bản", value: 1.0 });
    
    if (inputs.projectSpecificity === 'special') {
      return [{ note: getOptionLabel('projectSpecificity', 'special'), value: 0 }];
    }
    
    if (inputs.geographicLocation === 'island') {
      kFactors.push({ 
        note: getOptionLabel('geographicLocation', 'island'), 
        value: 1.2 
      });
    }
    
    if (inputs.projectScope === 'multiProvince') {
      kFactors.push({ 
        note: getOptionLabel('projectScope', 'multiProvince'), 
        value: 1.1 
      });
    }
    
    if (inputs.equipmentRatio === 'high') {
      kFactors.push({ 
        note: getOptionLabel('equipmentRatio', 'high'), 
        value: 0.7 
      });
    }
    
    return kFactors;
  },
  
  lapKeHoachThue: (inputs: BasicProjectInfo): Array<{note?: string; value?: number}> => {
    const kFactors: Array<{note?: string; value?: number}> = [];
    
    // kFactors.push({ note: "Hệ số cơ bản", value: 1.0 });
    
    if (inputs.projectSpecificity === 'special') {
      return [{ note: getOptionLabel('projectSpecificity', 'special'), value: 0 }];
    }
    
    if (inputs.geographicLocation === 'island') {
      kFactors.push({ 
        note: getOptionLabel('geographicLocation', 'island'), 
        value: 1.2 
      });
    }
    
    if (inputs.projectScope === 'multiProvince') {
      kFactors.push({ 
        note: getOptionLabel('projectScope', 'multiProvince'), 
        value: 1.3 
      });
    }
    
    if (inputs.equipmentRatio === 'high') {
      kFactors.push({ 
        note: getOptionLabel('equipmentRatio', 'high'), 
        value: 0.7 
      });
    }
    
    if (inputs.projectTypeDetail === 'renovation') {
      kFactors.push({ 
        note: getOptionLabel('projectTypeDetail', 'renovation'), 
        value: 1.2 
      });
    }
    
    if (inputs.projectTypeDetail === 'template') {
      kFactors.push({ 
        note: getOptionLabel('projectTypeDetail', 'template'), 
        value: 0.36 
      });
    }
    
    if (inputs.projectPhase === 'ktkt') {
      kFactors.push({ 
        note: getOptionLabel('projectPhase', 'ktkt'), 
        value: 0.84 
      });
    }
    
    return kFactors;
  },
  
  thamTraKeHoachThue: (inputs: BasicProjectInfo): Array<{note?: string; value?: number}> => {
    const kFactors: Array<{note?: string; value?: number}> = [];
    
    //  kFactors.push({ note: "Hệ số cơ bản", value: 1.0 });
    
    if (inputs.projectSpecificity === 'special') {
      return [{ note: getOptionLabel('projectSpecificity', 'special'), value: 0 }];
    }
    
    if (inputs.geographicLocation === 'island') {
      kFactors.push({ 
        note: getOptionLabel('geographicLocation', 'island'), 
        value: 1.2 
      });
    }
    
    if (inputs.projectScope === 'multiProvince') {
      kFactors.push({ 
        note: getOptionLabel('projectScope', 'multiProvince'), 
        value: 1.1 
      });
    }
    
    if (inputs.equipmentRatio === 'high') {
      kFactors.push({ 
        note: getOptionLabel('equipmentRatio', 'high'), 
        value: 0.7 
      });
    }
    
    return kFactors;
  },
  
  thamDinhGia: (_inputs: BasicProjectInfo): Array<{note?: string; value?: number}> => {
    return [{ note: "Chi phí thẩm định giá cần lập dự toán chi tiết", value: 0 }];
  }
};

// Function to automatically calculate kFactor for a cost type
export const calculateKFactor = (costType: string, basicInfo: BasicProjectInfo): Array<{note?: string; value?: number}> => {
  // console.log(costType,basicInfo)
  const calculator = kCalculators[costType as keyof typeof kCalculators];
  if (!calculator) {
    return [{ note: "Loại chi phí không được hỗ trợ", value: 1.0 }];
  }
  
  return calculator(basicInfo);
};  


const getKNote = (kInfo: Array<{ note?: string; value?: number }>, kFactor:number) => {
  const kNumbers = `${kInfo.map((k) => dot2Percent(k.value || 1)).join(" * ")} = ${dot2Percent(kFactor)}`;
  const note = kInfo.map((k) => `    - ${dot2Percent(k.value || 1)} : ${k.note}`).join(" <br> ");

  return `
    - Hệ số K: ${kNumbers} <br>
    Trong đó: <br>
    ${note}
  `
}

const getRate = (tableKey: string, money: number, projectForm: string) => {
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

const dot2Percent = (num: number, fractionDigits: number = 3) => {
  return num.toFixed(fractionDigits).replace(".", ",");
};

export const calculateCost = (
  field: string | number,
  category: EstimateCostCategory,
  basicInfo: BasicProjectInfo = {
    projectType: "",
    projectForm: "",
  }
) => {
  const { vat, money } = category;
  const {projectType, projectForm} = basicInfo

  const costType = costReportOptions.find((c) => c.value === field);
  if (!costType) {
    return {
      error: "Loại chi phí không hợp lệ.",
    };
  }

  const details = {
    costType: costType.label,
    costBeforeTax: 0,
    vatAmount: 0,
    totalCost: 0,
    baseCost: money,
    rate: 0,
    formula: "",
    note: "",
    rates: undefined as any,
    costParts: undefined as any,
    kFactor: undefined as any,
  };

  if (costType.calculationType === "manual") {
    return {
      costType: costType.label,
      note:
        "Chi phí này cần được lập dự toán chi tiết, không có công thức tính theo định mức.",
      totalCost: 0,
      formula: "",
      kFactor: []

    };
  }
  const kInfo = calculateKFactor(costType.value as keyof typeof kCalculators, basicInfo);
  const kFactor = kInfo.reduce((acc, curr) => acc * (curr.value || 1), 1);
  // console.log(kInfo)
  const moneyFormatted = formatNumberWithDots(money);
  details.kFactor = kInfo;
  switch (costType.calculationType) {
    case "standard": {
      const tableKey = `table${costType.tableKey}${projectType}`;

      const rateResult = getRate(tableKey, money, projectForm);
      details.rate = rateResult;
      details.formula = `${dot2Percent(details.rate)}% x Gtb + ${vat}% VAT ${kFactor == 1 ? "" : `x ${dot2Percent(kFactor)}`}`;

      if (
        costType.value === "quanLyDuAn" &&
        projectType === "a" &&
        projectForm === "baoCaoKTKT"
      ) {
        details.rate *= 0.84;
      } else {
        details.note = `
            - Chi phí thiết bị trước thuế (Gtb): ${moneyFormatted} đồng <br>
            - Hệ số ${dot2Percent(details.rate)}%: Bảng số ${
          costType.tableKey
          }${projectType} - Quyết định số 1688/QĐ-BTTTT. <br>
        ${kFactor == 1 ? "" : `${getKNote(kInfo, kFactor)}`}
        `;
  
      }

      details.costBeforeTax = money * (details.rate / 100);

      break;
    }

    case "adjusted": {
      const tableKey = `table${costType.tableKey}${projectType}`;
      const rateResult = getRate(tableKey, money, projectForm);
      details.rate = rateResult * 1.65;
      details.costBeforeTax = money * (details.rate / 100);
      break;
    }

    case "composite": {
      const rate4 = getRate(`table4${projectType}`, money, projectForm);
      const rate5 = getRate(`table5${projectType}`, money, projectForm);
      const rate6 = getRate(`table6${projectType}`, money, projectForm);

      const costPart4 = 0.4 * money * (rate4 / 100);
      const costPart5 = 0.7 * money * (rate5 / 100);
      const costPart6 = 0.7 * money * (rate6 / 100);

      details.costBeforeTax = costPart4 + costPart5 + costPart6;
      details.rates = { table4: rate4, table5: rate5, table6: rate6 };
      details.costParts = {
        part4: costPart4,
        part5: costPart5,
        part6: costPart6,
      };
      details.formula = `
      [40% x (${dot2Percent(rate4)}% x Gtb) + 70% x (${dot2Percent(
        rate5
      )}% x Gtb) + 70% x (${dot2Percent(rate6)}% x Gtb)] + ${vat}% VAT ${kFactor == 1 ? "" : `x ${dot2Percent(kFactor)}`}
      `;
      details.note = `
      - Chi phí thiết bị trước thuế (Gtb): ${moneyFormatted} đồng <br>
      - Trường hợp thẩm tra báo cáo kinh tế - kỹ thuật, đề cương và dự toán chi tiết, chi phí thẩm tra bao gồm: 70% định mức chi phí thẩm tra thiết kế thi công, 70% định mức chi phí thẩm tra dự toán và 40% định mức chi phí thẩm tra tính hiệu quả và khả thi của dự án trong Quyết định số 1688/QĐ-BTTTT ngày 11 tháng 10 năm 2019 của Bộ Thông tin và Truyền thông. <br>
      - Hệ số ${dot2Percent(
        rate4
      )}%: Định mức chi phí thẩm tra tính hiệu quả và tính khả thi của dự án đầu tư (Bảng số 4${projectType} - Quyết định số 1688/QĐ-BTTTT). <br>
      - Hệ số ${dot2Percent(
        rate5
      )}%: Định mức chi phí thẩm tra thiết kế thi công (Bảng số 5${projectType} - Quyết định số 1688/QĐ-BTTTT). <br>
      - Hệ số ${dot2Percent(
        rate6
      )}%: Định mức chi phí thẩm tra dự toán (Bảng số 6${projectType} - Quyết định số 1688/QĐ-BTTTT). <br>
      ${kFactor == 1 ? "" : `${getKNote(kInfo, kFactor)}`}
      `;

      break;
    }
  }

  details.vatAmount = details.costBeforeTax * (vat / 100);
  details.totalCost = details.costBeforeTax + details.vatAmount;

  details.totalCost = details.totalCost * kFactor;

  return details;
};
