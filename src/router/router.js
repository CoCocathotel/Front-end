import { createBrowserRouter } from 'react-router-dom';

import "../index.css";
import User from './user';
import Admin from './admin';
import Error from '../component/Error';

let data = JSON.parse(localStorage.getItem("user-provider"));

let role = "user";

if (data !== null) {
    role = data.pos;
}

let initRoute = [];

if(role === 'admin'){
    initRoute = Admin();
}else{
  initRoute = User();
}
const router = createBrowserRouter(
  initRoute
);


export default router;
