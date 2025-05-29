// src/components/PatientForm.jsx
import React from "react";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
`;

const Header = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;


const PatientForm = () => {
  const casualtyBaseUrl = import.meta.env.VITE_BACKEND_CASUALTY_BASE_URL;

  const [procedureOptions, setProcedureOptions] = React.useState([]);
  const [doctorOptions, setDoctorOptions] = React.useState([]);
  const [selectedProcedures, setSelectedProcedures] = React.useState([]);
  const [discount, setDiscount] = React.useState("");
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [discountedAmount, setDiscountedAmount] = React.useState(0);
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
  });

  // Fetch procedures & doctors
  React.useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await axios.get(`${casualtyBaseUrl}procedures/`);
        const data = response.data;

        const parsed = typeof data === 'string' ? JSON.parse(data) : data;

        const proceduresWithNumericRates = parsed.map(procedure => ({
          ...procedure,
          rate: parseFloat(procedure.rate) || 0,
        }));

        setProcedureOptions(proceduresWithNumericRates);
        console.log("procedures", proceduresWithNumericRates);
      } catch (error) {
        console.error("Error fetching procedures:", error);
        toast.error("Failed to fetch procedures.");
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${casualtyBaseUrl}doctors/`);
        const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        setDoctorOptions(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to fetch doctors.");
      }
    };

    // Fetch next bill number
    const fetchBillNumber = async () => {
      try {
        const res = await axios.get(`${casualtyBaseUrl}next-bill-number/`);
        setFormData((prev) => ({ ...prev, billNumber: res.data.billNumber }));
      } catch (err) {
        console.error("Error fetching bill number", err);
        toast.error("Failed to fetch bill number.");
      }
    };

    // Fetch next ER number
    const fetchERNumber = async () => {
      try {
        const res = await axios.get(`${casualtyBaseUrl}next-er-number/`);
        setFormData((prev) => ({ ...prev, erNumber: res.data.erNumber }));
      } catch (err) {
        console.error("Error fetching ER number", err);
        toast.error("Failed to fetch ER number.");
      }
    };

    fetchProcedures();
    fetchDoctors();
    fetchBillNumber();
    fetchERNumber();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add procedure to bill type
  const handleBillTypeChange = (e) => {
    const procedureName = e.target.value;

    if (!procedureName) return;

    // Check for duplicates
    if (selectedProcedures.find((p) => p.name === procedureName)) {
      toast.info("This procedure is already added.");
      return;
    }

    // Find procedure from cached procedureOptions
    const selectedProcedure = procedureOptions.find(
      (p) => p.procedure_name === procedureName
    );

    if (!selectedProcedure) {
      toast.error("Procedure not found in the list.");
      return;
    }

    const baseRate = parseFloat(selectedProcedure.rate) || 0;

    // Add to selected procedures with quantity=1 by default
    setSelectedProcedures((prev) => [
      ...prev, 
      { 
        name: procedureName, 
        baseRate: baseRate, // Store original rate
        rate: baseRate,     // This will be the calculated rate (qty * baseRate)
        quantity: 1         // Default quantity
      }
    ]);

    // Update billType to show in chips
    setFormData((prev) => ({
      ...prev,
      billType: [...prev.billType, procedureName],
    }));
    
    toast.success(`Added ${procedureName} to the bill`);
  };

  // Remove bill type chip
  const removeBillType = (type) => {
    setFormData((prev) => ({
      ...prev,
      billType: prev.billType.filter((t) => t !== type),
    }));
    setSelectedProcedures((prev) => prev.filter((p) => p.name !== type));
    toast.info(`Removed ${type} from the bill`);
  };

  // Change rate for selected procedure
  const handleRateChange = (index, newRate) => {
    const updated = [...selectedProcedures];
    const baseRate = parseFloat(newRate) || 0;
    updated[index].baseRate = baseRate;
    // Recalculate the total rate based on quantity
    updated[index].rate = baseRate * updated[index].quantity;
    setSelectedProcedures(updated);
  };

  // Change quantity for selected procedure
