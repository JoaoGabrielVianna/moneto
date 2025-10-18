import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    if (!localStorage.getItem("token")) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute;