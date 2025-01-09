"use client";

import { useEffect, useState } from "react";

export default function Prizes() {
  const [messageNumber, setMessageNumber] = useState(0);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats", {
          cache: "no-store",
        });
        const data = await response.json();
        if (data.statsArray && data.statsArray.length > 0) {
          const latestStats = data.statsArray[0];
          setMessageNumber(latestStats.messageNumber || 0);
          setLastMessageTimestamp(latestStats.timestamp || 0);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="mx-auto flex justify-between max-w-[850px] w-full relative">
      <div className="flex flex-col items-start justify-center">
        <p className="text-xl font-bold text-gray-500">残り時間</p>
        <p className="text-4xl font-black">{messageNumber}</p>
      </div>
      <div className="flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="text-xl font-bold text-gray-500">賞金池</p>
        <p className="text-5xl font-black">$4569</p>
      </div>
      <div className="flex flex-col items-end justify-center">
        <p className="text-xl font-bold text-gray-500">メッセージ料金</p>
        <p className="text-4xl font-black">
          {new Date(lastMessageTimestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
