import { Table, Input, Select, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
// import CategoryDetails from "./CategoryDetails";
import type {
  EstimateCostCategory,
  EstimateCostData,
  // EstimateCostRow,
} from "@/types";
// import { useCallback } from "react";
import { projectCategoryOptions } from "@/services/constants";

type CategoryManagementProps = {
  localData: EstimateCostData;
  setLocalData: React.Dispatch<React.SetStateAction<EstimateCostData>>;
};

export default function CategoryManagement({
  localData,
  setLocalData,
}: CategoryManagementProps) {
  const addCategory = () => {
    const newCategory: EstimateCostCategory = {
      id: Date.now().toString(),
      name: "",
      money: 0,
      vat: 8,
      costType: "",
    };
    setLocalData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const removeCategory = (categoryId: string) => {
    setLocalData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== categoryId),
      rows: prev.categories.length == 1 ? [] : prev.rows
    }));
  };

  const updateCategory = (
    categoryId: string,
    field: keyof EstimateCostCategory,
    value: string | number
  ) => {
    setLocalData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      ),
    }));
  };


  const categoryColumns = [
    {
      title: "Tên chi phí",
      dataIndex: "tenChiPhi",
      width: 250,
      render: (_: unknown, record: EstimateCostCategory) => (
        <Input
          value={record.name}
          onChange={(e) => updateCategory(record.id, "name", e.target.value)}
          placeholder="Nhập tên chi phí (VD: Chi phí phần mềm)"
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Loại chi phí",
      dataIndex: "costType",
      width: 200,
      render: (_: unknown, record: EstimateCostCategory) => {
        return (
          <div>
            <Select
              value={record.costType}
              onChange={(value) => updateCategory(record.id, "costType", value)}
              placeholder={"Chọn loại chi phí"}
              options={projectCategoryOptions}
              style={{ width: "100%" }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </div>
        );
      },
    },
    {
      title: "Tổng tiền (VNĐ)",
      dataIndex: "money",
      width: 180,
      render: (_: unknown, record: EstimateCostCategory) => (
        <Input
          type="number"
          value={record.money}
          onChange={(e) =>
            updateCategory(record.id, "money", Number(e.target.value) || 0)
          }
          placeholder="Nhập tổng tiền"
          addonAfter="VNĐ"
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "VAT (%)",
      dataIndex: "vat",
      width: 120,
      render: (_: unknown, record: EstimateCostCategory) => (
        <Select
          value={record.vat}
          onChange={(value) => updateCategory(record.id, "vat", value)}
          options={[
            { value: 0, label: "0%" },
            { value: 8, label: "8%" },
            { value: 10, label: "10%" },
          ]}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Thao tác",
      width: 100,
      render: (_: unknown, record: EstimateCostCategory) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeCategory(record.id)}
          // disabled={localData.categories.length === 1}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quản lý chi phí</h3>
        <Button
          className="mt-4"
          type="default"
          color="primary"
          onClick={addCategory}
          disabled={localData.categories.length == 2}
        >
          Thêm chi phí
        </Button>
      </div>

      <Table
        dataSource={localData.categories}
        columns={categoryColumns}
        pagination={false}
        rowKey="id"
        size="small"
        bordered
        scroll={{ x: "max-content" }}
      />

      {/* Category Details Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Bảng chi tiết dự toán</h3>
        {/* <Collapse
          items={localData.categories.map(category => ({
            key: category.id,
            label: (
              <div className="flex justify-between items-center w-full">
                <span className="font-semibold">
                  {category.name || "Danh mục chưa đặt tên"}
                </span>
              </div>
            ),
            children: ( */}
        {/* ),
          }))}
        /> */}
      </div>
    </div>
  );
}
