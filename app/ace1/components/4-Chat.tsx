"use client";

import { Button } from "@/components/ui/button";
import { ABI } from "@/lib/const/ABI";
import { Chat } from "@/lib/openai/chat";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { keccak256, parseEther, toHex } from "viem";
import { useAccount, useWalletClient } from "wagmi";

export default function ChatComponent() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
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
    if (!Chat.instance || !input.trim() || !address || !walletClient) return;

    try {
      const hashedInput = keccak256(toHex(input));
      const result = await walletClient.writeContract({
        address: "0x7a39C38105E237447129327Ca071c0eAf47D9460",
        abi: ABI,
        functionName: "buyIn",
        value: parseEther("0.001"),
        args: [hashedInput],
      });
      console.log(result);
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response, timestamp: Date.now() },
      ]);

      window.dispatchEvent(new Event("messageSent"));
    } catch (error) {
      console.error("Contract interaction failed:", error);
    } finally {
      setLoading(false);
    }
  }, [input, address, walletClient]);

  return (
    <div className=" flex flex-col justify-start max-w-[800px] w-full h-[70vh]">
      <TabBar />
      <motion.div
        className="flex flex-col justify-end border-2 border-t-0 border-main rounded-b-3xl bg-gradient-to-b from-[#F48BC9]/10 to-[#A67AEA]/20 backdrop-blur-sm"
        animate={{
          height: messageLoaded ? "95%" : "17%",
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <ChatContent
          messages={messages}
          setMessages={setMessages}
          loading={loading}
        />
        <Input
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading}
        />
      </motion.div>
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
  setMessages,
  loading,
}: {
  messages: Array<{
    role: string;
    content: string;
    walletAddress?: string;
    timestamp: number;
  }>;
  setMessages: Dispatch<
    SetStateAction<
      Array<{
        role: string;
        content: string;
        walletAddress?: string;
        timestamp: number;
      }>
    >
  >;
  loading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Scroll to bottom only on initial load
    if (isInitialLoad.current && scrollRef.current) {
      console.log("initial load");
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      isInitialLoad.current = false;
    }
  }, [messages]);

  const handleScroll = useCallback(
    async (e: React.UIEvent<HTMLDivElement>) => {
      const div = e.currentTarget;
      const isAtRelativeTop =
        Math.abs(-div.scrollTop + div.clientHeight - div.scrollHeight) <= 1;
      if (isAtRelativeTop && !fetchingMore && !allMessagesLoaded) {
        console.log("fetching more");
        setFetchingMore(true);
        const oldestMessage = messages[0];
        if (!oldestMessage) return;

        try {
          const response = await fetch(
            `/api/messages?before=${oldestMessage.timestamp}`
          );
          const { messagesArray } = await response.json();
          if (messagesArray.length > 0) {
            setMessages((prev) => [...messagesArray, ...prev]);
          } else {
            setAllMessagesLoaded(true);
            console.log("All messages loaded");
          }
        } catch (error) {
          console.error("Failed to fetch more messages:", error);
        } finally {
          setFetchingMore(false);
        }
      }
    },
    [messages, fetchingMore, allMessagesLoaded]
  );

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds}秒前`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}時間前`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}日前`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}ヶ月前`;
    return `${Math.floor(seconds / 31536000)}年前`;
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="overflow-y-auto p-4 space-y-4 flex flex-col-reverse"
    >
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
      {[...messages].reverse().map((message, index) => (
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
            {message.role === "user" ? (
              <img
                src={`https://api.dicebear.com/9.x/identicon/svg?seed=${message.walletAddress}`}
                alt="avatar"
                className="rounded-full w-6 h-6"
              />
            ) : (
              <img
                src="./yuina.png"
                alt="Yuina"
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
      {fetchingMore && (
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
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
  loading,
}: {
  input: string;
  setInput: (input: string) => void;
  sendMessage: (message: string) => void;
  loading: boolean;
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
            ? loading
              ? "AIが応答を生成中..."
              : "メッセージを入力してください"
            : "ウォレットを接続してチャットを始めましょう"
        }
        className="w-full border-none resize-none overflow-y-auto py-3 max-h-[120px] focus:outline-none bg-gray-100 disabled:cursor-not-allowed"
        style={{ minHeight: "44px" }}
        value={input}
        disabled={!isConnected || loading}
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
        className="rounded-full h-9 w-9 flex-shrink-0 mb-[6px] border-none hover:scale-110 transition-all duration-300 bg-gradient-to-r from-[#F48BC9] to-[#A67AEA]"
        variant="noShadow"
        onClick={() => sendMessage(input)}
        disabled={!isConnected || loading}
      >
        <Send />
      </Button>
    </div>
  );
}
