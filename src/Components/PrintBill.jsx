import axios from 'axios'; // Import axios
import { useState, useEffect } from "react";
import styled from "styled-components";
import { BsPerson } from "react-icons/bs"; // Assuming this is where BsPerson comes from

// Styled Components (assuming these are defined elsewhere or will be moved here)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f0f2f5;
`;

const MainWrapper = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderLeft = styled.div`
  h2 {
    color: #1a202c;
    font-weight: 700;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeaderSubtitle = styled.p`
  color: #718096;
  font-size: 1rem;
  margin: 0;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  label {
    font-size: 1rem;
    color: #4a5568;
    font-weight: 500;
  }
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #4a5568;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: #4a5568;
`;

const ErrorWrapper = styled.div`
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ErrorContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  font-weight: 500;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 1rem;
`;

const RetryButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #dc2626;
  }
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: #f8fafc;
  border-radius: 16px;
  margin-top: 2rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: #718096;
  font-size: 1rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const PatientCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const PatientHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const PatientIcon = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-radius: 50%;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
`;

const PatientName = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  flex-grow: 1;
`;

const ERNumber = styled.span`
  background-color: #edf2f7;
  color: #4a5568;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const PatientDetails = styled.div`
  margin-top: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  color: #4a5568;
`;

const DetailIcon = styled.span`
  margin-right: 0.75rem;
  font-size: 1.1rem;
  color: #6366f1;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  min-width: 70px;
`;

const DetailValue = styled.span`
  font-weight: 400;
  color: #2d3748;
`;

const PrintButton = styled.button`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  width: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
  }
