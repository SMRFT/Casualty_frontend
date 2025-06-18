import { useState } from "react"
import styled from "styled-components"
 import axios from 'axios';
import { Search, Plus, ChevronDown, ChevronUp, Info } from "lucide-react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Modal component for search results
const Modal = ({ show, onClose, title, children, footer }) => {
  if (!show) return null

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContainer>
    </ModalOverlay>
  )
}

// Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = true, icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <SectionWrapper>
      <SectionHeader onClick={() => setIsOpen(!isOpen)}>
        {icon && <SectionIcon>{icon}</SectionIcon>}
        <SectionTitle>{title}</SectionTitle>
        {/* {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />} */}
      </SectionHeader>
      {isOpen && <SectionContent>{children}</SectionContent>}
    </SectionWrapper>
  )
}

const PatientRegistrationForm = () => {

   // apiRequest function from Dashboard/ERPatientsBilling
  const apiRequest = async (url, method = 'GET', data = null, headers = {}) => {
    try {
      const token = localStorage.getItem("access_token");

      const defaultHeaders = {
        "Content-Type": "application/json", // Default to JSON, but will be overridden for FormData
        "Authorization": token,
      };

      const config = {
        method,
        url,
        headers: { ...defaultHeaders, ...headers },
        validateStatus: () => true, // Ensure Axios doesn't throw for non-2xx codes
      };

      // Axios automatically handles FormData if you pass it directly as data
      if (data instanceof FormData) {
        config.data = data;
        // Do NOT set Content-Type for FormData, Axios will set it correctly including boundary
        delete config.headers['Content-Type'];
      } else if (data) {
        config.data = data;
      }

      const response = await axios(config);

      if (response.status === 200) {
        return { success: true, data: response.data };
      } else if (response.status === 400) {
        return { success: false, error: 'Invalid data sent to server.', status: 400, data: response.data };
      } else if (response.status === 401) {
        return { success: false, error: 'Session expired. Please log in again.', status: 401, data: response.data };
      } else if (response.status === 404) {
        return { success: false, error: 'Resource not found.', status: 404, data: response.data };
      } else {
        return { success: false, error: response.data?.message || 'Something went wrong. Try again.', status: response.status, data: response.data };
      }
    } catch (error) {
      console.error('Network or unexpected error:', error);
      return { success: false, error: 'Network error or unexpected issue occurred.', networkError: true };
    }
  };
 

  const casualtyBaseUrl = import.meta.env.VITE_BACKEND_CASUALTY_BASE_URL;

  // Patient state - removed patientUHID
  const [patient, setPatient] = useState({
    name: "",
    dob: "",
    age: "",
    gender: "",
    permanentAddress: "",
    area: "",
    zipcode: "",
    city: "",
    state: "",
    email: "",
    mobilePhone: "",
    homePhone: "",
    bloodGroup: "",
    spouseName: "",
    referredBy: "",
    doctorName: "",
    doctorFees: "",
  })

  // Age calculation functions
  const calculateAgeFromDOB = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age >= 0 ? age : ""
  }

  const calculateDOBFromAge = (age) => {
    const today = new Date()
    const birthYear = today.getFullYear() - age
    return new Date(birthYear, today.getMonth(), today.getDate()).toISOString().split("T")[0]
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === "dob") {
      const calculatedAge = calculateAgeFromDOB(value)
      setPatient({ ...patient, dob: value, age: calculatedAge })
    } else if (name === "age") {
      const calculatedDOB = calculateDOBFromAge(value)
      setPatient({ ...patient, age: value, dob: calculatedDOB })
    } else if (type === "checkbox") {
      setPatient({ ...patient, [name]: checked })
    } else {
      setPatient({ ...patient, [name]: value })
    }
  }

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!patient.name.trim()) {
    toast.error("Patient name is required!");
    return;
  }

  try {
    const formData = new FormData();
    Object.keys(patient).forEach((key) => {
      formData.append(key, patient[key]);
    });

    const token = localStorage.getItem("access_token");

    // ✅ Use native fetch instead of apiRequest
    const response = await fetch(`${casualtyBaseUrl}register/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: token,
        // Don't set Content-Type for FormData - browser will set it automatically
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Patient Registered:", data);
      toast.success("Patient Registered Successfully!");
      setPatient({
        name: "",
        dob: "",
        age: "",
        gender: "",
        permanentAddress: "",
        area: "",
        zipcode: "",
        city: "",
        state: "",
        email: "",
        mobilePhone: "",
        homePhone: "",
        bloodGroup: "",
        spouseName: "",
        referredBy: "",
        doctorName: "",
        doctorFees: "",
      });
    } else {
      const errorText = await response.text();
      console.error("Error Response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        toast.error("Error registering patient: " + JSON.stringify(errorData));
      } catch (e) {
        toast.error("Error registering patient. Check console for details.");
      }
    }
  } catch (error) {
    console.error("Network Error:", error);
    toast.error("Failed to connect to the server.");
  }
};

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />


      <MainContentWrapper className="row">
        <div className="col-lg-12">
          <FormContainer>
            <h2>Patient Registration</h2>
            <form onSubmit={handleSubmit}>
              

              <CollapsibleSection title="Personal Information">
              
                <div className="row g-3">
                  {/* Removed patientUHID field */}
                  <div className="col-md-4 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={patient.name} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter patient name"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input 
                        type="date" 
                        id="dob" 
                        name="dob" 
                        value={patient.dob} 
                        onChange={handleChange}
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="age">Age</Label>
                      <Input 
                        type="number" 
                        id="age" 
                        name="age" 
                        value={patient.age} 
                        onChange={handleChange}
                        placeholder="Age"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        id="gender" 
                        name="gender" 
                        value={patient.gender} 
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select 
                        id="bloodGroup" 
                        name="bloodGroup" 
                        value={patient.bloodGroup} 
                        onChange={handleChange}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Select>
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="spouseName">Spouse Name</Label>
                      <Input
                        type="text"
                        id="spouseName"
                        name="spouseName"
                        value={patient.spouseName}
                        onChange={handleChange}
                        placeholder="Spouse name (if applicable)"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="referredBy">Referred By</Label>
                      <Input
                        type="text"
                        id="referredBy"
                        name="referredBy"
                        value={patient.referredBy}
                        onChange={handleChange}
                        placeholder="Referral source"
                      />
                    </InputWrapper>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Address & Contact Information */}
              <CollapsibleSection title="Address & Contact Information">
                <div className="row g-3">
                  <div className="col-12">
                    <InputWrapper>
                      <Label htmlFor="permanentAddress">Permanent Address</Label>
                      <Input
                        type="text"
                        id="permanentAddress"
                        name="permanentAddress"
                        value={patient.permanentAddress}
                        onChange={handleChange}
                        placeholder="Full address"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="area">Area</Label>
                      <Input 
                        type="text" 
                        id="area" 
                        name="area" 
                        value={patient.area} 
                        onChange={handleChange} 
                        placeholder="Area/Locality"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="zipcode">Zipcode</Label>
                      <Input 
                        type="text" 
                        id="zipcode" 
                        name="zipcode" 
                        value={patient.zipcode} 
                        onChange={handleChange} 
                        placeholder="Postal code"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        type="text" 
                        id="city" 
                        name="city" 
                        value={patient.city} 
                        onChange={handleChange} 
                        placeholder="City"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="state">State</Label>
                      <Input 
                        type="text" 
                        id="state" 
                        name="state" 
                        value={patient.state} 
                        onChange={handleChange} 
                        placeholder="State/Province"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={patient.email} 
                        onChange={handleChange} 
                        placeholder="Email address"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="mobilePhone">Mobile Phone</Label>
                      <Input
                        type="text"
                        id="mobilePhone"
                        name="mobilePhone"
                        value={patient.mobilePhone}
                        onChange={handleChange}
                        placeholder="Mobile number"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="homePhone">Home Phone</Label>
                      <Input
                        type="text"
                        id="homePhone"
                        name="homePhone"
                        value={patient.homePhone}
                        onChange={handleChange}
                        placeholder="Home phone"
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="doctorName">Doctor Name</Label>
                      <Input
                        type="text"
                        id="doctorName"
                        name="doctorName"
                        value={patient.doctorName}
                        onChange={handleChange}
                        placeholder="Attending doctor"
                      />
                    </InputWrapper>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Payment Information */}
              <CollapsibleSection title="Payment Information">
                <div className="row g-3">
                  <div className="col-md-3 col-sm-6">
                    <InputWrapper>
                      <Label htmlFor="doctorFees">Doctor Fees</Label>
                      <Input
                        type="text"
                        id="doctorFees"
                        name="doctorFees"
                        value={patient.doctorFees}
                        onChange={handleChange}
                        placeholder="Doctor fees"
                      />
                    </InputWrapper>
                  </div>
                </div>
              </CollapsibleSection>
              
          
                <button type="submit" primary>
                  Save Patient
                </button>

              
            </form>
          </FormContainer>
        </div>
      </MainContentWrapper>
    </div>
  )
}

// Styled Components
const PageContainer = styled.div`
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
`

const PageHeader = styled.header`
  margin-bottom: 20px;
  padding: 15px 0;
  border-bottom: 2px solid #15616d;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`

const PageTitle = styled.h1`
  color: #15616d;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin: 0;
`

const MainContentWrapper = styled.div`
  justify-content: center;
`

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow: hidden;
  margin-bottom: 20px;
`



const SectionWrapper = styled.div`
  margin-bottom: 20px;
  border: 1px solid rgba(21, 97, 109, 0.2);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 18px;
  background-color: rgba(21, 97, 109, 0.05);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(21, 97, 109, 0.1);
  }
`

const SectionIcon = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
`

const SectionTitle = styled.h3`
  text-align: center;
  margin-bottom: 20px;
  color: #533527;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(21, 97, 109, 0.2);
`

const SectionContent = styled.div`
  padding: 20px;
  background-color: white;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
  width: 100%;
  
  &:focus {
    border-color: #15616d;
    box-shadow: 0 0 0 2px rgba(21, 97, 109, 0.2);
    outline: none;
  }
  
  &:disabled, &[readonly] {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: white;
  width: 100%;
  
  &:focus {
    border-color: #15616d;
    box-shadow: 0 0 0 2px rgba(21, 97, 109, 0.2);
    outline: none;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`

const Button = styled.button`
  padding: ${(props) => (props.small ? "8px 14px" : "12px 24px")};
  background: ${(props) => (props.primary ? "#15616d" : "white")};
  color: ${(props) => (props.primary ? "white" : "#15616d")};
  border: ${(props) => (props.primary ? "none" : "1px solid #15616d")};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(props) => (props.primary ? "#1d7686" : "rgba(21, 97, 109, 0.1)")};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
`

const ModalTitle = styled.h3`
  margin: 0;
  color: #15616d;
  font-size: 18px;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`

const ModalBody = styled.div`
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
`

const ModalFooter = styled.div`
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`

export default PatientRegistrationForm