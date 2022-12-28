import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// create instance of OpenAI
const openai = new OpenAIApi(configuration);

// initialize express application
const app = express();
// allow cross-origin requests
app.use(cors());
// allow passing json to backend
app.use(express.json());

// dummy root route
app.get('/', async(req, res) => {
    res.status(200).send({
        message: "Hello from codx",
    })
});

app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

