import type { FormInstance } from "antd";

export interface EstimateCostRow {
  id: string;
  costType: string;
  money: number;
  note?: string;
  formula?: string;
};

export interface EstimateCostCategory {
  id: string;
  name: string;
  money: number;
  vat: number; //  (8 or 10)
  rows: EstimateCostRow[];
};  

export interface EstimateCostData {
  projectType: string;
  projectForm: string;
  categories: EstimateCostCategory[];
};

export interface EstimateCostsProps {
    form: FormInstance;
    fieldName: string;
    open: boolean;
    onClose: () => void;
    title?: string;
}