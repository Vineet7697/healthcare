import { StrictMode } from 'react'
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)


// import React from "react";

// import ReactDOM from "react-dom/client";

// import App from "./App";

// import {
//   AuthProvider,
// } from "./context/AuthContext";

// ReactDOM.createRoot(
//   document.getElementById("root"),
// ).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>,
// );