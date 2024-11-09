const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

messages = []

const completion = openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": "Guess a Number"
            }
        ]
        },
    ],
});

completion.then((d)=>{
    console.log(d.choices[0].message)
    console.log(process.env.Bruh)
});

