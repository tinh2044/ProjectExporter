import type { Project } from "../project";
import type { Section } from "./section";

export interface ProjectForm {
  id: string;
  project: Project | undefined;
  sections: Section[];
}
