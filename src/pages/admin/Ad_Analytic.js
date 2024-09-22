import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";
import LoadingSpinner from "../../component/Loading";

import { DatePicker, Space } from "antd";
import { Button, Flex } from "antd";

const { RangePicker } = DatePicker;

export default function Ad_Analytic() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  function productionCheck() {
    const isDevelopment =
      window.location.origin.includes("localhost") ||
      window.location.origin.includes("127.0.0.1");

    return isDevelopment
      ? "http://localhost:8700"
      : "https://cococatbackend.vercel.app";
  }

  const fetchData = async () => {
    try {
      const response = await fetch(productionCheck() + "/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          email: JSON.parse(localStorage.getItem("user-provider")).email,
          pos: "admin",
        }),
      });
      const result = await response.json();
      let x_data = result.body.reverse();

      setData(x_data);
      setLoading(false);
    } catch (err) {
      console.log("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Data Analytics Dashboard
      </h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mb-4 flex">
            <RangePicker renderExtraFooter={() => "extra footer"} />
            <Flex gap="small" wrap>
              <Button type="primary">Primary Button</Button>
              <Button>Default Button</Button>
              <Button type="dashed">Dashed Button</Button>
              <Button type="text">Text Button</Button>
              <Button type="link">Link Button</Button>
            </Flex>
          </div>
        </>
      )}
    </div>
  );
}
