const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Check if environment variables are set
// If using custom SMTP, Gmail credentials are optional
if (!process.env.SMTP_HOST && (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD)) {
    console.error('\n❌ ERROR: Missing email credentials!');
    console.error('Please create a .env file in the project root with:');
    console.error('Option 1 - Gmail:');
    console.error('  GMAIL_USER=your-email@gmail.com');
    console.error('  GMAIL_APP_PASSWORD=your-16-digit-app-password');
    console.error('Option 2 - Custom SMTP:');
    console.error('  SMTP_HOST=smtp.your-domain.com');
    console.error('  SMTP_USER=your-email@settlerep.com');
    console.error('  SMTP_PASSWORD=your-password');
    console.error('\nSee MANUAL_DKIM_SETUP.md for instructions.\n');
    process.exit(1);
}

// Clean and prepare credentials (remove spaces from app password)
const gmailUser = process.env.GMAIL_USER?.trim() || '';
const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '').trim() || ''; // Remove all spaces

if (!process.env.SMTP_HOST && gmailUser) {
    console.log(`\n📧 Gmail User: ${gmailUser}`);
    console.log(`🔑 App Password: ${'*'.repeat(gmailPassword.length)} (${gmailPassword.length} characters)\n`);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve your portfolio files

// Create transporter - supports Gmail or custom SMTP
let transporter;

if (process.env.SMTP_HOST) {
    // Custom SMTP server (for custom domain)
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || gmailUser,
            pass: process.env.SMTP_PASSWORD || gmailPassword
        },
        // DKIM signing (if you have DKIM keys)
        dkim: process.env.DKIM_PRIVATE_KEY ? {
            domainName: process.env.DKIM_DOMAIN || 'settlerep.com',
            keySelector: process.env.DKIM_SELECTOR || 'default',
            privateKey: process.env.DKIM_PRIVATE_KEY.replace(/\\n/g, '\n')
        } : undefined
    });
    console.log(`📧 Using custom SMTP: ${process.env.SMTP_HOST}`);
} else {
    // Gmail SMTP (default)
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPassword
        },
        // DKIM signing (if you have DKIM keys)
        dkim: process.env.DKIM_PRIVATE_KEY ? {
            domainName: process.env.DKIM_DOMAIN || 'settlerep.com',
            keySelector: process.env.DKIM_SELECTOR || 'default',
            privateKey: process.env.DKIM_PRIVATE_KEY.replace(/\\n/g, '\n')
        } : undefined
    });
    console.log(`📧 Using Gmail SMTP`);
    if (process.env.DKIM_PRIVATE_KEY) {
        console.log(`🔐 DKIM signing enabled for ${process.env.DKIM_DOMAIN || 'settlerep.com'}`);
    }
}

// Verify transporter on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('\n❌ Gmail connection error:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Make sure 2-Step Verification is enabled on your Google account');
        console.error('2. Verify you\'re using the 16-digit App Password (not your regular password)');
        console.error('3. Check that the app password was generated for "Mail"');
        console.error('4. Try generating a new app password from: https://myaccount.google.com/apppasswords');
        console.error('\nCurrent config:');
        console.error(`   User: ${gmailUser}`);
        console.error(`   Password length: ${gmailPassword.length} characters\n`);
    } else {
        console.log('✅ Gmail connection verified successfully\n');
    }
});

// Contact form endpoint
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Email options
        // Support for custom domain email
        const fromEmail = process.env.FROM_EMAIL || gmailUser;
        const recipientEmail = process.env.RECIPIENT_EMAIL || gmailUser;
        
        const mailOptions = {
            from: `Portfolio Contact <${fromEmail}>`, // Use custom domain if configured
            to: recipientEmail, // Where you want to receive emails
            replyTo: email, // So you can reply directly to the sender
            subject: `Portfolio Contact: ${subject}`,
            text: `
New message from your portfolio contact form:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from your portfolio contact form.
            `.trim(),
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Contact Form Message</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">Sent from portfolio contact form</p>
                </div>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent:', info.messageId);
        res.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Make sure you have set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file');
});

