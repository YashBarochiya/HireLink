import React, { useEffect, useState } from "react";
import Base from "../base/Base.jsx"; // Import Base component
import axios from "axios";
import "../assets/css/style.css"; // Import existing styles

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookmarked"); // Track the active tab

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const userResponse = await axios.get("http://127.0.0.1:8000/user/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(userResponse.data);

        if (userResponse.data.role === "employer") {
          const jobsResponse = await axios.get("http://127.0.0.1:8000/employer/jobs/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setJobs(jobsResponse.data);
        } else if (userResponse.data.role === "employee") {
          const savedJobsResponse = await axios.get("http://127.0.0.1:8000/employee/saved-jobs/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setSavedJobs(savedJobsResponse.data);

          const appliedJobsResponse = await axios.get("http://127.0.0.1:8000/employee/applied-jobs/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setAppliedJobs(appliedJobsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/job/delete/${jobId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setJobs(jobs.filter((job) => job.id !== jobId)); // Remove the deleted job from the state
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete the job. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Base>
      <section className="relative bg-cover bg-center py-20 md:py-32" style={{ backgroundImage: "url('/static/images/hero_1.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dashboard
            </h1>
            <div className="flex items-center text-white space-x-2">
              <a href="/" className="hover:text-gray-300 transition-colors">Home</a>
              <span className="text-gray-300">/</span>
              <span className="font-semibold">Dashboard</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {user?.role === "employer" && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">My All Jobs</h2>
                {jobs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Job Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Posted Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date Expiring</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Applicants</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {jobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <a href={`/job/${job.id}`} className="text-green-600 hover:text-green-800">
                                {job.title}
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {new Date(job.timestamp).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {new Date(job.last_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {job.is_published ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Published
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {job.applicants_count > 0 ? (
                                <a href={`/job/${job.id}/applicants`} className="text-green-600 hover:text-green-800">
                                  {job.applicants_count} {job.applicants_count > 1 ? "Applicants" : "Applicant"}
                                </a>
                              ) : (
                                <span className="text-gray-500">No applicants</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <a
                                href={`/job/${job.id}/edit`}
                                className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                              >
                                Edit
                              </a>
                              {job.is_published && !job.is_closed && (
                                <button className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors">
                                  Close
                                </button>
                              )}
                              {job.is_closed && (
                                <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                                  Closed
                                </span>
                              )}
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You have not posted any jobs yet!</p>
                    <a
                      href="/job/create"
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Create a new job
                    </a>
                  </div>
                )}
              </div>
            )}

            {user?.role === "employee" && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex space-x-4" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab("bookmarked")}
                      className={`${
                        activeTab === "bookmarked"
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                      Bookmarked Jobs
                    </button>
                    <button
                      onClick={() => setActiveTab("applied")}
                      className={`${
                        activeTab === "applied"
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                      Applied Jobs
                    </button>
                  </nav>
                </div>

                <div className="mt-6">
                  {activeTab === "bookmarked" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Bookmarked Posts</h2>
                      {savedJobs.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Job Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Posted Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date Expiring</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {savedJobs.map((savedJob) => (
                                <tr key={savedJob.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <a href={`/job/${savedJob.job.id}`} className="text-green-600 hover:text-green-800">
                                      {savedJob.job.title}
                                    </a>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {new Date(savedJob.job.timestamp).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {new Date(savedJob.job.last_date).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors">
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600">You have not saved any jobs yet!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "applied" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Applied Posts</h2>
                      {appliedJobs.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Job Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Posted Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date Expiring</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {appliedJobs.map((appliedJob) => (
                                <tr key={appliedJob.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <a href={`/job/${appliedJob.job.id}`} className="text-green-600 hover:text-green-800">
                                      {appliedJob.job.title}
                                    </a>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {new Date(appliedJob.job.timestamp).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {new Date(appliedJob.job.last_date).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600">You have not applied for any jobs yet!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Dashboard;
