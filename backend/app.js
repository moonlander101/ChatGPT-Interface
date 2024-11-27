const express = require('express')
const app = express()
const port = 3000

const {getResponse,clearOldMessages, getStreamedResponse, getAllChatIDS} = require('./controllers/responseController')
const { clearChat, getOldMessages } = require('./database/db')

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

// s
app.get('/', (req, res) => {
  res.send('My api works bro')
})

app.get('/chat/:dateStr', async (req, res) => {
  const chats = await getOldMessages(req.params.dateStr)
  return res.json(chats)
})

app.get('/sidebar', async (req, res) => {
  return res.json(await getAllChatIDS())
})

app.post('/clear', async (req, res) => {
    await clearOldMessages(req,res);
    console.log("Old messages cleared")
    // return res.end()
})

app.post('/response', async (req, res) => {
    await getStreamedResponse(req,res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})