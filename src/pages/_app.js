import React, { lazy, Suspense } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

const LazyComponent = lazy(() => import('../components/TicketForm'));

function MyApp({ Component, pageProps }) {
  const MemoizedLazyComponent = React.memo(LazyComponent); // Memoizing the lazy-loaded component

  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <MemoizedLazyComponent {...pageProps} />
      </Suspense>
    </AuthProvider>
  );
}

export default MyApp;