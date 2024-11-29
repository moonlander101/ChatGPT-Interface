import { useRef, useState } from "react";

function Tooltip({children, position = "right", message="Add message"} : {children: React.ReactNode, position? : "top" | "bottom" | "left" | "right" | "bottom-left", message : string}) {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null); // Ref to store the timeout ID

    let posClass = "right-0 translate-x-[120%]";
    let outSideBoxClass = "w-[50%] ml-[50%] h-[50%] top-0"
    
    switch(position) {
        case "top":
            posClass = "top-0 translate-y-[-120%] translate-x-[-50%]";
            outSideBoxClass = "w-[50%] ml-[50%] h-[50%]"
            break;
        case "bottom":
            posClass = "left-[100%] bottom-0 -translate-x-[50%] translate-y-[120%]";
            outSideBoxClass = "w-[50%] mr-[50%] mt-[50%] h-[50%]";
            break;
        case "left":
            posClass = "top-0 left-0 -translate-y-[50%] translate-x-[-120%]";
            outSideBoxClass = "w-[50%] mr-[50%] mt-[50%] h-[50%]";
            break;
        case "right":
            posClass = "right-0 bottom-0 translate-x-[120%] translate-y-[50%]";
            outSideBoxClass = "w-[50%] ml-[50%] h-[50%]"
            break;
        case "bottom-left":
            posClass = "left-0 bottom-0 translate-y-[120%]";
            outSideBoxClass = "w-[50%] mr-[50%] mt-[50%] h-[50%]";
            break
        default:
            posClass = "right-0 bottom-0 translate-x-[120%] translate-y-[50%]";
            outSideBoxClass = "w-[50%] ml-[50%] h-[50%]"
            break;
    }

    const handleMouseIn = () => {
        timeoutRef.current = window.setTimeout(() => {
            setShowTooltip(true);
        }, 500);
    };

    const handleMouseOut = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setShowTooltip(false);
    };
    
    return ( 
    <>
        <div className="relative flex w-fit" onMouseLeave={handleMouseOut} onMouseEnter={handleMouseIn}>
            <div className={`absolute ${outSideBoxClass} top-0`}>
                <div className={`absolute z-20 ${posClass} bg-black p-2 rounded text-sm w-fit h-fit text-white text-nowrap`} hidden={!showTooltip}>
                    {message}
                </div>
            </div>
            {children}
        </div>
    </> 
    );
}

export default Tooltip;