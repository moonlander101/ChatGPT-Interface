
import { useRef, useState } from "react";
import Tooltip from "./Tooltip";
function TestApp() {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null); // Ref to store the timeout ID

    const handleMouseIn = () => {
        // Set a timeout for 1 second to show the tooltip
        timeoutRef.current = window.setTimeout(() => {
            setShowTooltip(true);
        }, 1000);
    };

    const handleMouseOut = () => {
        // Clear the timeout if mouse leaves before 1 second
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        // Hide the tooltip immediately
        setShowTooltip(false);
    };

    return (
        <>
            <div className="w-40 h-40 bg-black p-2 relative" onMouseEnter={handleMouseIn} onMouseLeave={handleMouseOut}>
                <p className="text-white">Hover over me to see tooltip</p>
                <Tooltip visible={showTooltip} message="2"/>
            </div>
        </>
    );
}

export default TestApp;