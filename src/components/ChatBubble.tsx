import type { Message } from "../types/types";

export default function ChatBubble({
  message,
  userId,
}: {
  message: Message;
  userId: string | null;
}) {
  const isMe = message.sender === userId;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-xl px-4 py-2 max-w-xs border border-white ${
          isMe ? "bg-vault-accent text-black" : "bg-gray-300 text-black"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
