import { Form } from "antd";
import BasicInfoForm from "../components/Form/BasicInfoForm";
import PreparationPhaseForm from "../components/Form/PreparationPhaseForm";
import DecisionForm from "../components/Form/DecisionForm";
import ContractorSelectionForm from "../components/Form/ContractorSelectionForm";
import ApprovalDecisionForm from "../components/Form/ApprovalDecisionForm";

const FullFormPage = () => {
  const [form] = Form.useForm();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
      }}
    >
      <BasicInfoForm form={form} />
      <PreparationPhaseForm form={form} />
      <DecisionForm form={form} />
      <ContractorSelectionForm form={form} />
      <ApprovalDecisionForm form={form} />
    </div>
  );
};

export default FullFormPage;
