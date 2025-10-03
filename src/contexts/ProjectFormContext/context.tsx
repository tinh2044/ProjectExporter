import { createContext, useReducer } from "react";
import type { ProjectFormContextValue } from "./types";
import { formReducer } from "./reducer";
import type { Project } from "../../models/project";

const ProjectFormContext = createContext<ProjectFormContextValue | null>(null);

export function ProjectFormProvider({
  children,
  id,
  project,
}: {
  children: React.ReactNode;
  id: string;
  project: Project;
}) {
  const [state, dispatch] = useReducer(formReducer, {
    id,
    sections: [],
    project,
  });

  return (
    <ProjectFormContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectFormContext.Provider>
  );
}

export default ProjectFormContext;
