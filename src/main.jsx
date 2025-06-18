import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

function setforlocaldev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoiU2l2YXN1bmRhcnNtcmZ0QGdtYWlsLmNvbSIsIm5hbWUiOiJTaXZhc3VuZGFyaSIsImFsbG93ZWQtYWN0aW9ucyI6WyJTRC1QLUJHLVJXIiwiU0QtUC1MVEEtUlciLCJNREMtQVBJLVBBVC1SIiwiRVItUi1FUk4iLCJTRC1QLVJHLVJXIiwiU0QtUC1PRC1SIiwiTURDLVAtT1NCLVJXIiwiTURDLVAtUkVHLVIiLCJTRC1QLVJFRy1SVyIsIlNELVAtU0MtUlciLCJTRC1QLVJCLVJXIiwiU0QtUC1TVlJPLVJXIiwiU0lOLVAtT1ItUiIsIlNELVAtQ1QtUlciLCJTRC1QLVNWUkktUlciLCJTSU4tUC1VUC1SIiwiU0QtUC1MQS1SVyIsIlNJTi1QLUlGLVIiLCJNREMtUC1QTlAtUlciLCJNREMtUC1UUkItUlciLCJTRC1QLUxELVJXIiwiTURDLUFQSS1USFItUiIsIlNELVAtU1ZELVJXIiwiU0QtUC1UREUtUlciLCJTRC1QLVJBLVJXIiwiRVItUC1SRS1SVyIsIkVSLVAtRE9DLVIiLCJTRC1QLVNWRi1SVyIsIk1EQy1QLUFTTS1SVyIsIlNELVAtUkQtUlciLCJTRC1QLUNOLVJXIiwiTURDLUFQSS1DRFItUiIsIlNELVAtUE8tUlciLCJTRC1QLUlOVi1SVyIsIlNELVAtVVItUlciLCJTRC1QLVBGRS1SVyIsIlNELVAtTUlTLVJXIiwiTURDLVAtU09SLVIiLCJFUi1QLUNGLVIiLCJTRC1QLUJJTEwtUlciLCJNREMtQVBJLUxCTi1SIiwiTURDLUFQSS1SVFMtUiIsIlNELVAtQ0ItUlciLCJNREMtUC1SRUctUlciLCJHTC1QLUVQTS1SVyIsIkVSLVAtUEItUiIsIlNELVAtU0EtUlciLCJTSU4tUC1EQy1SIiwiTURDLUFQSS1HQVMtUiIsIk1EQy1QLVBOUC1SIiwiRVItUC1DRi1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzUwMjM4Nzg0LCJleHAiOjE3NTAzMjUxODQsImp0aSI6ImRmN2I0MDhjLWJiZjktNGYyMy05ZTAyLWYxNDBlN2IzN2JkYiJ9.RYyNSuHVXjF4U5VoffKvgkBwthwjDgi6X0u6VGCZ15dKC93SugA9o_NHkvbP6QgPNb2eKvMhk4YneOMdk0YOkN-8c7V8OBQ3OjBYzkLIbixfKnIUs4n5EnyBODc_fL2n-Q3iDM7T6IBbdGdqyG_GrkmWdC9pYXdijQnyAWS0scFddydtAC_ZVvip4_IlVs5FsUtzvsx68fesCibv8hXvFuRLq192DnQe-W0JSF3yuF0edFrCwRuxcp6GDDgKZJJ5Uc1CmU3beWdutTvv8Hs-l_9gFTuhkkr6DtKvOBFkCqaJKVezRHNKYG6RGdqypi9alVHPJ4T4abeZ8kY7l0hzOA";
  localStorage.setItem("access_token", dev_token);
  return dev_token;
}

function validate(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error('Token expired');
    }
    return payload;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

let accessToken = localStorage.getItem('access_token');

// ✅ Only set dev token if local env is enabled
if (!accessToken && import.meta.env.VITE_LOCAL_DEV_ENVIRONMENT === 'true') {
  accessToken = setforlocaldev();
}

// ✅ Main app logic
(function main() {
  try {
    if (!accessToken) throw new Error('No token found');

    const userPayload = validate(accessToken);

    const allowedActions = userPayload["allowed-actions"] || [];

    localStorage.setItem('user_payload', JSON.stringify(userPayload));
    localStorage.setItem('Allowed', JSON.stringify(allowedActions));

    // Set role
    let role = 'ER Nurse'; // default
    if (allowedActions.includes("ER-R-ERA")) {
      role = 'ER Admin';
    } else if (allowedActions.includes("ER-R-ERN")) {
      role = 'ER Nurse';
    }
    localStorage.setItem('role', role);

    // ✅ Redirect to default route on first load (optional)
    const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
    const path = window.location.pathname;

    if (path === "/" || path === `${baseUrl}/`) {
      if (role === "ER Admin") {
        window.location.replace(`${baseUrl}/PatientRegistrationForm`);
        return;
      } else if (role === "ER Nurse") {
        window.location.replace(`${baseUrl}/PatientList`);
        return;
      }
    }

    // ✅ Finally render the app
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>
    );

  } catch (err) {
    console.error('Token validation failed:', err.message);
    localStorage.clear();

    // ✅ Redirect to external login
    window.location.href = import.meta.env.VITE_LOGIN_REDIRECT_URL;
  }
})();
