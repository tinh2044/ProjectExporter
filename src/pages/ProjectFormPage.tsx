import { useLocation, useParams } from "react-router";
import { ProjectFormProvider } from "@/contexts/ProjectFormContext/context";
import ProjectFormEditor from "@/components/ProjectFrom/ProjectFormEditor";

const ProjectFormPage = () => {
  const { id } = useParams();
  const { state } = useLocation();

  if (!id || !state) {
    return (
      <div>
        <h1>Error</h1>
      </div>
    );
  }

  return (
    <ProjectFormProvider id={id} project={state}>
      <ProjectFormEditor />
    </ProjectFormProvider>
  );
};

export default ProjectFormPage;
