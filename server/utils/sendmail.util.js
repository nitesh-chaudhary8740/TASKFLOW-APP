// Example in a separate send-email.js file
require('dotenv').config(); // Load environment variables
console.log(process.env.MAIL_SERVICE_PASSWORD_7225)
const nodemailer = require('nodemailer');

// 1. Define the Transporter configuration
const transporter = nodemailer.createTransport({
    // Use 'service' for well-known providers like 'gmail', 'hotmail', etc.
    // This automatically sets the host, port, and security settings.
    service: 'gmail', 
    
    // OR specify custom SMTP settings:
    /*
    host: 'smtp.gmail.com', // or smtp-mail.outlook.com
    port: 465, // Use 465 for secure: true (SSL/TLS)
    secure: true, // Use TLS
    */
    
    // 2. Authentication Block
    auth: {
        // Use environment variables for security!
        user: process.env.EMAIL_USER, // e.g., 'your-email@gmail.com'
        pass: process.env.MAIL_SERVICE_PASSWORD_7225, // e.g., 'the-16-character-app-password'
    },
});
const sendEmail = async (to, subject, htmlContent, textContent) => {
    const mailOptions = {
        // Must be the email you authenticated with in the transporter
        from: '"NITESH TAKS MANAGER APP" <' + process.env.EMAIL_USER + '>', 
        to: to, // Recipient's address (can be comma-separated list)
        subject: subject, // Subject line
        text: textContent, // Plain text body
        html: htmlContent, // HTML body (for rich formatting)
        // attachments: [ ... ] // Optional: array for files
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        console.log('Message sent: %s', info);
        // Helpful for testing: log the preview URL for test accounts (e.g. Ethereal)
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports =sendEmail;