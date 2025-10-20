import { Modal, Button } from "antd";
import { useState, useEffect } from "react";
import ProjectTypeSelection from "./ProjectTypeSelection";
import CategoryManagement from "./CategoryManagement";
import type { EstimateCostsProps, EstimateCostData } from "@/types";

export default function EstimateCosts({ 
  form, 
  fieldName, 
  open,
  onClose,
  title = "Dự toán chi phí" 
}: EstimateCostsProps) {
  const [localData, setLocalData] = useState<EstimateCostData>({
    projectType: "",
    projectForm: "",
    categories: [
      {
        id: Date.now().toString(),
        name: "",
        money: 0,
        vat: 8,
        rows: [
          {
            id: (Date.now() + 1).toString(),
            costType: "",
            money: 0,
            note: "",
          },
        ],
      },
    ],
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
    const defaultData: EstimateCostData = {
      projectType: "b",
      projectForm: "baoCaoKTKT",
      categories: [
        {
          id: Date.now().toString(),
          name: "Chi phí xây dựng phần mềm",
          money: 7636363636,
          vat: 8,
          rows: [
            {
              id: (Date.now() + 1).toString(),
              costType: "lapBaoCaoKTKT",
              money: 0,
              note: "",
            },
            {
              id: (Date.now() + 2).toString(),
              costType: "thamTraBaoCaoKTKT",
              money: 0,
              note: "",
            }
          ]
        }
      ]
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
            type="primary" 
            onClick={fillDefaultValues}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            Điền giá trị mặc định
          </Button>
        </div>
        
        <ProjectTypeSelection 
          localData={localData}
          setLocalData={setLocalData}
        />
        
        <CategoryManagement 
          localData={localData}
          setLocalData={setLocalData}
        />
        
        {/* <TotalSummary localData={localData} /> */}
      </div>
    </Modal>
  );
}
