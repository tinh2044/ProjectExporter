import { Tabs } from "antd";
import {
  ProjectOutlined,
  FileTextOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import DuAnList from "@/components/DuAnManagement/DuAnList";
import HopDongList from "@/components/DuAnManagement/HopDongList";
import Dashboard from "@/components/DuAnManagement/Dashboard";

export default function DuAnManagementPage() {
  const items = [
    {
      key: "du-an",
      label: (
        <span>
          <ProjectOutlined />
          Dự án
        </span>
      ),
      children: <DuAnList />,
    },
    {
      key: "hop-dong",
      label: (
        <span>
          <FileTextOutlined />
          Hợp đồng
        </span>
      ),
      children: <HopDongList />,
    },
    {
      key: "dashboard",
      label: (
        <span>
          <DashboardOutlined />
          Dashboard
        </span>
      ),
      children: <Dashboard />,
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Quản lý Dự án & Hợp đồng</h1>
      <Tabs items={items} defaultActiveKey="du-an" />
    </div>
  );
}
