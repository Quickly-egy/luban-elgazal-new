import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import useLocationStore from './stores/locationStore.js'

// Initialize location detection
const initializeLocation = () => {
  const locationStore = useLocationStore.getState();
  if (!locationStore.countryCode) {
    locationStore.initializeLocation();
  }
};

// Initialize location when app starts
initializeLocation();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
