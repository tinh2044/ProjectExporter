/* eslint-disable @typescript-eslint/no-explicit-any */
import { costReportOptions, decision1688Data } from "@/services/constants";
import type { EstimateCostCategory } from "@/types";
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
  projectType: string,
  projectForm: string
) => {
  const { vat, money } = category;

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
  };

  if (costType.calculationType === "manual") {
    return {
      costType: costType.label,
      note:
        "Chi phí này cần được lập dự toán chi tiết, không có công thức tính theo định mức.",
      totalCost: 0,
      formula: "",


    };
  }

  const moneyFormatted = formatNumberWithDots(money);
  switch (costType.calculationType) {
    case "standard": {
      const tableKey = `table${costType.tableKey}${projectType}`;

      const rateResult = getRate(tableKey, money, projectForm);
      details.rate = rateResult;
      details.formula = `${dot2Percent(details.rate)}% x Gtb + ${vat}% VAT`;

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
        }${projectType} - Quyết định số 1688/QĐ-BTTTT.
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
      )}% x Gtb) + 70% x (${dot2Percent(rate6)}% x Gtb)] + 8% VAT
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
      )}%: Định mức chi phí thẩm tra dự toán (Bảng số 6${projectType} - Quyết định số 1688/QĐ-BTTTT).
      `;

      break;
    }
  }

  details.vatAmount = details.costBeforeTax * (vat / 100);
  details.totalCost = details.costBeforeTax + details.vatAmount;

  return details;
  // return {
  //   costType: costType.label,
  //   costBeforeTax: formatNumberWithDots(Math.round(costBeforeTax)),
  //   vatAmount: formatNumberWithDots(Math.round(vatAmount)),
  //   totalCost:totalCost,
  //   baseCost: formatNumberWithDots(Math.round(money)),
  //   rate,
  // };
};
