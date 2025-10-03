import type { Item } from "./item";

export interface Section {
  id: string;
  title: string;
  content: string;
  receiver: string;
  items: Item[];
}
