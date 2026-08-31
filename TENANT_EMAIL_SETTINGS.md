# Tenant Email Configuration - Settings Page Guide

## Overview

The Settings page (`Settings.jsx`) in the React frontend provides the interface for tenant admins to configure email settings for their hospital/clinic. This configuration is used by the backend to send all tenant-related notifications, appointment reminders, and patient communications.

## Location

- **File**: `HMS_React/src/pages/Settings.jsx`
- **Routes**: `/settings` (accessible to tenant admins)
- **Sections**: Settings → Communication tab

## User Interface

### Communication Tab

When a tenant admin navigates to Settings → Communication, they will see two tabs:
1. **Email** - Configure email/SMTP settings
2. **SMS** - Configure SMS provider (future feature)

### Email Configuration Section

#### Input Fields:

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| Email Enabled | Toggle | Enable/disable email notifications | Yes |
| From Email | Email Input | Sender email address (e.g., noreply@hospital.com) | Yes (if enabled) |
| From Name | Text Input | Display name for sender (e.g., "St. Mary's Hospital") | Yes (if enabled) |
| Email Provider | Dropdown | Type of email provider (default, gmail, sendgrid, custom) | Yes |
| SMTP Host | Text Input | SMTP server address (e.g., smtp.gmail.com) | Yes (if custom) |
| SMTP Port | Number Input | SMTP port (default: 587) | Yes |
| SMTP Username | Text Input | SMTP authentication username | Yes (if using auth) |
| SMTP Password | Password Input | SMTP authentication password (encrypted) | Yes (if using auth) |
| Use TLS | Toggle | Enable TLS encryption (recommended) | Yes |

## How It Works

### 1. Tenant Admin Setup

```
Tenant Admin Login
    ↓
Navigate to Settings → Communication
    ↓
Click "Email" tab
    ↓
Enable Email Notifications (toggle)
    ↓
Enter:
  - From Email: noreply@myhospital.com
  - From Name: My Hospital
  - SMTP Host: smtp.gmail.com
  - SMTP Port: 587
  - SMTP Username: noreply@myhospital.com
  - SMTP Password: [App Password]
  - Use TLS: ON
    ↓
Click "Save Settings"
    ↓
Backend validates and encrypts password
    ↓
Settings saved to CommunicationProfile
```

### 2. Email Sending Flow

```
Patient books appointment
    ↓
System generates appointment reminder
    ↓
Backend retrieves CommunicationProfile for tenant
    ↓
Uses tenant's configured SMTP settings
    ↓
Sends email from noreply@myhospital.com
```

## Frontend API Integration

### Get Current Communication Settings
```javascript
// In Settings.jsx
const loadCommunicationProfile = async () => {
  try {
    const profile = await tenantSettingsApi.getCommunicationProfile();
    setCommunication({
      id: profile.id,
      email_enabled: profile.email_enabled,
      email_from: profile.email_from,
      from_name: profile.from_name,
      email_provider: profile.email_provider,
      email_host: profile.email_host,
      email_port: profile.email_port,
      email_username: profile.email_username,
      email_password: profile.email_password,
      email_use_tls: profile.email_use_tls,
      // ... other fields
    });
  } catch (error) {
    console.error('Unable to load communication profile:', error);
  }
};
```

### Save Communication Settings
```javascript
// In Settings.jsx
const handleSaveCommunicationSettings = async () => {
  try {
    setSaving(true);
    const response = await tenantSettingsApi.updateCommunicationProfile(communication);
    setMessage('Communication settings saved successfully!');
    setMessageType('success');
  } catch (error) {
    setMessage('Error saving communication settings: ' + error.message);
    setMessageType('error');
  } finally {
    setSaving(false);
  }
};
```

## Backend API Endpoints

### Get Communication Profile
```
GET /api/v1/tenants/settings/communication-profile/current/
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 123,
  "tenant": "clinic-123",
  "email_enabled": true,
  "email_from": "noreply@hospital.com",
  "from_name": "St. Mary's Hospital",
  "email_provider": "gmail",
  "email_host": "smtp.gmail.com",
  "email_port": 587,
  "email_username": "noreply@hospital.com",
  "email_password": "[encrypted]",
  "email_use_tls": true,
  "reply_to": "support@hospital.com",
  "verified_domain": "hospital.com",
  "sms_enabled": false,
  "sms_provider": "default",
  "consent_tracking_enabled": true,
  "dnd_enabled": false
}
```

### Update Communication Profile
```
PUT /api/v1/tenants/settings/communication-profile/current/
PATCH /api/v1/tenants/settings/communication-profile/current/
Authorization: Bearer {token}
Content-Type: application/json

{
  "email_enabled": true,
  "email_from": "noreply@hospital.com",
  "from_name": "St. Mary's Hospital",
  "email_provider": "gmail",
  "email_host": "smtp.gmail.com",
  "email_port": 587,
  "email_username": "noreply@hospital.com",
  "email_password": "[new-password]",
  "email_use_tls": true
}
```

## Configuration Examples

### Example 1: Gmail

```
Provider: Gmail
Email: admin@gmail.com
From Email: noreply@hospital.gmail.com
From Name: St. Mary's Hospital

SMTP Settings:
  Host: smtp.gmail.com
  Port: 587
  Username: noreply@hospital.gmail.com
  Password: [Gmail App Password]
  TLS: ON
```

**Note**: For Gmail, use an **App Password**, not your regular Gmail password. Generate at: https://myaccount.google.com/apppasswords

