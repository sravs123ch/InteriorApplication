// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../Context/AuthContext";
// import LoadingAnimation from "../Loading/LoadingAnimation";

// const ProtectedRoute = ({
//   children,
//   allowedRoles,
//   requiredPermissions = [],
// }) => {
//   const { isLoggedIn, userRole, permissionsID, loading } = useAuth();

//   if (loading) {
//     return <LoadingAnimation />; // Or a loading spinner
//   }

//   if (!isLoggedIn) {
//     return <Navigate to="/" />;
//   }

//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/unauthorized" />;
//   }

//   if (
//     requiredPermissions.length > 0 &&
//     !requiredPermissions.some((permission) =>
//       permissionsID.includes(permission)
//     )
//   ) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import LoadingAnimation from "../Loading/LoadingAnimation";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isLoggedIn, permissionsID, loading } = useAuth();

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (requiredPermission && !permissionsID.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;