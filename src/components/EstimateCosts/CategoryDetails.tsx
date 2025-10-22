import { Table, Select, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { costReportOptions } from "@/services/constants";
import { formatNumberWithDots } from "@/utils/formatters";
import type {
  BasicProjectInfo,
  EstimateCostCategory,
  EstimateCostRow,
} from "@/types";
import { calculateCost, calculateKFactor } from "@/utils/math";
import { useEffect, useCallback, useMemo } from "react";

type CategoryDetailsProps = {
  category: EstimateCostCategory;
  basicInfo: BasicProjectInfo;
  onAddRow: (categoryId: string) => void;
  onRemoveRow: (categoryId: string, rowId: string) => void;
  onUpdateRow: (
    categoryId: string,
    rowId: string,
    rowUpdate: Partial<EstimateCostRow>
  ) => void;
};

export default function CategoryDetails({
  category,
  basicInfo,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
}: CategoryDetailsProps) {
  const getAvailableOptions = (currentRowId: string) => {
    const selectedValues = category.rows
      .filter((row) => row.id !== currentRowId && row.costType)
      .map((row) => row.costType);

    return costReportOptions.filter(
      (option) => !selectedValues.includes(option.value)
    );
  };

  // Memoize basicInfo to prevent unnecessary recalculations
  const memoizedBasicInfo = useMemo(() => basicInfo, [basicInfo]);

  // Recalculate kFactor when basic project info changes
  useEffect(() => {
    category.rows.forEach((row) => {
      if (!row.costType) return;
      const nextK = calculateKFactor(row.costType, memoizedBasicInfo);
      const prevK = row.kFactor || [];
      const isSameLength = prevK.length === nextK.length;
      const isSame =
        isSameLength &&
        prevK.every(
          (f, idx) => f.value === nextK[idx].value && f.note === nextK[idx].note
        );
      if (!isSame) {
        onUpdateRow(category.id, row.id, {
          kFactor: nextK,
        });
      }
    });
  }, [memoizedBasicInfo, category.id]);

  const onUpdateTypeCost = useCallback(
    (recordId: string, value: string) => {
      onUpdateRow(category.id, recordId, { costType: value });

      if (value) {
        const calculatedResult = calculateCost(
          value,
          category,
          memoizedBasicInfo
        );

        if (
          calculatedResult &&
          typeof calculatedResult === "object" &&
          "totalCost" in calculatedResult
        ) {
          const totalCost = calculatedResult.totalCost || 0;
          const moneyValue = Math.round(Number(totalCost)) || 0;

          onUpdateRow(category.id, recordId, {
            money: moneyValue,
            formula: calculatedResult.formula || "",
            note: calculatedResult.note || "",
            kFactor: calculatedResult.kFactor || [],
          });
        }
      }
    },
    [category.id, memoizedBasicInfo]
  );
  useEffect(() => {
    category.rows.forEach((row) => {
      if (row.costType) {
        const calculatedResult = calculateCost(
          row.costType,
          category,
          memoizedBasicInfo,
        );

        if (
          calculatedResult &&
          typeof calculatedResult === "object" &&
          "totalCost" in calculatedResult
        ) {
          const totalCost = calculatedResult.totalCost || 0;
          const moneyValue = Math.round(Number(totalCost)) || 0;
          
          onUpdateRow(category.id, row.id, {
            costType: row.costType,
            money: moneyValue,
            formula: calculatedResult.formula || "",
            note: calculatedResult.note || "",
            kFactor: calculatedResult.kFactor || [],
          });
        }
      }
    });
  }, [category.money, category.vat, memoizedBasicInfo, category.id]);

  const rowColumns = [
    {
      title: "Loại chi phí",
      dataIndex: "costType",
      width: 200,
      render: (_: unknown, record: EstimateCostRow) => {
        const availableOptions = getAvailableOptions(record.id);
        const hasNoOptions = availableOptions.length === 0 && !record.costType;
        return (
          <div>
            <Select
              value={record.costType}
              onChange={(value) => onUpdateTypeCost(record.id, value)}
              placeholder={
                hasNoOptions ? "Không còn lựa chọn" : "Chọn loại chi phí"
              }
              options={availableOptions}
              style={{ width: "100%" }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              disabled={hasNoOptions}
            />
            {hasNoOptions && (
              <div className="text-xs text-red-500 mt-1">
                Tất cả loại chi phí đã được sử dụng
              </div>
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
        // const totalK = kFactors.reduce((acc, factor) => acc * (factor.value || 1), 1);

        return (
          <div className="text-left">
            <div className="mb-2">
              {/* <strong>Tổng k: {totalK.toFixed(3)}</strong> */}
              {kFactors.map((factor) => factor.value?.toFixed(3)).join(" * ")}
            </div>
            {/* <div className="space-y-1">
              {kFactors.map((factor, index) => (
                <Tooltip key={index} title={factor.note}>
                  <div className="text-xs text-gray-600 truncate">
                    {factor.note}: {factor.value}
                  </div>
                </Tooltip>
              ))}
            </div> */}
          </div>
        );
      },
    },
    {
      title: "Diễn giải",
      dataIndex: "formula",
      width: 150,
      render: (_: unknown, record: EstimateCostRow) => (
        <div className="text-left">{record.formula}</div>
      ),
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "money",
      width: 120,
      render: (_: unknown, record: EstimateCostRow) => (
        <div className="text-left">
          {formatNumberWithDots(record.money)} VNĐ
        </div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 300,
      render: (_: unknown, record: EstimateCostRow) => (
        <div
          className="text-left"
          dangerouslySetInnerHTML={{ __html: record.note || "" }}
        ></div>
      ),
    },
    {
      title: "Thao tác",
      width: 50,
      render: (_: unknown, record: EstimateCostRow) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemoveRow(category.id, record.id)}
          // disabled={category.rows.length === 1}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => onAddRow(category.id)}
          disabled={
            category.rows.filter((row) => row.costType).length >=
            costReportOptions.length
          }
        >
          Thêm chi phí
        </Button>
      </div>

      <Table
        dataSource={category.rows}
        columns={rowColumns}
        pagination={false}
        rowKey="id"
        size="small"
        bordered
        scroll={{ x: "max-content" }}
      />

      <div className="text-right space-y-2">
        <div className="text-lg font-semibold">
          Tổng cộng:
          {formatNumberWithDots(
            category.rows.reduce((sum, row) => sum + (row.money || 0), 0)
          )}{" "}
          VNĐ
        </div>
      </div>
    </div>
  );
}
