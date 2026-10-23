# Cybersecurity Awareness & Risk Checker for College Students

## Project Description

The Cybersecurity Awareness & Risk Checker is a browser-based application designed to help college students assess their cybersecurity awareness and everyday online security practices. It provides a self-assessment questionnaire, displays a risk level based on the user's answers, and offers security recommendations.

The application also includes a feedback feature that allows users to submit comments or suggestions.

## Features

- **Cybersecurity Assessment** – Answers questions about everyday cybersecurity practices.
- **Risk Level Calculation** – Calculates a score and displays a corresponding risk level.
- **Security Recommendations** – Provides recommendations based on the assessment results.
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

## Project Scope

This application is an educational cybersecurity awareness tool. It provides a self-assessment based on user responses; it does not perform actual device scans, network scans, or automated vulnerability detection.

## Academic Context

Developed for Web Systems and Technology (MO-IT161).

## Application Development Workflow Worksheet Link
https://docs.google.com/spreadsheets/d/1ladCaQ0dIZUoNmZWEuc2NC8W80azfvy4pDw7HsiKGdw/edit?usp=sharing

## AI Use Statement Link
https://docs.google.com/document/d/1brsTEIXXLcQ28UXZfO8CgNyF7gJl79_MaBH5d0Tzhho/edit?usp=sharing

## Course

MO-IT161 – Web Systems and Technology
