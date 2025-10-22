import { Table, Input, Select, Button, Collapse } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import CategoryDetails from "./CategoryDetails";
import type { EstimateCostCategory, EstimateCostData, EstimateCostRow } from "@/types";
import { useCallback } from "react";

type CategoryManagementProps = {
  localData: EstimateCostData;
  setLocalData: React.Dispatch<React.SetStateAction<EstimateCostData>>;
};

export default function CategoryManagement({ localData, setLocalData }: CategoryManagementProps) {
  const addCategory = () => {
    const newCategory : EstimateCostCategory = {
      id: Date.now().toString(),
      name: "",
    money: 0,
      vat: 8,
      rows: [{
        id: (Date.now() + 1).toString(),
        costType: "",
        money: 0, 
        note: "",
      }]
    };
    setLocalData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
  };

  const removeCategory = (categoryId: string) => {
    setLocalData(prev => ({ 
      ...prev, 
      categories: prev.categories.filter(cat => cat.id !== categoryId) 
    }));
  };

  const updateCategory = (categoryId: string, field: keyof EstimateCostCategory, value: string | number) => {
    setLocalData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, [field]: value }
          : cat
      )
    }));
  };

  // Functions for CategoryDetails - memoized to prevent infinite loops
  const addRowToCategory = useCallback((categoryId: string) => {
    const newRow = {
      id: Date.now().toString(),
      costType: "",
      money: 0,
      note: "",
    };
    
    setLocalData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, rows: [...cat.rows, newRow] }
          : cat
      )
    }));
  }, [setLocalData]);

  const removeRowFromCategory = useCallback((categoryId: string, rowId: string) => {
    setLocalData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, rows: cat.rows.filter(row => row.id !== rowId) }
          : cat
      )
    }));
  }, [setLocalData]);

  const updateRowInCategory = useCallback((categoryId: string, rowId: string, rowUpdate: Partial<EstimateCostRow>) => {
    setLocalData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? { 
              ...cat, 
              rows: cat.rows.map(row => 
                row.id === rowId 
                  ? { ...row, ...rowUpdate }
                  : row
              )
            }
          : cat
      )
    }));
  }, [setLocalData]);

  const categoryColumns = [
    {
      title: "Tên danh mục",
      dataIndex: "tenDanhMuc",
      width: 250,
      render: (_: unknown, record: EstimateCostCategory) => (
        <Input
          value={record.name}
          onChange={(e) => updateCategory(record.id, "name", e.target.value)}
          placeholder="Nhập tên danh mục (VD: Chi phí phần mềm)"
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Tổng tiền (VNĐ)",
      dataIndex: "money",
      width: 180,
      render: (_: unknown, record: EstimateCostCategory) => (
        <Input
          type="number"
          value={record.money}
          onChange={(e) => updateCategory(record.id, "money", Number(e.target.value) || 0)}
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
            { value: 8, label: "8%" },
            { value: 10, label: "10%" }
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
        <h3 className="text-lg font-semibold">Quản lý danh mục</h3>
        <Button
          type="dashed"
          onClick={addCategory}
        >
          Thêm danh mục
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
        <h3 className="text-lg font-semibold mb-4">Chi tiết từng danh mục</h3>
        <Collapse
          items={localData.categories.map(category => ({
            key: category.id,
            label: (
              <div className="flex justify-between items-center w-full">
                <span className="font-semibold">
                  {category.name || "Danh mục chưa đặt tên"}
                </span>
                {/* <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Chưa VAT: {formatNumberWithDots(category.money)} VNĐ
                  </div>
                  <div className="text-green-600 font-semibold">
                    Có VAT: {formatNumberWithDots(category.money + (category.money * category.vat / 100))} VNĐ
                  </div>
                </div> */}
              </div>
            ),
            children: (
              <CategoryDetails
                category={category}
                basicInfo={localData.basicInfo}
                onAddRow={addRowToCategory}
                onRemoveRow={removeRowFromCategory}
                onUpdateRow={updateRowInCategory}
              />
            ),
          }))}
        />
      </div>
    </div>
  );
}
