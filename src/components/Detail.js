// import '../App.css';
// import { Route, Routes, Link, useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import App from '../App';
  
// export default function Detail() {
//     const { Id, start, end } = useParams();

//     const [data, setData] = useState([]);
//     const [error, setError] = useState("");
//     const [startDate, setStartDate] =  useState(new Date());
//     const [endDate, setEndDate] = useState(new Date());
//     const [numcat, setNumcat] = useState(1);
//     const [check_cam, setCheck_cam] = useState(false);
//     const [camera, setCamera] = useState(false);

    

//     const handleImageError = (e) => {
//         e.target.src = "placeholder-image-url";
//     };

//     useEffect(() => {
//         handleget();
        
//         // Parsing the start and end dates
//         let start_ts = new Date(start);
//         let end_ts = new Date(end);
        
//         // Check if the date objects are valid
//         if (!isNaN(start_ts.getTime()) && !isNaN(end_ts.getTime())) {
//             setStartDate(start_ts.toJSON());
//             setEndDate(end_ts.toJSON());
//             handleCam(start_ts.toJSON(), end_ts.toJSON());
//         } else {
//             console.error("Invalid date format");
//         }
//     }, []);
    

//     const handleCam = async (ste,ete) => {
//         try {
//             let email = JSON.parse(localStorage.getItem("data")).email;
//             let newdata = {
//                 "email":email, 
//                 "cin": ste,
//                 "cout": ete,
//                 "booking": Id
//               };
//             //   console.log(newdata);
//             const response = await fetch(`http://localhost:8700/check_cam`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(newdata),
//             });
//             const result = await response.json();
//             console.log(result.message);
//             if(result.message ==""){
//                 setCheck_cam(true);
//             }else{
//                 setCheck_cam(false);
//             }

//         }catch (err) {
//             // console.log(err);
//             setCheck_cam(false);
//         }
//     }

//     const handleget = async () => {
//         try {
//             const response = await fetch(`http://localhost:8700/hotel/${Id}`, {
//                 method: "GET",
//             });
//             const result = await response.json();
//             setData(result);

//         } catch (err) {
//             console.log("An error occurred. Please try again.");
//         }
//     };

//     const handlefind = async (e) => {
//         try {
//             const response = await fetch(`http://localhost:8700/find_room/${data.name}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     cin: e.startDate,
//                     cout: e.endDate,
//                     // numcat: e.numcat,
//                 }),
//             });
//             const result = await response.json();
//             if (result.err) {
//                 setError(result.err);
//             } else {
//                 setError("");
//             }

//         } catch (err) {
//             console.log("An error occurred. Please try again.");
//         }
//     }

//     const handleTimeChange = (e) => {
//         if(e!=0){
//             handlefind(e);
//             let start_ts = new Date(e.startDate);
//             let end_ts = new Date(e.endDate);
//             setStartDate(start_ts.toJSON());
//             setEndDate(end_ts.toJSON());
//             handleCam(start_ts.toJSON(), end_ts.toJSON());
//             // console.log("start",start_ts.toJSON());
//             // console.log("end",end_ts.toJSON());
//         }else{
//             handleget();            
//         }
//     }


//     return (
//         <div className="App">
//            <App handleChange={(e) => handleTimeChange(e)} SetStartDate={startDate} SetEndDate={endDate} />
//             <h1>Item</h1>
//             {error && <h1>{error}</h1>}
//             {!error && <ul className="home_space">

//                 <li>
//                     <strong>Type:</strong> {data.type}
//                 </li>
//                 <li>
//                     <strong>Name:</strong> {data.name}
//                 </li>
//                 <li>
//                     <strong>Price:</strong> {data.price}
//                 </li>

//                 <li>
//                     {check_cam && (
//                        <>
//                         <input type="checkbox" id="camera" name="camera" value="camera" onChange={
//                             (e) => {
//                                 setCamera(e.target.checked);
//                                 // console.log(e.target.checked);
//                             }
//                         }/>
//                         <label for="camera"> เปิดใช้งานกล้อง</label>
//                        </>
//                     )}
//                 {!check_cam && (
//                        <>
//                         {/* <input type="checkbox" id="camera" name="camera" value="camera" /> */}
//                         <label for="camera"> กล้องไม่พร้อมใช้งาน</label>
//                        </>
//                     )}
//                 </li>
//                 <li> <Link to={`/book/${data._id}/${startDate}/${endDate}/${camera}`}><button>Book Now</button></Link>
                    
//                 </li>
//                 <li>
//                     <div className="before_image_room">
//                         <div className="image_room">
//                             {data.image && data.image.length > 0 ? (
//                                 data.image.map((img_data, img_index) => (
//                                     <img
//                                         key={img_index}
//                                         src={img_data}
//                                         alt={data.name}
//                                         width={100}
//                                         height={100}
//                                         onError={handleImageError}
//                                     />
//                                 ))
//                             ) : (
//                                 <div className="placeholder">No Images</div>
//                             )}
//                         </div>
//                     </div>
//                 </li>
//             </ul>}
//         </div>
//     );
// }
