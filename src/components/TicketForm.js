const sendEmailWithQRCode = async (to, qrCodeBase64, qrData) => {
  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        subject: 'Your QR Code',
        text: 'Here is your QR code for the event. Please check the attachment.',
        html: `<img src="${qrCodeBase64}" alt="QR Code" />`, // Adjust based on your requirements
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