import { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { useAppDispatch } from "@/store/hooks";
import { setProjectData, clearForm } from "@/store/slices/projectFormSlice";
// import ProjectFormEditor from "@/components/ProjectFrom/ProjectFormEditor";
import PreparationPhaseForm from "@/components/Editor/PreparationPhaseForm";
import DecisionForm from "@/components/Editor/DecisionForm";
import ContractorSelectionForm from "@/components/Editor/ContractorSelectionForm";
import ApprovalDecisionForm from "@/components/Editor/ApprovalDecisionForm";
import { Form } from "antd";

const ProjectFormPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  // console.log(state);
  console.log(form.getFieldsValue(), state);
  form.setFieldsValue(state);
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
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
      }}
    >
      <PreparationPhaseForm form={form} basicInfo={state} />
      <DecisionForm form={form} basicInfo={state} />
      <ContractorSelectionForm form={form} basicInfo={state} />
      <ApprovalDecisionForm form={form} basicInfo={state} />
    </div>
  );
  // return <ProjectFormEditor />;
};

export default ProjectFormPage;
