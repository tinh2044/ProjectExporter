import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Card,
  Row,
  Col,
  type FormInstance,
  Button,
  AutoComplete,
} from "antd";
import {
  ProjectOutlined,
  // EnvironmentOutlined,
} from "@ant-design/icons";
import {
  getDefaultFormInformation,
  getSortedInvestorKeys,
  getInvestorAddresses,
  getDistrictAdminCenter,
} from "@/services/constants";
import { useState } from "react";
import EstimateCosts from "../EstimateCosts";
// import { formatNumberWithDots } from "@/utils/formatters";

const { RangePicker } = DatePicker;

export default function BasicInfoForm({ form }: { form: FormInstance }) {
  const [useCustomInvestor, setUseCustomInvestor] = useState(false);
  const [addressList, setAddressList] = useState<string[]>([]);
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [estimateCostsOpen, setEstimateCostsOpen] = useState(false);

  const handleDefaultValues = () => {
    form.setFieldsValue(getDefaultFormInformation());
    setUseCustomInvestor(false);
  };

  const handleInvestorChange = (value: string) => {
    if (!value) {
      form.setFieldsValue({ chuDauTu: undefined, diaDiem: "" });
      setUseCustomInvestor(true);
      setAddressList([]);
      setDistrictList([]);
      return;
    }

    // Check if the value exists in investor data
    const investorKeys = getSortedInvestorKeys();
    if (investorKeys.includes(value)) {
      const addresses = getInvestorAddresses(value);
      if (addresses.length > 1) {
        // Multiple addresses
        setAddressList(addresses);
        setDistrictList([]);
        form.setFieldsValue({ chuDauTu: value, diaDiem: undefined });
        setUseCustomInvestor(false);
      } else if (addresses.length === 1) {
        // Single address
        setAddressList([]);
        setDistrictList([]);
        form.setFieldsValue({ chuDauTu: value, diaDiem: addresses[0] });
        setUseCustomInvestor(false);
      }
    } else {
      // Custom input - load district addresses for address search
      const districtData = getDistrictAdminCenter();
      const addresses = Object.values(districtData)
        .filter((addr): addr is string => typeof addr === "string")
        .sort((a, b) => a.localeCompare(b, "vi"));
      setDistrictList(addresses);
      setAddressList([]);
      form.setFieldsValue({ chuDauTu: value, diaDiem: "" });
      setUseCustomInvestor(true);
    }
  };

  const handleInvestorSelect = (value: string) => {
    const addresses = getInvestorAddresses(value);
    if (addresses.length > 1) {
      setAddressList(addresses);
      setDistrictList([]);
      form.setFieldsValue({ chuDauTu: value, diaDiem: undefined });
      setUseCustomInvestor(false);
    } else if (addresses.length === 1) {
      setAddressList([]);
      setDistrictList([]);
      form.setFieldsValue({ chuDauTu: value, diaDiem: addresses[0] });
      setUseCustomInvestor(false);
    }
  };

  const handleAddressSelect = (value: string) => {
    form.setFieldsValue({ diaDiem: value });
  };

  return (
    <Card
      className="!w-2/3 !mt-20 !p-8"
      title={
        <div className="flex items-center justify-between gap-2 text-center">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">Thông Tin Dự Án</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              onClick={handleDefaultValues}
            >
              Điền giá trị mặc định
            </Button>
            <Button
              color="green"
              variant="solid"
              onClick={() => setEstimateCostsOpen(true)}
              size="large"
            >
              Dự toán
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
              label="Tổng hợp dự toán (VNĐ)"
              name="tongHopDuToan"
              rules={[
                { required: true, message: "Vui lòng nhập tổng hợp dự toán!" },
              ]}
              // formatter={(value: any) => formatNumberWithDots(value)}
              // parser={(value: any) => value?.replace(/\./g, "") + " đồng"}
            >
              <InputNumber
                // prefix={<DollarOutlined />}
                addonAfter="VNĐ"
                placeholder="Nhập tổng hợp dự toán (VNĐ)"
                className="!w-full"
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
              <AutoComplete
                placeholder="Chọn hoặc nhập chủ đầu tư"
                options={getSortedInvestorKeys().map((key) => ({ value: key }))}
                onChange={handleInvestorChange}
                onSelect={handleInvestorSelect}
                allowClear
                filterOption={(inputValue, option) =>
                  (option?.value ?? "")
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Địa điểm thực hiện"
              name="diaDiem"
              rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
            >
              <AutoComplete
                placeholder={
                  addressList.length > 0
                    ? "Chọn địa chỉ từ danh sách"
                    : districtList.length > 0
                    ? "Tìm kiếm địa chỉ hoặc nhập địa chỉ tùy chỉnh"
                    : useCustomInvestor
                    ? "Nhập địa chỉ tùy chỉnh"
                    : "Địa chỉ đã tự động điền từ chủ đầu tư được chọn"
                  // }
                  // return "Nhập địa điểm thực hiện";
                }
                // )()
                // }
                options={[
                  // Address list from investor (if available)
                  ...addressList.map((addr) => ({ value: addr, label: addr })),
                  // District addresses for search (if available)
                  ...districtList.map((addr) => ({ value: addr, label: addr })),
                ]}
                value={form.getFieldValue("diaDiem")}
                onSelect={handleAddressSelect}
                onChange={(val) => form.setFieldsValue({ diaDiem: val })}
                allowClear
                filterOption={(inputValue, option) =>
                  (option?.value ?? "")
                    .toLowerCase()
                    .includes(String(inputValue).toLowerCase()) ||
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(String(inputValue).toLowerCase())
                }
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
                className="w-full"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <EstimateCosts
        form={form}
        fieldName="estimateCosts"
        open={estimateCostsOpen}
        onClose={() => setEstimateCostsOpen(false)}
        title="Dự toán chi phí"
      />
    </Card>
  );
}
