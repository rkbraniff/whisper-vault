import ChatBubble from "./ChatBubble";
import type { Message } from "../types/types";

export default function ChatThread({
  messages,
  userId,
}: {
  messages: Message[];
  userId: string | null;
}) {
  return (
    <div className="flex flex-col space-y-2 p-4 bg-vault-bg">
      {messages.map((msg, i) => (
        <ChatBubble key={i} message={msg} userId={userId} />
      ))}
    </div>
  );
}
