import { nanoid } from "nanoid";
import type { ProjectFormAction, ProjectFormState } from "./types";
import type { Section } from "../../models/project-form/section";

export const formReducer = (
  state: ProjectFormState,
  action: ProjectFormAction
): ProjectFormState => {
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
            items: [],
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
    case "ADD_TEXT_EDITOR_ITEM":
      return {
        ...state,
        sections: state.sections.map((section: Section) => {
          if (section.id === action.payload) {
            return {
              ...section,
              items: [
                ...section.items,
                {
                  id: nanoid(6),
                  title: "",
                  content: "",
                },
              ],
            };
          }
          return section;
        }),
      };
    case "ADD_SELECTION_ITEM":
      return {
        ...state,
        sections: state.sections.map((section: Section) => {
          if (section.id === action.payload) {
            return {
              ...section,
              items: [
                ...section.items,
                {
                  id: nanoid(6),
                  title: "",
                  values: [],
                  options: [],
                },
              ],
            };
          }
          return section;
        }),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        sections: state.sections.map((section: Section) => {
          if (section.id === action.payload.sectionId) {
            return {
              ...section,
              items: section.items.filter(
                (item) => item.id !== action.payload.itemId
              ),
            };
          }
          return section;
        }),
      };
    case "UPDATE_PROJECT":
      return {
        ...state,
        project: {
          ...state.project,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
