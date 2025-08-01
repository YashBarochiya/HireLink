import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Base from "../base/Base"; // Import Base component
import "../assets/css/style.css"; // Import existing styles

const JobSingle = () => {
  const { id } = useParams(); // Get job ID from URL
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const jobResponse = await axios.get(`http://127.0.0.1:8000/job/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setJob(jobResponse.data);

        const userResponse = await axios.get("http://127.0.0.1:8000/user/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(userResponse.data);
      } catch (err) {
        setError("Failed to load job details.");
        console.error(err);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.post(
        `http://127.0.0.1:8000/apply-job/${id}/`,
        {}, // No body required for this request
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert(response.data.message); // Show success message
    } catch (err) {
      console.error("Error applying for the job:", err.response || err.message);
      if (err.response && err.response.data.error) {
        alert(err.response.data.error); // Show error message from backend
      } else {
        alert("Failed to apply for the job.");
      }
    }
  };

  const handleSaveJob = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.post(
        `http://127.0.0.1:8000/bookmark-job/${id}/`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Job bookmarked successfully!");
    } catch (err) {
      console.error("Error bookmarking the job:", err);
      if (err.response && err.response.status === 400 && err.response.data.error) {
        // Handle case where job is already bookmarked
        alert(err.response.data.error); // Display backend error message
      } else {
        alert("Failed to bookmark the job.");
      }
    }
  };

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  if (!job) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <Base>
      {/* Hero Section */}
      <section
        className="section-hero overlay inner-page bg-image"
        style={{ backgroundImage: "url('/static/images/hero_1.jpg')" }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">{job.title}</h1>
              <div className="custom-breadcrumbs">
                <Link to="/">Home</Link> <span className="mx-2 slash">/</span>
                <Link to="/jobs">Job</Link> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>{job.title}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Details Section */}
      <section className="site-section">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <div className="d-flex align-items-center">
                <div className="border p-2 d-inline-block mr-3 rounded">
                  <img
                    src="/static/images/job_logo_2.jpg"
                    alt="Company Logo"
                    className="img-fluid"
                  />
                </div>
                <div>
                  <h2>{job.title}</h2>
                  <div>
                    <span className="ml-0 mr-2 mb-2">
                      <span className="icon-briefcase mr-2"></span>
                      <a href={job.url}>{job.company_name}</a>
                    </span>
                    <span className="m-2">
                      <span className="icon-room mr-2"></span>
                      {job.location}
                    </span>
                    <span className="m-2">
                      <span className="icon-clock-o mr-2"></span>
                      <span className="text-primary">
                        {job.job_type === "1"
                          ? "Full Time"
                          : job.job_type === "2"
                          ? "Part Time"
                          : "Internship"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row">
                {user?.role === "employee" && (
                  <div className="col-6">
                    <button className="btn btn-block btn-light btn-md" onClick={handleSaveJob}>
                      Save Job
                    </button>
                  </div>
                )}
                {user?.role === "employee" && (
                  <div className="col-6">
                    <button className="btn btn-block btn-primary btn-md" onClick={handleApply}>
                      Apply Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="mb-5">
                <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                  <span className="icon-align-left mr-3"></span>Job Description
                </h3>
                <p>{job.description}</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-light p-3 border rounded mb-4">
                <h3 className="text-primary mt-3 h5 pl-3 mb-3">Job Summary</h3>
                <ul className="list-unstyled pl-3 mb-0">
                  <li className="mb-2">
                    <strong className="text-black">Published on:</strong>{" "}
                    {new Date(job.timestamp).toLocaleDateString()}
                  </li>
                  <li className="mb-2">
                    <strong className="text-black">Employment Status:</strong>{" "}
                    {job.job_type === "1"
                      ? "Full Time"
                      : job.job_type === "2"
                      ? "Part Time"
                      : "Internship"}
                  </li>
                  <li className="mb-2">
                    <strong className="text-black">Job Location:</strong>{" "}
                    {job.location}
                  </li>
                  <li className="mb-2">
                    <strong className="text-black">Salary:</strong> {job.salary}
                  </li>
                  <li className="mb-2">
                    <strong className="text-black">
                      Application Deadline:
                    </strong>{" "}
                    {new Date(job.last_date).toLocaleDateString()}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default JobSingle;
