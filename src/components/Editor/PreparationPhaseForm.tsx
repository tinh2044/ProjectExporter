/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Card, Row, Col, type FormInstance, Button } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { loadLegalInfo } from "@/services/legal";
import { NotepadTextIcon } from "lucide-react";
import { findIndicesInArray, buildDocxData, applyLegalIndicesToText, applyYearRange, applyMoneyFields } from "../../utils/formatters";
import SelectLegal from "./SelectLegal";
import { generateDocxFromTemplateUrl } from "@/services/docx";
import { defaultFormInformation } from "@/constants";


const { TextArea } = Input;
const defaultLegals = [
  "Căn cứ Luật Đấu thầu số 22/2023/QH15 ngày 23 tháng 6 năm 2023;",
  "Căn cứ Luật số 57/2024/QH15 ngày 29 tháng 11 năm 2024 về sửa đổi bổ sung một số điều của Luật Quy hoạch, Luật Đầu tư, Luật Đầu tư theo phương thức đối tác công tư và Luật Đấu thầu;",
  "Căn cứ Luật số 90/2025/QH15 ngày 25 tháng 6 năm 2025 về sửa đổi bổ sung một số điều của luật đấu thầu, luật đầu tư theo phương thức đối tác công tư, luật hải quan, luật thuế giá trị gia tăng, luật thuế xuất khẩu, thuế nhập khẩu, luật đầu tư, luật đầu tư công, luật quản lý; sử dụng tài sản công;",
  "Căn cứ Nghị định số 214/2025/NĐ-CP ngày 04 tháng 8 năm 2025 của Chính phủ về quy định chi tiết một số điều và biện pháp thi hành luật đấu thầu về lựa chọn nhà thầu;",
  "Căn cứ Thông tư số 79/2025/TT-BTC ngày 04 tháng 8 năm 2025 của Bộ Tài Chính về hướng dẫn việc cung cấp, đăng tải thông tin về đấu thầu và mẫu hồ sơ đấu thầu trên hệ thống mạng đấu thầu quốc gia;",
  "Căn cứ Thông tư số 80/2025/TT-BTC ngày 08 tháng 8 năm 2025 của Bộ Tài Chính về quy định chi tiết mẫu hồ sơ yêu cầu, báo cáo đánh giá, báo cáo thẩm định, kiểm tra, báo cáo tình hình thực hiện hoạt động đấu thầu;",
  "Căn cứ Quyết định số 379/QĐ-UBND ngày 30 tháng 7 năm 2025 của Ủy ban nhân dân Thành phố về giao chỉ tiêu dự toán thu ngân sách nhà nước trên địa bàn, dự toán thu, chi ngân sách địa phương năm 2025 của Thành phố Hồ Chí Minh sau sắp xếp;",
  "Căn cứ Quyết định số 1062/QĐ-SGDĐT ngày 06 tháng 8 năm 2025 của Sở Giáo dục và Đào tạo về việc giao dự toán ngân sách nhà nước năm 2025 sau sắp xếp;",
  "Căn cứ Công văn số 490/UBND-VX ngày 24 tháng 7 năm 2025 của Ủy ban nhân dân Thành phố về điều chỉnh chủ trương thực hiện các hoạt động ứng dụng công nghệ thông tin sử dụng kinh phí chi thường xuyên năm 2025;",
];

export default function PreparationPhaseForm({ form, basicInfo }: { form: FormInstance, basicInfo: any }) {
  const [legalData, setLegalData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLegalData();
  }, []);

  useEffect(() => {
    if (legalData.length > 0) {
      const defaultIndices = findIndicesInArray(legalData, defaultLegals);
      form.setFieldsValue({
        thongTinPhapLiChuanBi: defaultIndices,
      });
    }
  }, [legalData, form]);

  const fetchLegalData = async () => {
    setLoading(true);
    try {
      const data = await loadLegalInfo();
      setLegalData(data);
    } catch (error) {
      console.error("Error fetching legal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const options = legalData.map((text, index) => ({
    value: index,
    label: text,
    searchText: text.toLowerCase(),
  }));

  const handleGenerateTemplate = async () => {
    const raw = form.getFieldsValue();
    const data = buildDocxData({...raw, ...basicInfo}, [
      applyLegalIndicesToText("thongTinPhapLiChuanBi", legalData),
      applyYearRange("thoiGian"),
      applyMoneyFields([{ numberField: "tongHopDuToan", wordsField: "duToanStr" }]),
    ]);
    const template1Url = new URL("../../assets/template1.docx", import.meta.url).href;
    await generateDocxFromTemplateUrl(template1Url, data, "template-1.docx");
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            <span>
              Tờ trình "V/v đề nghị phê duyệt dự toán giai đoạn chuẩn bị đầu tư
              dự án"
            </span>
          </div>
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
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Thông tin pháp lí"
              name="thongTinPhapLiChuanBi"
              rules={[
                { required: true, message: "Vui lòng chọn thông tin pháp lí!" },
              ]}
            >
              <SelectLegal
                loading={loading}
                options={options}
                value={form.getFieldValue("thongTinPhapLiChuanBi")}
                onChange={(value) =>
                  form.setFieldValue("thongTinPhapLiChuanBi", value)
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Mục tiêu"
              name="mucTieu"
              rules={[{ required: true, message: "Vui lòng nhập mục tiêu!" }]}
            >
              <TextArea
                rows={8}
                placeholder="Nhập mục tiêu của dự án"
                value={form.getFieldValue("mucTieu")}
                onChange={(e) => form.setFieldValue("mucTieu", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Quy mô"
              name="quyMo"
              rules={[{ required: true, message: "Vui lòng nhập quy mô!" }]}
            >
              <TextArea
                rows={8}
                placeholder="Nhập quy mô dự án (diện tích, công suất...)"
                value={form.getFieldValue("quyMo")}
                onChange={(e) => form.setFieldValue("quyMo", e.target.value)}
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
                rows={8}
                placeholder="Nhập lý do và sự cần thiết phải đầu tư dự án này"
                value={form.getFieldValue("suCanThiet")}
                onChange={(e) =>
                  form.setFieldValue("suCanThiet", e.target.value)
                }
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
                value={form.getFieldValue("nguonKinhPhi")}
                onChange={(e) =>
                  form.setFieldValue("nguonKinhPhi", e.target.value)
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Ghi chú dự toán" name="ghiChuDuToan">
              <TextArea
                rows={5}
                placeholder="Ghi chú về dự toán (nếu có)"
                value={form.getFieldValue("ghiChuDuToan")}
                onChange={(e) =>
                  form.setFieldValue("ghiChuDuToan", e.target.value)
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" onClick={handleGenerateTemplate}>
          <NotepadTextIcon />
          Tạo mẫu 1
        </Button>
      </Form>
    </Card>
  );
}
