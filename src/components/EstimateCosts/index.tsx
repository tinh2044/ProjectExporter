import { Modal, Button } from "antd";
import { useState, useEffect, useCallback } from "react";
import ProjectTypeSelection from "./BasicInfoCollapse";
import CategoryManagement from "./CategoryManagement";
import type { EstimateCostsProps, EstimateCostData, EstimateCostRow } from "@/types";
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
      },
      categories: [
        {
          id: Date.now().toString(),
          name: "",
          money: 0,
          vat: 8,
          costType: "",
        },
      ],
      rows: [
        {
          id: (Date.now() + 1).toString(),
          costType: "",
          money: 0,
          note: "",
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
      },
      categories: [
        {
          id: defaultCategoryId,
          name: "Chi phí xây dựng phần mềm",
          money: 7636363636,
          vat: 8,
          costType: "b",
        },
      ],
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
        },
      ],
    };
  
    setLocalData(defaultData);
  };

  const addRow = useCallback(
    () => {
      const newRow: EstimateCostRow = {
        id: Date.now().toString(),
        costType: "",
        money: 0,
        note: "",
        formula: "",
      };

      setLocalData((prev) => ({
        ...prev,
        rows: [...(prev.rows || []), newRow],
      }));
    },
    [setLocalData]
  );

  const removeRow = useCallback(
    (rowId: string) => {
      setLocalData((prev) => ({
        ...prev,
        rows: (prev.rows || []).filter(
          (row) => !(row.id === rowId)
        ),
      }));
    },
    [setLocalData]
  );

  const updateRow = useCallback(
    (
      rowId: string,
      rowUpdate: Partial<EstimateCostRow>
    ) => {
      setLocalData((prev) => ({
        ...prev,
        rows: (prev.rows || []).map((row) =>
          row.id === rowId 
            ? { ...row, ...rowUpdate }
            : row
        ),
      }));
    },
    [setLocalData]
  );

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
          rows={localData.rows || []}
          basicInfo={localData.basicInfo}
          onAddRow={addRow}
          onRemoveRow={removeRow}
          onUpdateRow={updateRow}
        />

        {/* <TotalSummary localData={localData} /> */}
      </div>
    </Modal>
  );
}
