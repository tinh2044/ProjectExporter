/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { costReportOptions } from "@/services/constants";
import { formatNumberWithDots } from "@/utils/formatters";
import type {
  BasicProjectInfo,
  EstimateCostRow,
  EstimateCostData,
} from "@/types";
import { useMemo } from "react";
import RowItem from "./RowItem";

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
  const categories = useMemo(
    () => localData.categories,
    [localData.categories]
  );

  const availableOptionsByRowId = useMemo(() => {
    const selectedValuesByRow = new Map<string, string>();
    (rows || []).forEach((r) => {
      if (r.costType) selectedValuesByRow.set(r.id, r.costType);
    });
    return new Map(
      (rows || []).map((row) => {
        const selectedOthers = (rows || [])
          .filter((r) => r.id !== row.id && r.costType)
          .map((r) => r.costType);
        const allowed = (basicInfo as any).costReportOptions || costReportOptions.map(o => o.value);
        const options = costReportOptions
          .filter((option) => !selectedOthers.includes(option.value))
          .filter((option) => allowed.includes(option.value))
          .map((o) => ({ value: o.value, label: o.label }));
        return [row.id, options] as const;
      })
    );
  }, [rows, basicInfo]);

  const usedCount = (rows || []).filter((r) => r.costType).length;
  const colWidth = ['w-[20%]', 'w-2/12', 'w-[20%]', 'w-5/12', 'w-[5%]'];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Bảng chi tiết dự toán</h3>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => onAddRow()}
          disabled={usedCount >= costReportOptions.length}
        >
          Thêm chi phí
        </Button>
      </div>

      {/* Header */}
      {/* <div className="flex gap-4 text-xs font-medium text-gray-600">
        <div className={`${colWidth[0]}`}>TT cơ bản</div>
        <div>Hệ số k</div>
        <div className={`${colWidth[1]}`}>Diễn giải</div>
        <div className={`${colWidth[2]}`}>Số tiền</div>
        <div>Số tiền sau thuế</div>
        <div className={`${colWidth[3]}`}>Ghi chú</div>
        <div className={`${colWidth[4]}`}>Thao tác</div>
      </div> */}

      {/* Rows */}
      <div className="space-y-2">
        {(rows || []).map((row) => (
          <RowItem
            colWidth={colWidth}
            key={row.id}
            record={row as any}
            availableOptions={availableOptionsByRowId.get(row.id) || []}
            categories={categories}
            basicInfo={basicInfo}
            onUpdateRow={onUpdateRow}
            onRemoveRow={onRemoveRow}
          />
        ))}
      </div>

      <div className="text-right space-y-2">
        <div className="text-lg font-semibold">
          Tổng cộng:{" "}
          {formatNumberWithDots(
            (rows || []).reduce((s, r) => s + (r.moneyAfterTax || 0), 0)
          )}{" "}
          VNĐ
        </div>
      </div>
    </div>
  );
}
