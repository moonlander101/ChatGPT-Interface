import { useState, useRef, useEffect } from 'react';
import './App.css'
import ResponseText from './components/responseText'
import UserTextBubble from './components/userText'
import Navbar from './components/Navbar';
import TextInput from './components/TextInput';
import Sidebar from './components/Sidebar';
import ScrollButton from './components/ScrollButton';
import { markdownString } from './components/Test';

interface Message {
  role: string;
  content: string;
}

function App() {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [oldMessages, setOldMessages] = useState<Message[]>([]);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const scrollToEnd = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
    
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // setOldMessages(prevMessages => [...prevMessages, {role: "assistant", content: markdownString}]);
    
    setIsSubmitting(false);
    
    scrollToEnd();
  }

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight < scrollHeight - 500) {
          // console.log('at bottom');
          if (isAtBottom === true) {
            setIsAtBottom(false);
          }
        } else {
          // console.log('not at bottom');
          if (!isAtBottom) {
            setIsAtBottom(true);
          }
        }
        // setIsAtBottom(scrollHeight - scrollTop === clientHeight);
      }
    }

    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
    }
    scrollToEnd();
  }, [oldMessages]);

  return (
    <>
      <div className='w-[100%] h-screen flex justify-evenly'>
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
        <div className={`relative w-[100%]`}>
          <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen}/>
          <div className="bg-[#212121] flex h-screen flex-col justify-between">
            <div className="flex-1 w-auto overflow-y-auto" ref={scrollRef}>
              <div className='w-full h-10 bg-inherit'></div>
              {oldMessages.map((message, index) => (
                message.role === "user"
                  ? <UserTextBubble key={index} message={message.content} />
                  : <ResponseText key={index} message={message.content} />
              ))}
              <div ref={lastMessageRef}/>
            </div>
            <div className="w-full pb-7 pt-4 relative">
              <ScrollButton isAtBottom={isAtBottom} onClick={scrollToEnd}/>
              <TextInput onSubmit={handleSubmit} isSubmitting={isSubmitting}/>
            </div>
          </div>
        </div>
        </div>
    </>
  );
}

export default App;
