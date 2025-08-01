import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Base from "../base/Base";
import heroImage from "../assets/images/hero_1.jpg";
import "../assets/css/style.css";

const JobEdit = () => {
  const { id } = useParams(); // Get job ID from URL
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

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const jobResponse = await axios.get(`http://127.0.0.1:8000/job/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setFormData({
          title: jobResponse.data.title || "",
          job_type: jobResponse.data.job_type || "",
          category: jobResponse.data.category || "",
          description: jobResponse.data.description || "",
          last_date: jobResponse.data.last_date || "",
          company_name: jobResponse.data.company_name || "",
          company_description: jobResponse.data.company_description || "",
        });

        const categoriesResponse = await axios.get("http://127.0.0.1:8000/categories/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching job details or categories:", error);
      }
    };

    fetchJobDetails();
  }, [id]);

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
      await axios.put(
        `http://127.0.0.1:8000/job/edit/${id}/`, // Ensure this matches the backend route
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Job updated successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error updating job:", error.response || error.message);
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
        className="section-hero overlay inner-page bg-image"
        style={{ backgroundImage: `url(${heroImage})` }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Edit Job</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <a href="/jobs">Job</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Edit Job</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Edit Form */}
      <section className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mb-5">
              <h2 className="mb-4 text-center">Edit Job</h2>

              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}

              {errors.general && (
                <div className="alert alert-danger">{errors.general}</div>
              )}

              <form onSubmit={handleSubmit} className="p-4 border rounded">
                <h3 className="text-black mb-5 border-bottom pb-2">Job Details</h3>

                <div className="form-group">
                  <label className="text-black" htmlFor="title">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    placeholder="Enter job title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  {errors.title && (
                    <small className="text-danger">{errors.title}</small>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-black" htmlFor="job_type">Job Type</label>
                  <select
                    className="form-control"
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
                    <small className="text-danger">{errors.job_type}</small>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-black" htmlFor="category">Category</label>
                  <select
                    className="form-control"
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
                    <small className="text-danger">{errors.category}</small>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-black" htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    placeholder="Enter job description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                  {errors.description && (
                    <small className="text-danger">{errors.description}</small>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-black" htmlFor="last_date">Last Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="last_date"
                    name="last_date"
                    value={formData.last_date}
                    onChange={handleChange}
                    required
                  />
                  {errors.last_date && (
                    <small className="text-danger">{errors.last_date}</small>
                  )}
                </div>

                <h3 className="text-black mt-5 mb-5 border-bottom pb-2">Company Details</h3>

                <div className="form-group">
                  <label className="text-black" htmlFor="company_name">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="company_name"
                    name="company_name"
                    placeholder="Enter company name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                  {errors.company_name && (
                    <small className="text-danger">{errors.company_name}</small>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-black" htmlFor="company_description">Company Description</label>
                  <textarea
                    className="form-control"
                    id="company_description"
                    name="company_description"
                    placeholder="Enter company description"
                    value={formData.company_description}
                    onChange={handleChange}
                    required
                  />
                  {errors.company_description && (
                    <small className="text-danger">{errors.company_description}</small>
                  )}
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-md">
                    Update
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

export default JobEdit;
