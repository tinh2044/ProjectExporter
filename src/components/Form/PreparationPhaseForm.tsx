import { Form, Input, Card, Row, Col, type FormInstance } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function PreparationPhaseForm({ form }: { form: FormInstance }) {
  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FileTextOutlined />
          <span>
            Tờ trình "V/v đề nghị phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án"
          </span>
        </div>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Thông tin pháp lí"
              name="thongTinPhapLi"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin pháp lí!" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Nhập thông tin pháp lí (văn bản, quyết định, thông tư...)"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Mục tiêu"
              name="mucTieu"
              rules={[{ required: true, message: "Vui lòng nhập mục tiêu!" }]}
            >
              <TextArea rows={4} placeholder="Nhập mục tiêu của dự án" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Quy mô"
              name="quyMo"
              rules={[{ required: true, message: "Vui lòng nhập quy mô!" }]}
            >
              <TextArea
                rows={3}
                placeholder="Nhập quy mô dự án (diện tích, công suất...)"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Sự cần thiết đầu tư"
              name="suCanThiet"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập sự cần thiết đầu tư!",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập lý do và sự cần thiết phải đầu tư dự án này"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Nguồn kinh phí"
              name="nguonKinhPhi"
              rules={[
                { required: true, message: "Vui lòng nhập nguồn kinh phí!" },
              ]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="Nhập nguồn kinh phí"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Ghi chú dự toán" name="ghiChuDuToan">
              <TextArea rows={2} placeholder="Ghi chú về dự toán (nếu có)" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
