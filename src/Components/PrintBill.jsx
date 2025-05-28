import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsPerson } from "react-icons/bs";

const Container = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  padding: 20px;
`;

const MainWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const HeaderSubtitle = styled.p`
  margin: 4px 0 0 0;
  color: #666;
  font-size: 14px;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const DateInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #333;
  font-weight: 500;
  font-size: 14px;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const PatientCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: #fff;
  width: 100%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
`;

const PatientHeader = styled.div`
  background: ${props => props.headerColor || 'linear-gradient(135deg, #533527, #AE8775)'};
  color: white;
  padding: 20px;
  position: relative;
  border-radius: 20px 20px 0px 0px;
`;

const PatientIcon = styled.div`
  position: absolute;
  top: 12px;
  left: 20px;
  font-size: 25px;
`;

const PatientName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  padding-left: 32px;
`;

const ERNumber = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
`;

const PatientDetails = styled.div`
  padding: 24px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
`;

const DetailIcon = styled.div`
  margin-right: 12px;
  font-size: 16px;
  color: #666;
  width: 20px;
`;

const DetailLabel = styled.span`
  color: #666;
  font-weight: 500;
  margin-right: 8px;
`;

const DetailValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const AmountSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  text-align: right;
`;

const AmountLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const AmountValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #059669;
`;

const PrintButton = styled.button`
  width: 100%;
  background: #533527;
  color: white;
  border: none;
  padding: 14px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s ease;

  &:active {
    transform: translateY(1px);
  }
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 48px 0;
`;

const Spinner = styled.div`
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: #666;
`;

const ErrorWrapper = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const ErrorContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorText = styled.p`
  margin: 0;
  color: #dc2626;
`;

const RetryButton = styled.button`
  margin-top: 8px;
  background: none;
  border: none;
  color: #dc2626;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: #b91c1c;
  }
`;

const EmptyWrapper = styled.div`
  text-align: center;
  padding: 48px 0;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  color: #ccc;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  color: #999;
  margin: 0;
`;

const ERPatientsBilling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billDateTime, setBillDateTime] = useState(null);

  const casualtyBaseUrl = import.meta.env.VITE_BACKEND_CASUALTY_BASE_URL;

  // Color options for patient cards
  const cardColors = [
    'linear-gradient(135deg, #4f46e5, #7c3aed)', // Blue to Purple
    'linear-gradient(135deg, #059669, #047857)', // Green
    'linear-gradient(135deg, #dc2626, #b91c1c)', // Red
    'linear-gradient(135deg, #d97706, #b45309)', // Orange
    'linear-gradient(135deg, #7c2d12, #92400e)', // Brown
    'linear-gradient(135deg, #1f2937, #374151)', // Gray
  ];

  const fetchPatients = async (date) => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const url = `${casualtyBaseUrl}printbill/?date=${formattedDate}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText.includes('<!doctype') || errorText.includes('<!DOCTYPE')) {
            errorMessage = `Server returned HTML error page instead of JSON. Status: ${response.status}`;
          } else {
            errorMessage += ` - ${errorText}`;
          }
        } catch (e) {
          console.log('Could not read error response');
        }
        throw new Error(errorMessage);
      }
      
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        if (responseText.includes('<!doctype') || responseText.includes('<!DOCTYPE')) {
          throw new Error('Server returned HTML page instead of JSON data. Check if the API endpoint exists and is correctly configured.');
        } else {
          throw new Error(`Expected JSON response but got: ${contentType || 'unknown content type'}`);
        }
      }
      
      const data = await response.json();
      
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
      
      // Parse JSON string
      const parsed = JSON.parse(billTypeString);
      
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
              const billItems = parseBillType(patient.billType || '[]');
              const cardColor = cardColors[index % cardColors.length];
              
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