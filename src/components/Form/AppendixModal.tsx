import { Modal, Form, Input, Table, type FormInstance } from "antd";
import { useMemo, useState } from "react";

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

  // Initialize when opened
  if (open && localRows.length === 0) {
    bootstrapRows();
  }

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
      render: (_: unknown, record: AppendixRow, index: number) => (
        <Input
          value={record.noiDung}
          onChange={(e) => {
            const value = e.target.value;
            setLocalRows((prev) =>
              prev.map((row, i) =>
                i === index ? { ...row, noiDung: value } : row
              )
            );
          }}
        />
      ),
    },
    {
      title: "Giá trị tạm tính (đồng)",
      dataIndex: "giaTriTamTinh",
      width: 220,
      render: (_: unknown, record: AppendixRow, index: number) => (
        <Input
          type="number"
          value={record.giaTriTamTinh}
          onChange={(e) => {
            const value = Number(e.target.value || 0);
            setLocalRows((prev) =>
              prev.map((row, i) =>
                i === index ? { ...row, giaTriTamTinh: value } : row
              )
            );
          }}
        />
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


