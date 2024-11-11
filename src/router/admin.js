
import AppbarAdmin from "../component/AppbarAdmin";
import SidebarAdmin from "../component/SidebarAdmin";

import Ad_Home from "../pages/admin/Ad_Home";
import Ad_Room from "../pages/admin/Ad_Room";
import Detail from "../component/Detail";
import Ad_Analytic from "../pages/admin/Ad_Analytic";
import Ad_Schedule from "../pages/admin/Ad_Schedule";
import Ad_Custom from "../pages/admin/Ad_Custome";
import Ad_Footer from "../pages/admin/Ad_Footer";

export default function Teacher() {

    return [
        {
            path: "/",
            element: (
                <>
                    <AppbarAdmin />
                    <SidebarAdmin value={0} page={<Ad_Home />} />
                </>
            ),
        },
        {
            path: "/room",
            element: (
                <>
                    <AppbarAdmin />
                    <SidebarAdmin value={3} page={<Ad_Room />} />
                </>
            ),
        },
        {
            path: "/admin_edit/:id",
            element: (
                <>
                    <AppbarAdmin />
                    <SidebarAdmin page={<Detail />} />
                </>
            ),
        },
        {
            path: "/schedule",
            element: (
                <>
                    <AppbarAdmin />
                    <SidebarAdmin page={<Ad_Schedule />} />
                </>
            ),
        },
        {
            path: "/ad_analytic",
            element: (
                <>
                    <AppbarAdmin />
                    <SidebarAdmin value={2} page={<Ad_Analytic />} />
                </>
            ),
        },
        {
            path: "/ad_custom",
            element: (
                <>
                    <AppbarAdmin />
                    <SidebarAdmin value={4} page={<Ad_Custom />} />
                </>
            ),
        },
        {
            path: "/footer",
            element: (
                <>
                    <AppbarAdmin />
                    <SidebarAdmin page={<Ad_Footer />} />
                </>
            ),
        },
        

    ]
};