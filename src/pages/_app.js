import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';
import TicketForm from '../components/TicketForm';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <TicketForm {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;