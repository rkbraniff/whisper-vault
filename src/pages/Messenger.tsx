import { useState, useEffect } from "react";
import ChatThread from "../components/ChatThread";
import ChatInput from "../components/ChatInput";
import type { Message } from "../types/types";
import { getOrCreateIdentityKeyPair } from "../crypto/crypto";
import sodium from "libsodium-wrappers";
import ChatBubble from "../components/ChatBubble";

export default function Messenger() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [identityKeyPair, setIdentityKeyPair] = useState<{
    publicKey: Uint8Array;
    privateKey: Uint8Array;
  } | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await sodium.ready;
      const identity = await getOrCreateIdentityKeyPair();
      setIdentityKeyPair(identity);
      const id = sodium.to_base64(identity.publicKey);
      setUserId(id);
    })();
  }, []);

  function handleSend(content: string) {
    if (!userId) return;
    const newMessage: Message = {
      content,
      sender: userId,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <div className="flex-1 overflow-y-auto">
        <ChatThread messages={messages} userId={userId} />
        <ChatBubble
          message={{
            id: "1",
            content: "Hello bubble test",
            sender: userId ?? "me",
            timestamp: Date.now(),
          }}
          userId={userId}
        />
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
