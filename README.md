# Geography Quiz App

Geography Quiz App is a full-stack trivia game focused on geography questions. The app lets users play a 10-question quiz in single-player mode or against a computer opponent. Each question has a 15-second timer, a hint option that removes one incorrect answer, score tracking, and a simple high-score display at the end of each round.

The frontend is built with React, and the backend is an Express API that fetches geography questions from [The Trivia API](https://the-trivia-api.com/).

## Project Structure

```text
GeographyQuizApp/
├── backend/
│   ├── index.js              # Express server and /getQuestion API route
│   ├── package.json          # Backend dependencies
│   └── package-lock.json
├── frontend/
│   ├── public/
│   │   ├── index.html        # React app HTML entry point
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── App.js            # Main quiz UI and game logic
│   │   ├── index.js          # React entry point
│   │   ├── style.css         # App styling
│   │   └── images/
│   │       └── worldmap.png  # Background image used by the app
│   ├── package.json          # Frontend dependencies and scripts
│   └── package-lock.json
├── geography_questions.csv   # Local geography question data
└── README.md
```

## How It Works

1. The React frontend starts at `http://localhost:3000`.
2. When a user chooses a game mode, the frontend calls the backend endpoint at `http://localhost:3001/getQuestion`.
3. The Express backend requests questions from The Trivia API, keeps geography questions, sorts them by difficulty, and returns 10 questions to the frontend.
4. The frontend displays each question with multiple-choice answers, a countdown timer, optional hints, and score tracking.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm, which is included with Node.js

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running the App

Start the backend server in one terminal:

```bash
cd backend
node index.js
```

The backend runs on `http://localhost:3001`.

Start the frontend in a second terminal:

```bash
cd frontend
npm start
```

The React app runs on `http://localhost:3000` and should open automatically in your browser.

## Available Frontend Scripts

From the `frontend` directory, you can run:

```bash
npm start
```

## Notes

- The backend must be running before starting a quiz, because the frontend depends on the `/getQuestion` API route.
- The current backend does not define an npm start script, so use `node index.js` from the `backend` directory.
- The app fetches live question data from The Trivia API, so an internet connection is required.
