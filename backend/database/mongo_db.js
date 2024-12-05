const fs = require('node:fs/promises');
const path = require('path')

const { MongoClient } = require('mongodb');

const CLIENT = new MongoClient(process.env.CONNECTION_URL);

async function migrateOldChatsToMongo() {
    // Assuming the chats are located in "./chats" directory at the same level as this file
    const db =  CLIENT.db("chatgptInterface")
    const col = db.collection("chats")

    const chats = await fs.readdir(path.resolve(__dirname, "./chats/"))
    let objs = []
    for (c of chats) {
        let chat = await fs.readFile(path.resolve(__dirname, "./chats/" + c))
        chat = JSON.parse(chat)
        const obj = {
            ...chat,
            _id : c.split('.')[0]
        }
        objs.push(obj)
    }
    // console.log(objs)
    await col.insertMany(objs)
}

async function createDbAndCollections() {
    try {
        const db =  CLIENT.db("chatgptInterface")
        await db.createCollection("chats")
    } catch(err) {
        console.error(err);
    }
};


const openChat = async (dateStr) => {
    // console.log("Opening " + dateStr)
    try {
        const db = CLIENT.db("chatgptInterface")
        const chats = db.collection("chats")
        const chat = await chats.findOne({ _id : dateStr })
        return chat
    } catch (err) {
        console.error(err)
        console.error('Cannot open chat');
        return null;
    }
}

const getOldMessages = async (dateStr) => {
    // let d = new Date(dateStr);
    const chat = await openChat(dateStr);
    if (chat) {
        return chat.messages;
    }
    return [];
}

const getTitle = async (dateStr) => {
    // let d = new Date(dateStr);
    const chat = await openChat(dateStr);
    if(chat) {
        return chat.title;
    }
    return '';
}

const storeChat = async (dateStr, title, messages) => {
    // let d = new Date(dateStr);
    const chat = {
        _id : dateStr,
        title,
        messages,
    }
    try {
        const db = CLIENT.db("chatgptInterface")
        await db.collection("chats").insertOne(chat)
    } catch(err) {
        console.error("Could Not store chat")
        console.error(err.errmsg)
    }
}

const updateChat = async (dateStr, title, messages) => {
    // let d = new Date(dateStr);
    const chat = {
        title,
        messages,
    }
    try {
        const db = CLIENT.db("chatgptInterface")
        await db.collection("chats").updateOne({_id : dateStr}, {$set : chat})
    } catch(err) {
        console.error("Could Not update chat")
        console.error(err.errmsg)
    }
}

const clearChat = async (dateStr) => {
    // await fs.access(`${CHATS_PATH}/${dateStr}.json`, fs.constants.F_OK)
    // await storeChat(dateStr, 'Chat', []);
}

const getAllChats = async () => {
    // const files = await fs.readdir(CHATS_PATH);
    // return files.map(file => file.split('.')[0]);
    const db = CLIENT.db("chatgptInterface")
    const chats = db.collection("chats").find({})
    let res = []
    for await (c of chats) {
        res.push(c._id)
    }
    return res
}

const checkIfChatExists = async (dateStr) => {
    try {
        const chat = await CLIENT.db("chatgptInterface").collection("chats").findOne({_id : dateStr});
        if (chat) {
            return true;
        }
        return false;
    } catch (err) {
        console.error(err)
        return false;
    }
}

createDbAndCollections().then(
    (data) => {
        console.log("Created Collection: chats, in Database: chatgptInterface")
    }
)


// migrateOldChatsToMongo()

module.exports = {
    getOldMessages,
    getTitle,
    storeChat,
    clearChat,
    getAllChats,
    checkIfChatExists,
    updateChat
}

