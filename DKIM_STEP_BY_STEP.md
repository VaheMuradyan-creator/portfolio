# DKIM Setup - Step by Step Guide

This guide will walk you through generating and setting up DKIM keys for your domain.

## What is DKIM?

DKIM (DomainKeys Identified Mail) adds a digital signature to your emails. This proves that emails really came from your domain and haven't been tampered with. It helps prevent spam and improves email deliverability.

## Step-by-Step DKIM Setup

### Step 1: Install OpenSSL (if not already installed)

**Windows:**
1. Download OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html
2. Install it (choose "Copy OpenSSL DLLs to" option during install)
3. Or use Git Bash (if you have Git installed) - it includes OpenSSL

**Mac:**
- OpenSSL is usually pre-installed. Check by running: `openssl version`

**Linux:**
- Usually pre-installed. If not: `sudo apt-get install openssl` (Ubuntu/Debian)

### Step 2: Generate DKIM Key Pair

Open your terminal/command prompt and navigate to your project folder:

```bash
cd C:\Users\Gugo3\Desktop\Projects\portfolio
```

**Generate the private key:**
```bash
openssl genrsa -out dkim_private.key 1024
```

This creates a file called `dkim_private.key` - **KEEP THIS SECRET!**

**Generate the public key from the private key:**
```bash
openssl rsa -in dkim_private.key -pubout -out dkim_public.key
```

This creates `dkim_public.key` - this goes in your DNS.

### Step 3: Extract the Public Key for DNS

Open `dkim_public.key` in a text editor. It will look like:

```
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
(more characters here)
...
-----END PUBLIC KEY-----
```

**You need to:**
1. Remove the `-----BEGIN PUBLIC KEY-----` line
2. Remove the `-----END PUBLIC KEY-----` line
3. Remove all line breaks/spaces
4. Keep only the characters in between

**Example:**
If your public key is:
```
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1234567890abcdef
-----END PUBLIC KEY-----
```

Your DNS value should be:
```
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1234567890abcdef
```

### Step 4: Add DKIM Record to Namecheap DNS

1. Log in to Namecheap
2. Go to **Domain List** → Click **Manage** next to `settlerep.com`
3. Click **Advanced DNS** tab
4. Click **Add New Record**
5. Select **TXT Record**
6. Fill in:
   - **Host:** `default._domainkey`
   - **Value:** `v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY_HERE`
     - Replace `YOUR_PUBLIC_KEY_HERE` with the public key from Step 3 (no spaces, no BEGIN/END lines)
   - **TTL:** Automatic
7. Click the checkmark (✓) to save

**Example of what the Value should look like:**
```
v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
```

### Step 5: Add DKIM Private Key to Your Server

1. Open your `.env` file
2. Add these lines:

```
DKIM_DOMAIN=settlerep.com
DKIM_SELECTOR=default
DKIM_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT_HERE\n-----END RSA PRIVATE KEY-----
```

**Important:** 
- Open `dkim_private.key` file
- Copy the ENTIRE content (including BEGIN and END lines)
- Replace all actual line breaks with `\n` (backslash followed by n)
- Or keep it as a multi-line string in your .env file

**Example format:**
```
DKIM_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n(more lines)\n...\n-----END RSA PRIVATE KEY-----
```

### Step 6: Update Your Server Code (Already Done!)

The `server.js` file already has DKIM support built in. It will automatically:
- Read the DKIM keys from your `.env` file
- Sign outgoing emails with your DKIM key
- Add the DKIM signature to email headers

### Step 7: Verify DKIM Setup

**Wait 15-30 minutes** for DNS propagation, then:

1. **Online Check:**
   - Go to: https://mxtoolbox.com/dkim.aspx
   - Enter: `default._domainkey.settlerep.com`
   - Click "DKIM Lookup"
   - Should show your DKIM record

2. **Command Line Check:**
   ```bash
   nslookup -type=TXT default._domainkey.settlerep.com
   ```
   Should return your DKIM record.

3. **Test Email:**
   - Send a test email from your contact form
   - Check the email headers (in Gmail: Open email → Three dots → Show original)
   - Look for: `DKIM-Signature:` header
   - Check for: `Authentication-Results: ... dkim=pass`

### Step 8: Restart Your Server

After updating `.env` with DKIM keys:

```bash
npm start
```

The server will automatically use DKIM signing for all outgoing emails.

## Troubleshooting

### "DKIM: FAIL" in email headers
- Check that DNS record is correct (wait for propagation)
- Verify private key in `.env` is correct (with `\n` for line breaks)
- Make sure selector matches (`default._domainkey`)

### "Invalid key format"
- Make sure private key includes BEGIN and END lines
- Replace actual line breaks with `\n` in .env file
- Don't add extra spaces

### DNS record not showing up
- Wait 15-30 minutes for propagation
- Check for typos in Host name (`default._domainkey`)
- Verify the Value doesn't have extra spaces

## Security Notes

⚠️ **IMPORTANT:**
- **NEVER** commit `dkim_private.key` to git (it's already in `.gitignore`)
- **NEVER** share your private key
- Keep `dkim_private.key` file secure
- Only the public key goes in DNS

## Quick Checklist

- [ ] OpenSSL installed
- [ ] Generated private key (`dkim_private.key`)
- [ ] Generated public key (`dkim_public.key`)
- [ ] Extracted public key (removed BEGIN/END lines)
- [ ] Added DKIM TXT record to Namecheap DNS
- [ ] Added DKIM keys to `.env` file
- [ ] Waited 15-30 minutes for DNS propagation
- [ ] Verified DKIM record using online tool
- [ ] Restarted server
- [ ] Tested email and checked headers

## Need Help?

If you get stuck:
1. Check the error message in server console
2. Verify DNS record using mxtoolbox.com
3. Make sure private key format is correct in `.env`
4. Check that selector matches (`default._domainkey`)

