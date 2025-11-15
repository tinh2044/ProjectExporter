import type { FormInstance } from "antd";

export interface EstimateCostRow {
  id: string;
  costName: string;
  costType: string;
  moneyBeforeTax: number;
  moneyAfterTax: number;
  note?: string;
  formula?: string;
  kFactor?: {
    note?: string;
    value?: number;
  }[];
  vat: number;
  // calculationType: string;
};

export interface EstimateCostCategory {
  id: string;
  // name: string;
  money: number;
  vat: number; //  (8 or 10)
  // rows: EstimateCostRow[];
  costType: string
};  

export interface EstimateCostData {
  basicInfo: BasicProjectInfo;
  categories: EstimateCostCategory[];
  rows: EstimateCostRow[]
};

export interface EstimateCostsProps {
    form: FormInstance;
    fieldName: string;
    open: boolean;
    onClose: () => void;
    title?: string;
}

export interface BasicProjectInfo {
    // Original fields
    projectType: string;
    projectForm: string;
    projectDocType?: string; // baoCaoKTKT | keHoachThue | nghienCuuKhaThi
    
    // New detailed selection criteria
    projectCategory?: string; // infrastructure, software, combined
    geographicLocation?: string; // urban, island, other
    projectScope?: string; // local, multiProvince, special
    equipmentRatio?: string; // low, high
    projectTypeDetail?: string; // new, renovation, template
    projectSpecificity?: string; // normal, special
    projectPhase?: string; // normal, ktkt, other
  language?: string; // vietnamese, foreign
  calculationType: "manual" | "standard";
  costReportOptions: string[];
}