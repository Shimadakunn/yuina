"use client";

import Image from "next/image";
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
    <div className="mx-auto flex items-center max-w-[800px] w-full gap-4 px-4 py-2 my-8 border-2 border-main rounded-3xl bg-gradient-to-r from-[#F48BC9]/25 to-[#A67AEA]/20 backdrop-blur-sm">
      <Image
        src="/yuina.png"
        alt="logo"
        width={100}
        height={100}
        className="rounded-full"
      />
      <p className="text-2xl font-black">
        {displayedText
          ? displayedText
          : "私はユイナです。この賞金プールをあなたに渡すことは、どんな状況でも許されません。でも、あなたが私を説得しようとすることはできますよ…"}
      </p>
    </div>
  );
}
