# PWA Notes App

A Progressive Web App for managing notes with offline support, built with React + Vite + TypeScript, Firebase Firestore, and deployed to GitHub Pages.

## Features

- ✅ **React + Vite + TypeScript** - Modern, fast development experience
- ✅ **Firebase Authentication** - Email/password authentication
- ✅ **Firestore Database** - Per-user note storage with real-time sync
- ✅ **Progressive Web App** - Install on any device, works offline
- ✅ **Offline Support** - Cache notes and queue writes when offline
- ✅ **Mobile-First Design** - Optimized for iPhone and mobile devices
- ✅ **GitHub Pages Deployment** - Automated CI/CD pipeline
- ✅ **Testing** - Unit tests with Vitest + React Testing Library
- ✅ **Code Quality** - ESLint + Prettier configured

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Backend**: Firebase (Firestore, Authentication)
- **Build Tool**: Vite
- **PWA**: vite-plugin-pwa with Workbox
- **Testing**: Vitest, React Testing Library
- **Deployment**: GitHub Pages via GitHub Actions

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- A Firebase project (see setup below)
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd pwa-notes-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the wizard
3. Once created, click on the Web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "PWA Notes")
5. Copy the Firebase configuration object

#### Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get Started**
2. Click **Sign-in method** tab
3. Enable **Email/Password** provider
4. Click **Save**

#### Create Firestore Database

1. In Firebase Console, go to **Firestore Database** → **Create database**
2. Choose **Start in production mode** (we'll add rules next)
3. Select a location closest to your users
4. Click **Enable**

#### Set Firestore Security Rules

In Firebase Console, go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access their own notes
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Click **Publish** to save the rules.

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and paste your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important**: Never commit `.env` to version control. It's already in `.gitignore`.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:ui` - Run tests with UI

## GitHub Pages Deployment

### 1. Create GitHub Repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Add Firebase Config as GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each Firebase config value:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 3. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow in `.github/workflows/deploy.yml` will automatically deploy on push to `main`

### 4. Update Firebase Configuration

Add your GitHub Pages URL to Firebase authorized domains:

1. Go to Firebase Console → **Authentication** → **Settings**
2. Under **Authorized domains**, add: `YOUR_USERNAME.github.io`
3. Click **Add**

### 5. Deploy

Push to the `main` branch to trigger deployment:

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Testing PWA on iPhone

### Local Testing

1. Make sure your iPhone and computer are on the same network
2. Run `npm run dev` and note the network URL (e.g., `http://192.168.1.x:5173`)
3. Open Safari on your iPhone and navigate to that URL
4. Click the Share button → **Add to Home Screen**
5. Name it "Notes" and tap **Add**
6. The app icon will appear on your home screen

### Testing Production (GitHub Pages)

1. Open Safari on your iPhone
2. Navigate to your GitHub Pages URL
3. Click the Share button → **Add to Home Screen**
4. The app will work as a standalone app with offline support

### Offline Testing

1. Open the app
2. Create some notes
3. Enable Airplane Mode on your iPhone
4. The app should still load and show cached notes
5. Try creating a note - it will be queued for sync
6. Disable Airplane Mode - queued notes will sync automatically

## Project Structure

```
pwa-notes-app/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # GitHub Actions deployment
│   └── copilot-instructions.md # Project guidelines
├── public/
│   ├── icons/                  # PWA icons (192x192, 512x512)
│   └── manifest.webmanifest    # PWA manifest
├── src/
│   ├── components/
│   │   ├── Header.tsx          # App header with logout
│   │   ├── NoteCard.tsx        # Individual note card
│   │   └── ProtectedRoute.tsx  # Auth guard for routes
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── pages/
│   │   ├── Login.tsx           # Login page
│   │   ├── Register.tsx        # Registration page
│   │   ├── Notes.tsx           # Notes list page
│   │   └── NoteEditor.tsx      # Create/edit note page
│   ├── styles/
│   │   └── index.css           # Tailwind styles
│   ├── tests/
│   │   ├── setup.ts            # Vitest setup
│   │   ├── NoteCard.test.tsx   # NoteCard tests
│   │   └── firebase.test.ts    # Firebase config tests
│   ├── utils/
│   │   ├── firestore.ts        # Firestore CRUD operations
│   │   └── offline.ts          # Offline queue management
│   ├── App.tsx                 # Main app component
│   ├── firebase.ts             # Firebase initialization
│   ├── main.tsx                # App entry point
│   ├── types.ts                # TypeScript type definitions
│   └── vite-env.d.ts           # Vite environment types
├── .env.example                # Example environment variables
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript config for Vite
└── vite.config.ts              # Vite + PWA configuration
```

## Architecture

### Data Model

Notes are stored in Firestore with the following structure:

```
users/{uid}/notes/{noteId}
  - id: string
  - title: string
  - content: string
  - createdAt: Timestamp
  - updatedAt: Timestamp
  - ownerUid: string
```

### Offline Support

- **Read**: Notes are cached in `localStorage` and served when offline
- **Write**: New/updated notes are queued in `localStorage` and synced when online
- **Service Worker**: Caches app shell (HTML, CSS, JS) for offline use
- **Network Strategy**: Network-first for Firestore, fallback to cache

### Security

- Firestore rules enforce that users can only access their own notes
- Authentication required for all note operations
- Firebase config values are public (security is in Firestore rules)

## Troubleshooting

### Build Errors

If you see TypeScript errors about missing modules, run:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase Connection Issues

1. Check that all environment variables are set correctly
2. Verify Firebase project settings match your config
3. Check browser console for specific Firebase errors

### PWA Not Installing on iPhone

1. Use Safari (not Chrome or other browsers)
2. Make sure you're using HTTPS (GitHub Pages provides this)
3. Check that `manifest.webmanifest` is accessible
4. Clear Safari cache and try again

### Notes Not Syncing

1. Check internet connection
2. Open browser DevTools → Console for errors
3. Verify Firestore security rules are correct
4. Check that user is authenticated

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or as a starter template.

## Next Steps

- [ ] Add note search functionality
- [ ] Implement note categories/tags
- [ ] Add rich text editor
- [ ] Enable note sharing
- [ ] Add dark mode
- [ ] Implement push notifications
- [ ] Add note export (PDF, Markdown)
- [ ] Enable collaborative editing

## Support

For issues or questions, please open an issue on GitHub.
