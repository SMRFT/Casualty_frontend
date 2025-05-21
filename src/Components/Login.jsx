import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserAlt, FaLock, FaSignInAlt, FaHospitalUser } from 'react-icons/fa';


// Responsive container with media queries
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* use 100vh instead of 90vh */
  background: linear-gradient(135deg, #A47864 0%, #F8F6F2 100%);
  position: relative;
  width: 100%;
`;


const Container = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 40px 30px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    max-width: 90%;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 10px;
  color: #333;
  font-size: 28px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
  font-size: 16px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 14px 14px 45px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  transition: all 0.3s;
  background-color: #f9f9f9;
  
  &:focus {
    border-color: #5C403C;
    background-color: #fff;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    outline: none;
  }
  
  @media (max-width: 768px) {
    padding: 12px 12px 12px 40px;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  transition: color 0.3s;
  
  ${Input}:focus + & {
    color: #5C403C;
  }
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 16px;
  background: linear-gradient(to right, #5C403C,rgb(105, 96, 95));
  color: white;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
 
  &:active {
    transform: translateY(0);
  }
  
  svg {
    margin-right: 8px;
  }
  
  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const Error = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  padding: 10px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 5px;
  text-align: center;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const IconCircle = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: rgba(94, 159, 238, 0.1);
  border-radius: 50%;
  position: relative;
  margin-bottom: 15px;
  
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background-color: rgba(74, 144, 226, 0.2);
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }
  
  svg {
    font-size: 40px;
    color: #5C403C;
  }
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    
    svg {
      font-size: 35px;
    }
  }
`;



const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ empid: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const casualtyBaseUrl = import.meta.env.VITE_BACKEND_CASUALTY_BASE_URL || "/api/casualty/";
  const baseUrl = (import.meta.env.BASE_URL || "").replace(/\/$/, ""); // Remove trailing slash if present

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${casualtyBaseUrl}login/`, formData);
      toast.success("Login successful!");
      onLogin?.(); // Notify parent component if onLogin is provided
      navigate(`${baseUrl}/PatientRegistrationForm`); // Redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      toast.error("Login failed");
    }
  };

  return (
    <PageWrapper>

      <Container>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        
        <LogoContainer>
          <IconCircle>
            <FaHospitalUser />
          </IconCircle>
          <Title>CASUALTY DEPARTMENT</Title>
             </LogoContainer>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Employee ID</Label>
            <InputWrapper>
              <Input
                name="empid"
                value={formData.empid}
                onChange={handleChange}
                placeholder="Enter your employee ID"
                required
              />
              <IconWrapper>
                <FaUserAlt />
              </IconWrapper>
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <InputWrapper>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <IconWrapper>
                <FaLock />
              </IconWrapper>
            </InputWrapper>
          </InputGroup>

          {error && <Error>{error}</Error>}

          <Button type="submit">
            <FaSignInAlt />
            Sign In
          </Button>
        </Form>
      </Container>
    </PageWrapper>
  );
};

export default Login;