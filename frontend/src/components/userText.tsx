function UserTextBubble({ message } : {message : string}) {
    return ( 
        <>
            <div className="pt-2 flex justify-center">
                <div className="max-w-[720px] w-[80%] flex justify-end p-2 pr-8">
                    <div className="w-fit max-w-[78%] bg-[#2f2f2f] h-auto rounded-2xl pl-4 pr-4 pt-3 pb-3 text-white break-words whitespace-pre-wrap">
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserTextBubble;