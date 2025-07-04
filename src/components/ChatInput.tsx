import { useState } from "react";

export default function ChatInput ({ onSend }: { onSend: (msg: string) => void}) {
    const [text, setText] = useState("");

    function handleSend() {
        if (!text.trim()) return;
        onSend(text);
        setText("");
    }

    return (
        <div className="flex items-center gap-2 p-4 bg-gray-900 border-t border-gray-700">
            <input 
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-2 rounded bg-gray-800 text-white"
            placeholder="Type a message"
             />
             <button
             onClick={handleSend}
             className="px-4 py-2 bg-vault-accent text-black rounded hover:brightness-110"
             >
                Send
             </button>
        </div>
    )
}