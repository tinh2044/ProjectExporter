import { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { useAppDispatch } from "@/store/hooks";
import { setProjectData, clearForm } from "@/store/slices/projectFormSlice";
import ProjectFormEditor from "@/components/ProjectFrom/ProjectFormEditor";

const ProjectFormPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id && state) {
      dispatch(setProjectData({ id, project: state }));
    }

    return () => {
      dispatch(clearForm());
    };
  }, [id, state, dispatch]);

  if (!id || !state) {
    return (
      <div>
        <h1>Error</h1>
      </div>
    );
  }

  return <ProjectFormEditor />;
};

export default ProjectFormPage;
