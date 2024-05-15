// pages/purchase.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Purchase() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase.from('tickets').select('*');
        if (error) throw error;
        setTickets(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Tickets</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>
            <p>Name: {ticket.name}</p>
            <p>Venue: {ticket.venue}</p>
            {/* Display other ticket information as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}
