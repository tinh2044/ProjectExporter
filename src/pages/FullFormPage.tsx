import { Form } from "antd";
import BasicInfoForm from "@/components/Form/BasicInfoForm";
import ProposalEstimateForm from "@/components/Form/ProposalEstimateForm";
import DecisionEstimateForm from "@/components/Form/DecisionEstimateForm";
import ProposalBiddingPlanForm from "@/components/Form/ProposalBiddingPlanForm";
import DecisionBiddingPlanForm from "@/components/Form/DecisionBiddingPlanForm";

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
      <ProposalEstimateForm form={form} />
      <DecisionEstimateForm form={form} />
      <ProposalBiddingPlanForm form={form} />
      <DecisionBiddingPlanForm form={form} />
    </div>
  );
};

export default FullFormPage;
