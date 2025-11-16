# Backend Setup Guide - Gmail App Password

This guide will help you set up a simple Node.js backend that sends emails using your Gmail account with an app password.

## Step 1: Get Your Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Under "How you sign in to Google", click **2-Step Verification** (you need this enabled)
4. Scroll down and click **App passwords**
5. Select **Mail** and **Other (Custom name)**
6. Type "Portfolio Contact Form" and click **Generate**
7. **Copy the 16-digit password** (it looks like: `abcd efgh ijkl mnop`)
   - Keep this safe! You'll need it in Step 3

## Step 2: Install Node.js

If you don't have Node.js installed:
1. Download from: https://nodejs.org/
2. Install it (includes npm)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Step 3: Set Up the Backend

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   - Copy `.env.example` to `.env`
   - Open `.env` and fill in:
     ```
     GMAIL_USER=your-email@gmail.com
     GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
     PORT=3000
     ```
   - Replace with your actual Gmail and the 16-digit app password from Step 1
   - **Important:** Use the app password, NOT your regular Gmail password!

## Step 4: Start the Server

```bash
npm start
```

You should see:
```
Server running on http://localhost:3000
Make sure you have set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file
```

## Step 5: Test the Form

1. Open `index.html` in your browser (or serve it: `python -m http.server 8000`)
2. Fill out the contact form
3. Submit it
4. Check your email at `contact@settlerep.com`

## Step 6: Update API URL for Production

When you deploy your backend (e.g., to Heroku, Railway, Render, etc.):

1. Update `API_URL` in `script.js`:
   ```javascript
   const API_URL = 'https://your-backend-url.com';
   ```

2. Set environment variables on your hosting platform:
   - `GMAIL_USER=your-email@gmail.com`
   - `GMAIL_APP_PASSWORD=your-16-digit-password`
   - `PORT=3000` (or let the platform set it)

## Troubleshooting

### "Cannot find module 'express'"
- Run: `npm install`

### "Invalid login" or authentication error
- Make sure you're using the **16-digit app password**, not your regular Gmail password
- Make sure 2-Step Verification is enabled on your Google account
- Check that there are no extra spaces in your `.env` file

### "Port 3000 already in use"
- Change `PORT=3001` in your `.env` file
- Update `API_URL` in `script.js` to match

### CORS errors
- Make sure `cors` is installed: `npm install cors`
- The server already has CORS enabled, so this shouldn't happen

### Emails not arriving
- Check your spam folder
- Verify the `to` email in `server.js` is correct
- Check server logs for error messages

## Development Tips

- Use `npm run dev` for auto-restart on file changes (requires nodemon)
- Check server console for email sending logs
- Test the endpoint directly:
  ```bash
  curl -X POST http://localhost:3000/send-email \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Hello"}'
  ```

## Security Notes

- **Never commit `.env` file to git** (it's already in `.gitignore`)
- Keep your app password secret
- For production, use environment variables on your hosting platform
- Consider adding rate limiting to prevent spam

