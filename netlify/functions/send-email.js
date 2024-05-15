const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  // Ensure the function only responds to POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const params = JSON.parse(event.body);
    if (!params.to || !params.subject || !params.text) {
      return { statusCode: 400, body: "Missing required email parameters" };
    }

    const msg = {
      to: params.to,
      from: 'auyerosignacio@gmail.com', // Replace with your verified sender email
      subject: params.subject,
      text: params.text,
      html: params.html || params.text, // Use text as HTML if HTML not provided
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" })
    };
  } catch (error) {
    console.error("Error in sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email", details: error.message })
    };
  }
};