// import ApprovalDecisionSection from "@/components/Editor/ApprovalDecisionSection";
// import ContractorSelectionSection from "@/components/Editor/ContractorSelectionSection";
// import DecisionSection from "@/components/Editor/DecisionSection";
// import PreparationPhaseSection from "@/components/Editor/PreparationPhaseSection";
// import { Flex, Form } from "antd";
// import { useLocation, useParams } from "react-router";

// export default function EditorPage() {
//   const { id } = useParams();
//   const { state: { BasicInfoForm, isDefaultFilled } } = useLocation();
//   const [form] = Form.useForm();
  

//   if (!id || !BasicInfoForm) {
//     return (
//       <div>
//         <h1>Error</h1>
//       </div>
//     );
//   }

  

//   return (
//     <Flex align="center" justify="center" gap={16} vertical>
//       <PreparationPhaseSection form={form} basicInfo={BasicInfoForm} isDefaultFilled={isDefaultFilled} />
//       <DecisionSection form={form} basicInfo={BasicInfoForm} />
//       <ContractorSelectionSection form={form} basicInfo={BasicInfoForm} />
//       <ApprovalDecisionSection form={form} basicInfo={BasicInfoForm} />
//     </Flex>
//   );
// }
