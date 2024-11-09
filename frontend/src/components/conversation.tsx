import { useRef, useState } from "react"

function Conversation() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaValue, setTextareaValue] = useState<string>('');

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      setTextareaValue(textarea.value);
    }
  };

  return (
    <form className="w-full">
      <div className="flex justify-center">
        <div className='bg-[#2F2F2F] p-3 w-4/5 rounded-3xl max-w-[700px] flex items-end'>
          <div className="p-1 ml-1 mr-2 rounded-lg hover:bg-[#00000033] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paperclip">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </div>
          
          {/* Textarea that grows */}
          <textarea
            ref={textareaRef}
            onInput={handleInput}
            className="mb-[0.8%] row-span-2 resize-none h-auto w-[90%] border-none outline-none bg-inherit text-white caret-white overflow-hidden"
            placeholder="Message Something"
            rows={1}
          />

          {/* Submit Button */}
          <button type="submit" className="ml-auto" disabled={textareaValue === "" ? true : false}>
            <div className={`p-1 mr-1 ml-2 rounded-lg ${textareaValue !== "" ? "hover:bg-[#00000033]" : ""} transition-colors`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={`${textareaValue === "" ? "grey" : "white"}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal">
                <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/>
                <path d="M6 12h16"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Conversation
