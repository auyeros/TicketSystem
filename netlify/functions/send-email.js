// /netlify/functions/send-email.js
const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const params = JSON.parse(event.body);

  const msg = {
    to: params.to,
    from: 'auyerosignacio@gmail.com', // Replace with your verified sender email
    subject: params.subject,
    text: params.text,
    html: params.html,
  };

  try {
    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email", details: error.toString() })
    };
  }
};