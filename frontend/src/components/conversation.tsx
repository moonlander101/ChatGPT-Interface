// import { useRef, useState } from "react"

import { useEffect, useRef, useState } from "react";
import { Message, SidebarButtonProps } from "../App";
import UserTextBubble from "./userText";
import ResponseText from "./responseText";
import ScrollButton from "./ScrollButton";
import TextInput from "./TextInput";
import { useNavigate, useOutletContext, useParams } from "react-router";

function Conversation() {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [oldMessages, setOldMessages] = useState<Message[]>([]);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

  const { chatID } = useParams();
  // const [statefullChatID, setStatefullChatID] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const updateSidebar = useOutletContext<() => Promise<SidebarButtonProps | "">>();

  const addDelimiters = (message: string) => {
    return message
    .replace(/\\\(/g, '$$')
    .replace(/\\\)/g, '$$')
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
  }

  const scrollToEnd = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleSubmit = async (message: string) => {
    setIsSubmitting(true);

    setOldMessages(prevMessages => [...prevMessages, {role: "user", content: message, isDone: true},{role: "assistant", content: '', isDone: false}]);

    const aiRes = await fetch('http://localhost:3000/response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        key : chatID
      })
    });

    const reader = aiRes.body!.getReader();
    const decoder = new TextDecoder();

    setIsGenerating(true);

    // Used to change url from "new" to generated id from server
    // let newChatID = "";
    let changed = false;
    
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setIsGenerating(false);
          break;
        };


        if (chatID === "new" || chatID === undefined) {
          changed = true;
        }

        const chunk = decoder.decode(value, { stream: true })
        // console.log(chunk)
        // try {
        //   const meta = JSON.parse(chunk);
        //   console.log("Meta is " + meta.id);
        //   newChatID = meta.id;
        //   continue
        // // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // } catch (e) {
        setOldMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content: addDelimiters(updatedMessages[updatedMessages.length - 1].content + chunk),
          };
          return updatedMessages;
        }); 
        // }
        // if (isAtBottom) {
        //   scrollToEnd();
        // }
    }

    // Setting isDone to true
    setOldMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1] = {
        ...updatedMessages[updatedMessages.length - 1],
        isDone : true
      };
      return updatedMessages;
    });

    setIsSubmitting(false);
    if (changed) {
      updateSidebar().then((chat : SidebarButtonProps | "") => {
        if (chat !== "") {
          navigate(`/${chat.id}`, { replace: false });
        }
      })
    }
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

    // This may cause an issue later as its adding so many event listners
    return () => {
      if (cur) {
        cur.removeEventListener('scroll', handleScroll);
      }
    };
    // if (oldMessages.length !== 0) {
    //     console.log(oldMessages);
    // }
  }, [oldMessages, isAtBottom]);

  // Loads chat history when chatID changes
  useEffect(() => {
    console.log("chat id from url is " + chatID)
    if (chatID !== undefined) {
      fetch(`http://localhost:3000/chat/${chatID}`).then(res => res.json()).
      then((data: Message[]) => {
        if (data.length === 0) {
          // replaces url to /new when invalid chat id is entered
          navigate('/new');
        }
        
        data.forEach((message) => {
          if (message.role === "assistant") {
            message.isDone = true;
            message.content = addDelimiters(message.content);
          }
        })
        setOldMessages(data)
      });
      return;
    }
    
  },[chatID]);

  return (
    <>
    <div className="bg-[#212121] flex h-screen flex-col justify-between">
      <div className="flex-1 w-auto overflow-y-auto" ref={scrollRef}>
        <div className='w-full h-10 bg-inherit'></div>
        {oldMessages.map((message, index) => (
          message.role === "user"
            ? <UserTextBubble key={index} message={message.content} />
            : <ResponseText key={index} message={message.content} isGenerating={isGenerating && !message.isDone}/>
        ))}
        <div ref={lastMessageRef}/>
      </div>
      <div className="w-full pb-7 pt-4 relative">
        <ScrollButton isAtBottom={isAtBottom} onClick={scrollToEnd}/>
        <TextInput onSubmit={handleSubmit} isSubmitting={isSubmitting}/>
      </div>
    </div>
    </> 
  );
};

export default Conversation
