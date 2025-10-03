import { nanoid } from "nanoid";
import type { ProjectFormAction, ProjectFormState } from "./types";
import type { Section } from "../../models/project-form/section";

export const formReducer = (
  state: ProjectFormState,
  action: ProjectFormAction
) => {
  switch (action.type) {
    case "ADD_SECTION":
      return {
        ...state,
        sections: [
          ...state.sections,
          {
            id: nanoid(6),
            title: "",
            content: "",
            receiver: "",
          },
        ],
      };
    case "DELETE_SECTION":
      return {
        ...state,
        sections: state.sections.filter(
          (section: Section) => section.id !== action.payload
        ),
      };
    case "UPDATE_SECTION":
      return {
        ...state,
        sections: state.sections.map((section: Section) => {
          if (section.id === action.payload.id) {
            return {
              ...section,
              ...action.payload,
            };
          }
          return section;
        }),
      };
    default:
      return state;
  }
};
