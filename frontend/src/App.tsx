import { useRef, useState } from 'react';
import './App.css'
import ResponseText from './components/responseText'
import UserTextBubble from './components/userText'

interface Message {
  role: string;
  content: string;
}


function App() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const [textareaValue, setTextareaValue] = useState<string>('');
  const [height, setHeight] = useState<number>(0);
  const [oldMessages , setOldMessages] = useState<Message[]>([]);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      setHeight(textarea.scrollHeight);
      setTextareaValue(textarea.value);
      console.log(textarea.scrollHeight);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (textareaValue === "") return;

    setOldMessages(prevMessages => [...prevMessages, {role: "user", content: textareaValue}]);

    const aiRes = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({message: textareaValue})
    });
    
    const aiResData = await aiRes.json() as Message;

    setOldMessages(prevMessages => [...prevMessages, {role: aiResData.role, content: aiResData.content}]);
    
    setTextareaValue('');
    textareaRef.current!.style.height = 'auto';
    textareaRef.current!.value = '';

    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    // console.log(textareaValue);
    // setOldMessages([...oldMessages, {role: "user", content: textareaValue}]);
    // console.log(oldMessages)
    // setOldMessages([...oldMessages, {role: aiResData.role, content: aiResData.content}]);
    // console.log(oldMessages)
  }
  
  return (
    <>
      <div className='bg-[#212121] h-screen'>
      {/* 'w-auto overflow-y-auto max-h-[80%] min-h-[60%] scroll-m-1' */}
            <div className={height <= 42 ? 'w-auto overflow-y-auto max-h-[80%] scroll-m-1' : 
              (height <= 72 ? 'w-auto overflow-y-auto max-h-[75%] scroll-m-1' : (
                height <= 96 ? 'w-auto overflow-y-auto max-h-[70%] scroll-m-1' : (
                  height <= 96 ? 'w-auto overflow-y-auto max-h-[75%] scroll-m-1' : 'w-auto overflow-y-auto max-h-[60%] scroll-m-1')))}>
              {oldMessages.map((message, index) => {
                return message.role === "user" ? <UserTextBubble key={index} message={message.content} /> : <ResponseText key={index} message={message.content} />
              })}
            </div>
            <div ref={lastMessageRef}/>
        <div className="flex flex-col-reverse w-full h-auto items-end p-7 fixed bottom-1">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <div className='bg-[#2F2F2F] p-3 w-4/5 rounded-3xl max-w-[720px] flex items-end'>
                <div className="p-1 ml-1 mr-2 rounded-lg hover:bg-[#00000033] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paperclip">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </div>
                
                {/* Textarea that grows */}
                <textarea
                  ref={textareaRef}
                  onInput={handleInput}
                  className="mb-[0.8%] row-span-2 resize-none h-auto w-[90%] border-none outline-none bg-inherit text-white caret-white max-h-[200px] overflow-y-auto"
                  placeholder="Message Something"
                  rows={1}
                />

                {/* Submit Button */}
                <button type="submit" className="ml-auto" disabled={textareaValue === "" ? true : false}>
                  <div className={`p-1 mr-1 ml-2 rounded-lg ${textareaValue !== "" ? "hover:bg-[#00000033]" : ""} transition-colors`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={`${textareaValue === "" ? "grey" : "white"}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal">
                      <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/>
                      <path d="M6 12h16"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
