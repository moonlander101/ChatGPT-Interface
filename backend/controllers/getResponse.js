const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

oldMessages = []

const getResponse = async (message) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...oldMessages,
            { role: "user", content: message },
        ],
    });

    oldMessages.push({ role: "user", content: message }); 
    oldMessages.push(completion.choices[0].message);

    return completion.choices[0].message;
}

const clearOldMessages = () => {
    oldMessages = []
}

module.exports = {
    getResponse,
    clearOldMessages
};