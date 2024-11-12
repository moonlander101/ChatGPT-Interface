function ScrollButton({isAtBottom, onClick}: {isAtBottom: boolean, onClick: () => void}) {
    return (
        <div
            className="w-8 h-8 transform-all absolute left-[46%] md:left-[47%] lg:left-[48%] xl:left-[48.5%] -top-10 bg-black rounded-full"
            hidden={isAtBottom}
        >
            <button className="w-full h-full text-white" onClick={onClick}>
                <div className="w-full flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1"
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
