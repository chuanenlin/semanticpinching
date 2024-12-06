import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

console.log("Main is running");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
