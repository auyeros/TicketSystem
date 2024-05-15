import sgMail from '@sendgrid/mail';

// Ensure the API key is correctly read from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { to, subject, text, attachments } = req.body;
      const msg = {
        to,
        from: 'auyerosignacio@gmail.com', // Make sure this email is verified in SendGrid
        subject,
        text,
        attachments
      };
      await sgMail.send(msg);
      res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error in sending email:", error);
      res.status(500).json({ success: false, error: "Failed to send email", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}