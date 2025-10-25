# Git Commit Guide

This file provides the recommended commit sequence for version control.

## Initial Commits (Logical History)

Follow these commits to build a clean Git history:

### 1. Initial Project Setup
```bash
git add package.json tsconfig.json tsconfig.node.json vite.config.ts
git add index.html postcss.config.js tailwind.config.js
git add .eslintrc.json .prettierrc .gitignore
git commit -m "feat: init vite react typescript project with build config"
```

### 2. Firebase Integration
```bash
git add src/firebase.ts src/vite-env.d.ts src/types.ts
git add .env.example
git commit -m "feat: add firebase integration with modular SDK"
```

### 3. Authentication
```bash
git add src/contexts/AuthContext.tsx
git add src/components/ProtectedRoute.tsx
git add src/pages/Login.tsx src/pages/Register.tsx
git commit -m "feat: add email/password authentication"
```

### 4. Notes CRUD
```bash
git add src/utils/firestore.ts src/utils/offline.ts
git add src/components/NoteCard.tsx src/components/Header.tsx
git add src/pages/Notes.tsx src/pages/NoteEditor.tsx
git commit -m "feat: implement notes CRUD with offline support"
```

### 5. Styling
```bash
git add src/styles/index.css
git commit -m "style: add tailwind styling with mobile-first design"
```

### 6. PWA Features
```bash
git add public/manifest.webmanifest public/icons/
git commit -m "feat: add PWA manifest and service worker for offline support"
```

### 7. App Integration
```bash
git add src/App.tsx src/main.tsx
git commit -m "feat: integrate routing and PWA registration"
```

### 8. Testing
```bash
git add src/tests/
git commit -m "test: add vitest with unit tests for components and firebase"
```

### 9. CI/CD
```bash
git add .github/workflows/deploy.yml .github/copilot-instructions.md
git commit -m "ci: add github pages deployment workflow"
```

### 10. Documentation
```bash
git add README.md NEXT_STEPS.md GIT_COMMITS.md
git commit -m "docs: add comprehensive setup and deployment documentation"
```

---

## Alternative: Single Commit

If you prefer a single initial commit:

```bash
git add .
git commit -m "feat: complete PWA notes app with Firebase, offline support, and GitHub Pages deployment

- React + Vite + TypeScript
- Firebase Authentication (email/password)
- Firestore CRUD operations (per-user notes)
- PWA with offline support via service worker
- Mobile-first responsive design with TailwindCSS
- GitHub Actions CI/CD for Pages deployment
- Unit tests with Vitest + React Testing Library
- ESLint + Prettier configuration
- iOS PWA meta tags and manifest
"
```

---

## Push to GitHub

After committing:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Future Feature Branches

For new features, create branches:

```bash
git checkout -b feature/search-functionality
# Make changes
git add .
git commit -m "feat: add note search functionality"
git push origin feature/search-functionality
# Create pull request on GitHub
```

---

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code restructuring without behavior change
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

Examples:
```bash
git commit -m "feat: add dark mode toggle"
git commit -m "fix: resolve offline sync issue"
git commit -m "docs: update README with new features"
git commit -m "test: add integration tests for auth flow"
```
