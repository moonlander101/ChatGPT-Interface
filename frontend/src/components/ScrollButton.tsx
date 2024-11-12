function ScrollButton({isAtBottom, onClick}: {isAtBottom: boolean, onClick: () => void}) {
    return (
        <div
            className="w-10 h-10 absolute ml-[46.75%] -top-10 bg-black rounded-full"
            hidden={isAtBottom}
        >
            <button className="w-full h-full text-white" onClick={onClick}>
                <div className="w-full flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-arrow-down"
                    >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                    </svg>
                </div>
            </button>
        </div>
    );
}

export default ScrollButton;
