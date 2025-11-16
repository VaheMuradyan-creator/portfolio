# DNS Records Quick Reference for settlerep.com

Copy and paste these records into your DNS settings. The exact format depends on your DNS provider.

## Step 1: Add SPF Record

**Type:** TXT  
**Name:** `@` (or leave blank, or `settlerep.com`)  
**Value:** `v=spf1 include:_spf.google.com ~all`  
**TTL:** 3600 (or default)

**Note:** If using Gmail SMTP, use the value above. If using a different email service, replace `_spf.google.com` with your service's SPF include.

## Step 2: Add DKIM Record

### If using Google Workspace:
1. Go to Google Admin Console
2. Apps → Google Workspace → Gmail
3. Click "Authenticate email"
4. Copy the DKIM record provided
5. Add as TXT record with the name and value provided by Google

### If generating your own DKIM:
**Type:** TXT  
**Name:** `default._domainkey` (or `selector._domainkey`)  
**Value:** `v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY_HERE`  
**TTL:** 3600

**To generate DKIM keys:**
```bash
openssl genrsa -out private.key 1024
openssl rsa -in private.key -pubout -out public.key
```
Then extract the public key (without BEGIN/END lines) and add to DNS.

## Step 3: Add DMARC Record (Recommended)

**Type:** TXT  
**Name:** `_dmarc`  
**Value:** `v=DMARC1; p=none; rua=mailto:contact@settlerep.com`  
**TTL:** 3600

**DMARC Policy Options:**
- `p=none` - Monitor only (start here)
- `p=quarantine` - Send suspicious emails to spam
- `p=reject` - Reject suspicious emails (use after testing)

## Step 4: Verify Records

After adding records, wait 15-30 minutes, then verify:

### Online Tools:
- **SPF Checker:** https://mxtoolbox.com/spf.aspx
- **DKIM Checker:** https://mxtoolbox.com/dkim.aspx
- **DMARC Checker:** https://mxtoolbox.com/dmarc.aspx
- **All-in-one:** https://mxtoolbox.com/SuperTool.aspx

### Command Line:
```bash
# Check SPF
nslookup -type=TXT settlerep.com

# Check DKIM
nslookup -type=TXT default._domainkey.settlerep.com

# Check DMARC
nslookup -type=TXT _dmarc.settlerep.com
```

## Example DNS Records (Format varies by provider)

### GoDaddy Format:
```
Type: TXT
Host: @
Value: v=spf1 include:_spf.google.com ~all
TTL: 1 Hour
```

### Cloudflare Format:
```
Type: TXT
Name: @
Content: v=spf1 include:_spf.google.com ~all
TTL: Auto
```

### Namecheap Format:
```
Type: TXT Record
Host: @
Value: v=spf1 include:_spf.google.com ~all
TTL: Automatic (or 3600)
```

**Step-by-step for Namecheap:**
1. Log in to Namecheap
2. Go to **Domain List** → Click **Manage** next to settlerep.com
3. Go to **Advanced DNS** tab
4. Click **Add New Record**
5. Select **TXT Record**
6. **Host:** `@` (or leave blank)
7. **Value:** `v=spf1 include:_spf.google.com ~all`
8. **TTL:** Automatic (or 3600)
9. Click the checkmark to save

## Common Issues

### Records not showing up?
- Wait 15-30 minutes for DNS propagation
- Check for typos in the record values
- Make sure you're using the correct record type (TXT)

### SPF: FAIL
- Verify SPF record syntax
- Make sure you're sending from an authorized server
- Check that include statements are correct

### DKIM: FAIL
- Verify DKIM record is in DNS
- Check that your email server is signing with the correct key
- Ensure selector matches (default._domainkey)

## Next Steps

1. Add all three records (SPF, DKIM, DMARC)
2. Wait 15-30 minutes
3. Verify using online tools
4. Update your `.env` file with `FROM_EMAIL=contact@settlerep.com`
5. Test sending an email
6. Check email headers for authentication status

## Email Header Check

After sending a test email, check the headers for:
- `SPF: PASS`
- `DKIM: PASS`  
- `DMARC: PASS`

In Gmail: Open email → Click three dots → Show original → Look for Authentication-Results header.

