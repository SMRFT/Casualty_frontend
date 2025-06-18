"use client"

import React, { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 30px 20px;
  font-family: 'Poppins', sans-serif;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const Title = styled.h2`
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Poppins', sans-serif;
  margin: 0;
`

const BackButton = styled.button`
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(108, 117, 125, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 6px;
`

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ChipContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const Chip = styled.div`
  background-color: #d1ecf1;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
`

const ChipRemove = styled.span`
  margin-left: 6px;
  cursor: pointer;
  font-weight: bold;
  color: #dc3545;
  
  &:hover {
    color: #c82333;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border: 1px solid #dee2e6;
`

const TableHeader = styled.th`
  padding: 12px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-weight: 600;
  text-align: left;
`

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
`

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background-color: #c82333;
  }
`

const TotalsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`

const TotalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`

const PatientForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const casualtyBaseUrl = import.meta.env.VITE_BACKEND_CASUALTY_BASE_URL

  const [procedureOptions, setProcedureOptions] = React.useState([])
  const [doctorOptions, setDoctorOptions] = React.useState([])
  const [selectedProcedures, setSelectedProcedures] = React.useState([])
  const [discount, setDiscount] = React.useState("")
  const [totalAmount, setTotalAmount] = React.useState(0)
  const [discountedAmount, setDiscountedAmount] = React.useState(0)
  const [formData, setFormData] = React.useState({
    name: "",
    erNumber: "",
    billNumber: "",
    doctorName: "",
    billDate: new Date().toISOString().split("T")[0],
    billType: [],
    age: "",
    gender: "Male",
    dob: new Date().toISOString().split("T")[0],
    address: "",
  })

  // apiRequest function - centralized API call logic
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

      console.log(`API Request: ${method} ${url}`, { config })
      const response = await axios(config)
      console.log(`API Response for ${url}:`, { status: response.status, data: response.data })

      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data }
      } else if (response.status === 400) {
        return {
          success: false,
          error: response.data?.message || "Invalid data sent to server.",
          status: 400,
          data: response.data,
        }
      } else if (response.status === 401) {
        toast.error("Session expired. Please log in again.")
        return { success: false, error: "Session expired. Please log in again.", status: 401, data: response.data }
      } else if (response.status === 403) {
        return {
          success: false,
          error: response.data?.message || "You do not have permission to perform this action.",
          status: 403,
          data: response.data,
        }
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

  // Load patient data from URL parameters or location state
  useEffect(() => {
    // First check if data was passed via navigation state
    if (location.state?.patientData) {
      handleSelectPatient(location.state.patientData)
      return
    }

    // Fallback to URL parameters
    const urlParams = new URLSearchParams(location.search)
    const patientDataParam = urlParams.get("data")
    if (patientDataParam) {
      try {
        const patientData = JSON.parse(decodeURIComponent(patientDataParam))
        handleSelectPatient(patientData)
      } catch (error) {
        console.error("Error parsing patient data from URL:", error)
        toast.error("Error loading patient data")
      }
    }
  }, [location])

  // Fetch procedures & doctors, ER/Bill numbers
  React.useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch Procedures
      const proceduresResponse = await apiRequest(`${casualtyBaseUrl}procedures/`)
      if (proceduresResponse.success) {
        const data = proceduresResponse.data
        const parsed = typeof data === "string" ? JSON.parse(data) : data
        const proceduresWithNumericRates = parsed.map((procedure) => ({
          ...procedure,
          rate: Number.parseFloat(procedure.rate) || 0,
        }))
        setProcedureOptions(proceduresWithNumericRates)
        console.log("Fetched and set procedures:", proceduresWithNumericRates)
      } else {
        console.error("Error fetching procedures:", proceduresResponse.error)
        toast.error("Failed to fetch procedures.")
      }

      // Fetch Doctors
      const doctorsResponse = await apiRequest(`${casualtyBaseUrl}doctors/`)
      if (doctorsResponse.success) {
        const data = typeof doctorsResponse.data === "string" ? JSON.parse(doctorsResponse.data) : doctorsResponse.data
        setDoctorOptions(data)
        console.log("Fetched and set doctors:", data)
      } else {
        console.error("Error fetching doctors:", doctorsResponse.error)
        toast.error("Failed to fetch doctors.")
      }

      // Fetch next bill number (only if ER Number is not already set from a selected patient)
      if (!formData.billNumber) {
        const billNumberResponse = await apiRequest(`${casualtyBaseUrl}next-bill-number/`)
        if (billNumberResponse.success) {
          setFormData((prev) => ({ ...prev, billNumber: billNumberResponse.data.billNumber }))
          console.log("Fetched and set bill number:", billNumberResponse.data.billNumber)
        } else {
          console.error("Error fetching bill number", billNumberResponse.error)
          toast.error("Failed to fetch bill number.")
        }
      }
    }

    fetchInitialData()
  }, [casualtyBaseUrl, formData.billNumber])

  // Handler to populate form with selected patient data
  const handleSelectPatient = (patient) => {
    // Convert billType string to array for chips
    const billTypeArray = patient.billType ? patient.billType.split(", ").map((item) => item.trim()) : []

    // Convert procedures to the format expected by selectedProcedures state
    const procedures = patient.procedures || []

    setFormData({
      name: patient.name || "",
      erNumber: patient.erNumber || "",
      billNumber: patient.billNumber || "",
      doctorName: patient.doctorName || "",
      billDate: patient.billDate || new Date().toISOString().split("T")[0],
      billType: billTypeArray,
      age: patient.age || "",
      gender: patient.gender || "Male",
      dob: patient.dob || new Date().toISOString().split("T")[0],
      address: patient.address || "",
    })
    setSelectedProcedures(procedures)
    setDiscount(patient.discount || "")
    setTotalAmount(patient.totalAmount || 0)
    setDiscountedAmount(patient.discountedAmount || 0)

    toast.success(`Patient ${patient.name} loaded into the form.`)
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add procedure to bill type
  const handleBillTypeChange = (e) => {
    const procedureName = e.target.value
    if (!procedureName) return

    if (selectedProcedures.find((p) => p.name === procedureName)) {
      toast.info("This procedure is already added.")
      return
    }

    const selectedProcedure = procedureOptions.find((p) => p.procedure_name === procedureName)

    if (!selectedProcedure) {
      toast.error("Procedure not found in the list.")
      return
    }

    const baseRate = Number.parseFloat(selectedProcedure.rate) || 0

    setSelectedProcedures((prev) => [
      ...prev,
      {
        name: procedureName,
        baseRate: baseRate,
        rate: baseRate,
        quantity: 1,
      },
    ])

    setFormData((prev) => ({
      ...prev,
      billType: [...prev.billType, procedureName],
    }))

    toast.success(`Added ${procedureName} to the bill`)
  }

  // Remove bill type chip
  const removeBillType = (type) => {
    setFormData((prev) => ({
      ...prev,
      billType: prev.billType.filter((t) => t !== type),
    }))
    setSelectedProcedures((prev) => prev.filter((p) => p.name !== type))
    toast.info(`Removed ${type} from the bill`)
  }

  // Change rate for selected procedure
  const handleRateChange = (index, newRate) => {
    const updated = [...selectedProcedures]
    const baseRate = Number.parseFloat(newRate) || 0
    updated[index].baseRate = baseRate
    updated[index].rate = baseRate * updated[index].quantity
    setSelectedProcedures(updated)
  }

  // Change quantity for selected procedure
  const handleQuantityChange = (index, newQuantity) => {
    setSelectedProcedures((prev) => {
      const updated = [...prev]
      const quantity = newQuantity === "" ? "" : Number.parseInt(newQuantity)

      updated[index] = {
        ...updated[index],
        quantity: quantity,
        rate: quantity && !isNaN(quantity) ? updated[index].baseRate * quantity : 0,
      }

      return updated
    })
  }

  // Remove procedure from table
  const handleDeleteProcedure = (index) => {
    const proc = selectedProcedures[index]
    removeBillType(proc.name)
  }

  // Update totals when procedures or discount changes
  React.useEffect(() => {
    const total = selectedProcedures.reduce((acc, curr) => acc + (Number.parseFloat(curr.rate) || 0), 0)
    setTotalAmount(total)

    if (discount.toString().includes("%")) {
      const percent = Number.parseFloat(discount.replace("%", "")) || 0
      setDiscountedAmount(total - (percent / 100) * total)
    } else {
      const flat = Number.parseFloat(discount) || 0
      setDiscountedAmount(total - flat)
    }
  }, [selectedProcedures, discount])

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Patient name is required")
      return false
    }

    if (!formData.doctorName) {
      toast.error("Doctor name is required")
      return false
    }

    if (selectedProcedures.length === 0) {
      toast.error("At least one procedure must be added")
      return false
    }

    return true
  }

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const payload = {
        ...formData,
        billType: selectedProcedures.map((p) => p.name).join(", "),
        procedures: selectedProcedures,
        totalAmount,
        discount,
        discountedAmount,
      }

      toast.info("Saving patient data...")

      const response = await apiRequest(`${casualtyBaseUrl}patient/`, "POST", payload)

      if (response.success) {
        setFormData((prev) => ({ ...prev, billNumber: response.data.billNumber }))
        toast.success("Patient data saved successfully!")
        console.log("Patient data saved successfully:", response.data)
        printBill(payload)
      } else {
        console.error("Error saving patient data:", response.error)
        toast.error("Failed to save data: " + (response.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Catch block error during save:", error)
      toast.error("An unexpected error occurred during patient registration.")
    }
  }

  // Print Bill Function
  const printBill = (data) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast.error("Unable to open print window. Please check your popup blocker settings.")
      return
    }

    const procedureRows = data.procedures
      .map(
        (proc, index) => `
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin: 2px 0;">
            <div style="width: 8%; text-align: center;">${index + 1}</div>
            <div style="width: 40%; padding-left: 5px;">${proc.name}</div>
            <div style="width: 10%; text-align: center;">${proc.quantity}</div>
            <div style="width: 15%; text-align: right;">${proc.baseRate.toFixed(2)}</div>
            <div style="width: 15%; text-align: right;">${proc.rate.toFixed(2)}</div>
          </div>`,
      )
      .join("")

    printWindow.document.write(`
      <html>
        <head>
          <title>Lab Bill - ${data.billNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              padding: 10px;
              width: 80mm;
            }
            .center {
              text-align: center;
            }
            .line {
              border-top: 1px solid #000;
              margin: 8px 0;
            }
            .header-title {
              font-weight: bold;
              font-size: 16px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
            }
            .info-label {
              font-weight: bold;
            }
            .procedure-header, .procedure-row {
              display: flex;
              font-weight: bold;
              border-bottom: 1px solid #000;
              padding-bottom: 4px;
              margin-bottom: 4px;
            }
            .procedure-header > div {
              padding-left: 5px;
            }
            .procedure-header div:nth-child(1) { width: 8%; text-align: center; }
            .procedure-header div:nth-child(2) { width: 40%; }
            .procedure-header div:nth-child(3) { width: 10%; text-align: center; }
            .procedure-header div:nth-child(4) { width: 15%; text-align: right; }
            .procedure-header div:nth-child(5) { width: 15%; text-align: right; }
            .totals {
              font-weight: bold;
              display: flex;
              justify-content: flex-end;
              margin-top: 6px;
            }
            .totals div {
              width: 30%;
              text-align: right;
              padding-left: 10px;
            }
          </style>
        </head>
        <body>
          <div class="center">
            <div class="header-title">SHANMUGA HOSPITAL LIMITED</div>
            <div>51/24, Saradha College Road, Salem - 636007</div>
            <div>CIN: L85110TZ2020PLC033974</div>
          </div>

          <div class="line"></div>

          <div class="center" style="font-weight: bold;">Cash Bill - <u>LAB BILL (SH)</u></div>

          <div class="line"></div>

          <div class="info-row"><div class="info-label">Bill Number:</div><div>${data.billNumber}</div></div>
          <div class="info-row"><div class="info-label">ER Number:</div><div>${data.erNumber}</div></div>
          <div class="info-row"><div class="info-label">Bill Date:</div><div>${data.billDate} ${data.billTime || ""}</div></div>
          <div class="info-row"><div class="info-label">Name:</div><div>${data.name}</div></div>
          <div class="info-row"><div class="info-label">Doctor:</div><div>${data.doctorName}</div></div>

          <div class="line"></div>

          <div class="procedure-header">
            <div>No</div>
            <div>Description</div>
            <div>Qty</div>
            <div>Cost</div>
            <div>Amount</div>
          </div>
          ${procedureRows}

          <div class="line"></div>

          <div class="totals">
            <div>Total:</div>
            <div>₹${data.totalAmount.toFixed(2)}</div>
          </div>
          <div class="totals">
            <div>Net Amount:</div>
            <div>₹${data.discountedAmount.toFixed(2)}</div>
          </div>

          <div class="line"></div>

          <div style="margin-top: 30px;">Signature: ___________________</div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  const handleBackToList = () => {
    navigate(`${import.meta.env.BASE_URL}/DailyPatientList`)
  }

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header>
        <Title>ER Patient Form</Title>
        <BackButton onClick={handleBackToList}>← Back to Patient List</BackButton>
      </Header>

      <FormGrid>
        <InputGroup>
          <Label>ER Number</Label>
          <Input name="erNumber" value={formData.erNumber} readOnly />
        </InputGroup>
        <InputGroup>
          <Label>Patient Name</Label>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </InputGroup>
        <InputGroup>
          <Label>Bill Number</Label>
          <Input name="billNumber" value={formData.billNumber} disabled />
        </InputGroup>
        <InputGroup>
          <Label>Doctor Name</Label>
          <Select name="doctorName" value={formData.doctorName} onChange={handleChange}>
            <option value="">Select Doctor</option>
            {doctorOptions.map((doc) => (
              <option key={doc._id?.$oid || doc._id} value={doc.doctor_name}>
                {doc.doctor_name}
              </option>
            ))}
          </Select>
        </InputGroup>
        <InputGroup>
          <Label>Bill Date</Label>
          <Input type="date" name="billDate" value={formData.billDate} onChange={handleChange} />
        </InputGroup>
        <InputGroup>
          <Label>Age</Label>
          <Input name="age" value={formData.age} onChange={handleChange} />
        </InputGroup>
        <InputGroup>
          <Label>Gender</Label>
          <Select name="gender" value={formData.gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Select>
        </InputGroup>
        <InputGroup>
          <Label>Address</Label>
          <Input name="address" value={formData.address} onChange={handleChange} />
        </InputGroup>
        <InputGroup>
          <Label>Date of Birth</Label>
          <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        </InputGroup>
        <InputGroup>
          <Label>Bill Type</Label>
          <Select onChange={handleBillTypeChange}>
            <option value="">Select Procedure</option>
            {procedureOptions
              .filter((p) => !formData.billType.includes(p.procedure_name))
              .map((item) => (
                <option key={item._id?.$oid || item._id} value={item.procedure_name}>
                  {item.procedure_name}
                </option>
              ))}
          </Select>
          <ChipContainer>
            {formData.billType.map((type) => (
              <Chip key={type}>
                {type}
                <ChipRemove onClick={() => removeBillType(type)}>×</ChipRemove>
              </Chip>
            ))}
          </ChipContainer>
        </InputGroup>
      </FormGrid>

      <SubmitButton onClick={handleSubmit}>Submit Patient Data</SubmitButton>

      {selectedProcedures.length > 0 && (
        <>
          <Table>
            <thead>
              <tr>
                <TableHeader>Procedure</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Unit Rate (₹)</TableHeader>
                <TableHeader>Total (₹)</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {selectedProcedures.map((proc, idx) => (
                <tr key={idx}>
                  <TableCell>{proc.name}</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={proc.quantity === "" ? "" : proc.quantity}
                      onChange={(e) => handleQuantityChange(idx, e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={proc.baseRate}
                      onChange={(e) => handleRateChange(idx, e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={proc.rate.toFixed(2)}
                      readOnly
                      style={{ width: "100%", backgroundColor: "#f8f9fa" }}
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteButton onClick={() => handleDeleteProcedure(idx)}>🗑️ Delete</DeleteButton>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </Table>

          <TotalsContainer>
            <TotalItem>
              <Label>Discount</Label>
              <Input
                type="text"
                value={discount}
                placeholder="Enter amount or percentage (e.g. 100 or 10%)"
                onChange={(e) => setDiscount(e.target.value)}
                style={{ width: "200px" }}
              />
            </TotalItem>
            <TotalItem>
              <Label>Total Amount</Label>
              <Input
                type="text"
                value={totalAmount.toFixed(2)}
                readOnly
                style={{ width: "150px", backgroundColor: "#f8f9fa" }}
              />
            </TotalItem>
            <TotalItem>
              <Label>Discounted Amount</Label>
              <Input
                type="text"
                value={discount ? discountedAmount.toFixed(2) : ""}
                placeholder="Discounted amount will appear here"
                readOnly
                style={{ width: "150px", backgroundColor: "#f8f9fa" }}
              />
            </TotalItem>
            <TotalItem>
              <Label>Net Amount</Label>
              <Input
                type="text"
                value={(discount ? discountedAmount : totalAmount).toFixed(2)}
                readOnly
                style={{ width: "150px", backgroundColor: "#f8f9fa", fontWeight: "bold" }}
              />
            </TotalItem>
          </TotalsContainer>
        </>
      )}
    </Container>
  )
}

export default PatientForm
