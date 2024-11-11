import { useState, useRef, useEffect } from 'react';
import './App.css'
import ResponseText from './components/responseText'
import UserTextBubble from './components/userText'
import Logo from './components/logo';
import TextInput from './components/TextInput';

interface Message {
  role: string;
  content: string;
}

function App() {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [oldMessages, setOldMessages] = useState<Message[]>([]);
  const [height, setHeight] = useState<number>(83);

  const scrollToEnd = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
  const changeHeight = (newHeight : number) => {
    console.log(newHeight)
    setHeight(newHeight);
  }

  const handleSubmit = async (message: string) => {
    setIsSubmitting(true);

    setOldMessages(prevMessages => [...prevMessages, {role: "user", content: message}]);

    const aiRes = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });

    const aiResData = await aiRes.json() as Message;

    setOldMessages(prevMessages => [...prevMessages, {role: aiResData.role, content: aiResData.content}]);
    setIsSubmitting(false);
    
    scrollToEnd();
  }

  useEffect(() => {
    scrollToEnd();
  }, [oldMessages]);

  return (
    <>
      <Logo />
      <div className="bg-[#212121] h-screen">
        <div className={`w-auto overflow-y-auto max-h-[${height}%]`}>
          {oldMessages.map((message, index) => (
            message.role === "user" 
              ? <UserTextBubble key={index} message={message.content} />
              : <ResponseText key={index} message={message.content} />
          ))}
          <div ref={lastMessageRef} />
        </div>
        <div className="flex flex-col-reverse w-full h-auto items-end p-7 fixed bottom-1">
          <TextInput onSubmit={handleSubmit} isSubmitting={isSubmitting} heightCallBack={changeHeight}/>
        </div>
      </div>
    </>
  );
}

export default App;
