# ChatGPT-Interface

Needs an OenAI API key to work, set it as the `OPENAI_API_KEY` environment variable in `./backend/.env` (you have to make the file) and run the `run.ps1` script.

## Setting up env variables

Apart from the `OPENAI_API_KEY` environment variables, if you are [using MongoDB](#where-the-chats-are-saved) to save your chats
you will need a `CONNECTION_URL` environment variable 
```bash
OPENAI_API_KEY=<your key>
CONNECTION_URL=<mongodb>
```

## Where the chats are saved

By default your past chats are saved in `@/backend/database/chats/*`, if you dont like this you can change it use MongoDB.

To do this change the following code,

```js
const OpenAI = require("openai");
const { 
    getOldMessages, 
    storeChat, 
    clearChat, 
    getAllChats, 
    checkIfChatExists, 
    getTitle, 
    updateChat 
} = require('../database/db');
```

To,

```js
const OpenAI = require("openai");
const { 
  // Same set of methods as before
} = require('../database/mongo_db');
```

## Model selection

Currently **gpt-4o-2024-08-06** is hardcoded as the model that is used to generate responses, this will be changed in later versions, additionally any models on
<a href='https://huggingface.co/blog/tgi-messages-api'>Hugging Face</a> that supports the <a href="https://huggingface.co/blog/tgi-messages-api">Messaging API</a> should also be implemented *soon* ;).

