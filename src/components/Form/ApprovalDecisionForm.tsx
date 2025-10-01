import { Form, Input, Card, type FormInstance } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function ApprovalDecisionForm({ form }: { form: FormInstance }) {
  return (
      <Card
          className="!w-full"
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircleOutlined />
          <span>QUYẾT ĐỊNH 
Về phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị đầu tư dự án </span>
        </div>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="Thông tin pháp lí"
          name="pheDuyetPhapLi"
          rules={[
            { required: true, message: "Vui lòng nhập thông tin pháp lí!" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập thông tin pháp lí của quyết định phê duyệt (số quyết định, ngày ban hành, người ký...)"
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
