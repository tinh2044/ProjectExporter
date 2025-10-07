import ApprovalDecisionSection from "@/components/Editor/ApprovalDecisionSection";
import ContractorSelectionSection from "@/components/Editor/ContractorSelectionSection";
import DecisionSection from "@/components/Editor/DecisionSection";
import PreparationPhaseSection from "@/components/Editor/PreparationPhaseSection";
import { Flex, Form } from "antd";
import { useLocation, useParams } from "react-router";

export default function EditorPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const [form] = Form.useForm();

  if (!id || !state) {
    return (
      <div>
        <h1>Error</h1>
      </div>
    );
  }

  return (
    <Flex align="center" justify="center" gap={16} vertical>
      <PreparationPhaseSection form={form} basicInfo={state} />
      <DecisionSection form={form} basicInfo={state} />
      <ContractorSelectionSection form={form} basicInfo={state} />
      <ApprovalDecisionSection form={form} basicInfo={state} />
    </Flex>
  );
}
