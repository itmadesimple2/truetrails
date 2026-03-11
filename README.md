# TrueTrails 🗺️

Trusted travel reviews — no sponsored content, filtered by age & nationality.

## Quick Start (Mac)

1. Make sure Node.js is installed (nodejs.org → download LTS)
2. Open Terminal, drag this folder into it, press Enter
3. Run: `./SETUP.sh`
4. Open http://localhost:5173 in your browser

## Deploy to Netlify (step-by-step)

### Step 1 — Push to GitHub
1. Go to github.com → click "+" → "New repository"
2. Name it `truetrails`, keep it Private, click "Create repository"
3. Copy the commands shown under "…or push an existing repository"
4. Open Terminal in this folder and paste those commands

### Step 2 — Connect to Netlify
1. Go to netlify.com → "Sign up" with your GitHub account
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub → select your `truetrails` repo
4. Build settings are auto-detected from netlify.toml
5. Click "Deploy site"
6. In ~2 minutes you get a URL like: https://truetrails.netlify.app

### Step 3 — Install on iPhone
1. Open your Netlify URL in Safari on your iPhone
2. Tap the Share button (box with arrow)
3. Scroll down → tap "Add to Home Screen"
4. Tap "Add" — it appears on your home screen like a real app!

### Step 4 — Custom domain (optional)
In Netlify dashboard → Domain settings → Add custom domain
e.g. truetrails.app (costs ~$15/year from namecheap.com)

## Project Structure
```
truetrails/
├── src/
│   ├── App.jsx        ← Main app (all screens)
│   └── main.jsx       ← Entry point
├── public/
│   └── favicon.svg    ← App icon
├── index.html         ← HTML shell
├── vite.config.js     ← Build config + PWA settings
├── netlify.toml       ← Netlify deployment config
└── package.json       ← Dependencies
```

## Next Steps
- [ ] Add Supabase backend (persistent reviews)
- [ ] Photo upload for visit verification
- [ ] Push notifications for new reviews
- [ ] Custom domain
# truetrails
# truetrails
# truetrails
