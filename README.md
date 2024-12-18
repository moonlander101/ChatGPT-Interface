# ChatGPT-Interface

A UI (that is *somewhat* similar to ChatGPT) for the OpenAI API or any model that supports the Messaging API. Key features include 

- Chat History
- Temporary Chat
- Support for math and code blocks

## Setup Instructions

### Step 1: Install Dependencies

1. Navigate to the `@/backend` directory and run:
   ```bash
   npm install
   ```
2. Navigate to the `@/frontend` directory and run:
   ```bash
   npm install
   ```

### Step 2: Run the Application

Run the `run.ps1` script located in the root directory to start the web application:
```bash
./run.ps1
```

- **First Time Setup**:  
  On the first execution, this script will automatically configure the required environment variables and generate configuration files before starting the application.

## Environment Variables

### Required Variables

To use the app, you need to set the following environment variables:

#### Using OpenAI API
```bash
OPENAI_API_KEY=<your_openai_api_key>
```

#### Using Hugging Face API
```bash
HF_API_KEY=<your_huggingface_api_key>
BASE_URL=<huggingface_inference_api_base_url>
```

> Note: The `run.ps1` script will prompt you to enter these keys during setup if they are not already configured.

### Saving Chats with MongoDB (Optional)

If you want to save your chat history to a MongoDB database, you need to set an additional environment variable:
```bash
CONNECTION_URL=<your_mongodb_connection_url>
```

## Saving Chat History

By default, chat history is saved as files in the `@/backend/database/chats/` directory.

### To Use MongoDB Instead:

1. Open the `@/backend/configs/config.json` file.
2. Locate the `"CHAT_SAVE_MODE"` property and update its value:

#### Default (File Storage):
```json
{
    // ...
    "CHAT_SAVE_MODE": 1
    // ...
}
```

#### MongoDB (Database Storage):
```json
{
    // ...
    "CHAT_SAVE_MODE": 2
    // ...
}
```

---

## Model Selection

The application supports a variety of text-completion models.

- **OpenAI Models**: Ensure the model is enabled in your OpenAI API Playground.  
- **Hugging Face Models**: Any model available via the Hugging Face Messaging or Inference API is supported.

## Notes

- Make sure you have a valid API key for the service you are using (OpenAI or Hugging Face).  
- The `run.ps1` script simplifies the setup and ensures everything is configured correctly.

Enjoy using the ChatGPT-Interface! 🎉
