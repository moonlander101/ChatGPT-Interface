const fs = require('node:fs/promises');
const path = require('path')

const CHATS_PATH = path.resolve(__dirname, './chats');

fs.access(CHATS_PATH, fs.constants.F_OK)
.catch(async (err)=>{
    await fs.mkdir(CHATS_PATH);
});


const openChat = async (dateStr) => {
    let d = new Date(dateStr);
    try {
        const chat = await fs.readFile(`${CHATS_PATH}/${dateStr}.json`, 'utf-8');
        return JSON.parse(chat);
    } catch (err) {
        console.error('Cannot open chat');
        return null;
    }
}

const getOldMessages = async (dateStr) => {
    let d = new Date(dateStr);
    const chat = await openChat(dateStr);
    if (chat) {
        return chat.messages;
    }
    return [];
}

const getTitle = async (dateStr) => {
    let d = new Date(dateStr);
    const chat = await openChat(dateStr);
    if(chat) {
        return chat.title;
    }
    return '';
}

const storeChat = async (dateStr, title, messages) => {
    let d = new Date(dateStr);
    const chat = {
        title,
        messages
    }
    await fs.writeFile(`${CHATS_PATH}/${dateStr}.json`, JSON.stringify(chat));
}

// For compatibility
const updateChat = async (dateStr, title, messages) => {
    return storeChat(dateStr, title, messages)
}

const clearChat = async (dateStr) => {
    await fs.access(`${CHATS_PATH}/${dateStr}.json`, fs.constants.F_OK)
    await storeChat(dateStr, 'Chat', []);
}

const getAllChats = async () => {
    const files = await fs.readdir(CHATS_PATH);
    return files.map(file => file.split('.')[0]);
}

const checkIfChatExists = async (dateStr) => {
    try {
        await fs.access(`${CHATS_PATH}/${dateStr}.json`, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    getOldMessages,
    getTitle,
    storeChat,
    clearChat,
    getAllChats,
    checkIfChatExists,
    updateChat
}

