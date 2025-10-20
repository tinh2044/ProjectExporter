import { Form, Input, Row, Col, Select, Button, type FormInstance } from "antd";
import { costReportOptions } from "@/services/constants";

type EstimateNotesProps = {
  form: FormInstance;
  itemLabels: Record<string, string>;
  onOpenAppendix: () => void;
};

export default function EstimateNotes(props: EstimateNotesProps) {
  const { form, itemLabels, onOpenAppendix } = props;

  return (
    <Form.Item label="Ghi chú dự toán">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block mb-2 font-bold">Chọn loại báo cáo chi phí:</label>
          <Form.Item name="selectedItems">
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Chọn loại báo cáo chi phí"
              options={costReportOptions}
            />
          </Form.Item>
        </div>

        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => prev.selectedItems !== curr.selectedItems}
        >
          {({ getFieldValue }) => {
            const selectedItems = getFieldValue("selectedItems") || [];

            return (
              <div className="flex flex-col gap-4">
                {selectedItems.map((item: string, index: number) => (
                  <Row key={item} gutter={16} className="mb-4">
                    <Col xs={24} sm={12}>
                      <label>{itemLabels[item]}:</label>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={["itemAmounts", index]} noStyle className="w-full">
                        <Input type="number" placeholder="Nhập số tiền" addonAfter="VNĐ" />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
              </div>
            );
          }}
        </Form.Item>

        <div className="flex justify-end">
          <Button
            type="default"
            onClick={onOpenAppendix}
            disabled={!(Form.useWatch("selectedItems", form) || []).length}
          >
            Tạo Phụ lục
          </Button>
        </div>
      </div>
    </Form.Item>
  );
}


