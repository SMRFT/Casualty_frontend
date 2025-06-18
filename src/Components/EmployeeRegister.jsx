// EmployeeRegister.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // axios is still needed for the apiRequest function itself
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Styled Components (remain unchanged) ---
const Container = styled.div`
  width: 400px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 10px;
  background: #f4f4f4;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-top: 10px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #45a049;
  }
`;

// --- EmployeeRegister Component ---
const EmployeeRegister = () => {
  const [formData, setFormData] = useState({
    empid: '',
    name: '',
    role: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const casualtyBaseUrl = import.meta.env.VITE_BACKEND_CASUALTY_BASE_URL;

  // apiRequest function - copied directly from Dashboard.jsx
  const apiRequest = async (url, method = 'GET', data = null, headers = {}) => {
    try {
      const token = localStorage.getItem("access_token");

      const defaultHeaders = {
        "Content-Type": "application/json",
        "Authorization": token,
      };

      const config = {
        method,
        url,
        headers: { ...defaultHeaders, ...headers },
        validateStatus: () => true, // Ensure Axios doesn't throw for non-2xx codes
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'GET')) {
        config.data = data;
      }

      const response = await axios(config);

      if (response.status === 200) {
        return { success: true, data: response.data };
      } else if (response.status === 400) {
        return { success: false, error: 'Invalid data sent to server.', status: 400, data: response.data };
      } else if (response.status === 401) {
        return { success: false, error: 'Session expired. Please log in again.', status: 401, data: response.data };
      } else {
        return { success: false, error: 'Something went wrong. Try again.', status: response.status, data: response.data };
      }
    } catch (error) {
      console.error('Network or unexpected error:', error);
      return { success: false, error: 'Network error or unexpected issue occurred.', networkError: true };
    }
  };
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // Use apiRequest for the POST call
      const response = await apiRequest(`${casualtyBaseUrl}employeeregister/`, 'POST', formData);

      if (response.success) {
        toast.success('Employee registered successfully!');
        setFormData({ empid: '', name: '', role: '', email: '', password: '', confirmPassword: '' });
      } else {
        // Handle specific error messages from the backend if available, or a generic one
        toast.error(response.error || 'Registration failed');
        console.error('API Error:', response.data || response.error);
      }
    } catch (error) {
      toast.error('Network error or unexpected issue occurred during registration.');
      console.error('Catch block error:', error);
    }
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Title>Employee Register</Title>
      <Form onSubmit={handleSubmit}>
        <Label>ID</Label>
        <Input name="empid" value={formData.empid} onChange={handleChange} required />
        
        <Label>Name</Label>
        <Input name="name" value={formData.name} onChange={handleChange} required />
        
        <Label>Role</Label>
        <Select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="Nurse">Nurse</option>
          <option value="Admin">Admin</option>
          <option value="Receptionist">Receptionist</option>
        </Select>
        
        <Label>Email</Label>
        <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
        
        <Label>Password</Label>
        <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
        
        <Label>Confirm Password</Label>
        <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        
        <Button type="submit">Register</Button>
      </Form>
    </Container>
  );
};

export default EmployeeRegister;