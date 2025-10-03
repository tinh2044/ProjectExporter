import type { ProjectForm } from "../../models/project-form";
import type { Section } from "../../models/project-form/section";

export type ProjectFormState = ProjectForm;

export type ProjectFormAction =
  | { type: "ADD_SECTION" }
  | { type: "DELETE_SECTION"; payload: string }
  | { type: "UPDATE_SECTION"; payload: Partial<Section> };

export type ProjectFormContextValue = {
  state: ProjectFormState;
  dispatch: React.Dispatch<ProjectFormAction>;
};
