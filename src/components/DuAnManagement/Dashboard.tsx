import { useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag } from "antd";
import { FileTextOutlined, DollarOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHopDongDashboard } from "@/features/hopDongs/hopDongsThunks";
import type { LoaiHopDongStatus, TinhTrangStatus } from "@/types/hop-dong";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { dashboard, dashboardStatus } = useAppSelector(
    (state) => state.hopDongs
  );

  useEffect(() => {
    dispatch(fetchHopDongDashboard({}));
  }, [dispatch]);

  const getTinhTrangColor = (label: string) => {
    const colors: Record<string, string> = {
      "Đang thực hiện": "blue",
      "Đã hoàn thành": "green",
      "Dự kiến kí hợp đồng": "orange",
      "Dừng thực hiện": "red",
    };
    return colors[label] || "default";
  };

  const tinhTrangColumns: ColumnsType<TinhTrangStatus> = [
    {
      title: "Tình trạng",
      dataIndex: "label",
      key: "label",
      render: (label) => <Tag color={getTinhTrangColor(label)}>{label}</Tag>,
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      key: "count",
      align: "right",
    },
    {
      title: "Tổng giá trị",
      dataIndex: "tongGiaTri",
      key: "tongGiaTri",
      align: "right",
      render: (value) => value?.toLocaleString("vi-VN") + " VNĐ",
    },
  ];

  const loaiHopDongColumns: ColumnsType<LoaiHopDongStatus> = [
    {
      title: "Loại hợp đồng",
      dataIndex: "loai",
      key: "loai",
      width: 200,
    },
    {
      title: "Tổng số",
      dataIndex: "tongSo",
      key: "tongSo",
      align: "right",
      width: 100,
    },
    {
      title: "Tổng giá trị",
      dataIndex: "tongGiaTri",
      key: "tongGiaTri",
      align: "right",
      width: 180,
      render: (value) => value?.toLocaleString("vi-VN") + " VNĐ",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard Hợp đồng</h2>
      </div>

      {dashboard && (
        <>
          {/* Tổng quan */}
          <Row gutter={16} className="mb-6">
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tổng số hợp đồng"
                  value={dashboard.totalSummary.tongSo}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={16}>
              <Card>
                <Statistic
                  title="Tổng giá trị hợp đồng"
                  value={dashboard.totalSummary.tongGiaTri}
                  prefix={<DollarOutlined />}
                  suffix="VNĐ"
                  valueStyle={{ color: "#1890ff" }}
                  formatter={(value) =>
                    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Card>
            </Col>
          </Row>

          {/* Thống kê theo tình trạng */}
          <Card
            title="Thống kê theo tình trạng"
            className="mb-6"
            loading={dashboardStatus === "pending"}
          >
            <Table
              columns={tinhTrangColumns}
              dataSource={dashboard.totalSummary.tinhTrang}
              rowKey="label"
              pagination={false}
              size="small"
            />
          </Card>

          {/* Thống kê theo loại hợp đồng */}
          <Card
            title="Thống kê theo loại hợp đồng"
            loading={dashboardStatus === "pending"}
          >
            <Table
              columns={loaiHopDongColumns}
              dataSource={dashboard.data}
              rowKey="loai"
              pagination={false}
              expandable={{
                expandedRowRender: (record) => (
                  <Table
                    columns={tinhTrangColumns}
                    dataSource={record.tinhTrang}
                    rowKey="label"
                    pagination={false}
                    size="small"
                    showHeader={false}
                  />
                ),
                rowExpandable: (record) => record.tinhTrang.length > 0,
              }}
            />
          </Card>
        </>
      )}
    </div>
  );
}
