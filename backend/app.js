const express = require('express')
const app = express()
const port = 3000

const {getResponse,clearOldMessages} = require('./controllers/getResponse')

const corsMiddleWare = (req,res,next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Allow only the specified origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify allowed HTTP methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With'); // Allowed headers in requests
  res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Disposition'); // Headers exposed to the client

  // If the request method is OPTIONS, return a successful response for preflight checks
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
}

app.use(express.json())
app.use(corsMiddleWare)


app.get('/', (req, res) => {
  res.send('My api works bro')
})

app.get('/clear', (req, res) => {
    clearOldMessages()
    console.log("Old messages cleared")
    return res.end()
})


const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

oldMessages = []

app.post('/chat', async (req, res) => {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  let localOldMessages = [...oldMessages];  // Clone to prevent cross-request issues

  const message = req.body.message;
  localOldMessages.push({ role: "user", content: message });

  let om = { role: "assistant", content: "" };
  localOldMessages.push(om);

  let stream = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...localOldMessages,
      ],
      stream: true
  });

  for await (const chunk of stream) {
      // console.log(chunk.choices[0]?.delta?.content || "No content");
      res.write(chunk.choices[0]?.delta?.content || "");
      om.content += chunk.choices[0]?.delta?.content || "";
  }

  return res.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})