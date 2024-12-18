// import { useRef, useState } from "react"

import { useEffect, useRef, useState } from "react";
import { Message, SidebarButtonProps } from "../App";
import UserTextBubble from "./userText";
import ResponseText from "./responseText";
import ScrollButton from "./ScrollButton";
import TextInput from "./TextInput";
import { createSearchParams, useNavigate, useOutletContext, useParams, useSearchParams } from "react-router";

type OutletProps = {
  updateSidebar: () => Promise<SidebarButtonProps | "">;
  oldMessages: Message[];
  setOldMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

function Conversation() {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // const [oldMessages, setOldMessages] = useState<Message[]>([]);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

  const { chatID } = useParams();
  const [searchParams] = useSearchParams();
  const temp_chat = searchParams.get('temp_chat');
  // const [statefullChatID, setStatefullChatID] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const {updateSidebar, oldMessages, setOldMessages} = useOutletContext<OutletProps>();

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

  const handleTempSubmit = async (message  : string) => {
    setIsSubmitting(true);
    console.log(oldMessages);
    setOldMessages(prevMessages => [...prevMessages, {role: "user", content: message, isDone: true},{role: "assistant", content: '', isDone: false}]);
    
    const oms = oldMessages.map((message) => {
      return {role : message.role, content : message.content}
    })

    const aiRes = await fetch('http://localhost:3000/temp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        oldMessages : [...oms, {role: "user", content: message}],
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
            content: addDelimiters(updatedMessages[updatedMessages.length - 1].content + chunk),
          };
          return updatedMessages;
        }); 
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
        key : chatID,
        temp_chat : searchParams.get('temp_chat')
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
    const temp_chat = searchParams.get('temp_chat');

    console.log("chat id from url is " + chatID)
    console.log("temp chat is " + temp_chat)
    if (chatID !== undefined) {
      if (temp_chat === "1") {
        navigate({
          pathname : "/new",
          search : createSearchParams({temp_chat : "1"}).toString()
        });
        return;
      }

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
        {oldMessages.length !== 0 ? (
          oldMessages.map((message, index) => (
            message.role === "user"
              ? <UserTextBubble key={index} message={message.content} />
              : <ResponseText key={index} message={message.content} isGenerating={isGenerating && !message.isDone}/>
          ))
        ) : (
          <div className={`flex flex-col ${temp_chat === "1" ? "justify-center" : "justify-end"} items-center h-[80%] text-[#8e8e8e]`}>
            {temp_chat === "1" ? (
              <p className="font-semibold text-2xl text-white">Temporary Chat</p>
            ) : (
              <p className="font-semibold text-3xl text-white">What can I help with?</p>
            )}
            <p className="mt-4 w-96 text-center" hidden={temp_chat !== "1"}>
              This chat won't be saved in your history, use the refresh button at the top to clear out the current conversation and start over.
            </p>
            {temp_chat === "1" && <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mt-6"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>}
          </div>
        )}
        <div ref={lastMessageRef}/>
      </div>
      <div className={`w-full pb-7 pt-4 relative transition-transform ${oldMessages.length === 0 && temp_chat !== "1" ? "h-[60%]" : "h-auto"}`}>
        <ScrollButton isAtBottom={isAtBottom} onClick={scrollToEnd}/>
        <TextInput onSubmit={(message : string)=>{ 
          if (temp_chat === "1") {
            handleTempSubmit(message);
            return;
          } 
          handleSubmit(message);
        }} isSubmitting={isSubmitting}/>
      </div>
    </div>
    </> 
  );
};

export default Conversation
