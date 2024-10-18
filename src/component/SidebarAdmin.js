import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";

import Ad_Home from "../pages/admin/Ad_Home";
import Ad_Analytic from "../pages/admin/Ad_Analytic";
import Detail from "../component/Detail";

export default function SidebarAdmin({ page }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(page ?? <Ad_Home />);
  const { Content, Sider } = Layout;

  const text = [
    "การจอง", // Home
    "กราฟ&สถิติ", // Manage rooms
    "ห้องพัก", // View all rooms
    // "จัดการผู้ใช้งาน", // Manage users
    "จัดการหน้าเว็บไซต์", // Manage website
  ];

  const items2 = [
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
  ].map((icon, index) => {
    const title = text[index];
    const key = String(index + 1);

    let children = null;

    // Add children (sub-options) for "Manage rooms" (index 1) and "Manage website" (index 4)
    if (index === 0) {
      children = [
        { key: `${key}-all`, label: "จองล่าสุด" },
        { key: `${key}-schedule`, label: "กำหนดการวันนี้" },
      ];
    }

    if (index === 3) {
      children = [
        { key: `${key}-home`, label: "หน้าหลัก" },
        { key: `${key}-footer`, label: "ฟุตเตอร์" },
      ];
    }

    return {
      key: `${key}`,
      icon: React.createElement(icon),
      label: `${title}`,
      children: children,
    };
  });

  useEffect(() => {
    setActiveIndex(activeIndex);
  }, [activeIndex]);

  const handleMenuClick = (e) => {
    setActiveIndex(e.key);
    switch (e.key) {
      case "1-all":
        navigate("/", { replace: true });
        window.location.reload();
        break;
      case "1-schedule":
        navigate("/schedule", { replace: false });
        window.location.reload();
        break;
      case "2":
        navigate("/ad_analytic", { replace: true });
        window.location.reload();
        break;
      case "3":
        navigate("/room", { replace: true });
        window.location.reload();
        break;
      case "4-home":
          navigate("/ad_custom", { replace: true });
          window.location.reload();
      break;
      case "4-footer":
        navigate("/footer", { replace: true });
        window.location.reload();
      break;
      default:
        console.log("#");
        break;
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            className="font-Kanit text-gray-700"
            mode="inline"
            // selectedKeys={[activeIndex]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={items2}
            onClick={handleMenuClick}
            theme="light"
            inlineIndent={24}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Content className="min-h-screen bg-white p-5">{pageIndex}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
