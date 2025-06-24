"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { BsPerson, BsChevronLeft, BsChevronRight } from "react-icons/bs"

// Styled Components using GlobalStyle colors
const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  padding: 1.5rem;
  background-color: #f8f9fa;
`

const MainWrapper = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const HeaderLeft = styled.div`
  h2 {
    color: #533527;
    font-weight: 600;
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
    text-align: left;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(21, 97, 109, 0.2);
  }
`

const HeaderSubtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
`

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  label {
    font-size: 0.9rem;
    color: #533527;
    font-weight: 500;
  }
`

const DateInput = styled.input`
  padding: 0.6rem 0.8rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
  width: 160px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #5C403C;
    box-shadow: 0 0 0 2px rgba(92, 64, 60, 0.2);
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  color: #533527;
`

const Spinner = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #5C403C;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.75rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const LoadingText = styled.p`
  font-size: 1rem;
  color: #533527;
`

const ErrorWrapper = styled.div`
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`

const ErrorContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  font-weight: 500;
`

const ErrorText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`

const RetryButton = styled.button`
  background-color: #5C403C;
  color: rgb(240, 238, 238);
  border: none;
  padding: 10px 16px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #4a332f;
    transform: translateY(-1px);
  }
`

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 1.5rem;
  padding: 1.5rem;
  text-align: center;
`

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`

const EmptyTitle = styled.h4`
  font-size: 1.25rem;
  color: #533527;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(21, 97, 109, 0.2);
`

const EmptyText = styled.p`
  color: #666;
  font-size: 0.9rem;
`

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const PatientCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`

const PatientHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
`

const PatientIcon = styled.div`
  background: #5C403C;
  color: rgb(240, 238, 238);
  border-radius: 50%;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-size: 1rem;
`

const PatientName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #533527;
  margin: 0;
  flex-grow: 1;
`

const ERNumber = styled.span`
  background-color: #f0f0f0;
  color: #533527;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`

const PatientDetails = styled.div`
  margin-top: 0.75rem;
`

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.6rem;
  font-size: 0.85rem;
  color: #666;
`

const DetailIcon = styled.span`
  margin-right: 0.6rem;
  font-size: 1rem;
  color: #5C403C;
`

const DetailLabel = styled.span`
  font-weight: 500;
  min-width: 60px;
`

const DetailValue = styled.span`
  font-weight: 400;
  color: #533527;
`

const PrintButton = styled.button`
  background-color: #5C403C;
  color: rgb(240, 238, 238);
  border: none;
  padding: 10px 16px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background-color: #4a332f;
    transform: translateY(-1px);
  }
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const PaginationButton = styled.button`
  background-color: ${(props) => (props.active ? "#5C403C" : "white")};
  color: ${(props) => (props.active ? "rgb(240, 238, 238)" : "#533527")};
  border: 1px solid #5C403C;
  padding: 8px 12px;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;

  &:hover {
    background-color: #5C403C;
    color: rgb(240, 238, 238);
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #ccc;
    border-color: #ddd;
    cursor: not-allowed;
  }
`

const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
  color: #533527;
  font-size: 0.9rem;
