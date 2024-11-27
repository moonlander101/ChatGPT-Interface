import { NavLink } from "react-router";
import { SidebarButtonProps } from "../App";
import Tooltip from "./Tooltip";

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

    console.log(diffDays + " value of the dates " + today.toDateString() + " minus " + date.toDateString());

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

  // console.log(catagories);
  return (
    <>
      <div className={`flex flex-1 bg-[#171717] h-full transition-all duration-500 ease-out ${sidebarOpen ? 'w-[30%]' : 'w-[0%]'} max-w-[267px] shrink-0 text-[#ececec]`}>
        <div className="w-[100%] max-w-[267px] flex flex-col">
          <div className="w-full p-2 pl-4 ">
                <button onClick={toggleSidebar} disabled={!sidebarOpen}>
                    <div className="p-1">
                        <Tooltip position="right" message="Close Sidebar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                        </Tooltip>
                    </div>
                </button>
          </div>
          {/* <div className="relative">
                  <div className="w-8 h-8 rounded-full absolute
                                  border-4 border-solid border-[#212121] top-0"></div>
                  <div className="w-8 h-8 rounded-full animate-spin absolute
                                  border-4 border-solid border-[#ececec] border-t-transparent top-0"></div>
              </div> */}
          <div className="h-[85%] overflow-scroll">
          {
            Object.keys(catagories).reverse().map((key) => {
              return(
                <div key={key} className="relative">
                  <p className="text-xs align-middle pl-5 pr-3 pt-3 pb-2 sticky top-0 bg-[#171717]">{key}</p>
                  {
                    catagories[key].reverse().map((chat, index) => {
                      // let date = new Date(`${chat.id.substring(0,4)}-${chat.id.substring(4,6)}-${chat.id.substring(6,8)}`);
                      // console.log("Maaaaaaaaaaaaaaaaaaaaaaa " + date);
                      return (
                        <NavLink className={({ isActive, isPending }) =>
                            isPending ? "w-full" : isActive ? "w-full bg-[#212121]" : ""
                          } 
                          key={index} to={`/${chat.id}`}>
                          <div className="w-auto h-10 pl-3 bg-inherit hover:bg-[#212121] ml-2 mr-2 rounded-md flex items-center">
                            <p className="overflow-hidden text-ellipsis whitespace-nowrap w-[90%] text-[14px]">{chat.title}</p>
                          </div>
                        </NavLink>
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