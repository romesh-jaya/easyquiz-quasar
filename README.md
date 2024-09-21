# EasyQuiz (Quasar with Vite)

Application to create and share your Quizzes with others. Ideal for a school or educational institute.

The app is hosted here:
https://easyquiz-romesh-jaya.vercel.app/

## App features

- Users have the ability to select a single answer or multiple answers, as suits the question.
- Ability to create multiple quizzes, and archive any unneccessary ones
- Ability to demo your own quiz before sharing with others

## Screenshots

<p align="center">
Quiz Home page
</p>

<div align="center">
  <img src="https://user-images.githubusercontent.com/56665179/209946384-10472862-5715-4a1d-8a3b-385e8e2435e3.png" height="400" alt="Quiz Home page" style="object-fit: contain;" >
</div>

---

<p align="center">
Edit Question page
</p>

<div align="center">
  <img src="https://user-images.githubusercontent.com/56665179/209946470-22b16497-be65-4f75-9e63-e6516f4e75ee.png" height="400" alt="Edit Question page" style="object-fit: contain;" >
</div>

---

<p align="center">
Single choice question - Demo
</p>

<div align="center">
  <img src="https://user-images.githubusercontent.com/56665179/209946522-8648c99b-e914-4679-b850-19e7937b227a.png" height="400" alt="Single choice question - Demo" style="object-fit: contain;" >
</div>

---

<p align="center">
Multiple choice question - Demo
</p>

<div align="center">
  <img src="https://user-images.githubusercontent.com/56665179/209946552-cde31637-114a-40f1-a839-bb67de900812.png" height="400" alt="Multiple choice question - Demo" style="object-fit: contain;" >
</div>

---

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

## TODO

- Share the quiz that the user created to others via an email link.
- Add time for quiz

## Deployment

`npm run deploy`

- currently using Vercel CLI to deploy. Remember to promote a particular build into production once verified.

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
