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
    res.sendStatus(200)
    return
})

app.post("/api/chat", async (req, res) => {
    if (req.body.sender === "botmessage") return
    else if (req.body.message.toLowerCase() === "ping") res.status(200).json({sender: "botmessage", message: "pong"})
    else if (req.body.message.startsWith('!covid')) {
        let string = req.body.message.split('!covid ') [1];
        let string2 = string.toLowerCase()
        let country = string2.charAt(0).toUpperCase() + string2.slice(1);
        let resposta = await covidData(country)
        if (!resposta) {
            res.status(404).json({sender: "botmessage", message: "Couldn't find any data for that country, make sure the country's name is correct"})
            return
        }
        res.status(200).json({sender: "botmessage", message: `COVID DATA FROM ${country}: \n\nCases: ${resposta.confirmed}\nRecovered: ${resposta.recovered}\nDeaths: ${resposta.deaths}\nPopulation: ${resposta.population}\nCases: ${resposta.confirmed}\nUpdated @ ${resposta.updated}`})
    }
    else res.status(200).json({sender: "botmessage", message: randomMessage(FAKEMESSAGES)})
})

function randomMessage(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function covidData(arg) {
    const response = await fetch(`https://covid-api.mmediagroup.fr/v1/cases?country=${arg}`);
    const covid = await response.json();
    return covid.All;
}