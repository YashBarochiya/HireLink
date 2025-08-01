import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Base from "../base/Base"; // Import Base component
import heroImage from "../assets/images/hero_1.jpg"; // Import hero image
import "../assets/css/style.css"; // Import existing CSS

const Joblist = () => {
  const [jobs, setJobs] = useState([]); // Initialize jobs as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/jobs/");
        setJobs(response.data || []); // Ensure jobs is set to a valid array
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <Base>
      {/* Hero Section */}
      <section
        className="section-hero overlay inner-page bg-image d-flex align-items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7 text-left">
              <h1 className="text-white font-weight-bold text-left">Jobs</h1>
              <div className="custom-breadcrumbs text-left">
                <Link to="/" className="text-white">Home</Link> 
                <span className="mx-2 slash text-white">/</span>
                <span className="text-white"><strong>Jobs</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="site-section services-section bg-light block__62849">
        <div className="container">
          {Array.isArray(jobs) && jobs.length > 0 ? ( // Ensure jobs is an array and not empty
            <div className="row">
              {jobs.map((job) => (
                <div key={job.id} className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5">
                  <Link
                    to={`/job/${job.id}`}
                    className="block__16443 min-h text-center d-block"
                  >
                    <span className="custom-icon mx-auto">
                      <span className="icon-magnet d-block"></span>
                    </span>
                    <h3 className="text-left">{job.title}</h3>
                    <ul className="job-listing-meta list-unstyled pl-3 mb-0 text-left">
                      <li className="menu-fix mb-2">
                        {job.job_type === "1" ? (
                          <span className="badge badge-primary">Full Time</span>
                        ) : job.job_type === "2" ? (
                          <span className="badge badge-danger">Part Time</span>
                        ) : (
                          <span className="badge badge-info">Internship</span>
                        )}
                      </li>
                      <li className="badge badge-secondary menu-fix mb-2">
                        {job.location}
                      </li>
                    </ul>
                    <p className="text-left">
                      {job.description?.length > 150
                        ? `${job.description.substring(0, 150)}...`
                        : job.description}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No jobs available at the moment.</p>
          )}
        </div>
      </section>
    </Base>
  );
};

export default Joblist;
