import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Base from "../base/Base"; // Import base layout
import heroImage from "../assets/images/hero_1.jpg"; // Import hero image
import "../assets/css/style.css"; // Import CSS

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", // Changed from username to email
    password: "",
  });

  const [errors, setErrors] = useState(null);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login/", // Ensure this matches your backend login endpoint
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Store JWT tokens in localStorage
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // Set default Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;

      navigate("/"); // Redirect on success
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data);
      } else {
        setErrors({ error: "Something went wrong. Please try again." });
      }
    }
  };

  return (
    <Base>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-20 md:py-32"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Log In
            </h1>
            <div className="flex items-center text-white space-x-2">
              <a href="/" className="hover:text-gray-300 transition-colors">Home</a>
              <span className="text-gray-300">/</span>
              <span className="font-semibold">Log In</span>
            </div>
          </div>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {errors && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                {Object.entries(errors).map(([key, value], index) => (
                  <p key={index} className="text-red-600 text-sm">
                    {key}: {value}
                  </p>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-md">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-black py-2 px-4 rounded-md hover:bg-green-700 f hover:scale-[1.02]"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Login;
