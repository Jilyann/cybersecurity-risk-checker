
let submitButton = document.getElementById("submit-assessment");
let resultText = document.getElementById("result-text");
let resultCard = document.querySelector(".result-card");
let resultLabel = document.querySelector(".result-label");
let recommendationMessage = document.getElementById("recommendation-message");
let feedbackName = document.getElementById("feedback-name");
let feedbackMessage = document.getElementById("feedback-message");
let feedbackButton = document.getElementById("send-feedback");
let feedbackStatus = document.getElementById("feedback-status");
let statsStatus = document.getElementById("stats-status");
let statsTiles = document.getElementById("stats-tiles");

submitButton.onclick = function () {

    let q1 = document.querySelector('input[name="password-unique"]:checked');
    let q2 = document.querySelector('input[name="password-sharing"]:checked');
    let q3 = document.querySelector('input[name="mfa-use"]:checked');
    let q4 = document.querySelector('input[name="verification-review"]:checked');
    let q5 = document.querySelector('input[name="sender-check"]:checked');
    let q6 = document.querySelector('input[name="phishing-links"]:checked');

    let answers = [q1, q2, q3, q4, q5, q6];

    for (let i = 0; i < answers.length; i++) {
        if (answers[i] === null) {
            resultText.textContent =
                "Please answer all six assessment questions before submitting.";

            recommendationMessage.textContent =
                "Complete all assessment questions first so the application can provide an appropriate recommendation.";

            document.getElementById("results").scrollIntoView();

            return;
        }
    }

    submitButton.disabled = true;

    // The server calculates the score, saves the result, and sends back the statistics
    fetch("/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            answers: {
                "password-unique": q1.value,
                "password-sharing": q2.value,
                "mfa-use": q3.value,
                "verification-review": q4.value,
                "sender-check": q5.value,
                "phishing-links": q6.value
            }
        })
    })
        .then(function (response) {
            return response.json().then(function (data) {
                if (!response.ok) {
                    throw new Error(data.error || "The server could not check the assessment.");
                }

                showResult(data.score, data.riskLevel);
                showStats(data.stats);
            });
        })
        .catch(function (error) {
            resultText.textContent =
                "The assessment was not submitted: " + error.message;

            resultCard.className = "result-card";
            resultLabel.className = "result-label";
            resultText.className = "result-placeholder";
        })
        .finally(function () {
            submitButton.disabled = false;
            document.getElementById("results").scrollIntoView();
        });

};

// Display the score and risk level calculated by the server
function showResult(riskScore, riskLevel) {

    if (riskLevel === "Low") {
        resultText.textContent =
            "Low Risk (score: " + riskScore + "/12): Your habits show strong cybersecurity awareness.";

        recommendationMessage.textContent =
            "Continue your current security habits and review the recommendations below to maintain strong account protection.";

        resultCard.className = "result-card low-risk";
        resultLabel.className = "result-label low-risk";
        resultText.className = "result-placeholder low-risk";

    } else if (riskLevel === "Moderate") {
        resultText.textContent =
            "Moderate Risk (score: " + riskScore + "/12): Some habits could be improved.";

        recommendationMessage.textContent =
            "Review the recommendations below and focus on the security habits that you only practice sometimes or do not practice yet.";

        resultCard.className = "result-card moderate-risk";
        resultLabel.className = "result-label moderate-risk";
        resultText.className = "result-placeholder moderate-risk";    
    
    } else {
        resultText.textContent =
            "High Risk (score: " + riskScore + "/12): Several habits may put your accounts at risk.";

        recommendationMessage.textContent =
            "Review the recommendations below carefully and prioritize stronger password habits, multi-factor authentication, and phishing awareness.";

        resultCard.className = "result-card high-risk";
        resultLabel.className = "result-label high-risk";
        resultText.className = "result-placeholder high-risk";
    }

}

feedbackButton.onclick = function () {

    let name = feedbackName.value.trim();
    let message = feedbackMessage.value.trim();

    if (name === "" || message === "") {
        feedbackStatus.textContent =
            "Please enter your name and feedback before submitting.";

        return;
    }

    fetch("/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, message: message })
    })
        .then(function (response) {
            return response.json().then(function (data) {
                if (!response.ok) {
                    throw new Error(data.error || "The server rejected the feedback.");
                }

                feedbackStatus.textContent =
                    "Thank you, " + name + "! Your feedback was saved.";

                feedbackName.value = "";
                feedbackMessage.value = "";
            });
        })
        .catch(function (error) {
            feedbackStatus.textContent =
                "Feedback was not sent: " + error.message;
        });

};

// Show the community statistics sent by the server
function showStats(stats) {

    if (stats.totalAssessments === 0) {
        statsStatus.textContent =
            "No assessments have been completed yet. Be the first to take it!";

        statsStatus.hidden = false;
        statsTiles.hidden = true;

        return;
    }

    document.getElementById("stats-total").textContent = stats.totalAssessments;
    document.getElementById("stats-average").textContent = stats.averageScore.toFixed(1);
    document.getElementById("stats-weakest").textContent = stats.weakestTopic || "None so far";

    let levels = ["Low", "Moderate", "High"];

    for (let i = 0; i < levels.length; i++) {
        let level = stats.riskLevels[levels[i]];
        let id = "stats-" + levels[i].toLowerCase();

        document.getElementById(id).textContent = level.percent + "%";
        document.getElementById(id + "-count").textContent =
            level.count + " of " + stats.totalAssessments;
    }

    statsStatus.hidden = true;
    statsTiles.hidden = false;

}

// Load the community statistics when the page opens
fetch("/assessment/stats")
    .then(function (response) {
        return response.json().then(function (data) {
            if (!response.ok) {
                throw new Error(data.error || "Statistics are not available.");
            }

            showStats(data);
        });
    })
    .catch(function () {
        statsStatus.textContent =
            "Community statistics are not available right now.";
    });
