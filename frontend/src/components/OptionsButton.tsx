import Tooltip from "./Tooltip";

function OptionsButton({buttonRef, handleClick} : {buttonRef: React.RefCallback<HTMLButtonElement>, handleClick: (event: React.MouseEvent) => void}) {
    return ( 
        <>
            <Tooltip message="Options" position="top-left">
                <button className="relative hover:backdrop-brightness-150 p-[2px] mr-auto rounded-md" onClick={handleClick} ref={buttonRef}>
                    <div className="text-[#e3e3e3] hover:text-white z-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="19" cy="12" r="1"/>
                            <circle cx="5" cy="12" r="1"/>
                        </svg>
                    </div>
                </button>
            </Tooltip>
        </>
     );
}

export default OptionsButton;