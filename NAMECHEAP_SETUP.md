# Namecheap DNS Setup for settlerep.com

Step-by-step guide for adding SPF, DKIM, and DMARC records in Namecheap.

## Accessing DNS Settings

1. Log in to your Namecheap account
2. Go to **Domain List**
3. Click **Manage** next to `settlerep.com`
4. Click on the **Advanced DNS** tab

## Step 1: Add SPF Record

Since you're using Gmail SMTP, add this SPF record:

1. Click **Add New Record**
2. Select **TXT Record**
3. Fill in:
   - **Host:** `@` (or leave blank - both work)
   - **Value:** `v=spf1 include:_spf.google.com ~all`
   - **TTL:** Automatic (or 3600)
4. Click the **checkmark** (✓) to save

**Important:** This tells email servers that Gmail is authorized to send emails for your domain.

## Step 2: Add DKIM Record

### Option A: If you have Google Workspace
1. Go to Google Admin Console
2. Apps → Google Workspace → Gmail
3. Click **Authenticate email**
4. Copy the DKIM record (it will look like: `default._domainkey.settlerep.com`)
5. In Namecheap:
   - **Host:** `default._domainkey` (or whatever Google provides)
   - **Value:** (the long string Google gives you, starts with `v=DKIM1`)
   - **TTL:** Automatic

### Option B: If generating your own DKIM
You'll need to generate DKIM keys first (see MANUAL_DKIM_SETUP.md), then:
- **Host:** `default._domainkey`
- **Value:** `v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY_HERE`
- **TTL:** Automatic

## Step 3: Add DMARC Record (Recommended)

1. Click **Add New Record**
2. Select **TXT Record**
3. Fill in:
   - **Host:** `_dmarc`
   - **Value:** `v=DMARC1; p=none; rua=mailto:contact@settlerep.com`
   - **TTL:** Automatic
4. Click the **checkmark** (✓) to save

**DMARC Policy Options:**
- `p=none` - Monitor only (start with this)
- `p=quarantine` - Send suspicious emails to spam
- `p=reject` - Reject suspicious emails (use after testing)

## Step 4: Verify Your Records

After adding all records:

1. **Wait 15-30 minutes** for DNS propagation
2. Verify using online tools:
   - https://mxtoolbox.com/spf.aspx (for SPF)
   - https://mxtoolbox.com/dkim.aspx (for DKIM)
   - https://mxtoolbox.com/dmarc.aspx (for DMARC)
   - https://mxtoolbox.com/SuperTool.aspx (all-in-one)

3. Or use command line:
   ```bash
   nslookup -type=TXT settlerep.com
   nslookup -type=TXT default._domainkey.settlerep.com
   nslookup -type=TXT _dmarc.settlerep.com
   ```

## Quick Reference - All Records

| Type | Host | Value | TTL |
|------|------|-------|-----|
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` | Automatic |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:contact@settlerep.com` | Automatic |
| TXT | `default._domainkey` | (Get from Google Workspace or generate) | Automatic |

## Common Issues

### "Host already exists"
- You might already have a TXT record for `@`
- Edit the existing record instead of creating a new one
- You can have multiple TXT records, but SPF should be in one record

### Records not showing up
- Wait 15-30 minutes for DNS propagation
- Clear your DNS cache: `ipconfig /flushdns` (Windows)
- Check for typos in the values

### SPF: FAIL
- Make sure the value is exactly: `v=spf1 include:_spf.google.com ~all`
- No extra spaces or quotes
- Verify you're using Gmail SMTP (not a different service)

## After Setup

Once all records are verified:

1. Update your `.env` file:
   ```
   FROM_EMAIL=contact@settlerep.com
   RECIPIENT_EMAIL=contact@settlerep.com
   ```

2. Restart your server:
   ```bash
   npm start
   ```

3. Test sending an email from your contact form

4. Check email headers for:
   - `SPF: PASS`
   - `DKIM: PASS`
   - `DMARC: PASS`

## Need Help?

- Namecheap Support: https://www.namecheap.com/support/
- DNS Propagation Checker: https://www.whatsmydns.net/
- Email Authentication Checker: https://mxtoolbox.com/SuperTool.aspx

