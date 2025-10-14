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


  // Initialize and sync rows when modal opens or when inputs change
  useEffect(() => {
    if (!open) return;
    
    setLocalRows(prevRows => {
      // Check if we have persisted data first
      const persisted = (form.getFieldValue(appendixFieldName) || []) as AppendixRow[];
      if (Array.isArray(persisted) && persisted.length > 0) {
        return persisted;
      }
      
      // Otherwise create new rows from current inputs
      const nextRows: AppendixRow[] = (selectedItems || []).map((key, idx) => {
        const noiDung = itemLabels[key] || key;
        // Try to find existing row with same content to preserve user input
        const existing = prevRows.find((r) => r.noiDung === noiDung);
        return {
          stt: idx + 1,
          noiDung,
          giaTriTamTinh: Number(itemAmounts?.[idx] || 0),
          dienGiai: existing?.dienGiai || "",
          ghiChu: existing?.ghiChu || "",
        };
      });

      return nextRows;
    });
  }, [open, selectedItems, itemAmounts, itemLabels, appendixFieldName, form]);

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
      width: 10,
    },
    {
      title: "Nội dung",
      dataIndex: "noiDung",
      width: 200,
      render: (_: unknown, record: AppendixRow) => (
        <span className="whitespace-pre-wrap">{record.noiDung}</span>
      ),
    },
    {
      title: "Giá trị tạm tính",
      dataIndex: "giaTriTamTinh",
      width: 200,
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
          autoSize={{ minRows: 10, maxRows: 10 }}
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
          autoSize={{ minRows: 10, maxRows: 10 }}
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
      width="95vw"
      // style={{ top: '5vh' }}
      centered
      styles={{
        body: {
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '16px'
        }
      }}
      // className="max-h-[80vh] overflow-y-auto p-4"
    >
      <Form layout="vertical">
        <Table
          dataSource={normalizedRows}
          columns={columns as never}
          pagination={false}
          rowKey={(row) => `${row.stt}-${row.noiDung}`}
          scroll={{ x: 'max-content' }}
        />
      </Form>
    </Modal>
  );
}


