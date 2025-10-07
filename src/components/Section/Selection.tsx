import type { Selection as SelectionModel } from "@/models/project-form/selection";
import { Select, Spin, Flex } from "antd";
import { useState, useEffect } from "react";
import { sectionTypesData } from "@/data/section-types";

function Selection({
  selectionModel,
  loading,
  mode,
  placeholder,
  onChange,
  availableOptions: propAvailableOptions,
}: {
  selectionModel: SelectionModel;
  loading: boolean;
  mode: "multiple" | "tags";
  placeholder: string;
  onChange: (e: number[]) => void;
  availableOptions?: { value: number; label: string }[];
}) {
  const [selectedSectionType, setSelectedSectionType] = useState<string>("");
  const [availableOptions, setAvailableOptions] = useState<{ value: number; label: string }[]>(propAvailableOptions || []);

  // Sync availableOptions with prop or selectionModel.options
  useEffect(() => {
    if (propAvailableOptions && propAvailableOptions.length > 0) {
      setAvailableOptions(propAvailableOptions);
    } else if (selectionModel && selectionModel.options && selectionModel.options.length > 0) {
      setAvailableOptions(selectionModel.options);
      // Find selectedSectionType from options hiện tại
      if (!selectedSectionType) {
        const firstOption = selectionModel.options[0];
        if (firstOption) {
          const foundType = sectionTypesData.sectionTypes.find(type =>
            type.options.some(opt => opt.value === firstOption.value && opt.label === firstOption.label)
          );
          if (foundType) {
            setSelectedSectionType(foundType.id);
          }
        }
      }
    }
  }, [selectionModel, selectedSectionType, propAvailableOptions]);

  const handleSectionTypeChange = (newType: string) => {
    setSelectedSectionType(newType);
    // Clear values when section type changes
    if (selectionModel) {
      selectionModel.values = [];
      onChange([] as number[]);
    }
  };

  useEffect(() => {
    if (selectedSectionType) {
      const sectionType = sectionTypesData.sectionTypes.find(type => type.id === selectedSectionType);
      if (sectionType && sectionType.options) {
        setAvailableOptions(sectionType.options);
      }
    } else {
      setAvailableOptions([]);
    }
  }, [selectedSectionType]);

  return (
    <Flex justify="space-between" gap="small" style={{ width: "100%" }}>
      <Select
        
        placeholder="Chọn loại section"
        value={selectedSectionType}
        onChange={handleSectionTypeChange}
        className="w-1/4"
        options={sectionTypesData.sectionTypes.map((type) => ({
          value: type.id,
          label: type.name,
        }))}
      />

      {selectedSectionType && (
        <Select
          className="w-3/4"
          mode={mode}
          placeholder={placeholder}
          showSearch
          loading={loading}
          value={selectionModel.values}
          onChange={onChange}
          notFoundContent={loading ? <Spin size="small" /> : "Không tìm thấy"}
          filterOption={(input, option) => {
            if (!input || !option) return true;
            const anyOption = option as unknown as { searchText?: string };
            return (anyOption.searchText ?? "").includes(input.toLowerCase());
          }}
          options={availableOptions}
          maxTagCount="responsive"
        />
      )}
    </Flex>
  );
}

export default Selection;
