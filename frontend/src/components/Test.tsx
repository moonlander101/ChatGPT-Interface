
import { useRef, useState } from "react";
import Tooltip from "./Tooltip";
function TestApp() {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null); // Ref to store the timeout ID

    const handleMouseIn = () => {
        // Set a timeout for 1 second to show the tooltip
        timeoutRef.current = window.setTimeout(() => {
            setShowTooltip(true);
        }, 1000);
    };

    const handleMouseOut = () => {
        // Clear the timeout if mouse leaves before 1 second
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        // Hide the tooltip immediately
        setShowTooltip(false);
    };

    return (
        <>
            <div className="w-10 h-10">
                2
            </div>
            <Tooltip position="top" message="hello">
            <div className="m-0">
            <div className="w-40 h-40 bg-black p-2 relative" onMouseEnter={handleMouseIn} onMouseLeave={handleMouseOut}>
                <p className="text-white">Hover over me to see tooltip</p>
            </div>
            </div>
            </Tooltip>

            <div className="m-10">
            <Tooltip position="bottom-left" message="Message Recieved">
            <div className="w-[100px] h-[100px] border border-green-400">
                2
            </div>
            </Tooltip>
            </div>

            <div className="w-6 h-6 border border-red-500 rounded full">
                2
            </div>
            <div className="relative">
                <div className="w-8 h-8 rounded-full absolute
                                border-4 border-solid border-[#212121] top-0"></div>
                <div className="w-8 h-8 rounded-full animate-spin absolute
                                border-4 border-solid border-[#ececec] border-t-transparent top-0"></div>
            </div>
        </>
    );
}

export default TestApp;

export const markdownString = `
In Tailwind CSS, there's no direct utility for the \`::selection\` pseudo-element, which is used in CSS to style the portion of text a user selects (highlights). However, you can easily extend Tailwind CSS to include custom styles for the \`::selection\` pseudo-element.

Here’s how you can do it:

### Step 1: Add Custom CSS for \`::selection\`
You can add custom CSS for the \`::selection\` pseudo-element in your Tailwind configuration file (\`tailwind.config.js\`).

For example:

\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '::selection': {
          backgroundColor: '#2563eb', // Change to your preferred color
          color: '#ffffff',           // Change to your preferred color
        },
      });
    }
  ],
}
\`\`\`

### Step 2: Apply the Configuration
After you’ve added this configuration, Tailwind will apply these styles globally to any selected text. You can customize the \`backgroundColor\` and \`color\` values as needed.

### Example:
- In this example, the selected text will have a **blue** background (\`#2563eb\`) and **white** text (\`#ffffff\`).

### Additional Notes:
- This will globally apply the selection style for all text.
- If you want to target specific elements with \`::selection\`, you can define them inside the \`addBase\` section or use normal CSS in a \`<style>\` block if you prefer.

Let me know if you'd like to customize this further!
`;
