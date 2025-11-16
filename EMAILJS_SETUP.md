# EmailJS Setup Guide

This guide will help you set up EmailJS to send emails directly from your contact form using your Gmail account.

## Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Sign up for a free account (200 emails/month free)
3. Verify your email address

## Step 2: Connect Gmail Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select **Gmail**
4. Click **Connect Account**
5. Sign in with your Gmail account (the one you want to send from)
6. Give your service a name (e.g., "Portfolio Contact")
7. Click **Create Service**
8. **Copy the Service ID** (you'll need this)

## Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}} ({{from_email}})

Message:
{{message}}

---
Sent from portfolio contact form
```

4. Set **To Email** to: `contact@settlerep.com`
5. Set **From Name** to: `{{from_name}}`
6. Set **Reply To** to: `{{from_email}}`
7. Click **Save**
8. **Copy the Template ID** (you'll need this)

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find **Public Key**
3. **Copy the Public Key**

## Step 5: Update Your Code

Open `script.js` and replace these three values:

1. Line 112: Replace `'YOUR_PUBLIC_KEY'` with your Public Key
2. Line 150: Replace `'YOUR_SERVICE_ID'` with your Service ID
3. Line 151: Replace `'YOUR_TEMPLATE_ID'` with your Template ID

Example:
```javascript
emailjs.init('abc123xyz'); // Your Public Key

// Later in the code:
const result = await emailjs.send(
    'service_abc123',  // Your Service ID
    'template_xyz789', // Your Template ID
    // ... rest of code
);
```

## Step 6: Test It!

1. Open your portfolio in a browser
2. Fill out the contact form
3. Submit it
4. Check your Gmail inbox at `contact@settlerep.com`

## That's It!

Your form will now send emails directly using your Gmail account. No email client popup, no third-party issues - just works!

## Troubleshooting

- **"EmailJS is not defined"**: Make sure the EmailJS script is loaded in `index.html`
- **"Invalid service ID"**: Double-check your Service ID in the EmailJS dashboard
- **"Invalid template ID"**: Double-check your Template ID in the EmailJS dashboard
- **Emails not arriving**: Check your Gmail spam folder, and verify the "To Email" in your template
