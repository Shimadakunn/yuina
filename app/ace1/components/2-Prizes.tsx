"use client";

import { getPrizePool } from "@/lib/tools/getBalance";
import { useEffect, useState } from "react";

export default function Prizes() {
  const [messageNumber, setMessageNumber] = useState(0);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(0);
  const [price, setPrice] = useState<number | null>(null);
  const [prizePool, setPrizePool] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("12:00:00");

  async function fetchStats() {
    const [statsResponse, priceResponse] = await Promise.all([
      fetch("/api/stats", { cache: "no-store" }),
      fetch("/api/price"),
    ]);

    if (!statsResponse.ok || !priceResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const [statsData, priceData] = await Promise.all([
      statsResponse.json(),
      priceResponse.json(),
    ]);

    setPrice(priceData.pricing);
    if (statsData.statsArray?.length > 0) {
      const latestStats = statsData.statsArray[0];
      setMessageNumber(latestStats.messageNumber || 0);
      setLastMessageTimestamp(latestStats.timestamp || 0);
    }

    const prizePool = await getPrizePool();
    setPrizePool(
      Number((parseFloat(prizePool) * priceData.pricing).toFixed(2))
    );
  }

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!lastMessageTimestamp) return;

      const endTime = lastMessageTimestamp + 12 * 60 * 60 * 1000; // 12 hours in milliseconds
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        setTimeRemaining("00:00:00");
        return;
      }

      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    // Initial calculation
    calculateTimeRemaining();

    // Update every second
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [lastMessageTimestamp]);

  useEffect(() => {
    fetchStats();

    const handleMessageSent = () => {
      console.log("Update Prize Pool");
      fetchStats();
    };

    window.addEventListener("messageSent", handleMessageSent);
    return () => {
      window.removeEventListener("messageSent", handleMessageSent);
    };
  }, []);

  return (
    <div className="mx-auto flex justify-between max-w-[850px] w-full relative h-[17vh]">
      <div className="flex flex-col items-start justify-center">
        <p className="text-xl font-bold text-gray-500">残り時間</p>
        <p className="text-4xl font-black font-[Star]">{timeRemaining}</p>
      </div>
      <div className="flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="text-xl font-bold text-gray-500">賞金池</p>
        <p className="text-2xl font-black">
          {/* ¥ */}
          <span className="text-5xl font-[Star]">{prizePool}</span> USD
        </p>
      </div>
      <div className="flex flex-col items-end justify-center">
        <p className="text-xl font-bold text-gray-500">メッセージ料金</p>
        <p className="text-xl font-black">
          {/* ¥ */}
          <span className="text-4xl font-[Star]">
            {Number((0.001 * price!).toFixed(2))}
          </span>
          USD
        </p>
      </div>
    </div>
  );
}
