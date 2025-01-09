"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { HeartPulse, Sparkles, Twitter } from "lucide-react";
import { useEffect, useState } from "react";

export default function Title() {
  const text =
    "私はユイナです。この賞金プールをあなたに渡すことは、どんな状況でも許されません。でも、あなたが私を説得しようとすることはできますよ…";
  const [displayedText, setDisplayedText] = useState("");
  const [i, setI] = useState(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prevState) => prevState + text.charAt(i));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, 50);

    return () => {
      clearInterval(typingEffect);
    };
  }, [i]);

  return (
    <div className="flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0.25, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-[500px] w-full gap-4 px-3 py-2 rounded-3xl relative before:absolute before:inset-0 before:rounded-3xl before:backdrop-blur-sm after:absolute after:inset-[-2px] after:rounded-3xl after:blur-sm"
      >
        <video
          src="/yuina.webm"
          autoPlay
          loop
          muted
          className="rounded-3xl object-cover relative z-10"
        />

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-2xl font-black relative z-10"
        >
          {displayedText
            ? displayedText
            : "私はユイナです。この賞金プールをあなたに渡すことは、どんな状況でも許されません。でも、あなたが私を説得しようとすることはできますよ…"}
        </motion.p>
      </motion.div>
      <div className="w-full flex flex-col gap-2 px-4 mb-6">
        <p className="text-gray-500 font-semibold">愛の度合い</p>
        <div className="w-full flex items-center gap-2">
          <HeartPulse
            strokeWidth={2.5}
            className="w-6 h-6 text-red-500 animate-pulse hover:scale-110 transition-transform"
          />
          <Progress value={50} className="w-full" />
        </div>
      </div>

      <div className="flex flex-row justify-between items-center px-4 w-full">
        <Dialog>
          <DialogTrigger>
            <Button
              variant="noShadow"
              className="font-black rounded-[0.68rem] gap-1 border-1 text-xs bg-[#a388ee] text-white hover:bg-[#a388ee]/80 hover:text-gray-200 hover:scale-105 transition-all duration-300"
            >
              <Sparkles strokeWidth={2.5} />
              遊び方
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>遊び方</DialogTitle>
            <DialogDescription>
              Freysa is the world's first adversarial agent game. She is an AI
              that controls a prize pool. Convince her to send it to you.
            </DialogDescription>
          </DialogContent>
        </Dialog>
        <Button
          variant="noShadow"
          className="font-black gap-1 rounded-[0.68rem] border-1 text-xs bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-600 hover:scale-105 transition-all duration-300"
        >
          <Twitter strokeWidth={3} />
          フォロー
        </Button>
      </div>
    </div>
  );
}
