import axios from 'axios';

const BASE = "http://localhost:8700";
const FRONTEND = "http://localhost:3000";


const service = axios.create({ baseURL: BASE });

export default{
  service,
  apiUrl: BASE,
  frontendUrl: FRONTEND,
  
//   Home
  getHome: (data) => service.get('/home', data),
  createHome: (data) => service.post('/home/createHome', data),
  updateHome: (id,data) => service.patch(`/home/updateHome/${id}`, data),

// Booking
  getBooking: (data) => service.get('/booking', data),
  createBooking: (data) => service.post('/booking/createBooking', data),


//   Room
  getRoom: (data) => service.get('/room', data),
  createRoom: (data) => service.post('/room/createRoom', data),
  getOneRoom: (type) => service.get(`/room/${type}`),


//User
  userLogin: (data) => service.post('/user/login', data),

//  AdminHome
  getAllEvent: (data) => service.post('/booking/getAllEvent', data),
  changeStatus: (data) => service.patch(`/booking/changeStatus`, data),
}



