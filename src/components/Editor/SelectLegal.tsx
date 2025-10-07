import { Select, Spin } from 'antd';
import { useMemo } from 'react';

interface SelectLegalProps {
  loading: boolean;
  options: { value: number, label: string, searchText: string }[];
  value?: number[];
  onChange?: (value: number[]) => void;
}

function SelectLegal({ loading, options, value, onChange }: SelectLegalProps) {
  const normalized = useMemo(() => options.map(o => ({ ...o, searchText: o.searchText.toLowerCase() })), [options]);
  return (
    <Select
      mode="multiple"
      placeholder="Chọn hoặc tìm kiếm căn cứ pháp lý"
      showSearch
      loading={loading}
      value={value}
      onChange={onChange}
      notFoundContent={loading ? <Spin size="small" /> : "Không tìm thấy"}
      filterOption={(input, option) => {
        if (!input || !option) return true;
        const anyOption = option as unknown as { searchText?: string };
        return (anyOption.searchText ?? "").includes(input.toLowerCase());
      }}
      options={normalized}
      maxTagCount="responsive"
    />
  );
}

export default SelectLegal