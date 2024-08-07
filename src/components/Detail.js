import '../App.css';
import { Route, Routes, Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import App from '../App';
  
export default function Detail() {
    const { Id, start, end } = useParams();

    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [startDate, setStartDate] =  useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [numcat, setNumcat] = useState(1);

    

    const handleImageError = (e) => {
        e.target.src = "placeholder-image-url";
    };

    useEffect(() => {
        handleget();
        
        console.log(Id);
        console.log(start);
        console.log(end);
        setStartDate(start);
        setEndDate(end);
    }, []);

    const handleget = async () => {
        try {
            const response = await fetch(`http://localhost:8700/hotel/${Id}`, {
                method: "GET",
            });
            const result = await response.json();
            setData(result);

        } catch (err) {

            console.log("An error occurred. Please try again.");
        }
    };

    const handlefind = async (e) => {
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
            handlefind(e);
        }else{
            handleget();
        }
    }


    return (
        <div className="App">
           <App handleChange={(e) => handleTimeChange(e)} SetStartDate={startDate} SetEndDate={endDate} />
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
                <li> <Link to={`/book/${data._id}/${startDate}/${endDate}`}><button>Book Now</button></Link>
                    
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
