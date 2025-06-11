# Meteor Auth App

A secure authentication app built with Meteor.js featuring social login capabilities.

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd meteor-auth-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure OAuth Credentials

#### Method 1: Using settings.json (Development)
1. Copy the example settings file:
   ```bash
   cp settings-example.json settings.json
   ```

2. Update `settings.json` with your actual Google OAuth credentials:
   ```json
   {
     "google": {
       "clientId": "your-actual-google-client-id",
       "secret": "your-actual-google-client-secret"
     },
     "public": {
       "appName": "Meteor Auth App"
     }
   }
   ```

#### Method 2: Using Environment Variables (Production)
1. Copy the example .env file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your actual credentials:
   ```
   GOOGLE_CLIENT_ID=your-actual-google-client-id
   GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
   ```

### 4. Google OAuth Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add your authorized redirect URIs:
   - `http://localhost:3000/_oauth/google` (for development)
   - `https://yourdomain.com/_oauth/google` (for production)

### 5. Run the application
```bash
# Development with settings.json
meteor run --settings settings.json

# Or with npm script
npm start
```

## Security Notes

- Never commit `settings.json` or `.env` files containing real credentials to version control
- The `settings.json` file is already added to `.gitignore`
- Use environment variables for production deployments
- Regularly rotate your OAuth credentials

## Features

- Secure user authentication
- Social login with Google
- Email verification
- Rate limiting on login attempts
- User profile management
- Responsive design

## File Structure

```
├── client/           # Client-side code
├── imports/          # Shared code
│   └── ui/          # React components
├── server/          # Server-side code
├── settings-example.json  # Settings template
└── .env.example     # Environment variables template
```
