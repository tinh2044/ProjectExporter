import { useLocation, useParams } from "react-router";
import { ProjectFormProvider } from "../contexts/ProjectFormContext/context";
import ProjectFormInfo from "../components/ProjectFrom/ProjectFormInfo";

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
      <ProjectFormInfo />
    </ProjectFormProvider>
  );
};

export default ProjectFormPage;
