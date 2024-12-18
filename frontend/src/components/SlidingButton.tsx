function SlidingButton({isActive} : {isActive: boolean}) {
    return ( 
        <div className={`w-9 h-5 p-[1px] ${isActive ? "bg-green-500" : "bg-inherit"} border-[1px] border-[#4a4a4a] rounded-full transition-colors`}>
            <div className={`${isActive && "translate-x-4"} w-4 h-4 bg-white rounded-full transition-transform`}></div>
        </div>
     );
}

export default SlidingButton;