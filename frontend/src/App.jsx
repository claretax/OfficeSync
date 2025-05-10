import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SmsDashboard from "./components/SmsDashboard";
import AddClient from "./components/forms/AddClient";
import HomePage from "./pages/HomePage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import ProjectsView from "./pages/dashboard/Projects/ProjectsView";
import { ToastContainer } from "react-toastify";
import Users from "./pages/dashboard/users/Users";
import AddTeam from "./components/forms/AddTeam";
import NotificationSettings from "./pages/dashboard/Notifications/NotificationSettings";

function App() {
  return (
    <Router>
      <ToastContainer />
      <div className="flex min-h-screen">
        {/* <Sidebar /> */}
        <main className="flex-1 p-0 bg-gray-100">
          <Routes>
            <Route path="/client" element={<AddClient/>} />
            <Route path="/team" element={<AddTeam/>} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashboardLayout />} >
              <Route path="sms-stats" element={<SmsDashboard />} />
              <Route index element={<ProjectsView />} />
              <Route path="projects" element={<ProjectsView />} />
              <Route path="notifications" element={<NotificationSettings />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
