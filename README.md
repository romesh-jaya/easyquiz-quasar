# EasyQuiz (Quasar with Vite)

Application to create and share your Quizzes with others. Ideal for a school or educational institute.

The app is hosted here:
https://easyquiz-romesh-jaya.vercel.app/

## Technical details

Tech Stack used:

- Vue, Serverless Functions hosted on Vercel, Postgres
- Quasar
- Vite server
- Typescript
- Firebase Authentication with email/password login

## .env variables

All fields mentioned in .env.example must be filled with correct values and renamed as .env.

- API_KEY - Firebase Auth related
- AUTH_DOMAIN - Firebase Auth related
- PROJECT_ID - Firebase Auth related
- STORAGE_BUCKET - Firebase Auth related
- MESSAGING_SENDER_ID - Firebase Auth related
- APP_ID - Firebase Auth related
- BACKEND_URL - Backend API URL for development
- BACKEND_URL_STAGING - Backend API URL for staging

## Backend Server Source

Can be found [here](https://github.com/romesh-jaya/easyquiz-backend-nodejs).

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```
