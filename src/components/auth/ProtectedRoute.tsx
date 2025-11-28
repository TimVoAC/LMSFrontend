import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
