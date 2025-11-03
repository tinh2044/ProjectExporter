import { Select, Button, InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Checkbox from "antd/es/checkbox";
import { useCallback, useEffect, useMemo } from "react";
import { costReportOptions } from "@/services/constants";
import { calculateCost } from "@/utils/math";
import type {
  EstimateCostRow,
  EstimateCostCategory,
  BasicProjectInfo,
} from "@/types";

type RowData = EstimateCostRow & { vat?: number; calculationType?: string };

type RowItemProps = {
  colWidth: string[];
  record: RowData;
  availableOptions: Array<{ value: string; label: string }>;
  categories: EstimateCostCategory[];
  basicInfo: BasicProjectInfo;
  onUpdateRow: (rowId: string, rowUpdate: Partial<RowData>) => void;
  onRemoveRow: (rowId: string) => void;
};

function RowItem({
  colWidth,
  record,
  availableOptions,
  categories,
  basicInfo,
  onUpdateRow,
  onRemoveRow,

}: RowItemProps) {
  const hasNoOptions = useMemo(
    () => availableOptions.length === 0 && !record.costType,
    [availableOptions.length, record.costType]
  );

  const onSelectType = useCallback(
    (value: string) => {
      const r = calculateCost(
        value,
        record as unknown as EstimateCostRow,
        categories,
        basicInfo
      );
      const calculationType =
        costReportOptions.find((option) => option.value === value)
          ?.calculationType || "standard";
      onUpdateRow(record.id, {
        costName: r.costName,
        costType: value,
        moneyAfterTax: Math.round(r.totalCost) || 0,
        moneyBeforeTax: Math.round(r.costBeforeTax) || 0,
        formula: r.formula,
        note: r.note,
        kFactor: r.kFactor || [],
        calculationType,
      });
    },
    [basicInfo, categories, onUpdateRow, record]
  );

  // Recalculate row when categories/basicInfo change (for non-manual rows)
  useEffect(() => {
    if (!record.costType) return;
    if (record.calculationType === "manual") return;
    const r = calculateCost(
      record.costType,
      record as unknown as EstimateCostRow,
      categories,
      basicInfo
    );
    const nextMoneyAfter = Math.round(r.totalCost) || 0;
    const nextMoneyBefore = Math.round(r.costBeforeTax) || 0;
    const nextFormula = r.formula;
    const nextNote = r.note;
    const nextK = r.kFactor || [];

    const isSame =
      record.moneyAfterTax === nextMoneyAfter &&
      record.moneyBeforeTax === nextMoneyBefore &&
      record.formula === nextFormula &&
      record.note === nextNote &&
      JSON.stringify(record.kFactor || []) === JSON.stringify(nextK);

    if (!isSame) {
      onUpdateRow(record.id, {
        moneyAfterTax: nextMoneyAfter,
        moneyBeforeTax: nextMoneyBefore,
        formula: nextFormula,
        note: nextNote,
        kFactor: nextK,
      });
    }
  }, [
    record,
    record.id,
    record.costType,
    record.calculationType,
    record.vat,
    categories,
    basicInfo,
    onUpdateRow,
  ]);

  const isManual = record.calculationType === "manual";

  const toggleQuoteMode = () => {
    const newCalculationType = isManual ? "standard" : "manual";
    if (newCalculationType === "manual") {
      onUpdateRow(record.id, {
        calculationType: newCalculationType,
        moneyAfterTax: 0,
        moneyBeforeTax: 0,
        formula: "",
        note: "",
        kFactor: [],
      });
    }
  };

  return (
    <div
      className={`flex gap-4 items-start border border-gray-200 rounded p-2`}
    >
      {/* Loại chi phí */}
      <div className={`${colWidth[0]} flex flex-col gap-2 justify-start`}>
        <Select
          value={record.costType}
          onChange={onSelectType}
          placeholder={
            hasNoOptions ? "Không còn lựa chọn" : "Chọn loại chi phí"
          }
          options={availableOptions}
          style={{ width: "%" }}
          showSearch
          filterOption={(input, option) =>
            String(option?.label ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          disabled={hasNoOptions}
        />
        <Select
          className="!my-2"
          value={record.vat}
          onChange={(value) => onUpdateRow(record.id, { vat: value })}
          options={[
            { value: 0, label: "VAT 0%" },
            { value: 8, label: "VAT 8%" },
            { value: 10, label: "VAT 10%" },
          ]}
          style={{ width: "100%" }}
        />
        <div className="text-left">
          {record.kFactor &&
          record.kFactor.length > 0 &&
          record.kFactor[0].value != 1 ? (
            <span>
              {`Hệ số k: ${(record.kFactor || [])
                .map((f) => f.value?.toFixed(3))
                .join(" * ")}`}
            </span>
          ) : null}
        </div>

        {/* Theo báo giá */}
        <div className="flex justify-start items-center gap-2">
          <Checkbox
            checked={isManual}
            onChange={toggleQuoteMode}
            // title={isManual ? "Theo báo giá" : "Tính định mức"}
          />
          <span className="text-sm">Theo báo giá</span>
        </div>
      </div>

      {/* Diễn giải */}
      <div className={`${colWidth[1]} text-left`}>{record.formula}</div>

      {/* Số tiền trước thuế */}
      <div className={`${colWidth[2]} text-left`}>
        <div>
          <div> Trước VAT: </div>
          <InputNumber
            value={record.moneyBeforeTax}
            onChange={(value) =>
              onUpdateRow(record.id, { moneyBeforeTax: Number(value) || 0 })
            }
            addonAfter="VNĐ"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            readOnly={record.calculationType !== "manual"}
          />
          <div> Sau VAT: </div>
          <InputNumber
            value={record.moneyAfterTax}
            onChange={(value) =>
              onUpdateRow(record.id, { moneyAfterTax: Number(value) || 0 })
            }
            addonAfter="VNĐ"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            readOnly
          />
        </div>
      </div>

      {/* Ghi chú */}
      <div
        className={`${colWidth[3]} text-left`}
        dangerouslySetInnerHTML={{ __html: record.note || "" }}
      />

      {/* Thao tác */}
      <div className={`${colWidth[4]}`}>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemoveRow(record.id)}
        />
      </div>
    </div>
  );
}

export default RowItem;