### Example 2: SendGrid

```
Provider: SendGrid
From Email: noreply@hospital.com
From Name: St. Mary's Hospital

SMTP Settings:
  Host: smtp.sendgrid.net
  Port: 587
  Username: apikey
  Password: [SendGrid API Key]
  TLS: ON
```

### Example 3: Office 365 / Outlook

```
Provider: Office365
From Email: noreply@hospital.onmicrosoft.com
From Name: St. Mary's Hospital

SMTP Settings:
  Host: smtp.office365.com
  Port: 587
  Username: noreply@hospital.onmicrosoft.com
  Password: [Office 365 Password]
  TLS: ON
```

### Example 4: Custom SMTP Server

```
Provider: Custom
From Email: noreply@hospital.com
From Name: St. Mary's Hospital

SMTP Settings:
  Host: mail.yourmailserver.com
  Port: 465 (SSL) or 587 (TLS)
  Username: [your username]
  Password: [your password]
  TLS: ON (or OFF if using SSL port 465)
```

## Validation

The Settings page performs the following validations:

### Client-Side (React)
- Email format validation for `email_from`
- Port number validation (1-65535)
- Required field validation when email is enabled
- Password strength indication

### Server-Side (Django)
- Email format validation
- SMTP connection test (optional)
- Encryption of password before storage
- Permission checks (only tenant admins)

## Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid email format" | Email field not valid | Use proper email format (name@domain.com) |
| "Port must be between 1-65535" | Port number out of range | Use valid port (usually 587 or 465) |
| "SMTP authentication failed" | Wrong credentials | Verify username/password with email provider |
| "Email not configured for tenant" | Email settings not saved | Ensure you saved changes |
| "Cannot save while another save is in progress" | Concurrent save attempt | Wait for current save to complete |

## Security Features

1. **Password Encryption**
   - Passwords are encrypted before storage in database
   - Only admins can view/change passwords

2. **Input Validation**
   - Email addresses validated
   - SMTP parameters checked
   - Required fields enforced

3. **Access Control**
   - Only tenant root admins can modify settings
   - Audit logs track changes
   - Session-based authentication required

4. **HTTPS Only**
   - Settings always transmitted over HTTPS
   - Passwords never stored in plain text

## Testing Your Configuration

### Step 1: Save Settings
1. Go to Settings → Communication
2. Enter your email configuration
3. Click "Save Settings"

### Step 2: Test with System Action
1. Trigger an action that sends email (e.g., schedule appointment)
2. Check recipient's inbox
3. Verify email came from configured sender address

### Step 3: Check Backend Logs
```bash
# On server
tail -f logs/emails.log

# Look for entries like:
# [INFO] Sending email via smtp from "St. Mary's Hospital <noreply@hospital.com>" to patient@example.com
```

## What Happens After Settings Change

When a tenant admin saves new email configuration:

1. **Frontend** validates input
2. **Backend API** receives update
3. **Backend** encrypts password
4. **Database** stores configuration in CommunicationProfile
5. **Audit Log** records the change
6. **Next Email** uses new configuration

## Monitoring

### Check if Emails are Being Sent Correctly

```bash
# Docker container logs
docker-compose logs -f hms-backend

# Look for messages like:
# [INFO] Appointment reminder email sent to patient@example.com
# [ERROR] Failed to send appointment reminder: SMTP connection failed
```

### View Sent Emails (File Backend)
```bash
# If using file-based email backend for testing
ls -la logs/emails/
```

## Best Practices

1. **Use App Passwords**
   - Gmail: Generate App Password instead of using account password
   - Outlook/Office365: Use regular password or app-specific password

2. **Verify Your Domain**
   - Configure SPF records for your domain
   - Configure DKIM signing for email provider
   - This improves email deliverability

3. **Test Configuration**
   - Always test with a test email after configuration
   - Verify email headers and sender address

4. **Use TLS**
   - Always enable TLS encryption
   - Use port 587 for TLS (not 465 which is SSL)

5. **Monitor Deliverability**
   - Check email provider's dashboard
   - Monitor bounce rates
   - Review spam reports

6. **Backup Configuration**
   - Document your SMTP settings
   - Keep API keys/passwords in secure location
   - Have fallback email provider configured

## Integration with Other Features

### Patient Notifications
- Appointment reminders use tenant email config
- Test results use tenant email config
- Admission/discharge notifications use tenant email config

### Doctor/Admin Communications
- Welcome emails for new staff
- Appointment assignments
- System alerts and notifications

### Patient Portal
- Password reset emails
- Account verification emails
- Invoice/bill notifications

## Troubleshooting Checklist

- [ ] Email enabled toggle is ON
- [ ] Email address is valid format (name@domain.com)
- [ ] SMTP host is correct for your provider
- [ ] SMTP port is correct (usually 587 or 465)
- [ ] Username and password are correct
- [ ] TLS is enabled (usually required)
- [ ] Firewall allows outbound SMTP connection
- [ ] Email provider account is active
- [ ] 2FA/App passwords configured (if required)
- [ ] Settings saved successfully
- [ ] Tenant has email_enabled = true

## Support Resources

- **Gmail Help**: https://support.google.com/accounts/answer/185833
- **Office 365 SMTP**: https://docs.microsoft.com/en-us/exchange/connect-to-exchange-online
- **SendGrid SMTP**: https://docs.sendgrid.com/for-developers/sending-email/smtp-service
- **Backend Logs**: Check `logs/errors.log` for detailed error messages
