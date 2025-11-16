// Vercel serverless function for sending emails
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

        // Get credentials from environment variables
        const gmailUser = process.env.GMAIL_USER?.trim() || '';
        const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '').trim() || '';
        const recipientEmail = process.env.RECIPIENT_EMAIL || gmailUser;
        const fromEmail = process.env.FROM_EMAIL || gmailUser;

        if (!gmailUser || !gmailPassword) {
            return res.status(500).json({ error: 'Email service not configured' });
        }

        // Create transporter
        let transporter;
        
        if (process.env.SMTP_HOST) {
            // Custom SMTP server
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER || gmailUser,
                    pass: process.env.SMTP_PASSWORD || gmailPassword
                },
                dkim: process.env.DKIM_PRIVATE_KEY ? {
                    domainName: process.env.DKIM_DOMAIN || 'settlerep.com',
                    keySelector: process.env.DKIM_SELECTOR || 'default',
                    privateKey: process.env.DKIM_PRIVATE_KEY.replace(/\\n/g, '\n')
                } : undefined
            });
        } else {
            // Gmail SMTP
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmailUser,
                    pass: gmailPassword
                },
                dkim: process.env.DKIM_PRIVATE_KEY ? {
                    domainName: process.env.DKIM_DOMAIN || 'settlerep.com',
                    keySelector: process.env.DKIM_SELECTOR || 'default',
                    privateKey: process.env.DKIM_PRIVATE_KEY.replace(/\\n/g, '\n')
                } : undefined
            });
        }

        // Email options
        const mailOptions = {
            from: `Portfolio Contact <${fromEmail}>`,
            to: recipientEmail,
            replyTo: email,
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
        
        return res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ 
            error: 'Failed to send email. Please try again later.' 
        });
    }
};

