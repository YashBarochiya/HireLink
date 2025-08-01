import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Index from "./pages/Index.jsx"; // Import Index page
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import JobsList from "./pages/Joblist.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmployeeRegistration from "./pages/Employee-registration.jsx";
import EmployerRegistration from "./pages/Employer-registration.jsx";
import Logout from "./pages/Logout.jsx";
import EmployeeEditProfile from "./pages/Employee-edit-profile.jsx";
import PostJob from "./pages/Post-job.jsx";
import JobSingle from "./pages/Job-single"; // Import the JobSingle component
import JobEdit from "./pages/JobEdit.jsx"; // Import the JobEdit component
import Applicants from "./pages/Applicants.jsx"; // Import Applicants component
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Index />} /> {/* Publicly accessible */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register-employee" element={<EmployeeRegistration />} />
                    <Route path="/register-employer" element={<EmployerRegistration />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/jobs" element={<JobsList />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/edit-profile/:id" element={<EmployeeEditProfile />} />
                    <Route path="/job/create" element={<PostJob />} />
                    <Route path="job/:id/" element={<JobSingle />} /> 
                    <Route path="/job/:id/edit" element={<JobEdit />} /> 
                    <Route path="/job/:id/applicants" element={<Applicants />} /> {/* Add this route */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
