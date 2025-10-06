import type { Item } from "./item";

export interface Selection extends Item {
  values: number[];
  options: { value: number, label: string }[];
}
