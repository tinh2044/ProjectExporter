import { useEffect, useState } from "react";
import { Table, Select, InputNumber, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHopDongs } from "@/features/hopDongs/hopDongsThunks";
import type { HopDong } from "@/types/hop-dong";

export default function HopDongList() {
  const dispatch = useAppDispatch();
  const { hopDongs, total, status } = useAppSelector((state) => state.hopDongs);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [days, setDays] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<
    "expired" | "active" | "all"
  >("all");
  const [sort, setSort] = useState("id:desc");

  useEffect(() => {
    dispatch(fetchHopDongs({ page, limit, days, status: statusFilter, sort }));
  }, [dispatch, page, limit, days, statusFilter, sort]);

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
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      sorter: true,
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "loai",
      key: "loai",
      width: 180,
      sorter: true,
    },
    {
      title: "Giá trị",
      dataIndex: "giaTri",
      key: "giaTri",
      width: 130,
      sorter: true,
      render: (value) => value?.toLocaleString("vi-VN") + " VNĐ",
    },
    {
      title: "Tình trạng",
      dataIndex: "tinhTrang",
      key: "tinhTrang",
      width: 160,
      sorter: true,
      render: (tinhTrang) => (
        <Tag color={getTinhTrangColor(tinhTrang)}>{tinhTrang}</Tag>
      ),
    },
    {
      title: "Tiến độ",
      dataIndex: "tienDo",
      key: "tienDo",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Nhân sự",
      dataIndex: "nhanSuThucHien",
      key: "nhanSuThucHien",
      width: 150,
    },
    {
      title: "Ngày ký",
      dataIndex: "ngayKy",
      key: "ngayKy",
      width: 110,
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngayKetThuc",
      key: "ngayKetThuc",
      width: 120,
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Còn lại (ngày)",
      dataIndex: "soNgayConHan",
      key: "soNgayConHan",
      width: 120,
      sorter: true,
      render: (days) => (
        <span className={days < 30 ? "text-red-600 font-semibold" : ""}>
          {days}
        </span>
      ),
    },
    {
      title: "Còn lại sau gia hạn (ngày)",
      dataIndex: "soNgayConHanGiaHan",
      key: "soNgayConHanGiaHan",
      width: 120,
      sorter: true,
      render: (days) => (
        <span className={days < 30 ? "text-red-600 font-semibold" : ""}>
          {days}
        </span>
      ),
    },
    {
      title: "Số tiền còn phải đóng",
      dataIndex: "soTienConPhaiDong",
      key: "soTienConPhaiDong",
      width: 160,
      sorter: true,
      render: (value) => value?.toLocaleString("vi-VN") + " VNĐ",
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (pagination: any, _: any, sorter: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);

    if (sorter.field && sorter.order) {
      const order = sorter.order === "ascend" ? "asc" : "desc";
      setSort(`${sorter.field}:${order}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Trạng thái</label>
          <Select
            style={{ width: 200 }}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="active">Đang hoạt động</Select.Option>
            <Select.Option value="expired">Hết hạn</Select.Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Số ngày còn lại
          </label>
          <InputNumber
            style={{ width: 150 }}
            placeholder="Nhập số ngày"
            min={0}
            value={days}
            onChange={(value) => {
              setDays(value || undefined);
              setPage(1);
            }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={hopDongs}
        rowKey="id"
        loading={status === "pending"}
        scroll={{ x: 1400 }}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} hợp đồng`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
