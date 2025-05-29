"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { Calendar, Users, FileText, UserCheck, DollarSign } from "lucide-react"
import Table from "react-bootstrap/Table"

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
  padding: 2rem;
`

const DashboardWrapper = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`

const Title = styled.h1`
  color: #1a202c;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Subtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`

const DateInput = styled.input`
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  background: white;
  position: relative;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
`

const CalendarIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  color: #667eea;
  z-index: 1;
  margin-left: -2.5rem;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: ${(props) => props.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`

const StatIcon = styled.div`
  margin-right: 0.75rem;
  opacity: 0.9;
`

const StatTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
`

const StatSubtext = styled.p`
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.8;
  position: relative;
  z-index: 1;
`

const TablesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

const TableSection = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
`

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
`

const SectionIcon = styled.div`
  margin-right: 0.75rem;
  color: #667eea;
`

const StyledTable = styled(Table)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 0;
`

const Th = styled.th`
  background: #f8fafc;
  color: #2d3748;
  font-weight: 600;
  padding: 1rem;
  border: none;
  text-align: left;
  font-size: 1rem;
`

const Td = styled.td`
  padding: 1rem;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
  font-size: 0.95rem;
`

const Tr = styled.tr`
  &:hover {
    background-color: #f7fafc;
  }
  
  &:last-child td {
    border-bottom: none;
  }
`

const ProcedureName = styled.div`
  font-weight: 500;
  color: #2d3748;
`

const DoctorName = styled.div`
  font-weight: 500;
  color: #2d3748;
  display: flex;
  align-items: center;
`

const DoctorIcon = styled.span`
  margin-right: 0.5rem;
  font-size: 1.1rem;
`

const CountBadge = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
  min-width: 40px;
  text-align: center;
`

const AmountBadge = styled.div`
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
  min-width: 60px;
  text-align: center;
`

const NoDataCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  color: #a0aec0;
  grid-column: 1 / -1;
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const Dashboard = () => {
  const casualtyBaseUrl = import.meta.env?.VITE_BACKEND_CASUALTY_BASE_URL || "https://api.example.com/"
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [totalPatients, setTotalPatients] = useState(0)
  const [procedureCounts, setProcedureCounts] = useState({})
  const [doctorTotals, setDoctorTotals] = useState({})
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPatientData(selectedDate)
  }, [selectedDate])

  const parseBillTypeData = (rawData) => {
    const procedureCounts = {}
    const doctorTotals = {}
    let totalRevenue = 0

    rawData.forEach((item) => {
      try {
        // Handle doctor totals
        const doctorName = item.doctorName || "Unknown Doctor"
        const amount = Number.parseFloat(item.totalAmount || item.discountedAmount || 0)

        doctorTotals[doctorName] = (doctorTotals[doctorName] || 0) + amount
        totalRevenue += amount

        // Handle billType parsing - it's double-escaped JSON
        let procedures = []

        if (typeof item.billType === "string") {
          try {
            // First, parse the outer quotes
            let cleanedBillType = item.billType

            // Remove outer quotes if they exist
            if (cleanedBillType.startsWith('"') && cleanedBillType.endsWith('"')) {
              cleanedBillType = cleanedBillType.slice(1, -1)
            }

            // Unescape the JSON string
            cleanedBillType = cleanedBillType.replace(/\\"/g, '"').replace(/\\\\/g, "\\")

            // Parse the JSON array
            procedures = JSON.parse(cleanedBillType)
          } catch (parseError) {
            console.error("Error parsing billType:", parseError, item.billType)
            // Fallback for unparseable data
            procedures = [{ procedure: item.billType }]
          }
        } else if (Array.isArray(item.billType)) {
          procedures = item.billType
        } else if (item.billType && typeof item.billType === "object") {
          procedures = [item.billType]
        }

        // Count each procedure
        procedures.forEach((proc) => {
          const procedureName = proc.procedure || "Unknown Procedure"
          procedureCounts[procedureName] = (procedureCounts[procedureName] || 0) + 1
        })
      } catch (error) {
        console.error("Error parsing patient data:", error, item)
        // Fallback for unparseable data
        const fallbackName = item.billType || "Unknown"
        procedureCounts[fallbackName] = (procedureCounts[fallbackName] || 0) + 1

        const doctorName = item.doctorName || "Unknown Doctor"
        const amount = Number.parseFloat(item.totalAmount || 0)
        doctorTotals[doctorName] = (doctorTotals[doctorName] || 0) + amount
        totalRevenue += amount
      }
    })

    return { procedureCounts, doctorTotals, totalRevenue }
  }

  const fetchPatientData = async (date) => {
    setLoading(true)
    try {
      const response = await fetch(`${casualtyBaseUrl}dashboard/?billDate=${date}`)
      const patients = await response.json()

      setTotalPatients(patients.length)
      const { procedureCounts, doctorTotals, totalRevenue } = parseBillTypeData(patients)
      setProcedureCounts(procedureCounts)
      setDoctorTotals(doctorTotals)
      setTotalRevenue(totalRevenue)
    } catch (error) {
      console.error("Error fetching patient data:", error)
      // Mock data for demonstration
      const mockProcedures = {
        "I&D (INCISION AND DRAINAGE)": 1,
        "FNAC BIOPSY": 1,
        "ASCITIC TAPPING": 1,
        CONSULTATION: 5,
        "EMERGENCY TREATMENT": 3,
      }
      const mockDoctors = {
        "Dr. Prabhu Sankar": 2400,
        "Dr. Rajesh Kumar": 1800,
        "Dr. Priya Sharma": 3200,
        "Dr. Arun Patel": 1500,
      }
      setProcedureCounts(mockProcedures)
      setDoctorTotals(mockDoctors)
      setTotalPatients(Object.values(mockProcedures).reduce((a, b) => a + b, 0))
      setTotalRevenue(Object.values(mockDoctors).reduce((a, b) => a + b, 0))
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const totalProcedures = Object.keys(procedureCounts).length
  const totalDoctors = Object.keys(doctorTotals).length

  return (
    <Container>
      <DashboardWrapper>
        <Header>
          <Title>Patient Dashboard</Title>
          <Subtitle>Monitor patient statistics and billing information</Subtitle>

          <DatePickerWrapper>
            <CalendarIconWrapper>
              <Calendar size={20} />
            </CalendarIconWrapper>
            <DateInput
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </DatePickerWrapper>
        </Header>

        <StatsGrid>
          <StatCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <StatHeader>
              <StatIcon>
                <Users size={24} />
              </StatIcon>
              <StatTitle>Total Patients</StatTitle>
            </StatHeader>
            <StatValue>{loading ? <LoadingSpinner /> : totalPatients}</StatValue>
            <StatSubtext>Registered on {formatDate(selectedDate)}</StatSubtext>
          </StatCard>

          <StatCard gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <StatHeader>
              <StatIcon>
                <FileText size={24} />
              </StatIcon>
              <StatTitle>Procedures</StatTitle>
            </StatHeader>
            <StatValue>{loading ? <LoadingSpinner /> : totalProcedures}</StatValue>
            <StatSubtext>Different procedure types</StatSubtext>
          </StatCard>

          <StatCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <StatHeader>
              <StatIcon>
                <UserCheck size={24} />
              </StatIcon>
              <StatTitle>Active Doctors</StatTitle>
            </StatHeader>
            <StatValue>{loading ? <LoadingSpinner /> : totalDoctors}</StatValue>
            <StatSubtext>Doctors with patients today</StatSubtext>
          </StatCard>

          <StatCard gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <StatHeader>
              <StatIcon>
                <DollarSign size={24} />
              </StatIcon>
              <StatTitle>Total Revenue</StatTitle>
            </StatHeader>
            <StatValue>{loading ? <LoadingSpinner /> : formatCurrency(totalRevenue)}</StatValue>
            <StatSubtext>Revenue for {formatDate(selectedDate)}</StatSubtext>
          </StatCard>
        </StatsGrid>

        <TablesContainer>
          <TableSection>
            <SectionTitle>
              <SectionIcon>
                <FileText />
              </SectionIcon>
              Bill Type Summary
            </SectionTitle>
            {loading ? (
              <NoDataCard>
                <LoadingSpinner /> Loading...
              </NoDataCard>
            ) : Object.keys(procedureCounts).length === 0 ? (
              <NoDataCard>No procedures available for the selected date.</NoDataCard>
            ) : (
              <StyledTable striped bordered hover>
                <thead>
                  <tr>
                    <Th>Procedure</Th>
                    <Th>Count</Th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(procedureCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([procedure, count]) => (
                      <Tr key={procedure}>
                        <Td>
                          <ProcedureName>{procedure}</ProcedureName>
                        </Td>
                        <Td>
                          <CountBadge>{count}</CountBadge>
                        </Td>
                      </Tr>
                    ))}
                </tbody>
              </StyledTable>
            )}
          </TableSection>

          <TableSection>
            <SectionTitle>
              <SectionIcon>
                <UserCheck />
              </SectionIcon>
              Doctor Revenue Summary
            </SectionTitle>
            {loading ? (
              <NoDataCard>
                <LoadingSpinner /> Loading...
              </NoDataCard>
            ) : Object.keys(doctorTotals).length === 0 ? (
              <NoDataCard>No doctor data available for the selected date.</NoDataCard>
            ) : (
              <StyledTable striped bordered hover>
                <thead>
                  <tr>
                    <Th>Doctor Name</Th>
                    <Th>Total Amount</Th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(doctorTotals)
                    .sort(([, a], [, b]) => b - a)
                    .map(([doctor, total]) => (
                      <Tr key={doctor}>
                        <Td>
                          <DoctorName>
                            <DoctorIcon>👨‍⚕️</DoctorIcon>
                            {doctor}
                          </DoctorName>
                        </Td>
                        <Td>
                          <AmountBadge>{formatCurrency(total)}</AmountBadge>
                        </Td>
                      </Tr>
                    ))}
                </tbody>
              </StyledTable>
            )}
          </TableSection>
        </TablesContainer>
      </DashboardWrapper>
    </Container>
  )
}

export default Dashboard
