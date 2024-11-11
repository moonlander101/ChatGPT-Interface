import { useEffect, lazy } from 'react';
const Markdown = lazy(() => import('react-markdown'));
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {coldarkDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import './prism-coldark-dark.css'

function ResponseText({ message } : {message : string}) {
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
                                        <p className='p-0 absolute top-0 left-3'>{match[1]}</p>
                                    </div>
                                    <SyntaxHighlighter
                                    {...rest}
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