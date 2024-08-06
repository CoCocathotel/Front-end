import '../App.css';
import { Route, Routes, Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import App from '../App';

export default function Detail() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const { Id } = useParams();

    const handleImageError = (e) => {
        e.target.src = "placeholder-image-url";
    };

    useEffect(() => {
        handleget();
    }, []);

    const handleget = async () => {
        try {
            const response = await fetch(`http://localhost:8700/hotel/${Id}`, {
                method: "GET",
            });
            const result = await response.json();
            // console.log(result);
            setData(result);

        } catch (err) {

            console.log("An error occurred. Please try again.");
        }
    };

    const handlefind = async (e) => {
        console.log(data.name);
        try {
            const response = await fetch(`http://localhost:8700/find_room/${data.name}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cin: e.startDate,
                    cout: e.endDate,
                    // numcat: e.numcat,
                }),
            });
            const result = await response.json();
            // setData(result);
            console.log(result);
            if (result.err) {
                setError(result.err);
            } else {
                setError("");
            }

        } catch (err) {
            console.log("An error occurred. Please try again.");
        }
    }

    const handleTimeChange = (e) => {
        if(e!=0){
            console.log("startDate", e.startDate);
            console.log("endDate", e.endDate);
            console.log("numcat", e.numcat);
            handlefind(e);
        }else{
            handleget();
        }
    }


    return (
        <div className="App">
            <App handleChange={(e) => handleTimeChange(e)} />
            <h1>Item</h1>
            {error && <h1>{error}</h1>}
            {!error && <ul className="home_space">

                <li>
                    <strong>Type:</strong> {data.type}
                </li>
                <li>
                    <strong>Name:</strong> {data.name}
                </li>
                <li>
                    <strong>Price:</strong> {data.price}
                </li>

                <li>
                    <input type="checkbox" id="camera" name="camera" value="camera" />
                    <label for="camera"> เปิดใช้งานกล้อง</label>
                </li>
                <li>
                    <button>ทำการจอง</button>
                </li>
                <li>
                    <div className="before_image_room">
                        <div className="image_room">
                            {data.image && data.image.length > 0 ? (
                                data.image.map((img_data, img_index) => (
                                    <img
                                        key={img_index}
                                        src={img_data}
                                        alt={data.name}
                                        width={100}
                                        height={100}
                                        onError={handleImageError}
                                    />
                                ))
                            ) : (
                                <div className="placeholder">No Images</div>
                            )}
                        </div>
                    </div>
                </li>
            </ul>}
        </div>
    );
}
