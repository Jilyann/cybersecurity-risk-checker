const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const FEEDBACK_FILE = path.join(__dirname, "feedback.json");
const MAX_NAME = 50;
const MAX_MESSAGE = 1000;

app.use(express.json());
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/feedback", (req, res) => {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (name === "" || message === "") {
        return res.status(400).json({ error: "Name and feedback are required." });
    }

    if (name.length > MAX_NAME || message.length > MAX_MESSAGE) {
        return res.status(400).json({ error: "Name or feedback is too long." });
    }

    try {
        let entries = [];
        if (fs.existsSync(FEEDBACK_FILE)) {
            entries = JSON.parse(fs.readFileSync(FEEDBACK_FILE, "utf8"));
        }
        entries.push({ name, message, submittedAt: new Date().toISOString() });
        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(entries, null, 2));
    } catch (err) {
        console.error("Failed to save feedback:", err);
        return res.status(500).json({ error: "Could not save feedback." });
    }

    res.status(201).json({ message: "Feedback saved." });
});

app.listen(PORT, (err) => {
    if (err) {
        console.error("Could not start server:", err.message);
        process.exit(1);
    }
    console.log("Server running on port " + PORT);
});