import { useEffect, useState } from "react";
import { Table, Button, Input, Space, Popconfirm } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetActionStatus } from "@/features/duAns/duAnsSlice";
import type { DuAn } from "@/types/du-an";
import DuAnForm from "./DuAnForm";
import HopDongModal from "./HopDongModal";
import { deleteDuAn, fetchDuAns } from "@/features/duAns/duAnsThunks";
import { useAppMessage } from "@/contexts/AppMessage/hook";

export default function DuAnList() {
  const dispatch = useAppDispatch();
  const { duAns, total, status, actionStatus } = useAppSelector(
    (state) => state.duAns
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("id:DESC");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDuAn, setEditingDuAn] = useState<DuAn | null>(null);
  const [selectedDuAnId, setSelectedDuAnId] = useState<number | null>(null);

  const messageApi = useAppMessage();

  useEffect(() => {
    dispatch(fetchDuAns({ page, limit, search, sort }));
  }, [dispatch, page, limit, search, sort]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      messageApi.success("Thao tác thành công");
      dispatch(resetActionStatus());
      setIsFormOpen(false);
      setEditingDuAn(null);
    } else if (actionStatus === "failed") {
      messageApi.error("Thao tác thất bại");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, dispatch, messageApi]);

  const columns: ColumnsType<DuAn> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: true,
    },
    {
      title: "Tên dự án",
      dataIndex: "ten",
      key: "ten",
      sorter: true,
    },
    {
      title: "Chủ đầu tư",
      dataIndex: "chuDauTu",
      key: "chuDauTu",
      sorter: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<FileTextOutlined />}
            onClick={() => setSelectedDuAnId(record.id)}
          >
            Hợp đồng
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingDuAn(record);
              setIsFormOpen(true);
            }}
          />
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa dự án này?"
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            onConfirm={() => dispatch(deleteDuAn(record.id))}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (pagination: any, _: any, sorter: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);

    if (sorter.field && sorter.order) {
      const order = sorter.order === "ascend" ? "ASC" : "DESC";
      setSort(`${sorter.field}:${order}`);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Tìm kiếm dự án..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingDuAn(null);
              setIsFormOpen(true);
            }}
          >
            Thêm dự án
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={duAns}
          rowKey="id"
          loading={status === "pending"}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} dự án`,
          }}
          onChange={handleTableChange}
        />
      </div>

      <DuAnForm
        open={isFormOpen}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingDuAn(null);
        }}
        duAn={editingDuAn}
      />

      {selectedDuAnId && (
        <HopDongModal
          duAnId={selectedDuAnId}
          onClose={() => setSelectedDuAnId(null)}
        />
      )}
    </>
  );
}
