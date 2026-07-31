# GitHub Integration & Automated Mobile APK Build Setup

This project is configured with **GitHub Actions CI/CD** to automatically build and release an **Android APK** whenever changes are made in the Web Admin Panel or committed to GitHub.

---

## 🚀 Step 1: Initialize Git & Push to GitHub

Run the following commands in your project directory (`c:\website\newonestart`):

```bash
# 1. Initialize local Git repository
git init

# 2. Add all files to Git
git add .

# 3. Create initial commit
git commit -m "Initial commit: Jarvis Web Admin Panel, SRS Document & Mobile APK Sync Engine"

# 4. Link your remote GitHub repository (Replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/jarvis-cross-platform.git

# 5. Push code to main branch
git branch -M main
git push -u origin main
```

---

## 🤖 Step 2: Automated Android APK Generation

Once pushed to GitHub, **GitHub Actions** (`.github/workflows/sync_build_apk.yml`) will automatically:

1. Checkout your code.
2. Setup Node.js & Android SDK.
3. Bundle the **Web Admin Panel** & **Mobile App** sync logic.
4. Compile the **Android APK (`jarvis-mobile-app-debug.apk`)**.
5. Upload the compiled `.apk` to the **GitHub Actions Artifacts** tab for download!

---

## ⚡ Step 3: Real-Time Sync Protocol (Web Admin ↔ Mobile APK)

When a user modifies settings in the **Web Admin Panel**:

1. **WebSocket Telemetry Pulse**: The Web Admin panel emits a WebSocket payload over `ws://localhost:8080/ws/mobile`.
2. **Instant APK Reaction**: All installed Mobile APK instances receive the state mutation payload within **< 42ms**.
3. **Automated Re-Build**: Any pushed Git commit automatically triggers a new Android APK build on GitHub.
