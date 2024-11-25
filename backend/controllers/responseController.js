const OpenAI = require("openai");
const { getOldMessages, storeChat, clearChat } = require('../database/db');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Doesnt work need to change
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

const getStreamedResponse = async (req,res) => {
    const dateStr = req.body.key;
    const oldMessages = await getOldMessages(dateStr);

    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();

    const message = req.body.message;
    oldMessages.push({ role: "user", content: message });

    let om = { role: "assistant", content: "" };  

    let stream = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...oldMessages,
        ],
        stream: true
    });
    
    for await (const chunk of stream) {
        // console.log(chunk.choices[0]?.delta?.content || "No content");
        res.write(chunk.choices[0]?.delta?.content || "");
        om.content += chunk.choices[0]?.delta?.content || "";
    }
    oldMessages.push(om);
    console.log(oldMessages);

    try {
        await storeChat(dateStr, "Chat", oldMessages);
    } catch(err) {
        console.log("bruh2")
    }
    return res.end();
}

const clearOldMessages = async (req,res) => {
    const dateStr = req.body.key;
    await clearChat(dateStr);
    return res.end();
}

module.exports = {
    getResponse,
    clearOldMessages,
    getStreamedResponse
};