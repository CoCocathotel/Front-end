import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import App from "../App";

export default function Dashboard() {
  const ref = useRef({ startDate: new Date(), endDate: new Date(), numcat: 1 });
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(ref.current.startDate);
  const [endDate, setEndDate] = useState(ref.current.endDate);
  const [numcat, setNumcat] = useState(ref.current.numcat);

  const handlefind = async (e) => {
    try {
      const response = await fetch("http://localhost:8700/find_room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cin: e.startDate,
          cout: e.endDate,
        }),
      });
      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  const handleImageError = (e) => {
    e.target.src = "placeholder-image-url";
  };

  const handleTimeChange = (e) => {
    if (e != 0) {
      setStartDate(e.startDate);
      setEndDate(e.endDate);
      handlefind(e);
    } else {
      handleget();
    }
  };

  const handleget = async () => {
    try {
      const response = await fetch("http://localhost:8700/hotel", {
        method: "GET",
      });
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <App
        handleChange={(e) => handleTimeChange(e)}
        SetStartDate={startDate}
        SetEndDate={endDate}
      />
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>
            <div className="content">
              <img
                key={0}
                src={item.image[0]}
                alt={item.name}
                width={100}
                height={100}
                onError={handleImageError}
              />
              <h2>{item.name}</h2>
              <p>{item.price}</p>
              <p>{item.type}</p>
              <p>{item.description}</p>

              <Link to={`/detail/${item._id}/${startDate}/${endDate}`}>
                ดูรายละเอียดห้อง
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="content">
          <div>
            <h1> สิ่งที่ต้องเตรียมมาในวันเข้าพัก</h1>
            <h2>1.บัตรประชาชนเจ้าของ</h2>
            <h2>2.สมุดวัคซีนน้องแมว</h2>
            <h2>3.อาหารและทรายแมว</h2>
            <h2>4.ของเล่นชิ้นโปรดของน้องแมว</h2>
            <h2>5.เตียงนอนแมว</h2>
          </div>
        </div>
      )}
    </>
  );
}
