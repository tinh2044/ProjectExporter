import { Table, Select, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { costReportOptions } from "@/services/constants";
import { formatNumberWithDots } from "@/utils/formatters";
import type { BasicProjectInfo, EstimateCostRow, EstimateCostData } from "@/types";
import { calculateCost } from "@/utils/math";
import { useEffect, useCallback, useMemo } from "react";

type CategoryDetailsProps = {
  localData: EstimateCostData;
  rows: EstimateCostRow[];
  basicInfo: BasicProjectInfo;
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  onUpdateRow: (rowId: string, rowUpdate: Partial<EstimateCostRow>) => void;
};

export default function CategoryDetails({
  localData,
  rows,
  basicInfo,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
}: CategoryDetailsProps) {
  // Memoize categories to ensure stable reference
  const categories = useMemo(() => localData.categories, [localData.categories]);
  
  // Create memoized version of basicInfo to prevent unnecessary recalculations
  const memoizedBasicInfo = useMemo(
    () => ({
      projectType: basicInfo.projectType,
      projectForm: basicInfo.projectForm,
      projectDocType: basicInfo.projectDocType,
      projectCategory: basicInfo.projectCategory,
      geographicLocation: basicInfo.geographicLocation,
      projectScope: basicInfo.projectScope,
      equipmentRatio: basicInfo.equipmentRatio,
      projectTypeDetail: basicInfo.projectTypeDetail,
      projectSpecificity: basicInfo.projectSpecificity,
      projectPhase: basicInfo.projectPhase,
      language: basicInfo.language,
    }),
    [
      basicInfo.projectType,
      basicInfo.projectForm,
      basicInfo.projectDocType,
      basicInfo.projectCategory,
      basicInfo.geographicLocation,
      basicInfo.projectScope,
      basicInfo.equipmentRatio,
      basicInfo.projectTypeDetail,
      basicInfo.projectSpecificity,
      basicInfo.projectPhase,
      basicInfo.language,
    ]
  );

  const getAvailableOptions = (currentRowId: string) => {
    const selectedValues = (rows || [])
      .filter((row) => row.id !== currentRowId && row.costType)
      .map((row) => row.costType);

    return costReportOptions.filter((option) => !selectedValues.includes(option.value));
  };

  // Recalculate each row by summing across all categories
  useEffect(() => {
    (rows || []).forEach((row) => {

      const r = calculateCost(row.costType, categories, memoizedBasicInfo);
      onUpdateRow(row.id, {
          money: Math.round(r.totalCost) || 0,
          formula: r.formula,
          note: r.note,
          kFactor: r.kFactor || [],
        });
    });
  }, [categories, memoizedBasicInfo]);

  const onUpdateTypeCost = useCallback(
    (recordId: string, value: string) => {

      const r = calculateCost(value, categories, memoizedBasicInfo);
      onUpdateRow(recordId, {
          costType: value,
          money: Math.round(r.totalCost) || 0,
          formula: r.formula,
          note: r.note,
          kFactor: r.kFactor || [],
        });
    },
    [categories, memoizedBasicInfo, onUpdateRow]
  );

  const columns = [
    {
      title: "Loại chi phí",
      dataIndex: "costType",
      width: 220,
      render: (_: unknown, record: EstimateCostRow) => {
        const availableOptions = getAvailableOptions(record.id);
        const hasNoOptions = availableOptions.length === 0 && !record.costType;
        return (
          <div>
            <Select
              value={record.costType}
              onChange={(value) => onUpdateTypeCost(record.id, value)}
              placeholder={hasNoOptions ? "Không còn lựa chọn" : "Chọn loại chi phí"}
              options={availableOptions}
              style={{ width: "100%" }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              disabled={hasNoOptions}
            />
            {hasNoOptions && (
              <div className="text-xs text-red-500 mt-1">Tất cả loại chi phí đã được sử dụng</div>
            )}
          </div>
        );
      },
    },
    {
      title: "Hệ số k",
      dataIndex: "kFactor",
      width: 200,
      render: (_: unknown, record: EstimateCostRow) => {
        const kFactors = record.kFactor || [];
        return (
          <div className="text-left">
            <div className="mb-2">{kFactors.map((f) => f.value?.toFixed(3)).join(" * ")}</div>
          </div>
        );
      },
    },
    {
      title: "Diễn giải",
      dataIndex: "formula",
      width: 200,
      render: (_: unknown, record: EstimateCostRow) => (
        <div className="text-left">{record.formula}</div>
      ),
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "money",
      width: 140,
      render: (_: unknown, record: EstimateCostRow) => (
        <div className="text-left">{formatNumberWithDots(record.money)} VNĐ</div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 300,
      render: (_: unknown, record: EstimateCostRow) => (
        <div className="text-left" dangerouslySetInnerHTML={{ __html: record.note || "" }} />
      ),
    },
    {
      title: "Thao tác",
      width: 60,
      render: (_: unknown, record: EstimateCostRow) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onRemoveRow(record.id)} />
      ),
    },
  ];

  const usedCount = (rows || []).filter((r) => r.costType).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Bảng chi tiết dự toán</div>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => onAddRow()}
          disabled={usedCount >= costReportOptions.length}
        >
          Thêm chi phí
        </Button>
      </div>

      <Table
        dataSource={rows}
        columns={columns}
        pagination={false}
        rowKey="id"
        size="small"
        bordered
        scroll={{ x: "max-content" }}
      />

      <div className="text-right space-y-2">
        <div className="text-lg font-semibold">
          Tổng cộng: {formatNumberWithDots((rows || []).reduce((s, r) => s + (r.money || 0), 0))} VNĐ
        </div>
      </div>
    </div>
  );
}
