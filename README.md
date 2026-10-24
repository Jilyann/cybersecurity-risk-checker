# Cybersecurity Awareness & Risk Checker for College Students

## Project Description

The Cybersecurity Awareness & Risk Checker is a browser-based application designed to help college students assess their cybersecurity awareness and everyday online security practices. It provides a self-assessment questionnaire, displays a risk level based on the user's answers, and offers security recommendations.

The application also shows anonymous community statistics from all completed assessments, and it includes a feedback feature that allows users to submit comments or suggestions.

## Features

- **Cybersecurity Assessment** – Answers questions about everyday cybersecurity practices.
- **Risk Level Calculation** – Calculates a score and displays a corresponding risk level.
- **Security Recommendations** – Provides recommendations based on the assessment results.
- **Assessment Statistics** – Scores each assessment on the server, saves the result anonymously, and shows community statistics: the number of assessments completed, the average score, the most common weak area, and the share of Low, Moderate, and High risk results.
- **Feedback Submission** – Accepts user feedback through a form.
- **Server-Side Rendering** – Uses Express.js and EJS to render the homepage.
- **Feedback Storage** – Validates feedback on the server and stores submissions in a local JSON file.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- EJS
- JSON file storage

## Installation and Setup

### Prerequisites

Install Node.js and npm before running the application.

### Steps

1. Clone or download this repository.
2. Open a terminal in the project folder.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   node app.js
   ```

5. Open the following address in your browser:

   `http://localhost:3000`

## Feedback Storage

Feedback submissions are validated by the Express backend and stored in `feedback.json`. Each entry includes the submitted name, message, and submission timestamp.

The JSON file is created when feedback is saved, if it does not already exist. The file is intended for local development and should not be committed to the public repository because it may contain user-submitted information.

## Additional Feature: Assessment Statistics

The Assessment Statistics feature lets students compare their result with everyone who has taken the assessment. When a student submits the assessment, the Express backend scores it, saves the result anonymously, and returns community statistics. The statistics appear under the result in the **Results** section:

- **Assessments completed** – the number of assessments submitted so far
- **Average score** – the average score out of 12 (lower is safer)
- **Most common weak area** – the topic where students lose the most points: Password and Account Security, Multi-Factor Authentication, or Phishing Awareness
- **Low risk, Moderate risk, and High risk** – the percentage and number of results at each risk level

### How It Works

1. When the page opens, `js/script.js` loads the current statistics with `GET /assessment/stats`.
2. When a student submits the assessment, `js/script.js` sends the six answers to the server with `POST /assessment`.
3. The server checks that all six questions were answered with `yes`, `sometimes`, or `no`.
4. `utils/assessment.js` calculates the score on the server (`yes` = 0, `sometimes` = 1, and `no` = 2 points) and the risk level (0–3 Low, 4–7 Moderate, 8–12 High). Because the server calculates the score, a score sent from the browser is ignored and cannot change the saved results.
5. The server saves the result to `assessments.json` and responds with the score, the risk level, and the updated statistics. The page then shows the result and refreshes the statistics.

### Data Storage and Privacy

Each saved result contains only the score, the risk level, the points for each topic, and the submission time. Names and other personal information are not collected. Like `feedback.json`, the `assessments.json` file is created automatically when the first assessment is saved. It is listed in `.gitignore` so that it is not committed to the repository.

### API

**`POST /assessment`**

Request body:

```json
{
  "answers": {
    "password-unique": "yes",
    "password-sharing": "sometimes",
    "mfa-use": "no",
    "verification-review": "yes",
    "sender-check": "sometimes",
    "phishing-links": "yes"
  }
}
```

Response (`201 Created`):

```json
{
  "score": 4,
  "riskLevel": "Moderate",
  "stats": {
    "totalAssessments": 4,
    "averageScore": 3.3,
    "riskLevels": {
      "Low": { "count": 1, "percent": 25 },
      "Moderate": { "count": 3, "percent": 75 },
      "High": { "count": 0, "percent": 0 }
    },
    "weakestTopic": "Multi-Factor Authentication"
  }
}
```

Missing or invalid answers return `400 Bad Request` with an `error` message.

**`GET /assessment/stats`**

Returns the current statistics (`200 OK`) in the same format as the `stats` object above. If no assessments have been saved yet, `totalAssessments` is `0` and `weakestTopic` is `null`.

### Files Added or Updated

- `utils/assessment.js` – answer validation, scoring, and statistics logic (new file)
- `app.js` – `POST /assessment` and `GET /assessment/stats` routes and `assessments.json` storage
- `views/index.ejs` – Community Statistics panel in the Results section
- `js/script.js` – sends the answers to the server and displays the result and statistics
- `css/style.css` – Community Statistics styles
- `.gitignore` – excludes `assessments.json`

## Project Scope

This application is an educational cybersecurity awareness tool. It provides a self-assessment based on user responses; it does not perform actual device scans, network scans, or automated vulnerability detection.

## Application Development Workflow Worksheet Link
https://docs.google.com/spreadsheets/d/1ladCaQ0dIZUoNmZWEuc2NC8W80azfvy4pDw7HsiKGdw/edit?usp=sharing

## AI Use Statement Link
https://docs.google.com/document/d/1brsTEIXXLcQ28UXZfO8CgNyF7gJl79_MaBH5d0Tzhho/edit?usp=sharing

## Course

MO-IT161 – Web Systems and Technology
