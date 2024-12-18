import { createSearchParams, useNavigate, useSearchParams } from "react-router";
import Tooltip from "./Tooltip";
import { useEffect, useRef, useState } from "react";
import SlidingButton from "./SlidingButton";

function Navbar({toggleSidebar, handleClear, sidebarOpen } : {handleClear: () => void, toggleSidebar: () => void, sidebarOpen: boolean}) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const temp_chat = searchParams.get("temp_chat");
    const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
    const optionsButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleIsOutsideClick = (e: MouseEvent) => {
            e.stopPropagation();
            if (optionsButtonRef.current && !optionsButtonRef.current.contains(e.target as Node)) {
                setIsOptionsVisible(false);
            }
        };

        const handleEspaceKey = (e: KeyboardEvent) => {
            e.stopPropagation();
            if (e.key === 'Escape') {
                setIsOptionsVisible(false);
            }
        }

        document.addEventListener('click', handleIsOutsideClick);
        document.addEventListener('keydown', handleEspaceKey);
        return () => {
            document.removeEventListener('keydown', handleEspaceKey);
            document.removeEventListener('click', handleIsOutsideClick);
        };
    }, []);

    return ( <>
        <div className="flex font-semibold text-lg w-full h-auto p-2 pl-0 absolute z-50 top-0 text-[#999999] bg-[#212121] bg-opacity-10 backdrop-blur-sm">
            <div className={`w-auto z-50 min-w-[150px] flex ${sidebarOpen ? "justify-start pl-4" : "pl-4 justify-start"}`}>
                {!sidebarOpen && (
                    <>
                    <Tooltip message="Open Sidebar" position="bottom-left">
                    <button onClick={toggleSidebar}>
                        <div className="p-2 hover:backdrop-brightness-150 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                        </div>
                    </button>
                    </Tooltip>
                    {temp_chat === "1" ? (
                        <Tooltip message="Clear Chat" position={!sidebarOpen ? "bottom" : "bottom-left"}>
                            <button onClick={handleClear}>
                                <div className="p-2 w-fit hover:backdrop-brightness-150 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M21 6H3"/><path d="M7 12H3"/><path d="M7 18H3"/><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/><path d="M11 10v4h4"/></svg>
                                </div>
                            </button>
                        </Tooltip>
                    ) : (
                        <Tooltip message="New Chat" position="bottom">
                            <button onClick={()=>{
                                handleClear()
                                navigate('/new');
                            }}>
                                <div className="p-2 hover:backdrop-brightness-150 rounded-md">
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                                </div>
                            </button>
                        </Tooltip>
                    )}
                    </>
                )}
                <button onClick={()=>{
                    setIsOptionsVisible(!isOptionsVisible);
                }} ref={optionsButtonRef}>
                    <div className={`flex flex-row p-1 pl-3 justify-center items-center hover:backdrop-brightness-150 rounded-md relative ${isOptionsVisible && "bg-"}`}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> */}
                        <p className="pr-1">ChatGPT API</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="pt-[1px] mr-2"><path d="m6 9 6 6 6-6"/></svg>
                        <div className="absolute w-80 p-1 h-auto rounded-lg bg-[#2f2f2f] -bottom-2 left-0 translate-y-[100%] border-[1px] border-[#414141] text-[#d7d7da]" hidden={!isOptionsVisible}>
                            <div>
                                <button key={"TempChat"} onClick={(e : React.MouseEvent)=>{
                                    e.stopPropagation()
                                    handleClear()
                                    const temp_chat = searchParams.get("temp_chat");
                                    if (temp_chat === "1") {
                                        navigate('/new');
                                        return;
                                    }
                                    navigate({
                                        pathname : "/new",
                                        search : createSearchParams({temp_chat : "1"}).toString()
                                    });
                                }} className="w-full p-4 hover:bg-[#414141] text-sm rounded-lg flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2"><line x1="2" x2="22" y1="2" y2="22"/><path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16"/><path d="M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5"/><path d="M14.121 15.121A3 3 0 1 1 9.88 10.88"/></svg>
                                    <p>Temporary Chat</p>
                                    <div className="w-auto h-auto ml-auto">
                                        <SlidingButton isActive={temp_chat === "1"}/>
                                    </div>
                                </button>
                                <div className="w-[90%] h-[1px] mt-[2px] mb-[2px] bg-[#414141] ml-auto mr-auto"></div>
                                <button key={"Models"} onClick={(e : React.MouseEvent)=>{
                                    // navigate('/api');
                                    e.stopPropagation();
                                }} className="w-full p-4 hover:bg-[#414141] text-sm rounded-lg flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                                    <p>Model Selection</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
            {/* <p className={`absolute p-[1px] w-[100%] text-center`}>ChatGPT API</p> */}
        </div>
    </> );
}

export default Navbar;