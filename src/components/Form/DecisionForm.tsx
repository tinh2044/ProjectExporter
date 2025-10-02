import { Form, Card, type FormInstance, Button } from "antd";
import { SolutionOutlined } from "@ant-design/icons";
import SelectLegal from "./SelectLegal";
import { useEffect, useState } from "react";
import { loadLegalInfo } from "../../services/legal";
import { findIndicesInArray, buildDocxData, applyLegalIndicesToText, applyYearRange, applyMoneyFields } from "../../utils/formatters";
import { generateDocxFromTemplateUrl } from "../../services/docx";
import { NotepadTextIcon } from "lucide-react";

const defaultLegals = [
  "Căn cứ Luật Đấu thầu số 22/2023/QH15 ngày 23 tháng 6 năm 2023;",
  "Căn cứ Luật số 57/2024/QH15 ngày 29 tháng 11 năm 2024 về sửa đổi bổ sung một số điều của Luật Quy hoạch, Luật Đầu tư, Luật Đầu tư theo phương thức đối tác công tư và Luật Đấu thầu;",
  "Căn cứ Luật số 90/2025/QH15 ngày 25 tháng 6 năm 2025 về sửa đổi bổ sung một số điều của luật đấu thầu, luật đầu tư theo phương thức đối tác công tư, luật hải quan, luật thuế giá trị gia tăng, luật thuế xuất khẩu, thuế nhập khẩu, luật đầu tư, luật đầu tư công, luật quản lý; sử dụng tài sản công;",
  "Căn cứ Nghị định số 214/2025/NĐ-CP ngày 04 tháng 8 năm 2025 của Chính phủ về quy định chi tiết một số điều và biện pháp thi hành luật đấu thầu về lựa chọn nhà thầu;",
];
export default function DecisionForm({ form }: { form: FormInstance }) {
  const [legalData, setLegalData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchLegalData();
  }, []);

  useEffect(() => {
    if (legalData.length > 0) {
      const defaultIndices = findIndicesInArray(legalData, defaultLegals);
      form.setFieldsValue({
        thongTinPhapLiDuToan: defaultIndices,
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
    const data = buildDocxData(raw, [
      applyLegalIndicesToText("thongTinPhapLiDuToan", legalData),
      applyYearRange("thoiGian"),
      applyMoneyFields([{ numberField: "tongHopDuToan", wordsField: "duToanStr" }]),
    ]);
    if (typeof data.nguoiNhan === "string") {
      data.nguoiNhan = (data.nguoiNhan as string).toUpperCase();
    }
    const template1Url = new URL("../../assets/template2.docx", import.meta.url)
      .href;
    await generateDocxFromTemplateUrl(template1Url, data, "template-2.docx");
  };

  return (
    <Card
      className="!w-full"
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SolutionOutlined />
          <span>
            QUYẾT ĐỊNH "Phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án"
          </span>
        </div>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="Thông tin pháp lí"
          name="thongTinPhapLiDuToan"
          rules={[
            { required: true, message: "Vui lòng nhập thông tin pháp lí!" },
          ]}
        >
          <SelectLegal
            loading={loading}
            options={options}
            value={form.getFieldValue("thongTinPhapLiDuToan")}
            onChange={(value) => form.setFieldValue("thongTinPhapLiDuToan", value)}
          />
        </Form.Item>
        <Button type="primary" onClick={handleGenerateTemplate}>
          <NotepadTextIcon />
          Tạo mẫu 2 
        </Button>
      </Form>
    </Card>
  );
}
