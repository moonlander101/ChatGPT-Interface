import { useState, useRef, useEffect } from 'react';
import './App.css'
import ResponseText from './components/responseText'
import UserTextBubble from './components/userText'
import Navbar from './components/Navbar';
import TextInput from './components/TextInput';
import Sidebar from './components/Sidebar';
import ScrollButton from './components/ScrollButton';

interface Message {
  role: string;
  content: string;
}

function App() {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
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
  
  const handleClear = async () => {
    console.log("clearing messages");
    await fetch('http://localhost:3000/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        key : "20241113130312" //HARDCODED
      })
    });
    console.log("cleared messages");
    setOldMessages([]);
    setIsAtBottom(true);
  }

  const handleSubmit = async (message: string) => {
    setIsSubmitting(true);

    setOldMessages(prevMessages => [...prevMessages, {role: "user", content: message},{role: "assistant", content: ''}]);

    const aiRes = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        key : "20241113130312" //HARDCODED
      })
    });

    const reader = aiRes.body!.getReader();
    const decoder = new TextDecoder();

    setIsGenerating(true);
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setIsGenerating(false);
          break;
        };

        const chunk = decoder.decode(value, { stream: true })  

        setOldMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content: updatedMessages[updatedMessages.length - 1].content + chunk,
          };
          return updatedMessages;
        });

        // if (isAtBottom) {
        //   scrollToEnd();
        // }
    }

    // Delimiters for math
    setOldMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1] = {
        ...updatedMessages[updatedMessages.length - 1],
        content: updatedMessages[updatedMessages.length - 1].content
        .replace(/\\\(/g, '$$')
        .replace(/\\\)/g, '$$')
        .replace(/\\\[/g, '$$$$')
        .replace(/\\\]/g, '$$$$')
      ,
      };
      return updatedMessages;
    });

    setIsSubmitting(false);
    // scrollToEnd();
  }

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight < scrollHeight - 300) {
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

    const cur = scrollRef.current;

    if (cur) {
      cur.addEventListener('scroll', handleScroll);
    }

    if (isAtBottom) {
      scrollToEnd();
    }

    // This may cause an issue later 
    // return () => {
    //   if (cur) {
    //     cur.removeEventListener('scroll', handleScroll);
    //   }
    // };
    if (oldMessages.length !== 0) {
        console.log(oldMessages);
    }
  }, [oldMessages]);

  return (
    <>
        <div className='w-[100%] h-screen flex justify-evenly'>
          <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
          <div className={`relative w-[100%]`}>
            <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} handleClear={handleClear}/>
            <div className="bg-[#212121] flex h-screen flex-col justify-between">
              <div className="flex-1 w-auto overflow-y-auto" ref={scrollRef}>
                <div className='w-full h-10 bg-inherit'></div>
                {oldMessages.map((message, index) => (
                  message.role === "user"
                    ? <UserTextBubble key={index} message={message.content} />
                    : <ResponseText key={index} message={message.content} isGenerating={isGenerating}/>
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
