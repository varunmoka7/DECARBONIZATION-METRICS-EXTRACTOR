
# Firebase Backend Setup Guide & Next Steps for ESG Metrics Extractor

This document summarizes the steps we've taken and the plan for setting up a Firebase backend to store extracted ESG metrics.

## Phase 1: Firebase Project & Firestore Setup (Completed by User)

1.  **Create Firebase Project:**
    *   A Firebase project was created in the Firebase Console.
    *   Project name example: "Sustainability Agent".

2.  **Enable Firestore Database:**
    *   Cloud Firestore was enabled within the Firebase project.
    *   A region/location for the Firestore database was selected.
    *   The database was started in **Test Mode** for easier initial development (Security rules will need to be updated later for production).
    *   The default database ID is `(default)`.

3.  **Obtain Firebase Service Account Key:**
    *   Navigated to Project settings > Service accounts.
    *   Generated a new private key and downloaded the JSON file.
    *   **Crucially, this `firebase-service-account-key.json` file is stored securely OUTSIDE of the project's codebase.**

## Phase 2: Setting up Local Firebase Tools & Environment (Completed by User)

1.  **Install Firebase CLI (Command Line Interface):**
    *   `firebase-tools` was installed globally using `npm install -g firebase-tools`.
    *   System `PATH` variable issues were resolved to ensure the `firebase` command is recognized.
    *   Confirmed `firebase-tools` version `14.4.0`.

2.  **Log in to Firebase using the CLI:**
    *   Successfully ran `firebase login` and authenticated with the Google account via the browser.
    *   Terminal is authenticated to manage Firebase projects.

## Next Steps (To Be Done by User)

### A. Initialize Firebase Functions in Your Project

1.  **Navigate to Your Project's Root Directory:**
    *   **Action:** Open your terminal and use the `cd` command to navigate to the root directory of your `esg-metrics-extractor` frontend application (the folder containing `package.json`, `index.html`, `App.tsx`, etc.).
    *   This is essential because `firebase init functions` needs to be run from within the project folder it will be associated with.

2.  **Initialize Firebase Functions:**
    *   **Command (run from project root):** `firebase init functions`
    *   **Purpose:** This command will set up a `functions` sub-directory in your project, configure it for Cloud Functions, and install necessary Node.js dependencies for backend development.
    *   **Interactive Prompts during `firebase init functions`:**
        *   **Select features:** Choose "Functions".
        *   **Project Setup:** Select "Use an existing project" and choose your Firebase project (e.g., "Sustainability Agent").
        *   **Language:** Select "TypeScript".
        *   **ESLint:** Recommended to select "Yes" (Y).
        *   **Overwrite existing files (if any):** If it asks to overwrite `functions/package.json` or similar, and this is a fresh functions setup, "Yes" (y) is usually fine.
        *   **Install dependencies:** Select "Yes" (Y) to have npm install dependencies automatically.
    *   **Expected Outcome:** A new `functions` folder in your project root, along with `.firebaserc` and an updated `firebase.json`. The `functions` folder will have its own `package.json`, `tsconfig.json`, and a `src/index.ts` file for your backend code.

### B. Develop the Cloud Function

1.  **Write the Cloud Function Code:**
    *   Edit `functions/src/index.ts`.
    *   Create an HTTP-triggered function to receive extracted ESG data (JSON payload) from your frontend.
    *   Use the `firebase-admin` SDK to connect to Firestore.
    *   Save received data as a new document in a Firestore collection (e.g., `esgExtractions`).

2.  **Configure Environment Variables for the Service Account Key:**
    *   **Do NOT put the service account key JSON directly into the code.**
    *   Set it up as an environment variable when deploying the function or using Firebase emulators. The contents of the JSON key file will be the value of this variable. This is typically done by setting `process.env.FIREBASE_CONFIG` and `process.env.GOOGLE_APPLICATION_CREDENTIALS` or by using `functions.config()`. For `firebase-admin` initialized with a service account, you'll pass the key path or object to `admin.initializeApp()`. The simplest for local and deployed is often setting `GOOGLE_APPLICATION_CREDENTIALS` to point to the key file (locally) or using Firebase's built-in config for deployed functions.
    * For Cloud Functions, you can set runtime environment variables using the Firebase CLI or Google Cloud Console. Example: `firebase functions:config:set company.key="$(cat path/to/serviceAccountKey.json)"` (then access in code via `functions.config().company.key`).

3.  **Test the Function Locally (Recommended):**
    *   Use Firebase Emulators (Firestore Emulator, Functions Emulator) to test backend logic locally.
    *   Start emulators: `firebase emulators:start`

4.  **Deploy the Cloud Function:**
    *   **Command:** `firebase deploy --only functions` (run from your project root).

### C. Integrate Frontend with Backend

1.  **Update Frontend Service:**
    *   Modify frontend code (e.g., in a new `backendService.ts` or by extending `geminiService.ts`) to make an HTTP POST request to the deployed Cloud Function's URL after successfully extracting ESG metrics.
    *   The request body will contain the extracted data.

2.  **Handle API Responses and Errors:**
    *   Update the frontend to handle success and error responses from your new backend API.

3.  **Secure Firestore Rules:**
    *   Update Firestore security rules from "Test Mode" to more secure rules (e.g., only allow authenticated functions to write data, or restrict access based on user authentication if you add it later). Example for allowing writes only from your app (simplistic, often needs user auth):
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // Allow reads if public, or restrict as needed
            match /{document=**} {
              allow read: if true; // Or more restrictive
              allow write: if request.auth != null; // Example: only if user is authenticated
                                                    // Or allow if request comes from an authenticated function
            }
          }
        }
        ```
        For function-only writes, it's more about network rules or ensuring the function is the only one with credentials, and rules might be `allow write: if false;` for client-side, relying on the function's admin access. A common pattern is `allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;` or similar if user roles are involved.

This plan outlines the path to creating a robust backend for your application.
