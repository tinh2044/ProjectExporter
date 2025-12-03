import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createDuAn, updateDuAn } from "@/features/duAns/duAnsThunks";
import type { DuAn } from "@/types/du-an";
import { useAppMessage } from "@/contexts/AppMessage/hook";

interface DuAnFormProps {
  open: boolean;
  onCancel: () => void;
  duAn: DuAn | null;
}

export default function DuAnForm({ open, onCancel, duAn }: DuAnFormProps) {
  const messageApi = useAppMessage();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { actionStatus } = useAppSelector((state) => state.duAns);

  useEffect(() => {
    if (open) {
      if (duAn) {
        form.setFieldsValue(duAn);
      } else {
        form.resetFields();
      }
    }
  }, [open, duAn, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (duAn) {
        await dispatch(updateDuAn({ id: duAn.id, dto: values })).unwrap();
      } else {
        await dispatch(createDuAn(values)).unwrap();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.errorFields) return;
      messageApi.error(error.message);
    }
  };

  return (
    <Modal
      title={duAn ? "Sửa dự án" : "Thêm dự án mới"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={actionStatus === "pending"}
      okText={duAn ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="ten"
          label="Tên dự án"
          rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
        >
          <Input placeholder="Nhập tên dự án" />
        </Form.Item>

        <Form.Item
          name="chuDauTu"
          label="Chủ đầu tư"
          rules={[{ required: true, message: "Vui lòng nhập chủ đầu tư" }]}
        >
          <Input placeholder="Nhập tên chủ đầu tư" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
