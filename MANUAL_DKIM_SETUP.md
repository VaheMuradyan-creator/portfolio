# Manual DKIM/SPF Setup for settlerep.com

This guide will help you set up DKIM, SPF, and DMARC records manually for your domain.

## Step 1: Access Your DNS Settings

1. Log in to your domain registrar (where you bought `settlerep.com`)
   - Common registrars: GoDaddy, Namecheap, Cloudflare, Google Domains
2. Find **DNS Management** or **DNS Settings**
3. Look for **DNS Records** or **Advanced DNS**

## Step 2: Add SPF Record

SPF (Sender Policy Framework) tells email servers which servers are allowed to send emails for your domain.

### Add this TXT record:

```
Type: TXT
Name: @ (or leave blank, or settlerep.com - depends on your DNS provider)
Value: v=spf1 include:_spf.google.com ~all
TTL: 3600 (or default)
```

**If you're using Gmail SMTP (current setup):**
```
v=spf1 include:_spf.google.com ~all
```

**If you're using a different email service, replace with:**
- **SendGrid**: `v=spf1 include:sendgrid.net ~all`
- **Mailgun**: `v=spf1 include:mailgun.org ~all`
- **Custom SMTP**: `v=spf1 ip4:YOUR_SERVER_IP ~all`

## Step 3: Add DKIM Record

DKIM (DomainKeys Identified Mail) adds a digital signature to your emails.

### Option A: If using Gmail/Google Workspace

1. Go to Google Admin Console (if you have Google Workspace)
2. Go to **Apps** → **Google Workspace** → **Gmail**
3. Click **Authenticate email**
4. Copy the DKIM record provided
5. Add it to your DNS as a TXT record

**If you don't have Google Workspace**, you'll need to:
- Sign up for Google Workspace, OR
- Use a different email service that provides DKIM keys

### Option B: Generate DKIM keys manually

If you're running your own email server, you can generate DKIM keys:

```bash
# Install OpenSSL if not already installed
# Then generate DKIM key pair
openssl genrsa -out private.key 1024
openssl rsa -in private.key -pubout -out public.key
```

Then add to DNS:
```
Type: TXT
Name: default._domainkey (or selector._domainkey)
Value: v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY_HERE
TTL: 3600
```

## Step 4: Add DMARC Record (Recommended)

DMARC (Domain-based Message Authentication) helps prevent email spoofing.

### Add this TXT record:

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:contact@settlerep.com
TTL: 3600
```

**DMARC Policy Options:**
- `p=none` - Monitor only (start with this)
- `p=quarantine` - Send suspicious emails to spam
- `p=reject` - Reject suspicious emails (use after testing)

## Step 5: Verify Your Records

### Check SPF:
```bash
nslookup -type=TXT settlerep.com
```
Look for: `v=spf1`

### Check DKIM:
```bash
nslookup -type=TXT default._domainkey.settlerep.com
```
Look for: `v=DKIM1`

### Check DMARC:
```bash
nslookup -type=TXT _dmarc.settlerep.com
```
Look for: `v=DMARC1`

### Online Tools:
- https://mxtoolbox.com/spf.aspx
- https://mxtoolbox.com/dkim.aspx
- https://mxtoolbox.com/dmarc.aspx

## Step 6: Update Your Server Code

I'll update `server.js` to use your custom domain properly.

## Step 7: Test Email Delivery

1. Send a test email
2. Check the email headers for:
   - `SPF: PASS`
   - `DKIM: PASS`
   - `DMARC: PASS`

## Common Issues

### "SPF: FAIL"
- Check that your SPF record is correct
- Make sure you're sending from an authorized server
- Wait 24-48 hours for DNS propagation

### "DKIM: FAIL"
- Verify DKIM record is in DNS
- Check that your email server is signing emails with the correct key
- Ensure the selector matches (default._domainkey)

### "Relay access denied"
- Your sending server isn't authorized in SPF
- Add your server's IP to the SPF record

## DNS Propagation

DNS changes can take:
- **5 minutes** to **48 hours** to propagate
- Usually takes 15-30 minutes
- Use DNS checker tools to verify

## Next Steps

After adding DNS records:
1. Wait 15-30 minutes for propagation
2. Verify records using online tools
3. Update your server code (I'll do this next)
4. Test sending an email
5. Check email headers for authentication

