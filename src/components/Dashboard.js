import { Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import App from '../App';

export default function Dashboard() {

    const [data, setData] = useState([]);

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

        } catch (err) {
            console.log("An error occurred. Please try again.");
        }
    };

    const handleImageError = (e) => {
        e.target.src = "placeholder-image-url";
    };

    const handleTimeChange = (e) => {
        if (e != 0) {
            console.log("startDate", e.startDate);
            console.log("endDate", e.endDate);
            console.log("numcat", e.numcat);
            handlefind(e);
        } else {
            handleget();
        }
    }

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
    }

    useEffect(() => {
        // handleget();
    }, []);

    return (
        <>
            <App handleChange={(e) => handleTimeChange(e)} />
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

                            <Link to={`/detail/${item._id}`}>ดูรายละเอียดห้อง</Link>
                        </div>
                    </div>
                ))
            ) : (
                <div className="content">
                    <h1>No data</h1>
                </div>
                
            )}
        </>
    );
}
