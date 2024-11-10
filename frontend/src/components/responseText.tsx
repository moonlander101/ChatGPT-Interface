import ReactMarkdown from 'react-markdown'


function ResponseText({ message } : {message : string}) {
    return ( 
        <div className="flex justify-center">
            <div className="w-4/5 max-w-[720px] flex p-2">
                <div className="rounded-3xl w-[100%] h-auto text-white pl-6 pr-6 pt-3 pb-3">
                    <div className='markdown'>
                        <ReactMarkdown>
                            {message}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default ResponseText;