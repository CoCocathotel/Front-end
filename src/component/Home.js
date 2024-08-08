import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Dashboard() {
    // axios fetch data
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8700/v1/room")
            .then((res) => {
                setData(res.data);
                setLoading(false);
                console.log(res.data);
            });
    }, []);

    return (
        <>
            <h1>Dashboard</h1>
            {data.map((item, index) => (
                <div key={index}>
                    <h2>{item.type}</h2>

                    {item.image.map((img, index) => (
                        <img key={index} src={"https://szrepoqlfkcnlfdeicse.supabase.co/storage/v1/object/public/rooms/" + item.type + "/" + img} alt={item.type} width={200} height={200} />
                    ))}

                </div>
            ))}
        </>
    )
}<>
 </>