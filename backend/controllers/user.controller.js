import dotenv from "dotenv";
import fetch from "node-fetch"; 

dotenv.config();

const userController = async (req, res) => {
    try {
        const { userInput } = req.body;

        if (!userInput?.trim()) {
            return res.status(400).json({ msg: "UserInput is Mandatory" });
        }
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.CHATBOT_API_KEY}`, 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1:free", 
                messages: [{ role: "user", content: userInput }],
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        return res.status(200).json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error("🔥 OpenRouter API Error:", error); 
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export default userController;
