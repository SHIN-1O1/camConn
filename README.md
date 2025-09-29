# CamConn - React & Firebase Social Media App

This is a complete React + Firebase project for a mini social media app (Instagram-like) suitable for a college project.

## Features

-   **Authentication**: Firebase email + password login & signup.
-   **User Profiles**: Editable user profiles with name, bio, and profile picture.
-   **Posts**: Image uploads with captions.
-   **Feed**: Chronological feed of all posts.
-   **Interactions**: Liking and commenting on posts.
-   **UI**: Clean, modern UI built with React and TailwindCSS.

## Tech Stack

-   **Frontend**: React 18 (with TypeScript), React Router, Tailwind CSS
-   **Backend**: Firebase (Authentication, Firestore, Cloud Storage)
-   **Icons**: `lucide-react`

---

## 1. Firebase Project Setup

1.  **Create a Firebase Project**:
    -   Go to the [Firebase Console](https://console.firebase.google.com/).
    -   Click "Add project" and follow the on-screen instructions.

2.  **Create a Web App**:
    -   In your project's dashboard, click the Web icon (`</>`) to add a new web app.
    -   Register your app and Firebase will provide you with a `firebaseConfig` object. **Copy this object.**

3.  **Enable Firebase Services**:
    -   **Authentication**: Go to "Authentication" -> "Sign-in method" and enable "Email/Password".
    -   **Firestore**: Go to "Firestore Database" -> "Create database". Start in **test mode** for this project (you can change security rules later).
    -   **Storage**: Go to "Storage" -> "Get started". Start in **test mode**.

4.  **Configure Firebase in the App**:
    -   Open the `firebaseConfig.ts` file.
    -   Paste the `firebaseConfig` object you copied earlier into the placeholder.

---

## 2. Local Development

1.  **Prerequisites**:
    -   [Node.js](https://nodejs.org/) (version 16 or later)
    -   `npm` or `yarn`

2.  **Install Dependencies**:
    -   Open your terminal in the project root directory.
    -   Run the following command to install the required packages:

    ```bash
    npm install react react-dom react-router-dom firebase lucide-react
    ```
    - For TypeScript development, also install the types:
    ```bash
    npm install --save-dev @types/react @types/react-dom
    ```

3.  **Run the App**:
    -   Use a development server like Vite or Create React App. If you're using Vite:
    ```bash
    npm create vite@latest my-camconn-app -- --template react-ts
    cd my-camconn-app
    # <copy the generated files into this new directory>
    npm install
    npm run dev
    ```
    - The application will be running at `http://localhost:5173` (or another port).

---

## 3. Deployment to Firebase Hosting

1.  **Install Firebase CLI**:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**:
    ```bash
    firebase login
    ```

3.  **Initialize Firebase Hosting**:
    -   In your project root, run:
    ```bash
    firebase init hosting
    ```
    -   Select "Use an existing project" and choose the Firebase project you created.
    -   Set your public directory to `dist` (for Vite) or `build` (for Create React App).
    -   Configure as a single-page app (rewrite all URLs to /index.html).
    -   Do **not** set up automatic builds and deploys with GitHub.

4.  **Build the Project**:
    ```bash
    npm run build
    ```

5.  **Deploy**:
    ```bash
    firebase deploy
    ```

After deployment is complete, the CLI will give you the URL to your live application.
# camConn
