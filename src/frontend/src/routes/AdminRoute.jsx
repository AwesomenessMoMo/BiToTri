import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    // 🚫 Not logged in
    if (!user) {
        return <Navigate to="/home" replace />;
    }

    // 🚫 Logged in but NOT admin
    if (user.role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    // ✅ Admin
    return children;
};

export default AdminRoute;
