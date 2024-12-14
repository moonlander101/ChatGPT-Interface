import { useRef, useState } from "react";

function Tooltip({children, position = "right", message="Add message"} : {children: React.ReactNode, position? : "top" | "bottom" | "left" | "right" | "bottom-left" | "top-left", message : string}) {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null); // Ref to store the timeout ID

    let posClass = "right-0 translate-x-[120%]";
    let outSideBoxClass = "w-[50%] ml-[50%] h-[50%] top-0"
    let smallTickClass = "-translate-x-[50%] mt-[13%] rotate-45 border-l-[1px] border-b-[1px] border-[#262626]"
    
    switch(position) {
        case "top":
            posClass = "top-0 translate-y-[-120%] translate-x-[-50%]";
            outSideBoxClass = "w-[50%] ml-[50%] h-[50%]"
            smallTickClass = "mt-[28%] ml-[48%] mr-auto -translate-y-[50%] rotate-45 border-r-[1px] border-b-[1px] border-[#262626]"
            break;
        case "bottom":
            posClass = "left-[100%] bottom-0 -translate-x-[50%] translate-y-[120%]";
            outSideBoxClass = "w-[50%] mr-[50%] mt-[50%] h-[50%]";
            smallTickClass = "ml-[48%] mr-auto -translate-y-[50%] rotate-45 border-l-[1px] border-t-[1px] border-[#262626]"
            break;
        case "left":
            posClass = "top-0 left-0 -translate-y-[50%] translate-x-[-120%]";
            outSideBoxClass = "w-[50%] mr-[50%] mt-[50%] h-[50%]";
            smallTickClass = "ml-[97%] mt-[15%] mr-auto -translate-y-[50%] rotate-45 border-r-[1px] border-t-[1px] border-[#262626]"
            break;
        case "right":
            posClass = "right-0 bottom-0 translate-x-[120%] translate-y-[50%]";
            outSideBoxClass = "w-[50%] ml-[50%] h-[50%]"
            smallTickClass = "-translate-x-[50%] mt-[13%] rotate-45 border-l-[1px] border-b-[1px] border-[#262626]"
            break;
        case "bottom-left":
            posClass = "left-0 bottom-0 translate-y-[120%]";
            outSideBoxClass = "w-[50%] mr-[50%] mt-[50%] h-[50%]";
            smallTickClass = "ml-[20%] mr-auto -translate-y-[50%] rotate-45 border-l-[1px] border-t-[1px] border-[#262626]"
            break
        case "top-left":
            posClass = "top-0 right-0 -translate-y-[120%]";
            outSideBoxClass = "w-[50%] ml-[50%] mb-[50%] h-[50%]";
            smallTickClass = "ml-[70%] mr-auto mt-[49%] rotate-45 border-r-[1px] border-b-[1px] border-[#262626]"
            break;
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
                <div className={`absolute z-20 ${posClass} bg-black p-2 rounded-lg text-sm w-fit h-fit text-white text-nowrap font-semibold border-[1px] border-[#262626]`} hidden={!showTooltip}>
                <div className={`w-2 h-2 bg-black absolute top-0 left-0 z-20 ${smallTickClass}`}></div>
                    {message}
                </div>
            </div>
            {children}
        </div>
    </> 
    );
}

export default Tooltip;