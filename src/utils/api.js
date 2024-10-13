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

// Booking
  getBooking: (data) => service.get('/booking', data),
  createBooking: (data) => service.post('/booking/createBooking', data),


//   Room
  getRoom: (data) => service.get('/room', data),
  createRoom: (data) => service.post('/room/createRoom', data),
  getOneRoom: (type) => service.get(`/room/${type}`),


//User
  userLogin: (data) => service.post('/user/login', data),
}



