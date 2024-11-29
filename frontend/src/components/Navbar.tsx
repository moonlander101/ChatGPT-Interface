import { useNavigate } from "react-router";
import Tooltip from "./Tooltip";

function Navbar({toggleSidebar, handleClear, sidebarOpen } : {handleClear: () => void, toggleSidebar: () => void, sidebarOpen: boolean }) {
    const navigate = useNavigate();
    
    return ( <>
        <div className="flex font-semibold text-lg w-full h-auto p-2 pl-0 absolute z-50 top-0 text-[#999999] bg-[#212121] bg-opacity-10 backdrop-blur-sm">
            <div className={`w-[10%] z-50 min-w-[150px] flex ${sidebarOpen ? "justify-start pl-4" : "justify-evenly"}`}>
                {!sidebarOpen && (
                    <>
                    <Tooltip message="Open Sidebar" position="bottom-left">
                    <button onClick={toggleSidebar}>
                        <div className="p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                        </div>
                    </button>
                    </Tooltip>
                    <Tooltip message="New Chat" position="bottom">
                    <button onClick={()=>{
                        navigate('/new');
                    }}>
                        <div className="p-1">
                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                        </div>
                    </button>
                    </Tooltip>
                    </>
                )}
                <button onClick={handleClear} className="text-red-200">
                    <div className="p-1 w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </div>
                </button>
            </div>
            <p className={`absolute p-[1px] w-[100%] text-center`}>ChatGPT API</p>
        </div>
    </> );
}

export default Navbar;