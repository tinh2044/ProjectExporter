import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  // Button,
  Card,
  Row,
  Col,
  type FormInstance,
} from "antd";
import {
  ProjectOutlined,
  DollarOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

export default function BasicInfoForm({form}: {form: FormInstance}) {
  return (
    <Card
      className="!w-2/3 !mt-20 !p-8"
      title={
        <div style={{ textAlign: "center" }}>
          <ProjectOutlined style={{ fontSize: 32, marginBottom: 8 }} />
          <div style={{ fontSize: 20, fontWeight: 600 }}>Thông Tin Dự Án</div>
        </div>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tên dự án"
              name="tenDuAn"
              rules={[{ required: true, message: "Vui lòng nhập tên dự án!" }]}
            >
              <Input
                prefix={<ProjectOutlined />}
                placeholder="Nhập tên dự án"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Tổng hợp dự toán (VNĐ)"
              name="tongHopDuToan"
              rules={[
                { required: true, message: "Vui lòng nhập tổng hợp dự toán!" },
              ]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                placeholder="Nhập tổng hợp dự toán (VNĐ)"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                min={0}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Chủ đầu tư"
              name="chuDauTu"
              rules={[{ required: true, message: "Vui lòng nhập chủ đầu tư!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập tên chủ đầu tư"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Địa điểm thực hiện"
              name="diaDiem"
              rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder="Nhập địa điểm thực hiện"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Người Nhận"
              name="nguoiNhan"
              rules={[{ required: true, message: "Vui lòng nhập người nhận!" }]}
            >
              <Input placeholder="Nhập người nhận" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Thời gian thực hiện"
              name="thoiGian"
              rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
            >
              <RangePicker
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
          <Button type="primary" htmlType="submit" size="large">
            Bắt đầu tạo form
          </Button>
        </Form.Item> */}
      </Form>
    </Card>
  );
}
