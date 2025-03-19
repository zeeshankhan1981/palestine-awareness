# DNS Configuration for voiceforpalestine.xyz

This document outlines the DNS records you need to configure for your domain `voiceforpalestine.xyz` to point to your baremetal server.

## Required DNS Records

1. **A Record (Primary)**
   - **Type**: A
   - **Name**: @ (or voiceforpalestine.xyz)
   - **Value**: 65.109.156.106
   - **TTL**: 3600 (or as recommended by your DNS provider)

2. **A Record (www subdomain)**
   - **Type**: A
   - **Name**: www
   - **Value**: 65.109.156.106
   - **TTL**: 3600

3. **CNAME Record (Optional but recommended)**
   - **Type**: CNAME
   - **Name**: www
   - **Value**: voiceforpalestine.xyz
   - **TTL**: 3600

4. **CAA Record (Optional but recommended for SSL security)**
   - **Type**: CAA
   - **Name**: @
   - **Value**: 0 issue "letsencrypt.org"
   - **TTL**: 3600

## DNS Propagation

After updating these records, it may take up to 24-48 hours for the changes to propagate globally, although most updates are visible within a few hours.

## Verifying DNS Configuration

You can verify your DNS configuration using the following commands:

```bash
# Check A record
dig voiceforpalestine.xyz A

# Check www subdomain
dig www.voiceforpalestine.xyz A

# Check CNAME record
dig www.voiceforpalestine.xyz CNAME

# Check CAA record
dig voiceforpalestine.xyz CAA
```

## Important Notes

1. These DNS records will ensure that your domain properly points to your server (65.109.156.106)
2. The configuration won't interfere with your existing websites (pmimrankhan.xyz and frametheglobenews.xyz)
3. The SSL certificate will be automatically obtained during deployment using Let's Encrypt

## Troubleshooting

If you encounter issues with DNS configuration:

1. Verify that you've entered the correct IP address (65.109.156.106)
2. Check that there are no conflicting DNS records
3. Ensure your domain registrar's nameservers are properly configured
4. Use online DNS propagation checkers to verify global DNS updates
