import React, { useEffect, useState } from 'react';
import { Route, Routes, Link, useParams } from 'react-router-dom';

import AppPay from '../App_Pay';

export default function Payment() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const { Id, start, end } = useParams();

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
            console.log(result);
            setData(result);

        } catch (err) {

            console.log("An error occurred. Please try again.");
        }
    };

    const handlebuy = async () => {
        try {
            let img = "";
            let data = {
                product_id: Id,
                cin: start,
                cout: end,
                camerasBooked: 0,
                email: JSON.parse(localStorage.getItem("data")).email,
                pay_way: "walk-in",
                image: img
            };

            const response = await fetch(`http://localhost:8700/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": JSON.parse(localStorage.getItem("data")).token,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log(result);
            if (result.err) {
                setError(result.err);
            } else {
                setError("");
            }

        } catch (err) {
            console.log("An error occurred. Please try again.");
        }
    };

    const handlePageChange = (e) => {
        console.log(e);
        if (e != 0) {
            handlebuy();
        }
    }

    return (
        <>
            <AppPay handleChange={(e) => handlePageChange(e)} />
            <h1>Payment</h1>
            <div>
                {error && <h1>{error}</h1>}
                {!error &&

                    <div>
                        <div className='pay_final1' >
                       
                       
                        <img
                                key={0}
                                src={data.image[0]}
                                alt={data.name}
                                width={100}
                                height={100}
                                onError={handleImageError}
                            />
                            <div className='pay_final'>
                                <p> {data.type} </p>
                                <p> {data.name}</p>
                                <p> {data.price}</p>
                                <p> {data.description}</p>
                            </div>
                           

                      
                        </div>
                    </div>
                }
            </div>

        </>
    )
}