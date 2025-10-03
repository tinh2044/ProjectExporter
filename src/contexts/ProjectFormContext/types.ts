import type { Project } from "@/models/project";
import type { ProjectForm } from "../../models/project-form";
import type { Section } from "../../models/project-form/section";

export type ProjectFormState = ProjectForm;

export type ProjectFormAction =
  | { type: "ADD_SECTION" }
  | { type: "DELETE_SECTION"; payload: string }
  | { type: "UPDATE_SECTION"; payload: Partial<Section> }
  | {
      type: "ADD_TEXT_EDITOR_ITEM";
      payload: string;
    }
  | {
      type: "ADD_SELECTION_ITEM";
      payload: string;
    }
  | {
      type: "DELETE_ITEM";
      payload: { sectionId: string; itemId: string };
    }
  | {
      type: "UPDATE_PROJECT";
      payload: Partial<Project>;
    };

export type ProjectFormContextValue = {
  state: ProjectFormState;
  dispatch: React.Dispatch<ProjectFormAction>;
};
