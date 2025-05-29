import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaDownload } from 'react-icons/fa'; 

// Styled Components
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

  useEffect(() => {
    fetchPatients(selectedDate);
  }, [selectedDate]);

  const fetchPatients = async (date) => {
    try {
      const response = await axios.get(`${casualtyBaseUrl}patients-by-date/?billDate=${date}`);
      setPatients(response.data);

      const totalAmount = response.data.reduce((sum, p) => {
        const amount = parseFloat(p.totalAmount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      setTotal(totalAmount);
    } catch (err) {
      console.error('Error fetching patients:', err);
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
      return `${procedureData.procedure || 'Unknown'} - Qty: ${procedureData.qty || 0}, Rate: ₹${procedureData.rate || 0}, Total: ₹${procedureData.total || 0}`;
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
            {patients.length > 0 ? (
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