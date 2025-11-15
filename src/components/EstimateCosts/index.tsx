import { Modal, Button } from "antd";
import { useState, useEffect } from "react";
import ProjectTypeSelection from "./BasicInfoCollapse";
import CategoryManagement from "./CategoryManagement";
import type { EstimateCostsProps, EstimateCostData } from "@/types";
import CategoryDetails from "./CategoryDetails";

export default function EstimateCosts({ 
  form, 
  fieldName, 
  open,
  onClose,
  title = "Dự toán chi phí" 
}: EstimateCostsProps) {
  const [localData, setLocalData] = useState<EstimateCostData>(() => {
    return {
      basicInfo: {
        projectType: "",
        projectForm: "",
        projectDocType: "",
        projectCategory: "",
        geographicLocation: "",
        projectScope: "",
        equipmentRatio: "",
        projectTypeDetail: "",
        projectSpecificity: "",
        projectPhase: "",
        language: "",
        calculationType: "standard",
        costReportOptions: [],
      },
      categories: [
        {
          id: Date.now().toString(),
          money: 0,
          vat: 8,
          costType: "",
        },
      ],
      rows: [
        {
          id: (Date.now() + 1).toString(),
          costName: "",
          // calculationType: "standard",
          costType: "",
          moneyBeforeTax: 0,
          moneyAfterTax: 0,
          note: "",
          vat: 0,
        },
      ],
    };
  });
  // Initialize from form data when modal opens
  useEffect(() => {
    if (!open) return;
    
    const formData = form.getFieldValue(fieldName) || {};
    
    if (formData && typeof formData === 'object' && formData.categories && formData.categories.length > 0) {
      setLocalData(formData);
    }
    // If no form data, keep the default initialized state
  }, [open, form, fieldName]);

  const handleOk = () => {
    form.setFieldValue(fieldName, localData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const fillDefaultValues = () => {
    const defaultCategoryId = Date.now().toString();
    const defaultData: EstimateCostData = {
      basicInfo: {
        projectDocType: "baoCaoKTKT",
        projectType: "b",
        projectForm: "baoCaoKTKT",
        projectCategory: "software",
        geographicLocation: "urban",
        projectScope: "local",
        equipmentRatio: "low",
        projectTypeDetail: "new",
        projectSpecificity: "normal",
        projectPhase: "ktkt",
        language: "vietnamese",
        calculationType: "standard",
        costReportOptions: [
          "quanLyDuAn",
          "lapBaoCaoKTKT",
          "thamTraBaoCaoKTKT",
          "thamDinhGia",
        ],
      },
      categories: [
        {
          id: defaultCategoryId,
          // name: "Chi phí xây dựng phần mềm",
          money: 7636363636,
          vat: 8,
          costType: "b",
        },
      ],
      rows: [
        {
          costName: "Lập báo cáo kinh tế - kỹ thuật",
          id: (Date.now() + 1).toString(),
          // calculationType: "standard",
          costType: "lapBaoCaoKTKT",
          moneyBeforeTax: 0,
          moneyAfterTax: 0,
          note: "",
          vat: 0,
        },
        {
          costName: "Thẩm tra báo cáo kinh tế - kỹ thuật",
          id: (Date.now() + 2).toString(),
          // calculationType: "composite",
          costType: "thamTraBaoCaoKTKT",
          moneyBeforeTax: 0,
          moneyAfterTax: 0,
          note: "",
          vat: 0,
        },
      ],
    };
  
    setLocalData(defaultData);
  };



  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width="95vw"
      centered
      styles={{
        body: {
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "16px",
        },
      }}
    >
      <div className="space-y-6">
        <div className="flex justify-end mb-4">
          <Button
            variant="solid"
            color="green"
            onClick={fillDefaultValues}
            size="large"
          >
            Điền giá trị mặc định
          </Button>
        </div>

        <ProjectTypeSelection
          localData={localData}
          setLocalData={setLocalData}
        />

        <CategoryManagement localData={localData} setLocalData={setLocalData} />

        <CategoryDetails
          localData={localData}
          basicInfo={localData.basicInfo}
          setLocalData={setLocalData}
        />

        {/* <TotalSummary localData={localData} /> */}
      </div>
    </Modal>
  );
}
