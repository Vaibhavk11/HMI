# Google Sign-In Setup Guide

## Overview
This guide explains how to set up Google Sign-In for the PWA Notes App. Google Sign-In has been implemented but requires Firebase Console configuration to work properly.

## Features Added
✅ **Google Sign-In Button** - Added to both Login and Register pages  
✅ **User Profile Display** - Shows Google avatar, display name, and email in header  
✅ **Automatic Routing** - Redirects to notes after successful Google sign-in  
✅ **Error Handling** - Displays appropriate error messages for failed sign-ins  

## Required Configuration

### 1. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **HMI**
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Google** as a sign-in provider:
   - Click on **Google**
   - Toggle **Enable**
   - Add your **project support email**
   - Click **Save**

### 2. Google Cloud Console (if needed)
If you encounter issues, you may need to configure OAuth consent screen:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Configure the consent screen with your app details

### 3. Authorized Domains
Make sure these domains are authorized in Firebase:
- `localhost` (for development)
- `vaibhavk11.github.io` (for production)

## Implementation Details

### Updated Components
- **`src/contexts/AuthContext.tsx`** - Added Google sign-in functionality
- **`src/pages/Login.tsx`** - Added Google sign-in button
- **`src/pages/Register.tsx`** - Added Google sign-in button  
- **`src/components/Header.tsx`** - Enhanced user profile display
- **`src/types.ts`** - Extended User interface with Google profile data
- **`src/firebase.ts`** - Added Google Auth Provider

### User Data Structure
```typescript
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;  // From Google profile
  photoURL: string | null;     // Google avatar
}
```

### Authentication Flow
1. User clicks "Sign in with Google"
2. Google OAuth popup opens
3. User authorizes the app
4. Firebase creates/signs in user
5. App redirects to Notes page
6. User profile displays in header

## Testing Instructions

### Local Testing
1. Start development server: `npm run dev`
2. Navigate to `/login` or `/register`
3. Click "Sign in with Google"
4. Complete Google OAuth flow
5. Verify user profile appears in header

### Production Testing
1. Deploy to GitHub Pages: `git push origin main`
2. Visit: `https://vaibhavk11.github.io/HMI/`
3. Test Google Sign-In functionality

## Troubleshooting

### Common Issues

**"Error: popup_closed_by_user"**
- User closed the popup before completing sign-in
- Solution: Try again and complete the OAuth flow

**"Error: unauthorized_client"**
- Domain not authorized in Firebase
- Solution: Add domain to authorized list in Firebase Console

**"Error: configuration not found"**
- Firebase environment variables missing
- Solution: Ensure GitHub Secrets are configured

### Error Messages
The app displays user-friendly error messages for:
- Network connectivity issues
- Authentication failures
- Missing configuration
- User cancellation

## Security Notes
- Google Sign-In uses Firebase Auth for secure token management
- User data is automatically synced across devices
- No passwords stored locally - handled by Google/Firebase
- Firestore security rules enforce per-user data access

## Next Steps
1. Configure Google Sign-In in Firebase Console
2. Test authentication flow
3. Optionally customize OAuth consent screen
4. Consider adding additional sign-in providers (Apple, Facebook, etc.)

## Support
If you encounter issues:
1. Check Firebase Console configuration
2. Verify authorized domains
3. Check browser console for detailed errors
4. Ensure all environment variables are set