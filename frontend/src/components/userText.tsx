function UserTextBubble({ message } : {message : string}) {
    return ( 
        <>
            <div className="pt-2 flex justify-center">
                <div className="max-w-[720px] w-full flex justify-end p-2 pr-8">
                    <div className="w-auto bg-[#2f2f2f] rounded-2xl pl-6 pr-6 pt-3 pb-3 text-white">
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserTextBubble;