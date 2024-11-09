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
    
  );
};

export default Conversation
