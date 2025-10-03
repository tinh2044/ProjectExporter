import { useContext } from "react";
import ProjectFormContext from "../contexts/ProjectFormContext/context";

export const useProjectForm = () => {
  const context = useContext(ProjectFormContext);
  if (!context) {
    throw new Error("useProjectForm must be used within a ProjectFormProvider");
  }
  return context;
};
