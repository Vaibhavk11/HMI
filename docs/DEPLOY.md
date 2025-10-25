# Quick Deploy to GitHub Pages

Follow these steps to deploy your app to GitHub Pages:

## Prerequisites Checklist

- [ ] Firebase project created
- [ ] Firebase configuration added to `.env` file
- [ ] GitHub account ready
- [ ] Git installed

## Deployment Steps

### 1. Initialize Git Repository (if not done)

```bash
git init
git add .
git commit -m "feat: initial commit - complete PWA notes app"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `pwa-notes-app` (or your choice)
3. Choose Public or Private
4. **DO NOT** initialize with README
5. Click "Create repository"

### 3. Add Remote and Push

Replace `YOUR_USERNAME` and `YOUR_REPO` with your values:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 4. Add Firebase Secrets to GitHub

**CRITICAL:** You must add your Firebase config as GitHub Secrets for the deployment to work.

1. Go to your repo: `https://github.com/YOUR_USERNAME/YOUR_REPO`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each:

| Secret Name | Value (from your .env file) |
|------------|-------------|
| `VITE_FIREBASE_API_KEY` | Your actual Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Your project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |

### 5. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions** (not a branch!)
3. That's it - the workflow is already configured!

### 6. Trigger Deployment

The app will deploy automatically when you push to `main`. To deploy now:

```bash
# Make a small change (if needed)
git add .
git commit -m "ci: trigger deployment" --allow-empty
git push origin main
```

### 7. Add GitHub Pages Domain to Firebase

After deployment (2-3 minutes):

1. Your app will be at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
2. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
3. Add: `YOUR_USERNAME.github.io`
4. Click **Add**

### 8. Test on Your Device

1. Open Safari (or any browser) on your phone
2. Navigate to: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
3. On iPhone Safari: Share button → **Add to Home Screen**

---

## If You Haven't Set Up Firebase Yet

### Option A: Set Up Firebase Now (Recommended)

1. Open: https://console.firebase.google.com/
2. Follow the Firebase setup in `NEXT_STEPS.md` Section 1
3. Update your `.env` file with the real values
4. Come back and follow deployment steps above

### Option B: Use Mock/Demo Mode (Testing Only)

If you just want to see the UI without Firebase:

1. Update `.env` with placeholder values (just to build)
2. Deploy following steps above
3. The app will show Firebase connection errors
4. You can see the UI layout and PWA features
5. Later, replace with real Firebase config

---

## Troubleshooting

### Build Fails in GitHub Actions

- Check the **Actions** tab in your GitHub repo
- Verify all 6 Firebase secrets are added correctly
- Check that secret names match exactly (including `VITE_` prefix)

### App Doesn't Load

- Check browser console for errors
- Verify Firebase config is correct
- Make sure Firebase auth domain is authorized

### Can't Install as PWA

- Must use HTTPS (GitHub Pages provides this)
- Must use Safari on iOS
- Clear browser cache and try again

---

## Quick Commands Reference

```bash
# Check git status
git status

# Initialize repo
git init
git add .
git commit -m "feat: initial commit"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main

# Make changes and deploy
git add .
git commit -m "fix: update configuration"
git push origin main
```

---

**Your app will be live at:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

**Access it from any device with this URL!** 🚀
