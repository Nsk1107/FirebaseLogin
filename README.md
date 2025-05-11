# FirebaseLogin App

This is the second exercise of the **EA 3141 - Mobile Application Development II** course. The app is built using **React Native** with **Expo** and implements **Firebase Authentication** for login and signup functionality. It also includes a feed screen with image display and a profile screen showing user details.

## Features

* **User Authentication** with Firebase (Email & Password)
* **Signup** and **Login** screens
* **Feed Page** displaying sample image cards
* **Camera Access** using `expo-image-picker`
* **User Profile** screen with email and UID
* **Bottom Tabs Navigation** using `expo-router`

## File Structure

```
FirebaseLogin/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── feed.tsx
│   │   └── profile.tsx
│   ├── index.tsx         # Login screen
│   └── signup.tsx        # Signup screen
├── components/
│   └── CameraScreen.tsx  # Camera access screen (optional)
├── firebaseConfig.ts     # Firebase configuration
├── app.json
├── package.json
└── README.md             # This file
```

## 1. Clone the Repository

```bash
git clone https://github.com/Nsk1107/FirebaseLogin.git
cd FirebaseLogin
```

## 2. Install Dependencies

```bash
npm install
```

Also make sure the following packages are installed:

```bash
npx expo install firebase
npx expo install expo-image-picker
npx expo install expo-router
```

## 3. Configure Firebase

* Create a project on [Firebase Console](https://console.firebase.google.com/).
* Enable **Email/Password Authentication** under **Authentication > Sign-in Method**.
* Copy the Firebase config object into `firebaseConfig.ts`:

```ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(app);
```

## 4. Run the App

```bash
npx expo start
```

Use Expo Go app on your device or an emulator to preview the app.

---

📚 License
This project is part of coursework for EA 3141 and is intended for academic learning only.

👨‍🎓 Author
Coursework by Nandika Sirinuwan
EA 3141 – Mobile Application Development II
