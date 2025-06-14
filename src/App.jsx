
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import { messageAPI } from './services/endpoints';
import { ROUTES } from './constants/app';
import { queryClient } from './lib/queryClient';

function App() {
  
  useEffect(() => {
    const sendInitialMessage = async () => {
      try {
        console.log('Sending initial message...');
        const response = await messageAPI.sendMessage();
        console.log('Message sent successfully:', response);
      } catch (error) {
        console.error('Failed to send initial message:', error);
      }
    };

    sendInitialMessage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.PRODUCTS} element={<Products />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App