`;

const ERPatientsBilling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [billDateTime, setBillDateTime] = useState(null); // This state isn't used in the provided code

  const casualtyBaseUrl = import.meta.env.VITE_BACKEND_CASUALTY_BASE_URL;

  // apiRequest function copied from Dashboard
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

      if (data && (method === 'POST' || method === 'PUT' || method === 'GET')) { // Added GET for data in body if needed, though usually GET doesn't have a body
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


  const fetchPatients = async (date) => {
    setLoading(true);
    setError(null);

    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const url = `${casualtyBaseUrl}printbill/?date=${formattedDate}`;

      // Use apiRequest instead of fetch
      const response = await apiRequest(url, 'GET');

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch patient data');
      }

      const data = response.data;

      if (Array.isArray(data)) {
        setPatients(data);
      } else if (data && typeof data === 'object') {
        setPatients([data]);
      } else {
        setPatients([]);
      }

    } catch (error) {
      console.error("Error fetching patient data:", error);
      setError(error.message);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(selectedDate);
  }, [selectedDate]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch (e) {
      return dateString;
    }
  };

  const parseBillType = (billTypeString) => {
    try {
      if (!billTypeString) return [];

      // Handle if it's already an array
      if (Array.isArray(billTypeString)) {
        return billTypeString;
      }

      // Try to parse the JSON string. Handle potential double-escaped strings
      let cleanedBillType = billTypeString;
      // Remove outer quotes if they exist
      if (cleanedBillType.startsWith('"') && cleanedBillType.endsWith('"')) {
        cleanedBillType = cleanedBillType.slice(1, -1);
      }
      // Unescape the JSON string
      cleanedBillType = cleanedBillType.replace(/\\"/g, '"').replace(/\\\\/g, "\\");

      const parsed = JSON.parse(cleanedBillType);

      // Ensure it's an array
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed && typeof parsed === 'object') {
        return [parsed];
      }

      return [];
    } catch (e) {
      console.error('Error parsing billType:', e, billTypeString);
      return [];
    }
  };

  // The getBillType function is not used in the render, but keeping it for completeness if needed elsewhere
  const getBillType = (patient) => {
    const billItems = parseBillType(patient.billType || '[]');
    if (billItems.length > 0) {
      return billItems[0].procedure || 'CONSULTATION';
    }
    return 'CONSULTATION';
  };

  const handlePrint = (patient) => {
    const billItems = parseBillType(patient.billType || '[]');
    const printDate = formatDate(patient.billDate);

    console.log('Patient data for printing:', patient);
    console.log('Parsed bill items:', billItems);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill - ${patient.name}</title>
          <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 10px;
            width: 80mm;
            margin: 0;
          }
            .hospital-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .hospital-name {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 5px;
            }
            .hospital-address {
              font-size: 11px;
              margin-bottom: 3px;
            }
            .bill-type {
              font-weight: bold;
              margin-top: 10px;
              text-decoration: underline;
            }
            .bill-info {
              margin: 15px 0;
            }
            .bill-row {
              margin-bottom: 5px;
            }
            .bill-row span:first-child {
              width: 120px;
              display: inline-block;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }

            .items-table th, .items-table td {
              padding: 5px;
              text-align: left;
              font-size: 11px;
              border: none; /* Remove all default borders */
            }

            .items-table thead tr {
              border-top: 2px solid #000;   /* Line before heading */
              border-bottom: 2px solid #000; /* Line after heading */
            }

            .items-table th {
              background-color: #f0f0f0;
              font-weight: bold;
              text-align: center;
            }

            .items-table .number-col {
              text-align: center;
              width: 40px;
            }

            .items-table .amount-col {
              text-align: right;
              width: 80px;
            }


            .total-section {
              border-top: 2px solid #000;
              margin-top: 20px;
              padding-top: 10px;
            }
            .total-row {
              margin-bottom: 5px;
              font-weight: bold;
            }
            .net-amount {
              font-size: 14px;
              font-weight: bold;
              border-top: 2px solid #000;
              padding-top: 5px;
              margin-top: 10px;
            }
            .signature-section {
            border-top: 2px solid #000;
              margin-top: 30px;
              text-align: right;
            }

          </style>
        </head>
        <body>
          <div style="position: relative;">
            <div class="hospital-header">
              <div class="hospital-name">SHANMUGA HOSPITAL LIMITED</div>
              <div class="hospital-address">51/24,Saradha College Road, Salem - 636007</div>
              <div class="hospital-address">CIN: L85110TZ2020PLC033974</div>
              <div class="bill-type">Cash Bill - ER BILL (SH)</div>
            </div>

            <div class="bill-info">
              <div class="bill-row">
                <span>Bill Number</span>
                <span>: ${patient.billNumber || 'N/A'}</span>
              </div>

              <div class="bill-row">
                <span>Bill Date</span>
                <span>: ${printDate}</span>
              </div>
              <div class="bill-row">
                <span>Name</span>
                <span>: ${patient.name || 'N/A'}</span>
              </div>
              <div class="bill-row">
                <span>Doctor</span>
                <span>: ${patient.doctorName || 'N/A'}</span>
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th class="number-col">No</th>
                  <th>Description</th>
                  <th class="number-col">Qty</th>
                  <th class="amount-col">Cost</th>
                  <th class="amount-col">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${billItems.length > 0 ? billItems.map((item, index) => `
                  <tr>
                    <td class="number-col">${index + 1}</td>
                    <td>${item.procedure || 'N/A'}</td>
                    <td class="number-col">${item.qty || 1}</td>
                    <td class="amount-col">${parseFloat(item.rate || 0).toFixed(2)}</td>
                    <td class="amount-col">${parseFloat(item.total || 0).toFixed(2)}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="5" style="text-align: center;">No items found</td>
                  </tr>
                `}
              </tbody>
            </table>

            <div class="total-section">
              <div style="text-align: right;">
                <div class="total-row">
                  <span>Total</span>
                  <span>:${parseFloat(patient.totalAmount || 0).toFixed(2)}</span>
                </div>

              </div>

              <div class="net-amount">
                <div style="text-align: right;">
                  <span>Net Amount</span>
                  <span>:${parseFloat(patient.discountedAmount || patient.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="signature-section">
              <div style="margin-top: 40px;">

                <span style="margin-left: 100px;">(Signature)</span>
              </div>
            </div>

          </div>

          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Container>
      <MainWrapper>
        <Header>
          <HeaderLeft>
            <div>
              <h2>🩺 ER Billing Records</h2>
              <HeaderSubtitle>Select a date to view patient bills</HeaderSubtitle>
            </div>
          </HeaderLeft>

          <DatePickerWrapper>
            <label htmlFor="date">Date:</label>
            <DateInput
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </DatePickerWrapper>
        </Header>

        {loading && (
          <LoadingWrapper>
            <Spinner />
            <LoadingText>Loading patient bills...</LoadingText>
          </LoadingWrapper>
        )}

        {error && (
          <ErrorWrapper>
            <ErrorContent>
              <ErrorText>{error}</ErrorText>
            </ErrorContent>
            <RetryButton onClick={() => fetchPatients(selectedDate)}>Retry</RetryButton>
          </ErrorWrapper>
        )}

        {!loading && patients.length === 0 && (
          <EmptyWrapper>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyTitle>No Records</EmptyTitle>
            <EmptyText>No patients found for the selected date.</EmptyText>
          </EmptyWrapper>
        )}

        {!loading && patients.length > 0 && (
          <CardsGrid>
            {patients.map((patient, index) => {
              // The cardColors array and its usage was in the original code, but it's not being used for styling the PatientCard itself.
              // If you intend to use it for dynamic styling, you would need to pass it as a prop to PatientCard, e.g.,
              // const cardColor = cardColors[index % cardColors.length];
              // <PatientCard color={cardColor}>
              // and then in PatientCard styled component: background: ${(props) => props.color || 'white'};
              
              return (
                <PatientCard key={patient._id || index}>
                  <PatientHeader>
                    <PatientIcon><BsPerson /></PatientIcon>
                    <PatientName>{patient.name || 'Unknown'}</PatientName>
                    <ERNumber>Bill No : {patient.billNumber || patient.opNumber || 'N/A'}</ERNumber>
                  </PatientHeader>

                  <PatientDetails>
                    <DetailRow>
                      <DetailIcon>🩺</DetailIcon>
                      <DetailLabel>Doctor:</DetailLabel>
                      <DetailValue>{patient.doctorName || 'N/A'}</DetailValue>
                    </DetailRow>

                    <DetailRow>
                      <DetailIcon>📅</DetailIcon>
                      <DetailLabel>Date:</DetailLabel>
                      <DetailValue>{formatDate(patient.billDate)}</DetailValue>
                    </DetailRow>

                    <PrintButton onClick={() => handlePrint(patient)}>
                      Print Bill
                    </PrintButton>
                  </PatientDetails>
                </PatientCard>
              );
            })}
          </CardsGrid>
        )}
      </MainWrapper>
    </Container>
  );
};

export default ERPatientsBilling;