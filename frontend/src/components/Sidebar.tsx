function Sidebar({ sidebarOpen, toggleSidebar }: { sidebarOpen: boolean, toggleSidebar: () => void }) {
  return (
    <>
      <div className={`bg-[#171717] h-full transition-all duration-500 ease-out ${sidebarOpen ? 'w-[20%]' : 'w-[0%]'} max-w-[267px] shrink-0 text-[#ececec]`}>
        <div className="w-full p-2 pl-4">
            <button onClick={toggleSidebar}>
                <div className="p-1 mr-6" hidden={!sidebarOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panels-top-left"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                </div>
            </button>
        </div>
        {/* <div className="relative">
                <div className="w-8 h-8 rounded-full absolute
                                border-4 border-solid border-[#212121] top-0"></div>
                <div className="w-8 h-8 rounded-full animate-spin absolute
                                border-4 border-solid border-[#ececec] border-t-transparent top-0"></div>
            </div> */}
        <button className="w-full">
          <div className="w-auto h-10 pl-3 bg-inherit hover:bg-[#212121] ml-2 mr-2 rounded-md flex items-center">
            <p>Chat</p>
          </div>
        </button>
      </div>
    </>
  );
}

export default Sidebar;