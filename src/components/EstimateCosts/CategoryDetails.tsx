/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { costReportOptions } from "@/services/constants";
import { formatNumberWithDots } from "@/utils/formatters";
import type {
  BasicProjectInfo,
  EstimateCostRow,
  EstimateCostData,
} from "@/types";
import { useCallback, useMemo } from "react";
import RowItem from "./RowItem";

const COL_WIDTH = ["w-[25%]", "w-2/12", "w-[20%]", "w-5/12", "w-[5%]"];

type CategoryDetailsProps = {
  localData: EstimateCostData;
  setLocalData: React.Dispatch<React.SetStateAction<EstimateCostData>>;
  basicInfo: BasicProjectInfo;
};

export default function CategoryDetails({
  localData,
  setLocalData,
  basicInfo,
}: CategoryDetailsProps) {
  const categories = useMemo(
    () => localData.categories,
    [localData.categories]
  );

    const handleAddRow = useCallback(() => {
      const newRow: EstimateCostRow = {
        costName: "",
        id: Date.now().toString(),
        costType: "",
        costDesc: "",
        moneyBeforeTax: 0,
        moneyAfterTax: 0,
        note: "",
        formula: "",
        vat: 0,
      };

      setLocalData((prev) => ({
        ...prev,
        rows: [...(prev?.rows || []), newRow],
      }));
    }, [setLocalData]);

    const handleRemoveRow = useCallback(
      (rowId: string) => {
        setLocalData((prev) => ({
          ...prev,
          rows: (prev?.rows || []).filter((row) => !(row.id === rowId)),
        }));
      },
      [setLocalData]
    );

    const handleUpdateRow = useCallback(
      (rowId: string, rowUpdate: Partial<EstimateCostRow>) => {
        setLocalData((prev) => ({
          ...prev,
          rows: (prev?.rows || []).map((row) =>
            row.id === rowId ? { ...row, ...rowUpdate } : row
          ),
        }));
      },
      [setLocalData]
    );


  const availableOptionsByRowId = useMemo(() => {
    const rows = localData?.rows || [];
    const allowed =
      basicInfo.costReportOptions || costReportOptions.map((o) => o.value);

    const usedCountByType = rows.reduce<Record<string, number>>((acc, r) => {
      if (r.costType) acc[r.costType] = (acc[r.costType] || 0) + 1;
      return acc;
    }, {});

    return new Map(
      rows.map((row) => {
        const options = costReportOptions
          .filter((o) => allowed.includes(o.value))
          .filter((o) => {
            const count = usedCountByType[o.value] || 0;
            return count === 0 || o.value === row.costType;
          })
          .map((o) => ({ value: o.value, label: o.label }));
        return [row.id, options] as const;
      })
    );
  }, [localData?.rows, basicInfo.costReportOptions]);

  const isManual = basicInfo.calculationType === "manual";

  const handleChangeCalculationType = useCallback(
    (checked: boolean) => {
      const newCalculationType = checked ? "manual" : "standard";
      setLocalData((prev) => {
        const rows = (prev?.rows || []).map((r) => ({
          ...r,
          calculationType: newCalculationType,
          moneyAfterTax: 0,
          moneyBeforeTax: 0,
          formula: "",
          note: "",
          kFactor: [],
        }));
        return {
          ...prev,
          basicInfo: { ...prev.basicInfo, calculationType: newCalculationType },
          rows,
        };
      });
    },
    [setLocalData]
  );

  const allowedValues =
    basicInfo.costReportOptions || costReportOptions.map((o) => o.value);
  const usedCount = (localData?.rows || []).filter((r) => r.costType).length;
  const isAddDisabled = usedCount >= allowedValues.length;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Bảng chi tiết dự toán</h3>
        <div className="flex justify-start items-center gap-2">
          <div className="flex justify-start items-center gap-2">
            <Checkbox
              
              checked={isManual}
              onChange={(e) => {handleChangeCalculationType(e.target.checked)}}
            />
            <span className="text-sm">Theo báo giá</span>
          </div>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddRow}
            disabled={isAddDisabled}
          >
            Thêm chi phí
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {(localData?.rows || []).map((row) => (
          <RowItem
            colWidth={COL_WIDTH}
            key={row.id}
            record={row as any}
            availableOptions={availableOptionsByRowId.get(row.id) || []}
            categories={categories}
            basicInfo={basicInfo}
            onUpdateRow={handleUpdateRow}
            onRemoveRow={handleRemoveRow}
          />
        ))}
      </div>

      <div className="text-right space-y-2">
        <div className="text-lg font-semibold">
          Tổng cộng:{" "}
          {formatNumberWithDots(
            (localData?.rows || []).reduce((s, r) => s + (r.moneyAfterTax || 0), 0)
          )}{" "}
          VNĐ
        </div>
      </div>
    </div>
  );
}