const handleQuantityChange = (index, newQuantity) => {
  setSelectedProcedures(prev => {
    const updated = [...prev];
    const quantity = newQuantity === '' ? '' : parseInt(newQuantity);

    updated[index] = {
      ...updated[index],
      quantity: quantity,
      rate:
        quantity && !isNaN(quantity)
          ? updated[index].baseRate * quantity
          : 0,
    };

    return updated;
  });
};

  // Remove procedure from table
  const handleDeleteProcedure = (index) => {
    const proc = selectedProcedures[index];
    removeBillType(proc.name);
  };

  // Update totals when procedures or discount changes
  React.useEffect(() => {
    const total = selectedProcedures.reduce((acc, curr) => acc + (parseFloat(curr.rate) || 0), 0);
    setTotalAmount(total);

    if (discount.toString().includes("%")) {
      const percent = parseFloat(discount.replace("%", "")) || 0;
      setDiscountedAmount(total - (percent / 100) * total);
    } else {
      const flat = parseFloat(discount) || 0;
      setDiscountedAmount(total - flat);
    }
  }, [selectedProcedures, discount]);

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Patient name is required");
      return false;
    }
    
    if (!formData.doctorName) {
      toast.error("Doctor name is required");
      return false;
    }
    
    if (selectedProcedures.length === 0) {
      toast.error("At least one procedure must be added");
      return false;
    }

    return true;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const payload = {
        ...formData,
        billType: selectedProcedures.map((p) => p.name).join(", "),
        procedures: selectedProcedures,
        totalAmount,
        discount,
        discountedAmount,
      };

      toast.info("Saving patient data...");
      
      const response = await axios.post(`${casualtyBaseUrl}patient/`, payload);
      setFormData(prev => ({ ...prev, billNumber: response.data.billNumber }));
      toast.success("Patient data saved successfully!");
      console.log(response.data);
      // Print after successful save
      printBill(payload);
    } catch (error) {
      console.error("Error saving patient data:", error);
      toast.error("Failed to save data: " + (error.response?.data?.message || error.message));
    }
  };

  const printBill = (data) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Unable to open print window. Please check your popup blocker settings.");
      return;
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
          </div>`
      )
      .join("");

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
          <div class="info-row"><div class="info-label">Bill Date:</div><div>${data.billDate} ${data.billTime || ''}</div></div>
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
    `);

    printWindow.document.close();
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>ER Form</h2>
      
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
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {formData.billType.map((type) => (
              <div
                key={type}
                style={{
                  backgroundColor: "#d1ecf1",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {type}
                <span
                  style={{ marginLeft: 6, cursor: "pointer" }}
                  onClick={() => removeBillType(type)}
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        </InputGroup>
      </FormGrid>

      <button onClick={handleSubmit}>Submit</button>

      {selectedProcedures.length > 0 && (
        <>
          <div className="table-responsive mt-4" style={{ marginTop: '20px' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              marginTop: '20px',
              border: '1px solid #dee2e6' 
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Procedure</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Quantity</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Unit Rate (₹)</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Total (₹)</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedProcedures.map((proc, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{proc.name}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                    <Input
                      type="text"
                      value={proc.quantity === '' ? '' : proc.quantity}
                      onChange={(e) => handleQuantityChange(idx, e.target.value)}
                      style={{ width: '100%' }}
                    />

                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                      <Input
                        type="text"
                        value={proc.baseRate}
                        onChange={(e) => handleRateChange(idx, e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                      <Input
                        type="text"
                        value={proc.rate.toFixed(2)}
                        readOnly
                        style={{ width: '100%', backgroundColor: '#f8f9fa' }}
                      />
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                      <button
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleDeleteProcedure(idx)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals and Discount */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center', 
              gap: '20px', 
              marginTop: '20px' 
            }}>
              <div>
                <Label>Discount</Label>
                <Input
                  type="text"
                  value={discount}
                  placeholder="Enter amount or percentage (e.g. 100 or 10%)"
                  onChange={(e) => setDiscount(e.target.value)}
                  style={{ width: '200px' }}
                />
              </div>
              <div>
                <Label>Total Amount</Label>
                <Input 
                  type="text" 
                  value={totalAmount.toFixed(2)} 
                  readOnly 
                  style={{ width: '150px', backgroundColor: '#f8f9fa' }} 
                />
              </div>
              <div>
                <Label>Discounted Amount</Label>
                <Input
                  type="text"
                  value={discount ? discountedAmount.toFixed(2) : ""}
                  placeholder="Discounted amount will appear here"
                  readOnly
                  style={{ width: '150px', backgroundColor: '#f8f9fa' }}
                />
              </div>
              <div>
                <Label>Net Amount</Label>
                <Input
                  type="text"
                  value={(discount ? discountedAmount : totalAmount).toFixed(2)}
                  readOnly
                  style={{ width: '150px', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default PatientForm;