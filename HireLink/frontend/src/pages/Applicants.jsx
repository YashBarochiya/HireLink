import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Base from "../base/Base";
import heroImage from "../assets/images/hero_1.jpg"; // Import hero image
import "../assets/css/style.css"; // Import existing styles

const Applicants = () => {
  const { id } = useParams(); // Get job ID from URL
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`http://127.0.0.1:8000/dashboard/employer/job/${id}/applicants/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setApplicants(response.data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError("Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id]);

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
        className="section-hero overlay inner-page bg-image"
        style={{ backgroundImage: `url(${heroImage})` }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Applicants</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <a href="/dashboard">Dashboard</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Applicants</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applicants Table Section */}
      <section className="site-section">
        <div className="container">
          <h2 className="text-center mb-4">Applicants</h2>
          {applicants.length > 0 ? (
            <table className="table text-center">
              <thead className="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td>{`${applicant.user.first_name} ${applicant.user.last_name}`}</td>
                    <td>{applicant.user.email}</td>
                    <td>{new Date(applicant.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No applicants found for this job.</p>
          )}
        </div>
      </section>
    </Base>
  );
};

export default Applicants;
