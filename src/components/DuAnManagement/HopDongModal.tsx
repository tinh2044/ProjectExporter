import { useEffect, useState } from "react";
import { Modal, Table, Button, Space, message, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetActionStatus } from "@/features/duAns/duAnsSlice";
import type { HopDong } from "@/types/hop-dong";
import HopDongForm from "./HopDongForm";
import {
  deleteHopDongForDuAn,
  fetchHopDongsBy,
} from "@/features/duAns/duAnsThunks";

interface HopDongModalProps {
  duAnId: number;
  onClose: () => void;
}

export default function HopDongModal({ duAnId, onClose }: HopDongModalProps) {
  const dispatch = useAppDispatch();
  const { currentDuAnHopDongs, status, actionStatus } = useAppSelector(
    (state) => state.duAns
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHopDong, setEditingHopDong] = useState<HopDong | null>(null);

  useEffect(() => {
    dispatch(fetchHopDongsBy({ duAnId, params: { page, limit } }));
  }, [dispatch, duAnId, page, limit]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      message.success("Thao tác thành công");
      dispatch(resetActionStatus());
      setIsFormOpen(false);
      setEditingHopDong(null);
    } else if (actionStatus === "failed") {
      message.error("Thao tác thất bại");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, dispatch]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa hợp đồng này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => dispatch(deleteHopDongForDuAn({ duAnId, id })),
    });
  };

  const getTinhTrangColor = (tinhTrang: string) => {
    const colors: Record<string, string> = {
      "Đang thực hiện": "blue",
      "Đã hoàn thành": "green",
      "Dự kiến kí hợp đồng": "orange",
      "Dừng thực hiện": "red",
    };
    return colors[tinhTrang] || "default";
  };

  const columns: ColumnsType<HopDong> = [
    {
      title: "Loại",
      dataIndex: "loai",
      key: "loai",
      width: 180,
    },
    {
      title: "Giá trị",
      dataIndex: "giaTri",
      key: "giaTri",
      width: 120,
      render: (value) => value?.toLocaleString("vi-VN") + " VNĐ",
    },
    {
      title: "Tình trạng",
      dataIndex: "tinhTrang",
      key: "tinhTrang",
      width: 150,
      render: (tinhTrang) => (
        <Tag color={getTinhTrangColor(tinhTrang)}>{tinhTrang}</Tag>
      ),
    },
    {
      title: "Ngày ký",
      dataIndex: "ngayKy",
      key: "ngayKy",
      width: 110,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngayKetThuc",
      key: "ngayKetThuc",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Còn lại (ngày)",
      dataIndex: "soNgayConHan",
      key: "soNgayConHan",
      width: 120,
      render: (days) => (
        <span className={days < 30 ? "text-red-600 font-semibold" : ""}>
          {days}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingHopDong(record);
              setIsFormOpen(true);
            }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Quản lý hợp đồng"
        open={true}
        onCancel={onClose}
        width={1200}
        footer={null}
      >
        <div className="mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingHopDong(null);
              setIsFormOpen(true);
            }}
          >
            Thêm hợp đồng
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={currentDuAnHopDongs.data}
          rowKey="id"
          loading={status === "pending"}
          scroll={{ x: 1000 }}
          pagination={{
            current: page,
            pageSize: limit,
            total: currentDuAnHopDongs.total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} hợp đồng`,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setLimit(newPageSize);
            },
          }}
        />
      </Modal>

      <HopDongForm
        open={isFormOpen}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingHopDong(null);
        }}
        hopDong={editingHopDong}
        duAnId={duAnId}
      />
    </>
  );
}
