import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
} from "antd";
import {
  ProjectOutlined,
  DollarOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { nanoid } from "nanoid";
import { defaultFormInformation } from "@/constants";

const { RangePicker } = DatePicker;

export default function ProjectInfoForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  return (
    <Card
      className="!w-2/3 !mt-20 !p-8"
      title={
        <div
          style={{ textAlign: "center" }}
          className="flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <ProjectOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <div style={{ fontSize: 20, fontWeight: 600 }}>Thông Tin Dự Án</div>
          </div>
          <div>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              onClick={() => {
                form.setFieldsValue(defaultFormInformation);
              }}
            >
              Điền giá trị mặc định
            </Button>
          </div>
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
              label="Kinh phí (VNĐ)"
              name="tongHopDuToan"
              rules={[{ required: true, message: "Vui lòng nhập kinh phí!" }]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                placeholder="Nhập kinh phí"
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

        <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            onClick={() => {
              const formId = nanoid(6);
              navigate(`/forms/${formId}`, {
                state: form.getFieldsValue(),
              });
            }}
          >
            Bắt đầu tạo form
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
