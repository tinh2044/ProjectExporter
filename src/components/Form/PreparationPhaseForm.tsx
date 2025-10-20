import { Form, Input, Row, Col, Button, type FormInstance } from "antd";
import { useState, useEffect } from "react";
import { loadLegalInfo } from "@/services/legal";
import { NotepadTextIcon } from "lucide-react";
import { findIndicesInArray } from "@/utils/formatters";
import SelectLegal from "./SelectLegal";
import BaseForm from "./BaseForm";
import { getBaseRequiredKeys, costReportOptions } from "@/services/constants";
import { createTemplate1 } from "@/services/docx";
import AppendixModal from "./AppendixModal";
import EstimateCosts from "@/components/EstimateCosts";
import EstimateNotes from "./EstimateNotes";


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

export default function PreparationPhaseForm({ form }: { form: FormInstance }) {
  const [legalData, setLegalData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [appendixOpen, setAppendixOpen] = useState(false);
  const [estimateCostsOpen, setEstimateCostsOpen] = useState(false);

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

  // Create labels mapping from costReportOptions
  const appendixItemLabels: { [key: string]: string } = costReportOptions.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {} as { [key: string]: string });

  // Reactively watch form values so UI updates and modal receives correct data
  const selectedItemsWatch = Form.useWatch("selectedItems", form) || [];
  const itemAmountsWatch = Form.useWatch("itemAmounts", form) || [];

  const requiredKeys: Array<string | string[]> = [
    ...getBaseRequiredKeys(),
    "thongTinPhapLiChuanBi",
    "mucTieu",
    "quyMo",
    "suCanThiet",
    "nguonKinhPhi",
  ];

  return (
    <BaseForm
      form={form}
      title="Tờ trình V/v đề nghị phê duyệt dự toán giai đoạn chuẩn bị đầu tư dự án"
      requiredKeys={requiredKeys}
      legalFieldKey="thongTinPhapLiChuanBi"
      legalList={legalData}
      // templateRelativeUrl="../../assets/template1.docx"
      createFormCallBack={createTemplate1}
      outputFileName="template-1.docx"
      submitText="Tạo mẫu 1"
      submitIcon={<NotepadTextIcon />}
      useCollapse={true}
      collapseDefaultActiveKey={["1"]}
    >
      <Row gutter={16}>
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
            <EstimateNotes
              form={form}
              itemLabels={appendixItemLabels}
              onOpenAppendix={() => setAppendixOpen(true)}
            />
          </Col>
          
          <Col xs={24}>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold mb-2">Dự toán chi phí</h3>
                <p className="text-gray-600">Quản lý các loại chi phí dự toán</p>
              </div>
              <Button
                type="primary"
                onClick={() => setEstimateCostsOpen(true)}
              >
                Mở dự toán chi phí
              </Button>
            </div>
          </Col>

          <Col xs={24}>
            <EstimateCosts
              form={form}
              fieldName="estimateCosts"
              open={estimateCostsOpen}
              onClose={() => setEstimateCostsOpen(false)}
              title="Dự toán chi phí"
            />
          </Col>

          <Col xs={24}>
            <AppendixModal
              form={form}
              open={appendixOpen}
              onClose={() => setAppendixOpen(false)}
              selectedItems={selectedItemsWatch}
              itemLabels={appendixItemLabels}
              itemAmounts={itemAmountsWatch}
              appendixFieldName="appendixRows"
            />
          </Col>
        </Row>
      </Row>
    </BaseForm>
  );
}
