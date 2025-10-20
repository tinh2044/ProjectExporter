import { Modal, Form, Input, Table, type FormInstance } from "antd";

type WorkValueTableProps = {
  form: FormInstance;
  open: boolean;
  onClose: () => void;
  fieldName?: string; // default: "workValues"
};

type RowData = {
  key: string;
  stt: number;
  noiDung: string;
};

const ROWS: RowData[] = [
  {
    key: "1",
    stt: 1,
    noiDung: "Tổng giá trị phần công việc đã thực hiện",
  },
  {
    key: "2",
    stt: 2,
    noiDung:
      "Tổng giá trị phần công việc không áp dụng được một trong các hình thức lựa chọn nhà thầu",
  },
  {
    key: "3",
    stt: 3,
    noiDung: "Tổng giá trị phần công việc thuộc kế hoạch lựa chọn nhà thầu",
  },
];

export default function WorkValueTable({form, open, onClose, fieldName = "workValues" }: WorkValueTableProps) {
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 80,
    },
    {
      title: "Nội dung",
      dataIndex: "noiDung",
      render: (_: unknown, record: RowData) => (
        <span className="whitespace-pre-wrap">{record.noiDung}</span>
      ),
    },
    {
      title: "Giá trị (VND)",
      dataIndex: "giaTri",
      width: 240,
      render: (_: unknown, _record: RowData, index: number) => (
        <Form.Item name={[fieldName, index]} noStyle>
          <Input type="number" placeholder="Nhập giá trị" addonAfter="VNĐ" />
        </Form.Item>
      ),
    },
  ];

    const handleOk = () => {
      // Lưu dữ liệu từ các input vào form
      const formValues: Record<string, number[]> = {};
      ROWS.forEach((_row, index) => {
        formValues[fieldName] = formValues[fieldName] || [];
        // Lấy giá trị từ Form.Item trong modal
        const inputValue = form.getFieldValue([fieldName, index]) as number;
        formValues[fieldName][index] = inputValue || 0;
      });

      // Cập nhật form với dữ liệu mới
      form.setFieldValue(fieldName, formValues[fieldName]);

      onClose();
    };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      title="VI. Tổng giá trị các phần công việc"
      onOk={handleOk}
      onCancel={handleCancel}
      width="90vw"
      centered
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "16px",
        },
      }}
    >
      <Form layout="vertical">
        <Table
          dataSource={ROWS}
          columns={columns as never}
          pagination={false}
          rowKey={(row) => row.key}
          scroll={{ x: "max-content" }}
        />
      </Form>
    </Modal>
  );
}


