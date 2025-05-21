import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 90vh;
    background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 3rem 1.5rem;
  align-items: center;
  overflow: hidden;
  margin-bottom: 20px;
`;

const Header = styled.div`
  width: 90%;
  max-width: 900px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #1a202c;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const DatePickerWrapper = styled.div`
  position: relative;
  margin-bottom: 2.5rem;
  width: 100%;
  max-width: 250px;
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const CalendarIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #4a5568;
  &:before {
    content: "📅";
    font-size: 18px;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 90%;
  max-width: 900px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-right: 1rem;
  background: ${props => props.bgColor || '#ebf8ff'};
  font-size: 20px;
`;

const CardTitle = styled.h3`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const Stat = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${props => props.color || '#2b6cb0'};
  margin-bottom: 0.75rem;
`;

const StatSubtext = styled.p`
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
`;

const BillList = styled.ul`
  list-style: none;
  padding: 0;
`;

const BillItem = styled.li`
  background: #f7fafc;
  margin: 0.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #edf2f7;
  }
`;

const BillType = styled.span`
  font-weight: 500;
  color: #2d3748;
  display: flex;
  align-items: center;
`;

const BillTypeIcon = styled.span`
  display: inline-block;
  margin-right: 8px;
  color: #4a5568;
  &:before {
    content: "📄";
    font-size: 16px;
  }
`;

const BillCount = styled.span`
  font-weight: 600;
  color: #2b6cb0;
  background: #ebf8ff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const NoDataMessage = styled.p`
  color: #a0aec0;
  text-align: center;
  font-style: italic;
  padding: 1.5rem 0;
`;

const Dashboard = () => {
  const casualtyBaseUrl = import.meta.env.VITE_BACKEND_CASUALTY_BASE_URL;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalPatients, setTotalPatients] = useState(0);
  const [billTypeCounts, setBillTypeCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData(selectedDate);
  }, [selectedDate]);

  const fetchPatientData = async (date) => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const res = await axios.get(`${casualtyBaseUrl}dashboard/?billDate=${formattedDate}`);
      const patients = res.data;

      setTotalPatients(patients.length);

      const counts = {};
      patients.forEach((patient) => {
        const billType = patient.billType || 'Unknown';
        counts[billType] = (counts[billType] || 0) + 1;
      });
      setBillTypeCounts(counts);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setTotalPatients(0);
      setBillTypeCounts({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h2>Patient Dashboard</h2>
        <Subtitle>Monitor patient statistics and billing information</Subtitle>
        
        <DatePickerWrapper>
          <CalendarIcon />
          <StyledDatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
            maxDate={new Date()}
          />
        </DatePickerWrapper>
      </Header>

      <DashboardGrid>
        <Card>
          <CardHeader>
            <IconWrapper bgColor="#e6fffa">
              👤
            </IconWrapper>
            <CardTitle>Total Patients</CardTitle>
          </CardHeader>
          <Stat color="#0694a2">{loading ? '...' : totalPatients}</Stat>
          <StatSubtext>Patients registered on {format(selectedDate, 'MMMM d, yyyy')}</StatSubtext>
        </Card>

        <Card>
          <CardHeader>
            <IconWrapper bgColor="#ebf8ff">
              📊
            </IconWrapper>
            <CardTitle>Bill Type Distribution</CardTitle>
          </CardHeader>
          
          {loading ? (
            <NoDataMessage>Loading data...</NoDataMessage>
          ) : Object.keys(billTypeCounts).length === 0 ? (
            <NoDataMessage>No billing data available for the selected date.</NoDataMessage>
          ) : (
            <BillList>
              {Object.entries(billTypeCounts).map(([billType, count]) => (
                <BillItem key={billType}>
                  <BillType>
                    <BillTypeIcon />
                    {billType}
                  </BillType>
                  <BillCount>{count}</BillCount>
                </BillItem>
              ))}
            </BillList>
          )}
        </Card>
      </DashboardGrid>
    </Container>
  );
};

export default Dashboard;