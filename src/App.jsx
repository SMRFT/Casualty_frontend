import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import PatientForm from "./Components/PatientForm";
import Sidebar from "./Components/Sidebar";
import GlobalStyle from "./Components/GlobalStyle";
import Dashboard from "./Components/Dashboard";
import PatientRegistrationForm from "./Components/PatientRegistrationForm";
import EmployeeRegister from "./Components/EmployeeRegister";
import Login from "./Components/Login"; // Login component

// Wrapper for conditional Sidebar display
const AppContent = () => {
  const location = useLocation();
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  const hideSidebarPaths = [`${baseUrl}/`, `${baseUrl}/login`];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <>
      <GlobalStyle />
      {showSidebar && <Sidebar />}
      <div style={{ marginLeft: showSidebar && window.innerWidth > 768 ? "200px" : "0", padding: "20px" }}>
        <Routes>
          <Route path={`${baseUrl}/`} element={<Navigate to={`${baseUrl}/login`} />} />
          <Route path={`${baseUrl}/login`} element={<Login />} />
          <Route path={`${baseUrl}/PatientForm`} element={ <PatientForm /> } />
          <Route path={`${baseUrl}/Dashboard`} element={ <Dashboard />}/>
          <Route path={`${baseUrl}/PatientRegistrationForm`} element={ <PatientRegistrationForm /> } />
          <Route path={`${baseUrl}/EmployeeRegister`} element={<EmployeeRegister />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