`

const ERPatientsBilling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const itemsPerPage = 9 // Changed from 8 to 9 (3 rows of 3 cards each)

  const casualtyBaseUrl = import.meta.env?.VITE_BACKEND_CASUALTY_BASE_URL || "https://api.example.com/casualty/"

  const apiRequest = async (url, method = "GET", data = null, headers = {}) => {
    try {
      const token = localStorage.getItem("access_token")

      const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: token,
      }

      const config = {
        method,
        url,
        headers: { ...defaultHeaders, ...headers },
        validateStatus: () => true,
      }

      if (data && (method === "POST" || method === "PUT" || method === "GET")) {
        config.data = data
      }

      const response = await axios(config)

      if (response.status === 200) {
        return { success: true, data: response.data }
      } else if (response.status === 400) {
        return { success: false, error: "Invalid data sent to server.", status: 400, data: response.data }
      } else if (response.status === 401) {
        return { success: false, error: "Session expired. Please log in again.", status: 401, data: response.data }
      } else {
        return {
          success: false,
          error: "Something went wrong. Try again.",
          status: response.status,
          data: response.data,
        }
      }
    } catch (error) {
      console.error("Network or unexpected error:", error)
      return { success: false, error: "Network error or unexpected issue occurred.", networkError: true }
    }
  }

  const fetchPatients = async (date, page = 1) => {
    setLoading(true)
    setError(null)

    try {
      const formattedDate = new Date(date).toISOString().split("T")[0]
      const url = `${casualtyBaseUrl}printbill/?date=${formattedDate}&page=${page}&limit=${itemsPerPage}`

      const response = await apiRequest(url, "GET")

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch patient data")
      }

      const data = response.data

      if (Array.isArray(data)) {
        setPatients(data)
        setTotalRecords(data.length)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      } else if (data && typeof data === "object") {
        // Handle paginated response
        if (data.results && Array.isArray(data.results)) {
          setPatients(data.results)
          setTotalRecords(data.total || data.count || data.results.length)
          setTotalPages(Math.ceil((data.total || data.count || data.results.length) / itemsPerPage))
        } else if (data.data && Array.isArray(data.data)) {
          setPatients(data.data)
          setTotalRecords(data.total || data.count || data.data.length)
          setTotalPages(Math.ceil((data.total || data.count || data.data.length) / itemsPerPage))
        } else {
          setPatients([data])
          setTotalRecords(1)
          setTotalPages(1)
        }
      } else {
        setPatients([])
        setTotalRecords(0)
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Error fetching patient data:", error)
      setError(error.message)
      setPatients([])
      setTotalRecords(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchPatients(selectedDate, 1)
  }, [selectedDate])

  useEffect(() => {
    if (currentPage > 1) {
      fetchPatients(selectedDate, currentPage)
    }
  }, [currentPage])

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-GB")
    } catch (e) {
      return dateString
    }
  }

  const parseBillType = (billTypeString) => {
    try {
      if (!billTypeString) return []

      if (Array.isArray(billTypeString)) {
        return billTypeString
      }

      let cleanedBillType = billTypeString
      if (cleanedBillType.startsWith('"') && cleanedBillType.endsWith('"')) {
        cleanedBillType = cleanedBillType.slice(1, -1)
      }
      cleanedBillType = cleanedBillType.replace(/\\"/g, '"').replace(/\\\\/g, "\\")

      const parsed = JSON.parse(cleanedBillType)

      if (Array.isArray(parsed)) {
        return parsed
      } else if (parsed && typeof parsed === "object") {
        return [parsed]
      }

      return []
    } catch (e) {
      console.error("Error parsing billType:", e, billTypeString)
      return []
    }
  }

  const handlePrint = (patient) => {
    const billItems = parseBillType(patient.billType || "[]")
    const printDate = formatDate(patient.billDate)

    const printWindow = window.open("", "_blank")
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
              border: none;
            }
            .items-table thead tr {
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
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
                <span>: ${patient.billNumber || "N/A"}</span>
              </div>
              <div class="bill-row">
                <span>Bill Date</span>
                <span>: ${printDate}</span>
              </div>
              <div class="bill-row">
                <span>Name</span>
                <span>: ${patient.name || "N/A"}</span>
              </div>
              <div class="bill-row">
                <span>Doctor</span>
                <span>: ${patient.doctorName || "N/A"}</span>
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
                ${
                  billItems.length > 0
                    ? billItems
                        .map(
                          (item, index) => `
                  <tr>
                    <td class="number-col">${index + 1}</td>
                    <td>${item.name || "N/A"}</td>
                    <td class="number-col">${item.quantity || 1}</td>
                    <td class="amount-col">${Number.parseFloat(item.unitRate || 0).toFixed(2)}</td>
                    <td class="amount-col">${Number.parseFloat(item.amount || 0).toFixed(2)}</td>
                  </tr>
                `,
                        )
                        .join("")
                    : `
                  <tr>
                    <td colspan="5" style="text-align: center;">No items found</td>
                  </tr>
                `
                }
              </tbody>
            </table>
            <div class="total-section">
              <div style="text-align: right;">
                <div class="total-row">
                  <span>Total</span>
                  <span>:${Number.parseFloat(patient.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
              <div class="net-amount">
                <div style="text-align: right;">
                  <span>Net Amount</span>
                  <span>:${Number.parseFloat(patient.discountedAmount || patient.totalAmount || 0).toFixed(2)}</span>
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
    `)
    printWindow.document.close()
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    buttons.push(
      <PaginationButton key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        <BsChevronLeft />
      </PaginationButton>,
    )

    // First page
    if (startPage > 1) {
      buttons.push(
        <PaginationButton key={1} onClick={() => handlePageChange(1)}>
          1
        </PaginationButton>,
      )
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1">...</span>)
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PaginationButton key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
          {i}
        </PaginationButton>,
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2">...</span>)
      }
      buttons.push(
        <PaginationButton key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </PaginationButton>,
      )
    }

    // Next button
    buttons.push(
      <PaginationButton
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <BsChevronRight />
      </PaginationButton>,
    )

    return buttons
  }

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
            <DateInput id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
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
            <RetryButton onClick={() => fetchPatients(selectedDate, currentPage)}>Retry</RetryButton>
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
          <>
            <CardsGrid>
              {patients.map((patient, index) => {
                return (
                  <PatientCard key={patient._id || index}>
                    <PatientHeader>
                      <PatientIcon>
                        <BsPerson />
                      </PatientIcon>
                      <PatientName>{patient.name || "Unknown"}</PatientName>
                      <ERNumber>Bill No : {patient.billNumber || patient.opNumber || "N/A"}</ERNumber>
                    </PatientHeader>

                    <PatientDetails>
                      <DetailRow>
                        <DetailIcon>🩺</DetailIcon>
                        <DetailLabel>Doctor:</DetailLabel>
                        <DetailValue>{patient.doctorName || "N/A"}</DetailValue>
                      </DetailRow>

                      <DetailRow>
                        <DetailIcon>📅</DetailIcon>
                        <DetailLabel>Date:</DetailLabel>
                        <DetailValue>{formatDate(patient.billDate)}</DetailValue>
                      </DetailRow>

                      <PrintButton onClick={() => handlePrint(patient)}>Print Bill</PrintButton>
                    </PatientDetails>
                  </PatientCard>
                )
              })}
            </CardsGrid>

            {totalPages > 1 && (
              <>
                <PaginationWrapper>{renderPaginationButtons()}</PaginationWrapper>
                <PaginationInfo>
                  <span>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} records
                  </span>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationInfo>
              </>
            )}
          </>
        )}
      </MainWrapper>
    </Container>
  )
}

export default ERPatientsBilling
