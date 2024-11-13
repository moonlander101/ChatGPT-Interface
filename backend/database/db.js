const fs = require('node:fs/promises');
const path = require('path')

const openChat = async (dateStr) => {
    let d = new Date(dateStr);
    try {
        const chat = await fs.readFile(path.resolve(__dirname, `./chats/${dateStr}.json`), 'utf-8');
    return JSON.parse(chat);
    } catch (err) {
        console.error('bruh');
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
    await fs.writeFile(path.resolve(__dirname, `./chats/${dateStr}.json`), JSON.stringify(chat));
}

const clearChat = async (dateStr) => {
    await storeChat(dateStr, 'Chat', []);
}

module.exports = {
    getOldMessages,
    getTitle,
    storeChat,
    clearChat
}

