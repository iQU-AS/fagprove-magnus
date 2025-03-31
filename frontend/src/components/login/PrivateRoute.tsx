import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { LoadingSpinner } from "../utils.tsx/Spinner";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <LoadingSpinner />;
  }
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
