import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
    if (!!localStorage.getItem("token")) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}

export default PublicRoute;