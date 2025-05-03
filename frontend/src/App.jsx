import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SmsDashboard from "./components/SmsDashboard";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProjectForm from "./components/NewProjectForm";
import Leads from "./pages/Leads";
import NewLeadForm from "./components/NewLeadForm";
import HomePage from "./pages/HomePage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-6 bg-gray-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/stats" element={<SmsDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/new" element={<NewLeadForm />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<NewProjectForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
