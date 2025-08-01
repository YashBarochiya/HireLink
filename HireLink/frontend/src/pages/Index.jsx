import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/images/hero_1.jpg"; // Adjust the path as per your project structure
import "../styles/Index.css";
import Base from "../base/Base"; // Import Base component

const JobPortalHome = () => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalJobs: 0,
    totalCompletedJobs: 0,
    totalCompanies: 0,
  });

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/") // Corrected URL
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setStats({
          totalCandidates: data.total_candidates,
          totalJobs: data.total_jobs,
          totalCompletedJobs: data.total_completed_jobs,
          totalCompanies: data.total_companies,
        });
        setJobs(data.job_lists); // Ensure this matches the API response key
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load job data. Please try again later.");
      });
  }, []);

  return (
    <Base>
      <div id="root" className="full-width-container">
        {error && <div className="error-message">{error}</div>}
        {/* Home Section */}
        <section
          className="home-section section-hero overlay bg-image"
          style={{ backgroundImage: `url(${heroImage})` }}
          id="home-section"
        >
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-12 text-center">
                <h1 className="text-white font-weight-bold">
                  The Easiest Way To Get Your Dream Job
                </h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                <form method="GET" action="/search" className="search-jobs-form">
                  {/* Include search component here */}
                </form>
              </div>
            </div>
          </div>
          <a href="#next" className="scroll-button smoothscroll">
            <span className="icon-keyboard_arrow_down"></span>
          </a>
        </section>

        {/* Stats Section */}
        <section
          className="py-5 bg-image overlay-primary fixed overlay"
          style={{ backgroundImage: `url(${heroImage})` }}
          id="next"
        >
          <div className="container text-center">
            <h2 className="section-title text-white">Job Portal Stats</h2>
            <p className="lead text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <div className="row">
              {[
                { label: "Candidates", count: stats.totalCandidates },
                { label: "Jobs Posted", count: stats.totalJobs },
                { label: "Jobs Filled", count: stats.totalCompletedJobs },
                { label: "Companies", count: stats.totalCompanies },
              ].map((item, index) => (
                <div key={index} className="col-6 col-md-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <strong className="number">{item.count}</strong>
                  </div>
                  <span className="caption">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Listings */}
        {jobs.length > 0 ? (
          <section className="site-section">
            <div className="container">
              <h2 className="text-center">{stats.totalJobs} Job Listed</h2>
              <ul className="job-listings">
                {jobs.map((job) => (
                  <li key={job.id} className="job-listing d-block d-sm-flex align-items-center">
                    <Link to={`/job/${job.id}`}></Link>
                    <div className="job-listing-logo">
                      <img src={heroImage} alt="Job Logo" className="img-fluid" />
                    </div>
                    <div className="job-listing-about d-sm-flex w-100 justify-content-between mx-4">
                      <div className="job-listing-position w-50">
                        <h2>{job.title}</h2>
                        <strong>{job.company_name}</strong>
                      </div>
                      <div className="job-listing-location w-25">
                        <span className="icon-room"></span> {job.location}
                      </div>
                      <div className="job-listing-meta">
                        {job.job_type === "1" ? (
                          <span className="badge badge-success">Full Time</span>
                        ) : job.job_type === "2" ? (
                          <span className="badge badge-danger">Part Time</span>
                        ) : (
                          <span className="badge badge-info">Internship</span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : (
          <section className="site-section">
            <div className="container text-center">
              <h2 className="text-center">"Choose a job you love, and you will never have to work a day in your life."</h2>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section
          className="py-5 bg-image overlay-primary fixed overlay"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h2 className="text-white">Looking For A Job?</h2>
                <p className="mb-0 text-white lead">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div className="col-md-3 ml-auto">
                <Link to="/signup" className="btn btn-warning btn-block btn-lg">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Base>
  );
};

export default JobPortalHome;
