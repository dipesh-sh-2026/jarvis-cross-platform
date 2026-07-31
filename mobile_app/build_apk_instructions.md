# How to Build the Jarvis Android APK Package

This directory contains the standalone **Jarvis Mobile Application** (`mobile_app/index.html` & `manifest.json`).

Follow any of the 3 simple methods below to build your **`.apk`** file for Android phones:

---

## Method 1: Instant APK via PWABuilder (Easiest - 1 Minute)

1. Open **[https://www.pwabuilder.com](https://www.pwabuilder.com)** in your browser.
2. Enter your Jarvis server URL: `http://localhost:8080/mobile_app/index.html` (or your public IP address).
3. Click **Start** -> Click **Package for Android**.
4. Click **Download APK**! Transfer the `.apk` file to your Android phone and install.

---

## Method 2: Build Native APK using Capacitor CLI (Recommended for Developers)

1. Open terminal in `c:\website\newonestart\mobile_app`.
2. Initialize Capacitor:
   ```bash
   npx @capacitor/cli create
   ```
3. Add Android platform:
   ```bash
   npx cap add android
   ```
4. Open Android Studio and build APK:
   ```bash
   npx cap open android
   ```
5. In Android Studio, click **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.

---

## Method 3: Build APK using Cordova CLI

1. Install Cordova globally:
   ```bash
   npm install -g cordova
   ```
2. Create Cordova project:
   ```bash
   cordova create jarvis-apk com.jarvis.app JarvisMobile
   cd jarvis-apk
   ```
3. Copy all files from `c:\website\newonestart\mobile_app` into `jarvis-apk/www/`.
4. Add Android platform & build APK:
   ```bash
   cordova platform add android
   cordova build android
   ```
5. Your compiled `.apk` will be generated at:
   `jarvis-apk/platforms/android/app/build/outputs/apk/debug/app-debug.apk`
