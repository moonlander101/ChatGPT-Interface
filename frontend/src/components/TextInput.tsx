// TextInput.tsx
import { useRef, useState } from 'react';
// import Tooltip from './Tooltip';
import Tooltip from './Tooltip';
import { useSearchParams } from 'react-router';

interface TextInputProps {
  onSubmit: (message: string) => void;
  isSubmitting: boolean;
}

const TextInput = ({ onSubmit, isSubmitting }: TextInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaValue, setTextareaValue] = useState<string>('');

  const [searchParams] = useSearchParams();

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    //   setHeight(textarea.scrollHeight);
      console.log(textarea.scrollHeight)
      // if (textarea.scrollHeight <= 24) {
      //   heightCallBack(85);
      // }
      // else if (textarea.scrollHeight > 24 && textarea.scrollHeight <= 72) {
      //   heightCallBack(70);
      // } else if (textarea.scrollHeight > 72 && textarea.scrollHeight <= 120) {
      //   heightCallBack(75);
      // } else if (textarea.scrollHeight > 120 && textarea.scrollHeight <= 168) {
      //   heightCallBack(70);
      // } else {
      //   heightCallBack(65);
      // }
      setTextareaValue(textarea.value);
    }
  };

  // const handleClickDiv = () => {
  //   if (textareaRef.current) {
  //     textareaRef.current.focus();
  //   }
  // };

  const onEnterPress = (e : React.KeyboardEvent) => {
    if(e.key == "Enter" && e.shiftKey == false && textareaValue.trim() !== '' && !isSubmitting) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }

      handleSubmit(e);
    } else if (e.key == "Enter" && isSubmitting && e.shiftKey == false) {
      e.preventDefault();
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textareaValue.trim() !== '') {
      onSubmit(textareaValue);
      setTextareaValue(''); // Clear input after submitting
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex justify-center">
        <div className={`${searchParams.get('temp_chat') !== "1" ? "bg-[#2F2F2F]" : "bg-black"} p-3 w-4/5 rounded-3xl max-w-[720px] flex-col`}>
          {/** FOR ADDING FILE INPUTS */}
          {/* <div className='w-full bg-inherit h-auto flex p-1'>
            <div className='w-16 h-16 bg-[#10a37f] m-1'></div>
            <div className='w-16 h-16 bg-[#10a37f] m-1'></div>
            <div className='w-16 h-16 bg-[#10a37f] m-1'></div>
          </div> */}
          <div className='flex w-full h-auto items-end'>
            <div className="p-1 ml-1 mr-2 rounded-lg hover:bg-[#00000033] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paperclip">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </div>
            <textarea
              ref={textareaRef}
              onInput={handleInput}
              value={textareaValue}
              className="row-span-2 pb-[5px] resize-none h-full w-full border-none outline-none bg-inherit text-white caret-white max-h-[200px] overflow-y-auto"
              placeholder="Message Something"
              rows={1}
              onKeyDown={onEnterPress}
            />
            <Tooltip position='top' message={textareaValue === "" ? "Message is Empty" : (isSubmitting ? "Submitting": "Send Message")}>
              <button type="submit" disabled={textareaValue === "" || isSubmitting}>
                <div className={`p-1 mr-1 ml-2 rounded-lg relative ${textareaValue !== "" && !isSubmitting? "hover:bg-[#00000033]" : ""} transition-colors`}>
                  {/* <Tooltip visible={showTooltip && (textareaValue === "" || isSubmitting)} message={textareaValue === "" ? "Message is Empty" : "Submitting"}/> */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={`${textareaValue === "" || isSubmitting ? "grey" : "white"}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal">
                    <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/>
                    <path d="M6 12h16"/>
                  </svg>
                </div>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TextInput;
