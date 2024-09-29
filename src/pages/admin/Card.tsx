import React from "react";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface CardProps {
  title: string;
  data: number;
  change: number;
  color: string;
}

export default function Card({ title, data, change, color }: CardProps) {
  let text_color = "";

  if (title === "จำนวนการจอง") {
    text_color = "text-blue-500";
  } else if (title === "รอการอนุมัติ") {
    text_color = "text-yellow-500";
  } else if (title === "จำนวนอนุมัติ") {
    text_color = "text-green-500";
  } else {
    text_color = "text-red-500";
  }

  const getChangeIndicator = () => {
    change = data - change;
    if (change > 0) {
      return (
        <div>
          <span className="text-green-500">▲ {change}</span>
        </div>
      );
    } else if (change < 0) {
      return <span className="text-red-500">▼ {Math.abs(change)}</span>
    } else {
      return <span className="text-gray-500">—</span>
    }
  };

  return (
    <div className={`w-72 h-36 p-4 rounded-lg shadow-lg ${color}`}>
      <h2 className={`text-lg font-semibold ${text_color}`}>{title}</h2>
      <div className="flex items-center justify-between mt-4">
        <h3 className={`text-3xl font-bold ${text_color}`}>{data}</h3>
        <div>{getChangeIndicator()}</div>
      </div>
    </div>
  );
}
