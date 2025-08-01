import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      const refreshToken = localStorage.getItem("refresh_token"); // Retrieve the refresh token from local storage

      if (!refreshToken) {
        // If no refresh token is found, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
        return;
      }

      try {
        await axios.post(
          "http://127.0.0.1:8000/logout/",
          { refresh: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Clear tokens from local storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Redirect to login page
        navigate("/login");
      } catch (error) {
        console.error("Error during logout:", error);
        // Handle logout failure (optional)
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="text-center">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
