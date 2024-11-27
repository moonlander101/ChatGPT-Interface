import Tooltip from "./Tooltip";

function Navbar({toggleSidebar, handleClear, sidebarOpen} : {handleClear: () => void, toggleSidebar: () => void, sidebarOpen: boolean}) {
    return ( <>
        <div className="flex font-semibold text-lg w-full h-auto p-2 pl-4 absolute z-50 top-0 text-[#999999] bg-[#212121] bg-opacity-10 backdrop-blur-sm">
            <Tooltip message="Open Sidebar" position="bottom-left">
            <button onClick={toggleSidebar}>
                <div className="p-1" hidden={sidebarOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                </div>
            </button>
            </Tooltip>
            <button onClick={handleClear} className="w-20 text-red-200">
                <div className="p-1 ml-3 mr-6 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </div>
            </button>
            <p className={`p-[1px] w-screen ${sidebarOpen ? 'text-center' : ''}`}>ChatGPT API</p>
        </div>
    </> );
}

export default Navbar;