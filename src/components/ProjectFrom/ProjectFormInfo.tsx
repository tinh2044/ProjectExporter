import { useProjectForm } from "../../hooks/useProjectForm";

const ProjectFormInfo = () => {
  const { state } = useProjectForm();

  return (
    <div>
      <h1>Project Form</h1>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

export default ProjectFormInfo;
