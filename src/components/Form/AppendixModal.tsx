import { Modal, Form, Input, Table, type FormInstance } from "antd";
import { useEffect, useMemo, useState } from "react";
import { formatNumberWithDots } from "@/utils/formatters";

export type AppendixRow = {
  stt: number; // auto-generated
  noiDung: string; // label of selected item
  giaTriTamTinh: number; // from itemAmounts corresponding to noiDung
  dienGiai?: string; // input by user
  ghiChu?: string; // input by user
};

type AppendixModalProps = {
  form: FormInstance;
  open: boolean;
  onClose: () => void;
  // keys and values coming from the same form
  selectedItems: string[];
  itemLabels: Record<string, string>;
  itemAmounts: number[];
  // name in the main form to persist appendix values
  appendixFieldName?: string; // default: "appendixRows"
};

export default function AppendixModal(props: AppendixModalProps) {
  const {
    form,
    open,
    onClose,
    selectedItems,
    itemLabels,
    itemAmounts,
    appendixFieldName = "appendixRows",
  } = props;
  // console.log(selectedItems, itemAmounts);
  const [localRows, setLocalRows] = useState<AppendixRow[]>(() => []);

  // Re-initialize rows when modal opens or when watched inputs change
  // This ensures we don't get empty arrays when user selects items before opening
  const bootstrapRows = () => {
    const existing = (form.getFieldValue(appendixFieldName) || []) as AppendixRow[];
    if (Array.isArray(existing) && existing.length > 0) {
      setLocalRows(existing);
      return;
    }
    const rows = (selectedItems || []).map((key, idx) => ({
      stt: idx + 1,
      noiDung: itemLabels[key] || key,
      giaTriTamTinh: Number(itemAmounts?.[idx] || 0),
      dienGiai: "",
      ghiChu: "",
    }));
    setLocalRows(rows);
  };

  // Initialize when opened first time
  if (open && localRows.length === 0) {
    bootstrapRows();
  }

  // Keep rows in sync when selectedItems/itemAmounts change while modal is open
  useEffect(() => {
    if (!open) return;
    // Prefer values already saved in form, otherwise use current localRows to preserve notes
    const persisted = (form.getFieldValue(appendixFieldName) || []) as AppendixRow[];
    const source = Array.isArray(persisted) && persisted.length > 0 ? persisted : localRows;

    const nextRows: AppendixRow[] = (selectedItems || []).map((key, idx) => {
      const noiDung = itemLabels[key] || key;
      const matched = source.find((r) => r.noiDung === noiDung);
      return {
        stt: idx + 1,
        noiDung,
        giaTriTamTinh: Number(itemAmounts?.[idx] || 0),
        dienGiai: matched?.dienGiai || "",
        ghiChu: matched?.ghiChu || "",
      };
    });

    setLocalRows(nextRows);
  }, [open, selectedItems, itemAmounts, itemLabels, appendixFieldName]);

  // ensure syncing STT when rows change
  const normalizedRows = useMemo(() =>
    localRows.map((r, idx) => ({ ...r, stt: idx + 1 })),
    [localRows]
  );

  const handleOk = () => {
    form.setFieldValue(appendixFieldName, normalizedRows);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 70,
    },
    {
      title: "Nội dung",
      dataIndex: "noiDung",
      width: 100,
      render: (_: unknown, record: AppendixRow) => (
        <span className="whitespace-pre-wrap">{record.noiDung}</span>
      ),
    },
    {
      title: "Giá trị tạm tính (đồng)",
      dataIndex: "giaTriTamTinh",
      width: 220,
      render: (_: unknown, record: AppendixRow) => (
        <span>{formatNumberWithDots(record.giaTriTamTinh)} VNĐ</span>
      ),
    },
    {
      title: "Diễn giải",
      dataIndex: "dienGiai",
      width: 220,

      render: (_: unknown, record: AppendixRow, index: number) => (
        <Input.TextArea
          value={record.dienGiai}
          autoSize={{ minRows: 4 }}
          onChange={(e) => {
            const value = e.target.value;
            setLocalRows((prev) =>
              prev.map((row, i) =>
                i === index ? { ...row, dienGiai: value } : row
              )
            );
          }}
        />
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "ghiChu",
      render: (_: unknown, record: AppendixRow, index: number) => (
        <Input.TextArea
          value={record.ghiChu}
          autoSize={{ minRows: 4 }}
          onChange={(e) => {
            const value = e.target.value;
            setLocalRows((prev) =>
              prev.map((row, i) =>
                i === index ? { ...row, ghiChu: value } : row
              )
            );
          }}
        />
      ),
    },
  ];

  return (
    <Modal
      open={open}
      title="Phụ lục - Ghi chú dự toán"
      onOk={handleOk}
      onCancel={handleCancel}
      width={2000}
    >
      <Form layout="vertical">
        <Table
          dataSource={normalizedRows}
          columns={columns as never}
          pagination={false}
          rowKey={(row) => `${row.stt}-${row.noiDung}`}
        />
      </Form>
    </Modal>
  );
}


