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
      const emailSent = await sendEmailWithQRCode(correo, qrCodeBase64, qrData);
      const { data, error: dbError } = await supabase.from('tickets').insert([{ name, correo, qrCode: qrData }]);
      if (dbError) {
        throw new Error(dbError.message);
      }
      setShowSuccessMessage(true);
      if (!emailSent) {
        setError('Failed to send email, but QR code was generated and saved.');
      }
    } catch (error) {
      setError(error.message);
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailWithQRCode = async (to, qrCodeBase64, qrData) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to,
          subject: 'Tu codigo QR',
          text: 'Acá te mandamos tu QR como archivo adjunto. Por favor no lo pierdas y asegurate de no compartirlo.',
          attachments: [{
            content: qrCodeBase64.split("base64,")[1],
            filename: "QR.png",
            type: "image/png",
            disposition: "attachment",
            content_id: "QR"
          }]
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        console.error('Failed to send email:', data.error);
        return false; // Return false to indicate failure
      }
      console.log('Email sent successfully!');
      return true; // Return true to indicate success
    } catch (error) {
      console.error('Error sending email:', error);
      return false; // Return false to indicate failure
    }
  };

  const generateQRCodeBase64 = async (data) => {
    try {
      return await QRCode.toDataURL(data);
    } catch (err) {
      console.error('Failed to generate QR code', err);
      setError(err.message);
    }
  };

  const handleReset = () => {
    setName('');
    setCorreo('');
    setQRCodeData('');
    setShowSuccessMessage(false);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Generar Codigo QR</h2>
      <div className={styles.card}>
        <label> Nombre: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> </label>
        <br />
        <label> Correo: <input type="text" value={correo} onChange={(e) => setCorreo(e.target.value)} /> </label>
        <br />
        <button onClick={handleGenerateQRCode} disabled={loading}>Generar QR</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className={styles['qr-code-text']}>Error: {error}</p>}
      {showSuccessMessage && (
        <div className={styles.card}>
          <p className={`${styles['qr-code-text']} ${styles['success-message']}`}>QR generado y email enviado!</p>
          <button onClick={handleReset}>OK</button>
        </div>
      )}
    </div>
  );
}