import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AppPay from "../App_Pay";

export default function Payment() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [payWay, setPayWay] = useState("");
  const [image, setImage] = useState(null);  
  const { Id, start, end, cam } = useParams();

  const handleImageError = (e) => {
    e.target.src = "placeholder-image-url";
  };

  useEffect(() => {
    handleGet();
    // console.log("cam",cam);
    // console.log(cam);

       
  }, []);

  const handleGet = async () => {
    try {
      const response = await fetch(`http://localhost:8700/hotel/${Id}`, {
        method: "GET",
      });
      const result = await response.json();
    //   console.log(result);
      setData(result);
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  const handleBuy = async () => {
    try {
      if (image instanceof Blob) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = function () {
          const img = reader.result;
          proceedWithPurchase(img);
        };
        reader.onerror = function (err) {
          console.error("Error reading image file:", err);
          proceedWithPurchase("");
        };
      } else {
        proceedWithPurchase("");
      }
    } catch (err) {
      console.log("An error occurred. Please try again.");
    }
  };

  const proceedWithPurchase = async (img) => {
    img = ""
    try {
      let token = JSON.parse(localStorage.getItem("data")).token;
      let email = JSON.parse(localStorage.getItem("data")).email;
      let cameras = "";
      if(cam === "true"){
        cameras = "yes";
      } 
      const purchaseData = {
        product_id: Id,
        cin: start,
        cout: end,
        camerasBooked: cameras,
        email: email,
        pay_way: payWay,
        image: img,
      };
    //   console.log(purchaseData.cin,purchaseData.cout);
      console.log(purchaseData);
    //   console.log("token", token);  
      const response = await fetch(`http://localhost:8700/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(purchaseData),
      });
      const result = await response.json();
       if (result.err) {
        setError(result.err);
      } else {
        setError("");
        alert("Purchase successful!");
         window.location.href = "/";
      }
    } catch (err) {
      alert(err);
      console.error(err);

    }
  };

  const handlePageChange = async (e) => {
    console.log(e);
    if (e !== 0) {
      handleBuy();
   
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      <AppPay handleChange={(e) => handlePageChange(e)} />
      <h1>Payment</h1>
      <div>
        {error && <h1>{error}</h1>}
        {!error && (
          <>
            <div className="pay_final1">
              {data.image && data.image.length > 0 ? (
                <img
                  key={0}
                  src={data.image[0]}
                  alt={data.name}
                  width={100}
                  height={100}
                  onError={handleImageError}
                />
              ) : (
                <div className="placeholder">No Images</div>
              )}
              <div className="pay_final">
                <p>{data.type}</p>
                <p>{data.name}</p>
                <p>{data.price}</p>
                <p>{data.description}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <h1>เลือกวิธีการชำระเงิน</h1>
      <div className="pay_final">
        <input
          type="radio"
          id="walk-in"
          name="pay_way"
          value="walk-in"
          onChange={(e) => setPayWay(e.target.value)}
        />
        <label htmlFor="walk-in">ชำระเงินปลายทาง</label>
      </div>
      <div className="pay_final">
        <input
          type="radio"
          id="credit"
          name="pay_way"
          value="credit"
          onChange={(e) => setPayWay(e.target.value)}
        />
        <label htmlFor="credit">ชำระเงินผ่านบัตรเครดิต</label>
        {payWay === "credit" && (
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        )}
      </div>

      <br />
      <button onClick={() => handlePageChange(1)}>Submit</button>
    </>
  );
}
