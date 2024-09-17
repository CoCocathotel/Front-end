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
import LoadingSpinner from "../component/Loading";

export default function Ad_Analytic() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('day'); // day, month, year
  const [selectedYear, setSelectedYear] = useState(''); // To hold the selected year
  const [years, setYears] = useState([]); // To hold the list of unique years

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [data, dateFilter, selectedYear]);

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
      
      // Extract unique years from check_in_date and check_out_date
      const allDates = x_data.flatMap(item => [item.check_in_date, item.check_out_date]);
      const uniqueYears = [...new Set(allDates.map(date => new Date(date).getFullYear()))].sort((a, b) => b - a);

      setData(x_data);
      setYears(uniqueYears);
      setLoading(false);
    } catch (err) {
      console.log("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const filterData = () => {
    const groupedData = data.reduce((acc, item) => {
      const checkInDate = new Date(item.check_in_date);
      const checkOutDate = new Date(item.check_out_date);
      const year = checkInDate.getFullYear();
      let key;

      if (dateFilter === 'day') {
        key = checkInDate.toLocaleDateString();
      } else if (dateFilter === 'month') {
        key = `${year}-${checkInDate.getMonth() + 1}`;
      } else if (dateFilter === 'year') {
        key = `${year}`;
      }

      // Filter by selected year if specified
      if (selectedYear && year !== parseInt(selectedYear)) {
        return acc;
      }

      const existing = acc.find((entry) => entry.date === key && entry.room_name === item.room_name);

      if (existing) {
        existing.total_price += item.total_price;
        existing.count += 1;
      } else {
        acc.push({
          date: key,
          room_name: item.room_name,
          total_price: item.total_price,
          count: 1,
        });
      }

      return acc;
    }, []);

    setFilteredData(groupedData);
  };

  const generateTableRows = () => {
    const rooms = [...new Set(filteredData.map(item => item.room_name))];
    return rooms.map(room => {
      const roomData = filteredData.filter(item => item.room_name === room);
      const totalBookings = roomData.reduce((acc, item) => acc + item.count, 0);
      const totalCancelled = roomData.filter(item => item.status === "failed").length; // Filter and then count
      const totalCheckedIn = filteredData.filter(item => item.status === "pass").length;
      const totalPrice = roomData.reduce((acc, item) => acc + item.total_price, 0);
      const cashPayments = roomData.filter(item => item.pay_way ===  "walk-in").length; 
      const qrPayments = filteredData.filter(item => item.pay_way === "credit").length; 

      return (
        <tr key={room}>
          <td className="p-2 border">{room}</td>
          <td className="p-2 border">{totalBookings}</td>
          <td className="p-2 border">{totalCancelled}</td>
          <td className="p-2 border">{totalCheckedIn}</td>
          <td className="p-2 border">{totalPrice.toFixed(2)}</td>
          <td className="p-2 border">{cashPayments}</td>
          <td className="p-2 border">{qrPayments}</td>
        </tr>
      );
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Data Analytics Dashboard</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="dateFilter" className="mr-2 font-bold">Filter By:</label>
            <select
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          {dateFilter === 'year' && (
            <div className="mb-4">
              <label htmlFor="yearFilter" className="mr-2 font-bold">Select Year:</label>
              <select
                id="yearFilter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="p-2 border">Room Type</th>
                <th className="p-2 border">Total Bookings</th>
                <th className="p-2 border">Total Cancellations</th>
                <th className="p-2 border">Total Checked-In</th>
                <th className="p-2 border">Total Sales</th>
                <th className="p-2 border">Cash Payments</th>
                <th className="p-2 border">QR Payments</th>
              </tr>
            </thead>
            <tbody>
              {generateTableRows()}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
