import { useEffect } from "react";
import { Modal, Form, Select, Input, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createHopDongForDuAn,
  updateHopDongForDuAn,
} from "@/features/duAns/duAnsThunks";
import type {
  HopDong,
  CreateHopDongDto,
  UpdateHopDongDto,
  LoaiHopDong,
  TinhTrangHopDong,
} from "@/types/hop-dong";

interface HopDongFormProps {
  open: boolean;
  onCancel: () => void;
  hopDong: HopDong | null;
  duAnId: number;
}

const loaiHopDongOptions: LoaiHopDong[] = [
  "Tư vấn lập thuyết minh",
  "Tư vấn đấu thầu",
  "Tư vấn quản lí dự án",
  "Tư vấn giám sát",
  "Tư vấn thẩm tra",
];

const tinhTrangOptions: TinhTrangHopDong[] = [
  "Đang thực hiện",
  "Đã hoàn thành",
  "Dự kiến kí hợp đồng",
  "Dừng thực hiện",
];

export default function HopDongForm({
  open,
  onCancel,
  hopDong,
  duAnId,
}: HopDongFormProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { actionStatus } = useAppSelector((state) => state.duAns);

  useEffect(() => {
    if (open) {
      if (hopDong) {
        form.setFieldsValue({
          ...hopDong,
          giaTri: parseFloat(hopDong.giaTri),
          tamUng: hopDong.tamUng ? parseFloat(hopDong.tamUng) : undefined,
          ngayKy: dayjs(hopDong.ngayKy),
          ngayKetThuc: dayjs(hopDong.ngayKetThuc),
          ngayKetThucGiaHan: hopDong.ngayKetThucGiaHan
            ? dayjs(hopDong.ngayKetThucGiaHan)
            : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, hopDong, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const dto = {
        ...values,
        ngayKy: values.ngayKy.format("YYYY-MM-DD"),
        ngayKetThuc: values.ngayKetThuc.format("YYYY-MM-DD"),
        ngayKetThucGiaHan: values.ngayKetThucGiaHan
          ? values.ngayKetThucGiaHan.format("YYYY-MM-DD")
          : undefined,
      };

      if (hopDong) {
        const updateDto: UpdateHopDongDto = dto;
        dispatch(
          updateHopDongForDuAn({ duAnId, id: hopDong.id, dto: updateDto })
        );
      } else {
        const createDto: CreateHopDongDto = dto;
        dispatch(createHopDongForDuAn({ duAnId, dto: createDto }));
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={hopDong ? "Sửa hợp đồng" : "Thêm hợp đồng mới"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={actionStatus === "pending"}
      okText={hopDong ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="loai"
          label="Loại hợp đồng"
          rules={[{ required: true, message: "Vui lòng chọn loại hợp đồng" }]}
        >
          <Select placeholder="Chọn loại hợp đồng">
            {loaiHopDongOptions.map((loai) => (
              <Select.Option key={loai} value={loai}>
                {loai}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="tinhTrang"
          label="Tình trạng"
          rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
        >
          <Select placeholder="Chọn tình trạng">
            {tinhTrangOptions.map((tt) => (
              <Select.Option key={tt} value={tt}>
                {tt}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="giaTri"
            label="Giá trị (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              placeholder="Nhập giá trị"
            />
          </Form.Item>

          <Form.Item name="tamUng" label="Tạm ứng (VNĐ)">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              placeholder="Nhập tạm ứng"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="ngayKy"
            label="Ngày ký"
            rules={[{ required: true, message: "Vui lòng chọn ngày ký" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="ngayKetThuc"
            label="Ngày kết thúc"
            rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </div>

        <Form.Item name="ngayKetThucGiaHan" label="Ngày kết thúc gia hạn">
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item name="tienDo" label="Tiến độ">
          <Input.TextArea rows={2} placeholder="Nhập tiến độ" />
        </Form.Item>

        <Form.Item name="nhanSuThucHien" label="Nhân sự thực hiện">
          <Input placeholder="Nhập tên nhân sự thực hiện" />
        </Form.Item>

        <Form.Item
          name="phuLuc"
          label="Phụ lục"
          rules={[{ required: true, message: "Vui lòng nhập phụ lục" }]}
        >
          <Input placeholder="Nhập phụ lục" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
