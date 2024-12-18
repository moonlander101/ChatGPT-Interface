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
  const [oldMessages, setOldMessages] = useState<Message[]>([]);

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const openDeleteModal = ({id, title } : {id:string, title : string}) => {
    console.log("The context worked?")
    if (id !== "" && title !== "") {
      console.log("Opening delete dialogue for ", id, title)
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const handleClear = () => {
    setOldMessages([]);
  }

  return (
    <>
        <div className='relative w-[100%] h-screen flex justify-evenly'>
          <DeleteModal id={currentSelectionToDelete.id} title={currentSelectionToDelete.title} hidden={!isDeleteModalOpen} handleClose={closeDeleteModal} updateSidebar={updateSidebar}></DeleteModal>
          <div className={`flex max-w-[267px] transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-[20%]' : 'w-[0%]'}`}>
            <DeleteModalContext.Provider value={{
              isDeleteModalOpen,
              openDeleteModal
            }}>
              <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} chats={chats} handleClear={handleClear}/>
            </DeleteModalContext.Provider>
          </div>
          <div className={`relative w-[100%]`}>
            <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} handleClear={handleClear}/>
            <Outlet context={{updateSidebar, oldMessages, setOldMessages}}/>
          </div>
        </div>
    </>
  );
}

export default App;
