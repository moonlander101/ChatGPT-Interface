import { useEffect, useState } from 'react';
import Markdown  from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {coldarkDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import './prism-coldark-dark.css'

function ResponseText({ message } : {message : string}) {
    const [copied, setCopied] = useState<boolean>(false);


    useEffect(()=>{
        // Regular expression to match all occurrences between triple backticks
        const regex = /```(.*?)```/gs;

        // Find all matches
        const matches = message.match(regex);

        // If you want to remove the backticks and get just the content inside
        let cleanMatches : string[] = []
        if (matches) {
            cleanMatches = matches.map(match => {
                let codeBlock = match.slice(3, -3).trim();
                codeBlock = codeBlock.replace(/^.*?\n/, '');
                return codeBlock;
            });
        }

        console.log(cleanMatches);
    },[]) 
    return (
        <div className="flex justify-center">
            <div className="w-4/5 max-w-[720px] flex p-2">
                <div className="rounded-3xl w-[100%] text-white pl-6 pr-6 pt-3 pb-3">
                    <div className='markdown'>
                        <Markdown
                            children={message}
                            components={{
                            code(props) {
                                const {children, className, node, ...rest} = props
                            
                                const match = /language-(\w+)/.exec(className || '')
                                return match ? (
                                <div>
                                    <div className='w-full h-[30px] bg-[#2F2F2F] text-xs relative text-[#A8A8A8] rounded-t-[10px] flex'>
                                        <p className='absolute top-0 left-3 z-auto'>{match[1]}</p>
                                        <button className='p-0 absolute -top-1 right-1 z-auto flex flex-row-reverse w-10' onClick={()=>{
                                            setCopied(true)
                                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
                                            setTimeout(()=>{setCopied(false)}, 1000)
                                        }} disabled={copied}>
                                        <p className=''>{copied ? "Copied" : "Copy"}</p>
                                        <div className='w-6 h-6 -translate-y-1'>
                                            {!copied ? (
                                                <svg className='p-0'
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24" height="24" 
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                            </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                                            )}
                                        </div>
                                        </button>
                                    </div>
                                    <SyntaxHighlighter
                                    // {...rest}
                                    PreTag="div"
                                    children={String(children).replace(/\n$/, '')}
                                    language={match[1]}
                                    style={coldarkDark}
                                    customStyle={{
                                        borderRadius : "0px 0px 10px 10px",
                                        margin : "0px",
                                        fontSize : "14px"
                                    }}
                                    wrapLongLines={true}
                                    useInlineStyles={false}
                                    />
                                </div>
                                ) : (
                                <code {...rest} className={className}>
                                    {children}
                                </code>
                                )
                            }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
     );
}

export default ResponseText;