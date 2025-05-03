import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SmsDashboard from "./components/SmsDashboard";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProjectForm from "./components/NewProjectForm";
import Leads from "./pages/Leads";
import NewLeadForm from "./components/NewLeadForm";
import HomePage from "./pages/HomePage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import ProjectsView from "./pages/dashboard/Projects/ProjectsView";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* <Sidebar /> */}
        <main className="flex-1 p-0 bg-gray-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashboardLayout />} >
              <Route path="sms-stats" element={<SmsDashboard />} />
              <Route path="projects" element={<ProjectsView />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
