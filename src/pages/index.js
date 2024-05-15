// pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import TicketForm from '../components/TicketForm'; // Correctly imported

const Home = () => {
  const [loading, setLoading] = useState(false); // State for loading indicator

  return (
    <div className={styles.container}>
      <Head>
        <title>Ticketing System</title>
        <meta name="description" content="A simple ticketing system using QR codes and Supabase" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the Ticketing System
        </h1>

        <div className={styles.grid}>
          {loading ? (
            <div className={styles.card}>
              Loading...
            </div>
          ) : (
            <TicketForm className={styles.card} />
          )}
          <div className={styles.card}>
            <div>
              <h2>Scan Ticket &rarr;</h2>
              <p>Scan a ticket's QR code to validate entry.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <img src="/nextjs.svg" alt="Next.js Logo" />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;