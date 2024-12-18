const OpenAI = require("openai");

const CHAT_SAVE_MODES = {
    "FileSystem": 1,
    "MongoDB": 2
}
const MODEL_TYPE = {
    "OpenAI" : 1,
    "HuggingFace" : 2
}

const config = require("../configs/config.json")

let Api;
if (config.CHAT_SAVE_MODE === CHAT_SAVE_MODES.MongoDB) {
    console.log("Using MongoDB");
    Api = require('../database/mongo_db');
} else {
    console.log("Using File System");
    Api = require('../database/db');
}

const { 
    getOldMessages, 
    storeChat, 
    clearChat, 
    getAllChats, 
    checkIfChatExists, 
    getTitle, 
    updateChat,
    deleteChat
} = Api

let clientOptions = {}

if (config.MODEL_TYPE === MODEL_TYPE.HuggingFace) {
    clientOptions["baseURL"] = process.env.BASE_URL
    clientOptions["apiKey"] = process.env.HF_API_KEY
} else {
    clientOptions["apiKey"] = process.env.OPENAI_API_KEY
}
// console.log("Client options are", clientOptions)
const openai = new OpenAI(clientOptions);

// const list = openai.models.list().then(async models => {
//     for await (const model of models) {
//         console.log(model);
//     }
// });


// Doesnt work need to change
const getResponse = async (message) => {
    const completion = await openai.chat.completions.create({
        model: config.model,
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
    let dateStr = req.body.key;
    let title = await getTitle(dateStr);
    const doesExist = await checkIfChatExists(dateStr);

    if (!doesExist) {
        dateStr = formatDate(new Date());
    }

    const oldMessages = await getOldMessages(dateStr);
    console.log(oldMessages)

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
        // model: "meta-llama/Llama-3.2-3B-Instruct",
        model: config.model,
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...oldMessages,
        ],
        max_tokens: 500,
        stream: true
    });
    
    // res.write(JSON.stringify({
    //     id : dateStr
    // }));

    for await (const chunk of stream) {
        // console.log(chunk.choices[0]?.delta?.content || "No content");
        // res.write(`${chunk.choices[0]?.delta?.content || ""}`);
        res.write(chunk.choices[0]?.delta?.content || "");
        om.content += chunk.choices[0]?.delta?.content || "";
    }
    oldMessages.push(om);
    console.log(oldMessages);

    try {
        if (!doesExist) {
            title = await generateTitle(oldMessages);
            await storeChat(dateStr, title, oldMessages);
        } else {
            await updateChat(dateStr, title, oldMessages);
        }
    } catch(err) {
        console.log(err)
    }
    return res.end();
}

const getStreamedResponseTemp = async (req,res) => {
    const oldMessages = req.body.oldMessages;
    console.log("Before submission", oldMessages)
    // return;

    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();

    // const message = req.body.message;
    // oldMessages.push({ role: "user", content: message });

    let om = { role: "assistant", content: "" };  

    let stream = await openai.chat.completions.create({
        // model: "meta-llama/Llama-3.2-3B-Instruct",
        model: config.model,
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...oldMessages,
        ],
        max_tokens: 500,
        stream: true
    });
    
    // res.write(JSON.stringify({
    //     id : dateStr
    // }));

    for await (const chunk of stream) {
        // console.log(chunk.choices[0]?.delta?.content || "No content");
        // res.write(`${chunk.choices[0]?.delta?.content || ""}`);
        res.write(chunk.choices[0]?.delta?.content || "");
        om.content += chunk.choices[0]?.delta?.content || "";
    }
    oldMessages.push(om);
    console.log("After submission",oldMessages);
    return res.end();
}

const generateTitle = async (oldMessages) => {

    const completion = await openai.chat.completions.create({
        // model: "meta-llama/Llama-3.2-3B-Instruct",
        model: config.model,
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...oldMessages,
            { role: "user", content: "Give me a small title to summarize what this chat is about. A title to remember this chat by. No need quotation marks between the title" },
        ],
    });

    return completion.choices[0].message.content;
}

const clearOldMessages = async (req,res) => {
    const dateStr = req.body.key;
    await clearChat(dateStr);
    return res.end();
}

const getAllChatIDS = async () => {
    const metadataArray = []
    const files = await getAllChats();
    for (let i = 0; i < files.length; i++) {
        let metadata = {}
        metadata.id = files[i];
        metadata.title = await getTitle(files[i]);
        metadataArray.push(metadata);
    }
    return metadataArray
}

const handleDeleteChat = async (req,res) => {
    const dateStr = req.body.key;
    try {
        await deleteChat(dateStr);
        return res.status(200).end()
    } catch(e) {
        console.error(e)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}


module.exports = {
    getResponse,
    clearOldMessages,
    getStreamedResponse,
    getAllChatIDS,
    getOldMessages,
    handleDeleteChat,
    clearChat,
    getStreamedResponseTemp
};


function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}