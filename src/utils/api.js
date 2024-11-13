import axios from 'axios';

function FRONTEND_URL() {
  const isDevelopment =
    window.location.origin.includes("localhost") ||
    window.location.origin.includes("127.0.0.1");

  return isDevelopment
    ? "http://localhost:3000"
    : "https://cococatfrontend.vercel.app";
}

function BASE_URL() {
  const isDevelopment =
    window.location.origin.includes("localhost") ||
    window.location.origin.includes("127.0.0.1");

  return isDevelopment
    ? "http://localhost:8700"
    : "https://cococatbackend.vercel.app";
}

const BASE = BASE_URL();
const FRONTEND = FRONTEND_URL();

const service = axios.create({ baseURL: BASE });

export default {
  service,
  apiUrl: BASE,
  frontendUrl: FRONTEND,

  // Home
  getHome: (data) => service.get('/home', data),
  createHome: (data) => service.post('/home/createHome', data),
  updateHome: (id, data) => service.patch(`/home/updateHome/${id}`, data),

  // Booking
  getBooking: (data) => service.get('/booking', data),
  createBooking: (data) => service.post('/booking/createBooking', data),

  // Detail
  getOneBookingByType: (type) => service.get(`/booking/type/${type}`),
  getOneBookingById: (id) => service.post(`/booking/id/${id}`),
  updateBooking: (id, data) => service.patch(`/booking/updateBooking/${id}`, data),

  // Room
  getRoom: (data) => service.get('/room', data),
  createRoom: (data) => service.post('/room/createRoom', data),
  getOneRoom: (type) => service.get(`/room/${type}`),
  updateRoom: (id, data) => service.patch(`/room/updateRoom/${id}`, data),
  deleteRoom: (id) => service.delete(`/room/deleteRoom/${id}`),

  // User
  userLogin: (data) => service.post('/user/login', data),
  userRegister: (data) => service.post('/user/register', data),
  getUser: (id) => service.get(`/user/getUser/${id}`),
  updateUser: (id, data) => service.patch(`/user/updateUser/${id}`, data),
  updatePassword: (data) => service.patch(`/user/changePassword/${data.userId}`, data),
  getUserBookingEvent: (email) => service.get(`/booking/userBookingEvent/${email}`),
  checkEmailExists: (email) => service.get(`/user/checkEmailExists/${email}`),

  // AdminHome
  getAllEvent: (data) => service.post('/booking/getAllEvent', data),
  changeStatus: (data) => service.patch(`/booking/changeStatus`, data),

  // Footer
  getFooter: () => service.get('/footer'),
  createFooter: (data) => service.post('/footer/createFooter', data),
  updateFooter: (id, data) => service.patch(`/footer/updateFooter/${id}`, data),
};
