import { useEffect, useRef } from "react";
import { SidebarButtonProps } from "../App";

type DeleteModalProps  = SidebarButtonProps & {
    hidden: boolean;
    handleClose : () => void;
};
function DeleteModal({id, title, hidden, handleClose} : DeleteModalProps) {
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            handleClose();
        }
    }

    useEffect(()=>{
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        }
    },[])

    return ( 
        <>
        <div className={`absolute w-screen h-screen bg-[#000000c0] z-[60] flex flex-col items-center justify-center text-[#f9f9f9] ${hidden && "hidden"}`}>
            <div className="w-[60%] max-w-[448px] h-[60%] max-h-[227px] bg-[#2f2f2f] rounded-2xl overflow-y-scroll" >
                <div className="h-[32%] flex flex-col justify-center p-6 text-lg border-b-[1px] border-b-[#444444]">
                    <p className="font-semibold">Delete chat?</p>
                </div>
                <div className="h-[40%] p-6">
                    This will Delete <strong>{title}</strong>
                </div>
                <div className="h-[28%] relative">
                    <div className="absolute right-6 flex flex-row-reverse">
                        <button className="w-[70px] h-9 bg-[#ef4444] rounded-2xl text-sm hover:bg-[#ef4444ae]">
                            Delete
                        </button>
                        <button className="w-[70px] h-9 bg-[2f2f2f] mr-4 border-[1px] border-[#444444] rounded-2xl text-sm hover:backdrop-brightness-150" onClick={handleClose}>
                            Cancel
                        </button>
                    </div>           
                </div>
            </div>
        </div>
        </> 
    );
}

export default DeleteModal;