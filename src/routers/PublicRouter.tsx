import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function PublicRouter({ children }: { children: JSX.Element }) {
  const { user, isAuth } = useSelector((state: RootState) => state.authSlice);
  const location = useLocation();
  return (
    <>
      {isAuth && user?.permissions.isActive && user?.permissions.isAdmin ? (
        <Navigate to="/dashboard" state={{ from: location }} replace />
      ) : (
        children
      )}
    </>
  );
}
