import { Form, Input, Card, Row, Col, type FormInstance, Button } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { loadLegalInfo } from "@/services/legal";
import { findIndicesInArray, buildDocxData, applyLegalIndicesToText, applyYearRange, applyMoneyFields, formatAdditionalstimate } from "@/utils/formatters";
import SelectLegal from "./SelectLegal";
import { NotepadTextIcon } from "lucide-react";
import { generateDocxFromTemplateUrl } from "@/services/docx";

const { TextArea } = Input;
const defaultLegals = [
  "Căn cứ Luật Đấu thầu số 22/2023/QH15 ngày 23 tháng 6 năm 2023;",
  "Căn cứ Luật số 57/2024/QH15 ngày 29 tháng 11 năm 2024 về sửa đổi bổ sung một số điều của Luật Quy hoạch, Luật Đầu tư, Luật Đầu tư theo phương thức đối tác công tư và Luật Đấu thầu;",
  "Căn cứ Luật số 90/2025/QH15 ngày 25 tháng 6 năm 2025 về sửa đổi bổ sung một số điều của luật đấu thầu, luật đầu tư theo phương thức đối tác công tư, luật hải quan, luật thuế giá trị gia tăng, luật thuế xuất khẩu, thuế nhập khẩu, luật đầu tư, luật đầu tư công, luật quản lý; sử dụng tài sản công;",
  "Căn cứ Nghị định số 214/2025/NĐ-CP ngày 04 tháng 8 năm 2025 của Chính phủ về quy định chi tiết một số điều và biện pháp thi hành luật đấu thầu về lựa chọn nhà thầu;",
];

export default function ContractorSelectionForm({ form }: { form: FormInstance }) {
  const [legalData, setLegalData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLegalData();
  }, []);

  useEffect(() => {
    if (legalData.length > 0) {
      const defaultIndices = findIndicesInArray(legalData, defaultLegals);
      form.setFieldsValue({
        thongTinPhapLiChonNhaThau: defaultIndices,
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
    raw["ghiChuDuToan"] = formatAdditionalstimate(
      raw["baoCaoOptions"],
      raw["soTienBaoCao"],
      raw["chiPhiOptions"],
      raw["soTienChiPhi"]
    );
    const data = buildDocxData(raw, [
      applyLegalIndicesToText("thongTinPhapLiChonNhaThau", legalData),
      applyYearRange("thoiGian"),
      applyMoneyFields([{ numberField: "tongHopDuToan", wordsField: "duToanStr" }]),
    ]);
    const template1Url = new URL("../../assets/template4.docx", import.meta.url)
      .href;
    await generateDocxFromTemplateUrl(template1Url, data, "template-4.docx");
  };

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
              name="thongTinPhapLiChonNhaThau"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin pháp lí!" },
              ]}
            >
              <SelectLegal
                loading={loading}
                options={options}
                value={form.getFieldValue("thongTinPhapLiChonNhaThau")}
                onChange={(value) =>
                  form.setFieldValue("thongTinPhapLiChonNhaThau", value)
                }
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
                value={form.getFieldValue("congViecDaThucHien")}
                onChange={(e) =>
                  form.setFieldValue("congViecDaThucHien", e.target.value)
                }
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
                value={form.getFieldValue("congViecKhongApDung")}
                onChange={(e) =>
                  form.setFieldValue("congViecKhongApDung", e.target.value)
                }
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
                value={form.getFieldValue("congViecKeHoach")}
                onChange={(e) =>
                  form.setFieldValue("congViecKeHoach", e.target.value)
                }
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
        <Button type="primary" onClick={handleGenerateTemplate}>
          <NotepadTextIcon />
          Tạo mẫu 4
        </Button> 
      </Form>
    </Card>
  );
}
