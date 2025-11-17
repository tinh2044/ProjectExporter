import { Modal, Form, Table, type FormInstance, InputNumber } from "antd";
import { useEffect } from "react";
import type { EstimateCostData } from "@/types/estimateCosts";

type WorkValueTableProps = {
  form: FormInstance;
  open: boolean;
  onClose: () => void;
  fieldName?: string;
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
  const estimateCosts: EstimateCostData | undefined = form.getFieldValue("estimateCosts");
  const totalCosts = estimateCosts?.rows?.reduce((acc, row) => acc + row.moneyAfterTax, 0) ?? 0; 
  useEffect(() => {
      const row1Value = form.getFieldValue([fieldName, 0]);
      if (row1Value === undefined || row1Value === null) {
        form.setFieldValue([fieldName, 0], 0);
      }
      const row2Value = form.getFieldValue([fieldName, 1]);
      if (row2Value === undefined || row2Value === null) {
        form.setFieldValue([fieldName, 1], 0);
      }
      form.setFieldValue([fieldName, 2], totalCosts);
  }, [totalCosts, fieldName, form]);
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
          {index == 2 ? (
            <InputNumber
              placeholder="Nhập giá trị"
              addonAfter="VNĐ"
              readOnly
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          ) : (
            <InputNumber
              placeholder="Nhập giá trị"
              addonAfter="VNĐ"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          )}
        </Form.Item>
      ),
    },
  ];

    const handleOk = () => {
      const formValues: Record<string, number[]> = {};
      ROWS.forEach((_row, index) => {
        formValues[fieldName] = formValues[fieldName] || [];  
        const inputValue = form.getFieldValue([fieldName, index]) as number;
        formValues[fieldName][index] = inputValue || 0;
      });

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
      <Table
        dataSource={ROWS}
        columns={columns as never}
        pagination={false}
        rowKey={(row) => row.key}
        scroll={{ x: "max-content" }}
      />
    </Modal>
  );
}


