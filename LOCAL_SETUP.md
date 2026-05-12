# Local Setup Guide for VS Code

Welcome to your SmartFinds project! Follow these steps to get your full-stack application running on your local machine with real data persistence.

## 1. Prerequisites
- **Node.js**: Ensure you have Node.js installed (v18 or higher is recommended).
- **VS Code**: The project is optimized for VS Code development.

## 2. Installation
Open your terminal in the project root directory and run:
```bash
npm install
```

## 3. Running the Developer Server
This project uses a full-stack architecture with an Express backend and a Vite frontend. To start both, run:
```bash
npm run dev
```
The application will be accessible at: **http://localhost:3000**

## 4. How Persistence Works
- **Local Development**: Products and categories are stored in `data/database.json`. This file is automatically created when you first run the app. Adding products through the Admin Dashboard will save them to this file.
- **Production (Vercel)**: Vercel uses an ephemeral filesystem, meaning `database.json` will be reset frequently. To make your data permanent across all devices when deployed, follow the **Firebase Setup** below.

## 5. Deployment & Shared Database (Firebase)
To have products appear on all devices (mobile, other computers, etc.), you must use a cloud database.

### Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named "SmartFinds".
3. In the sidebar, go to **Build > Firestore Database** and click **Create database**.
4. Choose a location and start in **Production Mode** (you will update rules later).
5. Go to **Project Settings** (gear icon) and add a **Web App**.
6. Copy the `firebaseConfig` object values.

### Configure Environment Variables
Rename `.env.example` to `.env` (or create a new `.env` file) and paste your values:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Finalizing Deployment
When you deploy to Vercel, make sure to add these same Environment Variables in the Vercel Dashboard settings.

## 6. Important: Firestore Security Rules
By default, Firebase blocks all "writes". To allow your app to save products:
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Firestore Database** in the left sidebar.
3. Click the **Rules** tab at the top.
4. Copy and Paste these rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if true; 
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```
5. Click **Publish**.
