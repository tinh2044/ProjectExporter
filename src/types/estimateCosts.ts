import type { FormInstance } from "antd";

export interface EstimateCostRow {
  id: string;
  costType: string;
  money: number;
  note?: string;
  formula?: string;
  kFactor?: {
    note?: string;
    value?: number;
  }[];
};

export interface EstimateCostCategory {
  id: string;
  name: string;
  money: number;
  vat: number; //  (8 or 10)
  rows: EstimateCostRow[];
};  

export interface EstimateCostData {
  basicInfo: BasicProjectInfo;
  categories: EstimateCostCategory[];
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
    
    // New detailed selection criteria
    projectCategory?: string; // infrastructure, software, combined
    geographicLocation?: string; // urban, island, other
    projectScope?: string; // local, multiProvince, special
    equipmentRatio?: string; // low, high
    projectTypeDetail?: string; // new, renovation, template
    projectSpecificity?: string; // normal, special
    projectPhase?: string; // normal, ktkt, other
    language?: string; // vietnamese, foreign
}