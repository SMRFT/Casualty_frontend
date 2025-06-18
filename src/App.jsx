import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import PatientForm from "./Components/PatientForm";
import Sidebar from "./Components/Sidebar";
import GlobalStyle from "./Components/GlobalStyle";
import Dashboard from "./Components/Dashboard";
import PatientRegistrationForm from "./Components/PatientRegistrationForm";
import EmployeeRegister from "./Components/EmployeeRegister";

import PatientList from "./Components/PatientList";
import PrintBill from "./Components/PrintBill";
import DailyPatientList from "./Components/DailyPatientList";

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
         
          <Route path={`${baseUrl}/PatientForm`} element={ <PatientForm /> } />
          <Route path={`${baseUrl}/Dashboard`} element={ <Dashboard />}/>
          <Route path={`${baseUrl}/PatientRegistrationForm`} element={ <PatientRegistrationForm /> } />
          <Route path={`${baseUrl}/EmployeeRegister`} element={<EmployeeRegister />} />
          <Route path={`${baseUrl}/PatientList`} element={<PatientList />} />
          <Route path={`${baseUrl}/PrintBill`} element={<PrintBill />} />
           <Route path={`${baseUrl}/DailyPatientList`} element={<DailyPatientList />} />
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
