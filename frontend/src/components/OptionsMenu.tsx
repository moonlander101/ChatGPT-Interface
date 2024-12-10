import { useContext } from "react";
import { DeleteModalContext } from "../lib/Contexts";
import { SidebarButtonProps } from "../App";

function OptionsMenu({ showOptions, reference, chat } : { showOptions: boolean, reference: React.RefCallback<HTMLDivElement>, chat : SidebarButtonProps }) {
    const { openDeleteModal } = useContext(DeleteModalContext);

    const handleClick = () => {
        console.log("Clicked buttont to delete bruh")
        openDeleteModal({id : chat.id, title : chat.title });
    }

    return ( 
        <>
            <div className="z-20 p-1 absolute w-auto h-auto bg-[#2f2f2f] right-3 translate-y-16 rounded-xl border-[1px]  border-[#414141]" hidden={!showOptions} ref={reference}>
                <button className="flex w-28 h-10 hover:backdrop-brightness-150 rounded-md items-center p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 mr-3"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/><path d="m15 5 3 3"/></svg>
                    <p className="w-auto flex-grow text-start">Rename</p>
                </button>
                <button className="flex w-28 h-10 hover:backdrop-brightness-150 rounded-md items-center p-1 text-[#ef3936]" onClick={handleClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 mr-3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    <p className="w-auto flex-grow text-start">Delete</p>
                </button>
            </div>
        </>
     );
}

export default OptionsMenu;