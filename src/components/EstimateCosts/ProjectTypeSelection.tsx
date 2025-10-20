import { Select } from "antd";
import { projectCategories, projectForms } from "@/services/constants";
import type { EstimateCostData } from "@/types";

type ProjectTypeSelectionProps = {
  localData: EstimateCostData;
  setLocalData: React.Dispatch<React.SetStateAction<EstimateCostData>>;
};

export default function ProjectTypeSelection({ localData, setLocalData }: ProjectTypeSelectionProps) {
  const updateProjectType = (projectType: string) => {
    setLocalData(prev => ({ ...prev, projectType }));
  };

  const updateProjectForm = (projectForm: string) => {
    setLocalData(prev => ({ ...prev, projectForm }));
  };

  return (
    <div className="flex space-x-4">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700 min-w-[120px]">
          Loại dự án:
        </label>
        <Select
          value={localData.projectType}
          onChange={updateProjectType}
          placeholder="Chọn loại dự án"
          options={projectCategories.map((cat: { id: string; name: string }) => ({
            value: cat.id,
            label: cat.name
          }))}
          style={{ width: "100%", maxWidth: "400px" }}
          showSearch
          filterOption={(input, option) =>
            String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700 min-w-[120px]">
          Hình thức dự án:
        </label>
        <Select
          value={localData.projectForm}
          onChange={updateProjectForm}
          placeholder="Chọn hình thức dự án"
          options={projectForms.map((form: { value: string; label: string }) => ({
            value: form.value,
            label: form.label
          }))}
          style={{ width: "100%", maxWidth: "400px" }}
          showSearch
          filterOption={(input, option) =>
            String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>
    </div>
  );
}
