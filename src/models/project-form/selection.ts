import type { Item } from "./item";

export interface Selection extends Item {
  values: string[];
  options: number[];
}
