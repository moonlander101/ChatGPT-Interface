function Navbar({toggleSidebar, sidebarOpen} : {toggleSidebar: () => void, sidebarOpen: boolean}) {
    return ( <>
        <div className="flex font-semibold text-lg w-full h-auto p-2 pl-4 absolute top-0 text-[#999999] bg-[#212121] bg-opacity-10 backdrop-blur-sm">
            <button onClick={toggleSidebar}>
                <div className="p-1 pr-6" hidden={sidebarOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                </div>
            </button>
            <p className={`p-[1px] w-screen ${sidebarOpen ? 'text-center' : ''}`}>ChatGPT API</p>
        </div>
    </> );
}

export default Navbar;