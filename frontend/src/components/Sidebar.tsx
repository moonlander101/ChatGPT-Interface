import { NavLink, useNavigate, useParams } from "react-router";
import { SidebarButtonProps } from "../App";
import Tooltip from "./Tooltip";
import OptionsButton from "./OptionsButton";
import { useEffect, useRef, useState } from "react";
import OptionsMenu from "./OptionsMenu";

const getDayOfTheYear = (date: Date) => {;
  const monthDateCountCumilative = {
    January : 31,
    February : 59,
    March : 90,
    April : 120,
    May : 151,
    June : 181,
    July : 212,
    August : 243,
    September : 273,
    October : 304,
    November : 334,
    December : 365
  }
  const month = date.toLocaleString('default', { month: 'long' }) as keyof typeof monthDateCountCumilative;
  return monthDateCountCumilative[month] + date.getDate();
}


function Sidebar({ sidebarOpen, toggleSidebar, chats }: { sidebarOpen: boolean, toggleSidebar: () => void, chats: SidebarButtonProps[] }) {
  const navigator = useNavigate();
  const { chatID } = useParams();

  const [showOptions, setShowOptions] = useState<{ [key: string]: boolean }>({});
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const catagories: { [key: string]: SidebarButtonProps[] } = {}
  for (let i = 0; i < chats.length; i++) {
    const chat = chats[i];
    const date = new Date(`${chat.id.substring(0,4)}-${chat.id.substring(4,6)}-${chat.id.substring(6,8)}`);
    date.setHours(0, 0, 0, 0);

    const cur = new Date();
    const today = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate());
    
    // Calculate the difference in days between the dates
    const diffDays = Math.floor(
      (getDayOfTheYear(today) - getDayOfTheYear(date)) + ((today.getFullYear() - date.getFullYear()) * 365)
    );

    // console.log(diffDays + " value of the dates " + today.toDateString() + " minus " + date.toDateString());

    // console.log("Chat id: " + `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}` + `today ${today.getFullYear()}-${today.getMonth()}-${today.getDate()}` + " diffDays: " + diffDays);

    if (diffDays < 1) {
      catagories["Today"] = catagories["Today"] ? [...catagories["Today"], chat] : [chat];
    } else if (diffDays < 2) {
      catagories["Yesterday"] = catagories["Yesterday"] ? [...catagories["Yesterday"], chat] : [chat];
    } else if (diffDays < 7) {
      catagories["Past 7 days"] = catagories["Past 7 days"] ? [...catagories["Past 7 days"], chat] : [chat];
    } else if (diffDays < 31) {
      catagories["Past 30 days"] = catagories["Past 30 days"] ? [...catagories["Past 30 days"], chat] : [chat];
    } else {
      const month = date.toLocaleString('default', { month: 'long' })
      catagories[month] = catagories[month] ? [...catagories[month], chat] : [chat];
    }
  }

  const handleClick = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    setShowOptions((prev) => {
      const newShowOptions = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      newShowOptions[id] = !prev[id]; // Toggle only the specific menu
      return newShowOptions;
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const isOutside = Object.keys(menuRefs.current).every((id) => {
        const menu = menuRefs.current[id];
        const button = buttonRefs.current[id];
        return (
          menu &&
          button &&
          !menu.contains(event.target as Node) &&
          !button.contains(event.target as Node)
        );
      });

      if (isOutside) {
        setShowOptions({}); // Close all menus
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // console.log(catagories);
  return (
    <>
      <div className={`flex flex-1 bg-[#171717] h-full transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-[20%] min-w-[20%]' : 'min-w-[0%] w-[0%]'} max-w-[267px] shrink-0 text-[#ececec]`}>
        <div className="w-[100%] flex flex-col">
          <div className="w-full p-2 pl-4 pr-4 flex">
            <button onClick={toggleSidebar} disabled={!sidebarOpen}>
                <div className="p-2 hover:backdrop-brightness-150 rounded-md">
                    <Tooltip position="right" message="Close Sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                    </Tooltip>
                </div>
            </button>
            <div className="ml-auto">
              <Tooltip message="New Chat" position="bottom">
                <button disabled={!sidebarOpen} onClick={()=>{
                    navigator('/new');
                }}>
                    <div className="p-2 hover:backdrop-brightness-150 rounded-md">
                      {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                    </div>
                </button>
              </Tooltip>
            </div>
          </div>
          {/* <div className="relative">
                  <div className="w-8 h-8 rounded-full absolute
                                  border-4 border-solid border-[#212121] top-0"></div>
                  <div className="w-8 h-8 rounded-full animate-spin absolute
                                  border-4 border-solid border-[#ececec] border-t-transparent top-0"></div>
              </div> */}
          <div className="h-[85%] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 hover:scrollbar-thumb-zinc-500">
          {
            Object.keys(catagories).reverse().map((key) => {
              return(
                <div key={key} className="relative">
                  <p className="text-xs align-middle pl-5 pr-3 pt-3 pb-2 sticky top-0 bg-[#171717] z-10">{key}</p>
                  {
                    catagories[key].reverse().map((chat, index) => {
                      // let date = new Date(`${chat.id.substring(0,4)}-${chat.id.substring(4,6)}-${chat.id.substring(6,8)}`);
                      // console.log("Maaaaaaaaaaaaaaaaaaaaaaa " + date);
                      return (
                        <>
                          <div key={index} className="relative">
                            <div className={`w-auto h-10 pl-3 pr-3 ${chatID == chat.id ? "bg-[#212121]" : "bg-inherit"} hover:bg-[#212121] ml-2 mr-2 rounded-md flex items-center justify-between`}>
                              <NavLink className="h-full w-[80%] flex items-center" key={index} to={`/${chat.id}`}>
                                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] text-center">{chat.title}</p>
                              </NavLink>
                              <OptionsButton
                                  buttonRef={(el) => (buttonRefs.current[chat.id] = el)}
                                  handleClick={(e) => handleClick(e, chat.id)}
                                />
                              <OptionsMenu
                                showOptions={!!showOptions[chat.id]}
                                reference={(el) => (menuRefs.current[chat.id] = el)}
                                chat={chat}
                              />
                            </div>
                          </div>
                        </>
                      )
                    })
                  }
                  <div className="w-auto h-5 pl-3 bg-inherit ml-2 mr-2 rounded-md flex items-center">
                  </div>
                </div>
              )
            })
          }
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;