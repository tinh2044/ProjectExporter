import { Form, Input, Card, Row, Col, type FormInstance } from "antd";
import { TeamOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function ContractorSelectionForm({ form }: { form: FormInstance }) {
  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TeamOutlined />
          <span>
            TỜ TRÌNH Về phê duyệt kế hoạch lựa chọn nhà thầu giai đoạn chuẩn bị
            đầu tư dự án
          </span>
        </div>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Thông tin pháp lí"
              name="toTrinhPhapLi"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin pháp lí!" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Nhập thông tin pháp lí của tờ trình"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Phần công việc đã thực hiện"
              name="congViecDaThucHien"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập phần công việc đã thực hiện!",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả các công việc đã hoàn thành"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Phần công việc không áp dụng được một trong các hình thức lựa chọn nhà thầu"
              name="congViecKhongApDung"
            >
              <TextArea
                rows={3}
                placeholder="Mô tả các công việc không áp dụng được hình thức lựa chọn nhà thầu (nếu có)"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Phần công việc thuộc kế hoạch lựa chọn nhà thầu"
              name="congViecKeHoach"
              rules={[
                {
                  required: true,
                  message:
                    "Vui lòng nhập phần công việc thuộc kế hoạch lựa chọn nhà thầu!",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả các công việc thuộc kế hoạch lựa chọn nhà thầu"
              />
            </Form.Item>
          </Col>

          {/* <Col xs={24}>
            <Form.Item
              label="Tổng giá trị các phần công việc (VNĐ)"
              name="tongGiaTriCongViec"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tổng giá trị công việc!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                placeholder="Nhập tổng giá trị"
                min={0}
              />
            </Form.Item>
          </Col> */}
        </Row>
      </Form>
    </Card>
  );
}
