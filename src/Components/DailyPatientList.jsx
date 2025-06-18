"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { toast } from "react-toastify"
import axios from "axios"

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`

// Styled Components
const ListContainer = styled.div`
  max-width: 1400px;
  margin: 20px auto;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    z-index: 0;
  }
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`

const ListHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`

const MainTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #fff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const SubTitle = styled.p`
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
`

const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 25px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  min-width: 120px;
`

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 5px;
`

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`

const SearchContainer = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
`

const SearchInput = styled.input`
  padding: 15px 25px;
  border: none;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  outline: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    background: white;
  }
  
  &::placeholder {
    color: #666;
  }
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  animation: ${fadeIn} 0.6s ease-out;
`

const PatientCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    animation: ${pulse} 0.3s ease;
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f4f8;
`

const ERNumber = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`

const PatientName = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  text-transform: capitalize;
`

const CardDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`

const CardDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const DetailLabel = styled.span`
  font-size: 0.8rem;
  color: #8e9aaf;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const DetailValue = styled.span`
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
`

const GenderBadge = styled.span`
  background: ${(props) => (props.gender === "Male" ? "#e3f2fd" : props.gender === "Female" ? "#fce4ec" : "#f3e5f5")};
  color: ${(props) => (props.gender === "Male" ? "#1976d2" : props.gender === "Female" ? "#c2185b" : "#7b1fa2")};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const NoDataMessage = styled.div`
  text-align: center;
  color: white;
  padding: 60px 20px;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const NoDataIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
`

const DailyPatientList = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const casualtyBaseUrl = import.meta.env.VITE_BACKEND_CASUALTY_BASE_URL

  // Centralized API call logic
  const apiRequest = async (url, method = "GET", data = null, headers = {}) => {
    try {
      const token = localStorage.getItem("access_token")
      const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      }
      const config = {
        method,
        url,
        headers: { ...defaultHeaders, ...headers },
        validateStatus: () => true,
      }

      if (data && method === "GET") {
        config.params = data
      } else if (data && (method === "POST" || method === "PUT")) {
        config.data = data
      }

      const response = await axios(config)

      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data }
      } else if (response.status === 401) {
        toast.error("Session expired. Please log in again.")
        return { success: false, error: "Session expired. Please log in again.", status: 401, data: response.data }
      } else {
        return {
          success: false,
          error: response.data?.message || "Something went wrong. Try again.",
          status: response.status,
          data: response.data,
        }
      }
    } catch (error) {
      console.error("Network or unexpected error in apiRequest:", error)
      return { success: false, error: "Network error or unexpected issue occurred.", networkError: true }
    }
  }

  useEffect(() => {
    const fetchDailyPatients = async () => {
      setLoading(true)
      const today = new Date().toISOString().split("T")[0]
      console.log(`Fetching patients for date: ${today}`)

      const response = await apiRequest(`${casualtyBaseUrl}searchernumber/`, "GET", { date: today })

      if (response.success) {
        setPatients(response.data)
        setFilteredPatients(response.data)
        console.log("Fetched daily patients:", response.data)
      } else {
        toast.error(`Failed to fetch daily patient data: ${response.error}`)
        console.error("Error fetching daily patients:", response.error)
      }
      setLoading(false)
    }

    fetchDailyPatients()
  }, [casualtyBaseUrl])

  // Filter patients based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPatients(patients)
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.erNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPatients(filtered)
    }
  }, [searchTerm, patients])

  const handlePatientSelect = (patient) => {
    // Navigate to patient form with patient data via state (cleaner than URL params)
    navigate(`${import.meta.env.BASE_URL}/PatientForm`, {
      state: { patientData: patient },
    })

    toast.success(`Navigating to form for: ${patient.name}`, {
      position: "top-center",
      autoClose: 2000,
    })
  }

  const getTodayStats = () => {
    const totalPatients = patients.length
    const maleCount = patients.filter((p) => p.gender === "Male").length
    const femaleCount = patients.filter((p) => p.gender === "Female").length

    return { totalPatients, maleCount, femaleCount }
  }

  const stats = getTodayStats()

  if (loading) {
    return (
      <ListContainer>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        </ContentWrapper>
      </ListContainer>
    )
  }

  return (
    <ListContainer>
      <ContentWrapper>
        <ListHeader>
          <MainTitle>Today's Patients</MainTitle>
          <SubTitle>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </SubTitle>
        </ListHeader>

        <StatsBar>
          <StatItem>
            <StatNumber>{stats.totalPatients}</StatNumber>
            <StatLabel>Total Patients</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.maleCount}</StatNumber>
            <StatLabel>Male</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.femaleCount}</StatNumber>
            <StatLabel>Female</StatLabel>
          </StatItem>
        </StatsBar>

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="🔍 Search by name, ER number, bill number, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        {filteredPatients.length > 0 ? (
          <CardGrid>
            {filteredPatients.map((patient) => (
              <PatientCard key={patient._id?.$oid || patient.erNumber} onClick={() => handlePatientSelect(patient)}>
                <CardHeader>
                  <PatientName>{patient.name}</PatientName>
                  <ERNumber>ER: {patient.erNumber}</ERNumber>
                </CardHeader>

                <CardDetails>
                  <CardDetail>
                    <DetailLabel>Bill Number</DetailLabel>
                    <DetailValue>{patient.billNumber}</DetailValue>
                  </CardDetail>

                  <CardDetail>
                    <DetailLabel>Doctor</DetailLabel>
                    <DetailValue>{patient.doctorName}</DetailValue>
                  </CardDetail>

                  <CardDetail>
                    <DetailLabel>Age</DetailLabel>
                    <DetailValue>{patient.age} years</DetailValue>
                  </CardDetail>

                  <CardDetail>
                    <DetailLabel>Gender</DetailLabel>
                    <DetailValue>
                      <GenderBadge gender={patient.gender}>{patient.gender}</GenderBadge>
                    </DetailValue>
                  </CardDetail>
                </CardDetails>
              </PatientCard>
            ))}
          </CardGrid>
        ) : (
          <NoDataMessage>
            <NoDataIcon>🏥</NoDataIcon>
            <div>{searchTerm ? `No patients found matching "${searchTerm}"` : "No patients registered today"}</div>
          </NoDataMessage>
        )}
      </ContentWrapper>
    </ListContainer>
  )
}

export default DailyPatientList
