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



//   Room
  getRoom: (data) => service.get('/room', data),
  createRoom: (data) => service.post('/room/createRoom', data),
}



