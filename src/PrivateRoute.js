import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import {useContext, React} from "react"
function PrivateRoute({ children }) {
  let { user } = useContext(UserContext);
  let location = useLocation();

  return (
    user
      ? children
      : <Navigate to="/login" state={{ from: location }} />
  );
}
export default PrivateRoute