// Tooltip.js
function Tooltip({ visible, message } : { visible: boolean, message: string }) {
    return (
        <div className="absolute -top-[2px] translate-x-[120%] right-0 z-20 bg-black p-2 rounded text-sm w-fit h-fit text-white text-nowrap" hidden={!visible}>
            {message}
        </div>
    );
}

export default Tooltip;