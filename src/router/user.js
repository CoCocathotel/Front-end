
import Appbar_master from "../component/AppbarMaster";
import Sidebar from "../component/Sidebar";

// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
import Home from "../pages/user/Home";
import Dashboard from "../pages/user/Dashboard";
import History from "../pages/user/History";
import Rule from "../pages/user/Rule";
import Footer from "../component/Footer";
import Account from "../pages/user/Account";
import Detail from "../component/Detail";


export default function Teacher() {

    return [
        {
            path: "/",
            element: (
                <>
                    <Appbar_master />
                    <Home />
                    <Footer />
                </>
            ),
        },
        {
            path: "/booking",
            element: (
                <>
                    <Appbar_master />
                    <Dashboard />
                    <Footer />
                </>
            ),
        },
        {
            path: "/detail/:Type",
            element: (
                <>
                    <Appbar_master />
                    <Detail />
                    <Footer />
                </>
            ),
        },
        {
            path: "/history/:id",
            element: (
                <>
                    <Appbar_master />
                    <Detail />
                    <Footer />
                </>
            ),
        },
        {
            path: "/account",
            element: (
                <>
                    <Appbar_master />
                    <Sidebar value={0} />
                    <Account />
                    <Footer />
                </>
            ),
        },
        {
            path: "/history",
            element: (
                <>
                    <Appbar_master />
                    <Sidebar value={1} />
                    <History />
                    <Footer />
                </>
            ),
        },
        {
            path: "/rule",
            element: (
                <>
                    <Appbar_master />
                    <Rule />
                    <Footer />
                </>
            ),
        },
    ]
};