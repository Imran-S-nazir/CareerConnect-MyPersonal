import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../services/authService";
import { setUser, setInitialized } from "../redux/features/authSlice";
import { getDashboardPath } from "../utils/dashboardRedirect";

/**
 * Route protection based on userType.
 * Prevents students from accessing fresher/professional dashboards and vice versa.
 * Restores user state from backend session on refresh.
 *
 * @param {Array<string>} allowedRoles - e.g. ["student"], ["fresher"], ["professional"]
 */
const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isInitialized } = useSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(!isInitialized && !user);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!user && !isInitialized) {
        try {
          const res = await getCurrentUser();
          if (res?.success && res?.user) {
            dispatch(setUser(res.user));
          } else {
            dispatch(setInitialized(true));
          }
        } catch (error) {
          dispatch(setInitialized(true));
        } finally {
          setCheckingAuth(false);
        }
      } else {
        setCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [user, isInitialized, dispatch]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">Loading your workspace...</p>
      </div>
    );
  }

  // 1. Not authenticated -> Redirect to Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Missing or invalid userType -> Redirect to Select Role
  const validUserTypes = ["student", "fresher", "professional"];
  if (!user.userType || !validUserTypes.includes(user.userType)) {
    return <Navigate to="/select-role" replace />;
  }

  // 3. User attempting to access another role's dashboard -> Redirect to their own dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    const ownDashboard = getDashboardPath(user.userType);
    return <Navigate to={ownDashboard} replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleProtectedRoute;
