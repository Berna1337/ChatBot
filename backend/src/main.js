require('isomorphic-fetch');
const express = require("express")
const app = express()
const port = process.env.PORT ?? 3025

//array with random messages since this bot doesnt use ML/AI
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

//array of jokes for "tell me a joke"
const JOKES = [
    "How many programmers does it take to change a light bulb? None – It’s a hardware problem",
    "['hip', 'hip']",
    "My wife said: Honey, please go to the market and buy 1 bottle of milk. If they have eggs, bring 6.\nI came back with 6 bottles of milk.\nShe said: Why the hell did you buy 6 bottles of milk?\nI said: Because they had eggs!!",
    "When do two functions fight? \nWhen they have arguments",
    "To understand what recursion is, you must first understand recursion.",
    "A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn't."
]

app.use(express.json())

app.listen(port, () => console.log(`À escuta em http://localhost:${port}`));

//endpoint that tells the frontend if its online
app.get("/api/bot", (req, res) => {
    res.sendStatus(200)
    return
})

//endpoint for chat logic
app.post("/api/chat", async (req, res) => {
    if (req.body.sender === "botmessage") return
    else if (req.body.message.toLowerCase() === "ping") res.status(200).json({sender: "botmessage", message: "pong"});
    else if (req.body.message.toLowerCase() === "tell me a joke") res.status(200).json({sender: "botmessage", message: randomMessage(JOKES)});
    else if (req.body.message.startsWith('!covid')) {
        const string = req.body.message.split('!covid ') [1];
        const string2 = string.toLowerCase()
        const country = string2.charAt(0).toUpperCase() + string2.slice(1);
        const resposta = await covidData(country)
        if (!resposta) {
            res.status(404).json({sender: "botmessage", message: "Couldn't find any data for that country, make sure the country's name is correct"})
            return
        }
        res.status(200).json({sender: "botmessage", message: `COVID DATA FROM ${country}: \n\nCases: ${resposta.confirmed}\nRecovered: ${resposta.recovered}\nDeaths: ${resposta.deaths}\nPopulation: ${resposta.population}\nCases: ${resposta.confirmed}\nUpdated @ ${resposta.updated}`})
    }
    else res.status(200).json({sender: "botmessage", message: randomMessage(FAKEMESSAGES)})
})

//function to chose a random message from one of the arrays
function randomMessage(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

//function to fetch data from a public covid api, example: "!covid portugal"
async function covidData(arg) {
    const response = await fetch(`https://covid-api.mmediagroup.fr/v1/cases?country=${arg}`);
    const covid = await response.json();
    return covid.All;
}