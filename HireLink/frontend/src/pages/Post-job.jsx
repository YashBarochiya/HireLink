import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Base from "../base/Base"; // Import Base component
import heroImage from "../assets/images/hero_1.jpg"; // Import hero image
import axios from "axios";
import "../assets/css/style.css"; // Import existing styles

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    job_type: "",
    category: "",
    description: "",
    last_date: "",
    company_name: "",
    company_description: "",
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/categories/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.post(
        "http://127.0.0.1:8000/job/create/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Job posted successfully!");
      setTimeout(() => {
        navigate("/dashboard"); // Redirect to dashboard after success
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
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
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Post A Job
            </h1>
            <div className="flex items-center justify-center text-white space-x-2">
              <a href="/" className="hover:text-gray-300 transition-colors">Home</a>
              <span className="text-gray-300">/</span>
              <a href="/jobs" className="hover:text-gray-300 transition-colors">Job</a>
              <span className="text-gray-300">/</span>
              <span className="font-semibold">Post a Job</span>
            </div>
          </div>
        </div>
      </section>

      {/* Job Posting Form */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                Post A Job
              </h2>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                  {successMessage}
                </div>
              )}

              {errors.general && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                    Job Details
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">
                        Job Title
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        id="title"
                        name="title"
                        placeholder="Enter job title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="job_type">
                        Job Type
                      </label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        id="job_type"
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Job Type</option>
                        <option value="1">Full time</option>
                        <option value="2">Part time</option>
                        <option value="3">Internship</option>
                      </select>
                      {errors.job_type && (
                        <p className="mt-1 text-sm text-red-600">{errors.job_type}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="category">
                        Category
                      </label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors min-h-[150px]"
                        id="description"
                        name="description"
                        placeholder="Enter job description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="last_date">
                        Last Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        id="last_date"
                        name="last_date"
                        value={formData.last_date}
                        onChange={handleChange}
                        required
                      />
                      {errors.last_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.last_date}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                    Company Details
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="company_name">
                        Company Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        id="company_name"
                        name="company_name"
                        placeholder="Enter company name"
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                      />
                      {errors.company_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="company_description">
                        Company Description
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors min-h-[150px]"
                        id="company_description"
                        name="company_description"
                        placeholder="Enter company description"
                        value={formData.company_description}
                        onChange={handleChange}
                        required
                      />
                      {errors.company_description && (
                        <p className="mt-1 text-sm text-red-600">{errors.company_description}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-black py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default PostJob;
