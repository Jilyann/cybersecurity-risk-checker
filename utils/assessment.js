// Scoring and statistics for the Cybersecurity Awareness Assessment

// Each assessment question and the topic it belongs to
const QUESTION_TOPICS = {
    "password-unique": "password",
    "password-sharing": "password",
    "mfa-use": "mfa",
    "verification-review": "mfa",
    "sender-check": "phishing",
    "phishing-links": "phishing"
};

const TOPIC_NAMES = {
    password: "Password and Account Security",
    mfa: "Multi-Factor Authentication",
    phishing: "Phishing Awareness"
};

const VALID_ANSWERS = ["yes", "sometimes", "no"];

// Risk points for each answer. "No" is the riskiest habit.
const ANSWER_POINTS = {
    yes: 0,
    sometimes: 1,
    no: 2
};

// Returns an error message, or null when all six answers are valid
function validateAnswers(answers) {
    if (typeof answers !== "object" || answers === null) {
        return "Assessment answers are required.";
    }

    for (const question in QUESTION_TOPICS) {
        if (!VALID_ANSWERS.includes(answers[question])) {
            return "Please answer all six questions with yes, sometimes, or no.";
        }
    }

    return null;
}

// Calculates the total score, the risk level, and the points for each topic
function scoreAssessment(answers) {
    let score = 0;
    const topicPoints = { password: 0, mfa: 0, phishing: 0 };

    for (const question in QUESTION_TOPICS) {
        const points = ANSWER_POINTS[answers[question]];

        score = score + points;
        topicPoints[QUESTION_TOPICS[question]] += points;
    }

    let riskLevel = "High";

    if (score <= 3) {
        riskLevel = "Low";
    } else if (score <= 7) {
        riskLevel = "Moderate";
    }

    return { score, riskLevel, topicPoints };
}

// Summarizes all saved assessment results
function calculateStats(entries) {
    const total = entries.length;
    const counts = { Low: 0, Moderate: 0, High: 0 };
    const topicTotals = { password: 0, mfa: 0, phishing: 0 };
    let scoreTotal = 0;

    entries.forEach((entry) => {
        counts[entry.riskLevel] += 1;
        scoreTotal += entry.score;

        for (const topic in topicTotals) {
            topicTotals[topic] += entry.topicPoints[topic];
        }
    });

    const riskLevels = {};

    for (const level in counts) {
        riskLevels[level] = {
            count: counts[level],
            percent: total === 0 ? 0 : Math.round((counts[level] / total) * 100)
        };
    }

    // The weakest topic is the one where students lost the most points
    let weakestTopic = null;
    let highestPoints = 0;

    for (const topic in topicTotals) {
        if (topicTotals[topic] > highestPoints) {
            highestPoints = topicTotals[topic];
            weakestTopic = TOPIC_NAMES[topic];
        }
    }

    return {
        totalAssessments: total,
        averageScore: total === 0 ? 0 : Math.round((scoreTotal / total) * 10) / 10,
        riskLevels: riskLevels,
        weakestTopic: weakestTopic
    };
}

module.exports = { validateAnswers, scoreAssessment, calculateStats };
