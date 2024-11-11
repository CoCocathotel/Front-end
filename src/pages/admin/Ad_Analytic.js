import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Cell,
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
import { DatePicker } from "antd";
import Card from "./Card";
import api from "../../utils/api";

const { MonthPicker } = DatePicker;

export default function Ad_Analytic() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    api.getAllEvent({ role: 'admin' })
      .then((res) => {
        setData(res.data.body);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      })
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredData = data.filter(
    (entry) => new Date(entry.check_in_date).getFullYear() === selectedYear
  );

  if (filteredData.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-6" data-aos="fade-up">
          กราฟและสถิติ
        </h1>
        <div className="text-lg">
          ไม่มีข้อมูลสำหรับปี {selectedYear} กรุณาเลือกปีอื่น
        </div>
        <div className="flex justify-center mt-8">
        <MonthPicker
          onChange={(date, dateString) =>
            setSelectedYear(date ? date.year() : new Date().getFullYear())
          }
          picker="year"
          placeholder="เลือกปีที่ต้องการ"
        />
      </div>
      </div>
    );
  }

  const profitData = filteredData.map((entry) => ({
    date: new Date(entry.check_in_date).getMonth() + 1,
    profit: entry.total_price,
  }));

  const profitByMonth = profitData.reduce((acc, curr) => {
    const month = curr.date;

    if (!acc[month]) {
      acc[month] = { date: month, profit: 0 };
    }

    acc[month].profit += curr.profit;

    return acc;
  }, {});

  const groupedProfitData = Object.values(profitByMonth);

  const roomData = [
    {
      name: "Available",
      value: filteredData.filter((entry) => entry.status === "pass").length,
    },
    {
      name: "Cancelled",
      value: filteredData.filter((entry) => entry.status === "failed").length,
    },
    {
      name: "Pending",
      value: filteredData.filter((entry) => entry.status === "pending").length,
    },
  ];

  const roomTypeData = filteredData.reduce((acc, curr) => {
    const roomType = curr.room_name;

    if (!acc[roomType]) {
      acc[roomType] = { roomType, count: 0 };
    }

    acc[roomType].count += 1;

    return acc;
  }, {});

  const groupedRoomTypeData = Object.values(roomTypeData);

  const totalProfit = groupedProfitData.reduce(
    (acc, curr) => acc + curr.profit,
    0
  );
  const averageProfit = totalProfit / groupedProfitData.length;

  const latestMonthData = groupedProfitData[groupedProfitData.length - 1];
  const latestMonthProfit = latestMonthData.profit;
  const latestMonth = latestMonthData.date;

  const totalBookings = roomData.reduce((acc, curr) => acc + curr.value, 0);
  const availableBookings = roomData.find(
    (entry) => entry.name === "Available"
  ).value;
  const availablePercentage = (
    (availableBookings / totalBookings) *
    100
  ).toFixed(2);

  const mostBookedRoom = groupedRoomTypeData.reduce((prev, current) =>
    prev.count > current.count ? prev : current
  );

  const leastBookedRoom = groupedRoomTypeData.reduce((prev, current) =>
    prev.count < current.count ? prev : current
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6" data-aos="fade-up">
        กราฟและสถิติ
      </h1>
      <div className="flex justify-between mb-8" data-aos="fade-up">
        <Card
          title="จำนวนการจอง"
          data={filteredData.length}
          change={0}
          color="bg-blue-50"
        />
        <Card
          title="รอการอนุมัติ"
          data={filteredData.filter((value) => value.status === "pending").length}
          change={0}
          color="bg-yellow-50"
        />
        <Card
          title="จำนวนอนุมัติ"
          data={filteredData.filter((value) => value.status === "pass").length}
          change={0}
          color="bg-green-50"
        />
        <Card
          title="จำนวนยกเลิก"
          data={filteredData.filter((value) => value.status === "failed").length}
          change={0}
          color="bg-red-50"
        />
      </div>

      <div className="flex justify-center mt-8">
        <MonthPicker
          onChange={(date, dateString) =>
            setSelectedYear(date ? date.year() : new Date().getFullYear())
          }
          picker="year"
          placeholder="เลือกปีที่ต้องการ"
        />
      </div>
      
      <div className="flex items-center" data-aos="fade-up">
        <div className="w-1/2 m-5">
          <h2 className="text-xl font-bold mb-4 ">รายได้ (บาท)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={groupedProfitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profit" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-2xl">
          จากการคำนวน รายได้ของเดือน {latestMonth}
          {latestMonthProfit > averageProfit
            ? " มีค่าสูงกว่า"
            : " มีค่าต่ำกว่า"} {" "}
          โดยเฉลี่ย
        </div>
      </div>

      <div className="flex items-center" data-aos="fade-up">
        <div className="w-1/2 m-5">
          <h2 className="text-xl font-bold mb-4">การจองทั้งหมด</h2>
          <ResponsiveContainer width="50%" height={400}>
            <PieChart>
              <Pie
                dataKey="value"
                data={roomData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
              >
                {roomData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === "Cancelled"
                        ? "#D1695B"
                        : entry.name === "Available"
                        ? "#82ca9d"
                        : "#ffc658"
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="text-2xl">
          สถานะการจองที่อนุมัติ คิดเป็น {availablePercentage}% ของการจองทั้งหมด
        </div>
      </div>

      <div className="flex items-center" data-aos="fade-up">
        <div className="m-4 w-1/2">
          <h2 className="text-xl font-bold mb-4">
            จำนวนการจองตามประเภทห้อง
          </h2>
          <ResponsiveContainer width="50%" height={400}>
            <BarChart data={groupedRoomTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="roomType" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count">
                {groupedRoomTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? "#8884d8"
                        : index === 1
                        ? "#82ca9d"
                        : index === 2
                        ? "#ffc658"
                        : index === 3
                        ? "#ff8042"
                        : "#d0ed57"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-2xl">
          ประเภทห้องที่ได้รับการจองสูงสุดคือ {mostBookedRoom.roomType}
          และประเภทห้องที่ได้รับการจองต่ำสุดคือ {leastBookedRoom.roomType}
        </div>
      </div>
    </div>
  );
}
