
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const FEEDBACK_FILE = path.join(__dirname, "feedback.json");
const MAX_NAME = 50;
const MAX_MESSAGE = 1000;

// EJS server-side rendering configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

// Render the homepage on the server
app.get("/", (req, res) => {
    res.render("index", {
        pageTitle: "Cybersecurity Awareness & Risk Checker for College Students",
        currentYear: new Date().getFullYear()
    });
});

// Save feedback to a JSON file
app.post("/feedback", (req, res) => {
    const body = req.body || {};

    const name =
        typeof body.name === "string" ? body.name.trim() : "";

    const message =
        typeof body.message === "string" ? body.message.trim() : "";

    if (name === "" || message === "") {
        return res.status(400).json({
            error: "Name and feedback are required."
        });
    }

    if (
        name.length > MAX_NAME ||
        message.length > MAX_MESSAGE
    ) {
        return res.status(400).json({
            error: "Name or feedback is too long."
        });
    }

    try {
        let entries = [];

        if (fs.existsSync(FEEDBACK_FILE)) {
            entries = JSON.parse(
                fs.readFileSync(FEEDBACK_FILE, "utf8")
            );

            if (!Array.isArray(entries)) {
                throw new Error("Feedback data must be an array.");
            }
        }

        entries.push({
            name,
            message,
            submittedAt: new Date().toISOString()
        });

        fs.writeFileSync(
            FEEDBACK_FILE,
            JSON.stringify(entries, null, 2)
        );
    } catch (err) {
        console.error("Failed to save feedback:", err);

        return res.status(500).json({
            error: "Could not save feedback."
        });
    }

    return res.status(201).json({
        message: "Feedback saved."
    });
});

// Handle malformed JSON requests
app.use((err, req, res, next) => {
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        Object.prototype.hasOwnProperty.call(err, "body")
    ) {
        return res.status(400).json({
            error: "Invalid JSON request body."
        });
    }

    next(err);
});

app.listen(PORT, (err) => {
    if (err) {
        console.error("Could not start server:", err.message);
        process.exit(1);
    }

    console.log("Server running on port " + PORT);
});
