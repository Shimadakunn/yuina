"use client";

import { Button } from "@/components/ui/button";
import { Chat } from "@/lib/openai/chat";
import { Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

export default function ChatComponent() {
  const { address } = useAccount();
  const [messages, setMessages] = useState<
    Array<{
      role: string;
      content: string;
      walletAddress?: string;
      timestamp: number;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messageLoaded, setMessageLoaded] = useState(false);

  useEffect(() => {
    async function initializeChat() {
      const response = await fetch("/api/messages");
      const { messagesArray } = await response.json();
      setMessages(messagesArray);
      setMessageLoaded(true);
    }
    initializeChat();
  }, []);

  const sendMessage = useCallback(async () => {
    if (!Chat.instance || !input.trim() || !address) return;
    setLoading(true);
    const newMessage = {
      role: "user",
      content: input,
      walletAddress: address,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const response = await Chat.instance.sendMessage(input, address);
    setLoading(false);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: response, timestamp: Date.now() },
    ]);
  }, [input, address]);

  return (
    <div className="mx-auto flex flex-col justify-start max-w-[800px] w-full h-[57vh]">
      <TabBar />
      <div className="flex flex-col justify-end h-[95%] border-2 border-t-0 border-main rounded-b-3xl bg-gradient-to-b from-[#F48BC9]/5 to-[#A67AEA]/20 backdrop-blur-sm">
        {messageLoaded ? (
          <ChatContent messages={messages} loading={loading} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500 text-2xl animate-pulse">
              メッセージを読み込んでいます...
            </div>
          </div>
        )}
        <Input input={input} setInput={setInput} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

function TabBar() {
  return (
    <div className="flex items-center gap-2 h-10 border-2 border-main px-2 rounded-t-xl backdrop-blur-sm bg-gradient-to-r from-[#a388ee]/5 to-[#a388ee]/20">
      <div className="rounded-full bg-red-500/60 w-4 h-4" />
      <div className="rounded-full bg-yellow-500/60 w-4 h-4" />
      <div className="rounded-full bg-green-500/60 w-4 h-4" />
    </div>
  );
}

function ChatContent({
  messages,
  loading,
}: {
  messages: Array<{
    role: string;
    content: string;
    walletAddress?: string;
    timestamp: number;
  }>;
  loading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds}秒前`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}時間前`;
    return `${Math.floor(seconds / 86400)}日前`;
  };

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto p-4 space-y-4 flex flex-col"
    >
      {[...messages]
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((message, index) => (
          <div
            key={`${message.timestamp}-${index}`}
            className={`flex ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`flex items-start gap-2 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {message.role === "user" && (
                <img
                  src={`https://api.dicebear.com/9.x/identicon/svg?seed=${message.walletAddress}`}
                  alt="avatar"
                  className="rounded-full w-6 h-6"
                />
              )}
              <div
                className={`max-w-[70%] pl-4 pr-2 py-2 rounded-2xl ${
                  message.role === "assistant"
                    ? "bg-white/80 rounded-tl-sm"
                    : "bg-[#EE8BD5]/30 rounded-tr-sm"
                }`}
              >
                <div className="flex flex-col">
                  <div className="text-sm">{message.content}</div>
                  {message.role === "user" && (
                    <div className="text-xs text-gray-500 self-end">
                      {getTimeAgo(message.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      {loading && (
        <div className="flex justify-start">
          <div className="max-w-[70%] px-4 py-3 rounded-2xl bg-white/80 rounded-tl-sm">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  input,
  setInput,
  sendMessage,
}: {
  input: string;
  setInput: (input: string) => void;
  sendMessage: (message: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isConnected } = useAccount();

  return (
    <div className="mb-3 flex items-end bg-gray-100 justify-between w-[95%] mx-auto rounded-2xl pl-4 pr-2 gap-2">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder={
          isConnected
            ? "メッセージを入力してください"
            : "ウォレットを接続してチャットを始めましょう"
        }
        className="w-full border-none resize-none overflow-y-auto py-3 max-h-[120px] focus:outline-none bg-gray-100 disabled:cursor-not-allowed"
        style={{ minHeight: "44px" }}
        value={input}
        disabled={!isConnected}
        onChange={(e) => {
          const textarea = e.target;
          textarea.style.height = "auto";
          textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
          setInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
          }
        }}
      />
      <Button
        size="icon"
        className="rounded-full h-9 w-9 flex-shrink-0 mb-[6px] border-none hover:scale-110 transition-all duration-300"
        variant="noShadow"
        onClick={() => sendMessage(input)}
        disabled={!isConnected}
      >
        <Send />
      </Button>
    </div>
  );
}
