import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: 'auyerosignacio@gmail.com', // Your verified sender email
      subject,
      text,
      html,
    };
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email', error);
  }
};

export default sendEmail;
