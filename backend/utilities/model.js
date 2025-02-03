import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openaiModel = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.CHATBOT_API_KEY,
});

export default openaiModel;