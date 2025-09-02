import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkAuthState } from "../auth";
import PropTypes from "prop-types";
import "./Loader.css";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const styles = {
    textAlign: "center",
    marginTop: "50px",
    fontSize: "24px",
  };
  useEffect(() => {
    checkAuthState((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="loader-container">
        <p style={styles}>Loading...</p>
        <div className="loader"></div>
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ProtectedRoute;
