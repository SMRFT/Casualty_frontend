import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaDownload } from 'react-icons/fa'; 

// Styled Components (keep them as they are)
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const DateInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;

  th, td {
    border: 1px solid #dee2e6;
    padding: 0.75rem;
    text-align: left;
  }

  thead {
    background-color: #5C403C;
    color: white;
  }

  tfoot {
    background-color: #f8f9fa;
    font-weight: bold;
  }
`;

const NoData = styled.tr`
  td {
    text-align: center;
    color: #888;
    padding: 1rem;
  }
`;

const ProcedureCell = styled.td`
  max-width: 300px;
  word-wrap: break-word;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const PatientList = () => {
  const casualtyBaseUrl = import.meta.env.VITE_BACKEND_CASUALTY_BASE_URL;
  const [patients, setPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state

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

  useEffect(() => {
    fetchPatients(selectedDate);
  }, [selectedDate]);

  const fetchPatients = async (date) => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear previous errors
    try {
      // Use apiRequest instead of direct axios call
      const response = await apiRequest(`${casualtyBaseUrl}patients-by-date/?billDate=${date}`);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch patient data');
      }

      setPatients(response.data);

      const totalAmount = response.data.reduce((sum, p) => {
        const amount = parseFloat(p.totalAmount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      setTotal(totalAmount);
    } catch (err) {
      console.error('Error fetching patients:', err.message);
      setError(err.message || 'Failed to fetch patient data'); // Set the error state
      setPatients([]); // Clear patients on error
      setTotal(0); // Reset total on error
    } finally {
      setLoading(false); // Set loading to false after fetch (success or error)
    }
  };

  // Helper function to format procedures for display
  const formatProceduresForDisplay = (procedures) => {
    if (!procedures) return 'N/A';
    
    try {
      // If it's already a string, try to parse it
      const procedureData = typeof procedures === 'string' ? JSON.parse(procedures) : procedures;
      
      // If it's an array, format it as readable text
      if (Array.isArray(procedureData)) {
        return procedureData.map(proc => 
          `${proc.procedure || 'Unknown'} - Qty: ${proc.qty || 0}, Rate: ₹${proc.rate || 0}, Total: ₹${proc.total || 0}`
        ).join('\n');
      }
      
      // If it's an object, format it
      return `${procedureData.procedure || 'Unknown'} - Qty: ${procedureData.qty || 0}, Rate: ₹${procedureData.rate || 0}, Total: ₹₹${procedureData.total || 0}`;
    } catch (error) {
      // If parsing fails, return as string
      return procedures.toString();
    }
  };

  // Helper function to format procedures for CSV export
  const formatProceduresForCSV = (procedures) => {
    if (!procedures) return 'N/A';
    
    try {
      const procedureData = typeof procedures === 'string' ? JSON.parse(procedures) : procedures;
      
      if (Array.isArray(procedureData)) {
        return procedureData.map(proc => 
          `${proc.procedure || 'Unknown'} (Qty: ${proc.qty || 0}, Rate: ${proc.rate || 0}, Total: ${proc.total || 0})`
        ).join('; ');
      }
      
      return JSON.stringify(procedureData);
    } catch (error) {
      return procedures.toString().replace(/,/g, ';'); // Replace commas to avoid CSV issues
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Patient Name', 'Bill Number', 'Procedures', 'Total Amount'],
      ...patients.map(p => [
        p.name,
        p.billNumber,
        formatProceduresForCSV(p.procedures || p.billType), // Use procedures if available, fallback to billType
        p.totalAmount
      ]),
      ['', '', 'Total', total]
    ]
      .map(row => row.map(cell => `"${cell}"`).join(',')) // Wrap each cell in quotes for CSV safety
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ER_Patient_Report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <Header>
        <h2>ER Patient Report</h2>
        <DateInput
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </Header>

      <ButtonRow>
        <button
          onClick={handleExport}
          title="Export to CSV"
          style={{ marginLeft: "auto", marginRight: "10px" }}
        >
          <FaDownload />
        </button>
      </ButtonRow>

      {/* Display error message if there's an error */}
      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Bill Number</th>
              <th>Procedures</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Loading patient data...</td>
              </tr>
            ) : patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.billNumber}</td>
                  <ProcedureCell>
                    <div style={{ whiteSpace: 'pre-line' }}>
                      {formatProceduresForDisplay(patient.procedures || patient.billType)}
                    </div>
                  </ProcedureCell>
                  <td>{patient.totalAmount}</td>
                </tr>
              ))
            ) : (
              <NoData>
                <td colSpan="4">No data available for this date</td>
              </NoData>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ textAlign: 'right' }}>Total</td>
              <td style={{ color: 'green' }}>{total}</td>
            </tr>
          </tfoot>
        </StyledTable>
      </TableContainer>
    </Container>
  );
};

export default PatientList;