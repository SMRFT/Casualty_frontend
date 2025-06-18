// src/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }


 

  h2 {
     text-align: center;
  margin-bottom: 20px;
  color: #533527;

  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(21, 97, 109, 0.2);
  }

  h4 {
  text-align: center;
  margin-bottom: 20px;
  color: #533527;

  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(21, 97, 109, 0.2);
  }


  

  button {
    background-color: #5C403C; /* Accent Yellow */
    color:rgb(240, 238, 238);
    border: none;
    padding: 10px 16px;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }


 

  input, textarea, select {
    font-family: 'Poppins', sans-serif;
  }
`;

export default GlobalStyle;
