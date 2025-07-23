# Production Setup Guide for WhisperVault

Your app is successfully deployed to Vercel, but you need to set up the production database and environment variables to make the backend API functional.

## Current Status
✅ **Frontend**: Fully deployed and working  
❌ **Backend API**: Deployed but returns 500 errors (missing database & env vars)

## Quick Setup Steps

### 1. Create a Free PostgreSQL Database

**Option A: Neon (Recommended)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create new project
4. Copy the connection string (looks like: `postgresql://user:pass@host/db?sslmode=require`)

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string

### 2. Set Environment Variables in Vercel

Go to your [Vercel Dashboard](https://vercel.com/dashboard), find your `whisper-vault` project, go to Settings > Environment Variables, and add:

```
DATABASE_URL=your_database_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=WhisperVault <your_email@gmail.com>
TOTP_ISSUER=WhisperVault
```

**For all environments**: Production, Preview, Development

### 3. Run Database Migrations

After setting up the database URL, you need to run migrations. You can do this locally:

```bash
cd server-1
npx prisma db push
```

### 4. Redeploy

After setting environment variables:
```bash
vercel --prod
```

## Environment Variables Explained

- **DATABASE_URL**: PostgreSQL connection string from your database provider
- **JWT_SECRET**: Random string for signing JWTs (generate a long random string)
- **EMAIL_***: SMTP settings for sending confirmation emails (use Gmail app passwords)
- **TOTP_ISSUER**: Name shown in authenticator apps

## Optional: SMS 2FA (Twilio)

If you want SMS 2FA, also add:
```
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token  
TWILIO_PHONE_NUMBER=your_twilio_number
```

## Testing

Once set up, test these endpoints:
- `https://your-app.vercel.app/api/health` - Should return `{"ok":true}`
- Registration flow should work end-to-end
- Email confirmation should send emails
- 2FA setup should work

## Need Help?

1. Check Vercel function logs: `vercel logs your-deployment-url`
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check email credentials are correct

Your app will be fully functional once these steps are complete!
