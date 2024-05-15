import React, { useState } from 'react';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/TicketForm.module.css';

export default function TicketForm() {
  const [name, setName] = useState('');
  const [correo, setCorreo] = useState('');
  const [qrCodeData, setQRCodeData] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleGenerateQRCode = async () => {
    if (!name || !correo) {
      setError('Name and correo are required.');
      return;
    }
    setLoading(true);
    const qrData = `${name}, ${correo}`;
    setQRCodeData(qrData);

    try {
      const qrCodeBase64 = await generateQRCodeBase64(qrData);
      await sendEmailWithQRCode(correo, qrCodeBase64, qrData);
      const { data, error } = await supabase.from('tickets').insert([{ name, correo, qrCode: qrData }]);
      if (error) {
        setError(error.message);
      } else {
        console.log('QR code data saved to Supabase:', data);
        setShowSuccessMessage(true);
      }
    } catch (error) {
      setError('An error occurred while generating the QR code. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const sendEmailWithQRCode = async (to, qrCodeBase64, qrData) => {
    const response = await fetch('/ticketing-system/netlify/functions/send-email.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        subject: 'Que haces rey mira te mando un qr',
        text: 'Aca tenés tu QR para nuestro evento! ',
        html: `<strong>Acá tenés tu QR para nuestro evento: Asegurate de descargarlo y no perderlo ni compartirlo ya que es único.</strong><br/><img src="${qrCodeBase64}" alt="QR Code" />`,
        qrCodeData: qrData
      }),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error('Failed to send email');
    }
    console.log('Email sent successfully!');
  };

  const generateQRCodeBase64 = async (data) => {
    try {
      return await QRCode.toDataURL(data);
    } catch (err) {
      console.error('Failed to generate QR code', err);
    }
  };

  const handleReset = () => {
    setName('');
    setCorreo('');
    setQRCodeData('');
    setShowSuccessMessage(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Generate QR Code</h2>
      <div className={styles.card}>
        <label> Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> </label>
        <br />
        <label> Correo: <input type="text" value={correo} onChange={(e) => setCorreo(e.target.value)} /> </label>
        <br />
        <button onClick={handleGenerateQRCode} disabled={loading}>Generate QR Code</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className={styles['qr-code-text']}>Error: {error}</p>}
      {showSuccessMessage && (
        <div className={styles.card}>
          <p className={`${styles['qr-code-text']} ${styles['success-message']}`}>QR code generated and email sent successfully!</p>
          <button onClick={handleReset}>OK</button>
        </div>
      )}
    </div>
  );
}