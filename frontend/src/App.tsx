import { useEffect, useState } from 'react';
import './App.css'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router';
import DeleteModal from './components/DeleteModal';
import { DeleteModalContext } from './lib/Contexts';

export interface Message {
  role: string;
  content: string;
  isDone : boolean;
}

export interface SidebarButtonProps {
  id : string,
  title : string,
}

function App() {
  const [chats, setChats] = useState<SidebarButtonProps[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const updateSidebar = async () => {
    try {
      const res = await fetch('http://localhost:3000/sidebar');
      const data = await res.json() as SidebarButtonProps[];
      setChats(data);
      console.log("Latest chat is,", data[data.length - 1]);
      return data[data.length - 1]
    } catch (error) {
      console.error('Error updating sidebar:', error);
      return ""
    }
  }

  useEffect(()=>{
    updateSidebar();
    console.log("Upodated sidebar")
  },[])

  const [currentSelectionToDelete, setCurrentSelectionToDelete] = useState<SidebarButtonProps>({id : "", title : ""});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(true);

  const openDeleteModal = ({id, title } : {id:string, title : string}) => {
    console.log("The context worked?")
    if (id !== "" && title !== "") {
      setCurrentSelectionToDelete({id, title});
      setIsDeleteModalOpen(true);
    } else {
      console.log("Cannot open delete dialogue without id and title")
    }
  }

  const closeDeleteModal = () => {
    setCurrentSelectionToDelete({id : "", title : ""})
    setIsDeleteModalOpen(false);
  }

  // const lastMessageRef = useRef<HTMLDivElement>(null);
  // const scrollRef = useRef<HTMLDivElement>(null);

  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // const [oldMessages, setOldMessages] = useState<Message[]>([]);
  // const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

  // const [curChat, setCurChat] = useState<string>('');
  // const [messages, setMessages] = useState<Message[]>([]);


  // const addDelimiters = (message: string) => {
  //   return message
  //   .replace(/\\\(/g, '$$')
  //   .replace(/\\\)/g, '$$')
  //   .replace(/\\\[/g, '$$$$')
  //   .replace(/\\\]/g, '$$$$')
  // }

  // const handleSelect = (chat: string) => {
  //   setCurChat(chat);
  // }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  // const scrollToEnd = () => {
  //   if (lastMessageRef.current) {
  //     lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }
  
  // const handleClear = async () => {
  //   console.log("clearing messages");
  //   await fetch('http://localhost:3000/clear', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ 
  //       key : "20241113130312" //HARDCODED
  //     })
  //   });
  //   console.log("cleared messages");
  //   setOldMessages([]);
  //   setIsAtBottom(true);
  // }

  // const handleSubmit = async (message: string) => {
  //   setIsSubmitting(true);

  //   setOldMessages(prevMessages => [...prevMessages, {role: "user", content: message, isDone: true},{role: "assistant", content: '', isDone: false}]);

  //   const aiRes = await fetch('http://localhost:3000/chat', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ 
  //       message,
  //       key : "20241113130312" //HARDCODED
  //     })
  //   });

  //   const reader = aiRes.body!.getReader();
  //   const decoder = new TextDecoder();

  //   setIsGenerating(true);
  //   while (true) {
  //       const { value, done } = await reader.read();
  //       if (done) {
  //         setIsGenerating(false);
  //         break;
  //       };

  //       const chunk = decoder.decode(value, { stream: true })  

  //       setOldMessages(prevMessages => {
  //         const updatedMessages = [...prevMessages];
  //         updatedMessages[updatedMessages.length - 1] = {
  //           ...updatedMessages[updatedMessages.length - 1],
  //           content: addDelimiters(updatedMessages[updatedMessages.length - 1].content + chunk),
  //         };
  //         return updatedMessages;
  //       });

  //       // if (isAtBottom) {
  //       //   scrollToEnd();
  //       // }
  //   }

  //   // Delimiters for math
  //   setOldMessages(prevMessages => {
  //     const updatedMessages = [...prevMessages];
  //     updatedMessages[updatedMessages.length - 1] = {
  //       ...updatedMessages[updatedMessages.length - 1],
  //       content: updatedMessages[updatedMessages.length - 1].content
  //       .replace(/\\\(/g, '$$')
  //       .replace(/\\\)/g, '$$')
  //       .replace(/\\\[/g, '$$$$')
  //       .replace(/\\\]/g, '$$$$'),
  //       isDone : true
  //     };
  //     return updatedMessages;
  //   });

  //   setIsSubmitting(false);
  //   // scrollToEnd();
  // }

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (scrollRef.current) {
  //       const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
  //       if (scrollTop + clientHeight < scrollHeight - 300) {
  //         // console.log('at bottom');
  //         if (isAtBottom === true) {
  //           setIsAtBottom(false);
  //         }
  //       } else {
  //         // console.log('not at bottom');
  //         if (!isAtBottom) {
  //           setIsAtBottom(true);
  //         }
  //       }
  //       // setIsAtBottom(scrollHeight - scrollTop === clientHeight);
  //     }
  //   }

  //   const cur = scrollRef.current;

  //   if (cur) {
  //     cur.addEventListener('scroll', handleScroll);
  //   }

  //   if (isAtBottom) {
  //     scrollToEnd();
  //   }

  //   // This may cause an issue later as its adding so many event listners
  //   // return () => {
  //   //   if (cur) {
  //   //     cur.removeEventListener('scroll', handleScroll);
  //   //   }
  //   // };
  //   if (oldMessages.length !== 0) {
  //       console.log(oldMessages);
  //   }
  // }, [oldMessages]);

  // useEffect(() => {
  //   if (curChat === '') {
  //     setMessages([]);
  //   } else {
  //     // fetch messages

  //     // setMessages(messages);
  //   }
  // }, [chats, curChat]);

  return (
    <>
        <div className='relative w-[100%] h-screen flex justify-evenly'>
          <DeleteModal id={currentSelectionToDelete.id} title={currentSelectionToDelete.title} hidden={!isDeleteModalOpen} handleClose={closeDeleteModal}></DeleteModal>
          <div className={`flex max-w-[267px] transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-[20%]' : 'w-[0%]'}`}>
            <DeleteModalContext.Provider value={{
              isDeleteModalOpen,
              openDeleteModal
            }}>
              <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} chats={chats}/>
            </DeleteModalContext.Provider>
          </div>
          <div className={`relative w-[100%]`}>
            <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} handleClear={()=>{}}/>
            <Outlet context={updateSidebar}/>
          </div>
        </div>
    </>
  );
}

export default App;
