// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaFileInvoiceDollar,
  FaChartLine,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaClinicMedical
} from "react-icons/fa";
import { toast } from 'react-toastify';

// Overlay for mobile to capture clicks outside sidebar
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 900;
  opacity: ${(props) => (props.open ? 1 : 0)};
  visibility: ${(props) => (props.open ? "visible" : "hidden")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const SidebarContainer = styled.div`
  width: 200px;
  background: linear-gradient(135deg, #A47864 0%, #F8F6F2 100%);
  height: 100vh;
  position: fixed;
  transition: transform 0.3s ease;
  z-index: 1000;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 200px;
    transform: ${(props) => (props.open ? "translateX(0)" : "translateX(-100%)")};
  }
`;

const Logo = styled.div`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #533527;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  
  svg {
    font-size: 28px;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 15px;
  left: 15px;
  background: #A47864;
  color: white;
  border: none;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 22px;
  z-index: 1100;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #533527;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
`;

const SidebarItem = styled.li`
  margin: 5px 10px;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? "rgba(255, 255, 255, 0.2)" : "transparent")};
  transition: background-color 0.2s ease;

  a {
    color: ${(props) => (props.active ? "#533527" : "white")};
    text-decoration: none;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    font-weight: ${(props) => (props.active ? "600" : "400")};
    
    svg {
      font-size: 18px;
    }
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    
    a {
      color: #533527;
    }
  }
`;

const LogoutContainer = styled.div`
  margin: 20px 10px;
`;

const LogoutButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: white;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  
  &:hover {
    background-color: rgba(231, 76, 60, 0.8);
    
    svg {
      transform: translateX(3px);
    }
  }
  
  svg {
    font-size: 18px;
    transition: transform 0.2s ease;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 10px;
`;

const Footer = styled.div`
  padding: 15px;
  font-size: 12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
`;

const Sidebar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 769);
  const location = useLocation();
  const navigate = useNavigate();

  const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") || ""; // Remove trailing slash if present

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const closeSidebar = () => {
    if (window.innerWidth < 769) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 769) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Close sidebar on route change for mobile
  useEffect(() => {
    if (window.innerWidth < 769) {
      closeSidebar();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    // If you have any logout logic (clearing local storage, etc.), add it here
    if (typeof onLogout === 'function') {
      onLogout();
    }
    
    toast.info("Logged out successfully");
    navigate(`${baseUrl}/`);
  };

  return (
    <>
      <ToggleButton onClick={toggleSidebar} aria-label="Toggle navigation">
        {isOpen ? <FaTimes /> : <FaBars />}
      </ToggleButton>
      
      <Overlay open={isOpen} onClick={closeSidebar} />

      <SidebarContainer open={isOpen}>
        <div>
          <Logo>
            <FaClinicMedical />
            <span>MedPortal</span>
          </Logo>
          
          <SidebarList>
            <SidebarItem active={location.pathname === `${baseUrl}/PatientRegistrationForm`}>
              <Link to={`${baseUrl}/PatientRegistrationForm`} onClick={closeSidebar}>
                <FaFileInvoiceDollar />
                Registration 
              </Link>
            </SidebarItem>
            
            <SidebarItem active={location.pathname === `${baseUrl}/PatientForm`}>
              <Link to={`${baseUrl}/PatientForm`} onClick={closeSidebar}>
                <FaUserPlus />
                Casualty Form
              </Link>
            </SidebarItem>
            
            <SidebarItem active={location.pathname === `${baseUrl}/Dashboard`}>
              <Link to={`${baseUrl}/Dashboard`} onClick={closeSidebar}>
                <FaChartLine />
                Dashboard
              </Link>
            </SidebarItem>
          </SidebarList>
        </div>
        
        <div>
          <Divider />
          <LogoutContainer>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </LogoutButton>
          </LogoutContainer>
          <Footer>© {new Date().getFullYear()} MedPortal</Footer>
        </div>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;