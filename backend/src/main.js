require('isomorphic-fetch');
const express = require("express")
const app = express()
const port = process.env.PORT ?? 3025

const FAKEMESSAGES = [
    'Hi there, I\'m Berna and you?',
    'How are you?',
    'Nice to meet you',
    'What do you do?',
    'That\'s awesome',
    'I think you\'re a nice person',
    'Why do you think that?',
    'Can you explain?',
    'Anyway I\'ve gotta go now',
    'It was a pleasure chat with you',
    'Bye',
    ':)',
    'Not too bad, thanks',
];

app.use(express.json())

app.listen(port, () => console.log(`À escuta em http://localhost:${port}`));

app.get("/api/bot", (req, res) => {
    res.sendStatus(202)
    return
})

app.post("/api/chat", (req, res) => {
    if (req.body.sender === "botmessage") return
    else if (req.body.message.toLowerCase() === "ping") res.status(201).json({sender: "botmessage", message: "pong"})
    else res.status(201).json({sender: "botmessage", message: randomMessage(FAKEMESSAGES)})
})

function randomMessage(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}