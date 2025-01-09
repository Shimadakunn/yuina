import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const messagesRef = collection(db, "messages");
    const messages = await getDocs(messagesRef);
    const messagesArray = messages.docs
      .map((doc) => doc.data())
      .sort((a, b) => b.timestamp - a.timestamp);
    return NextResponse.json({ messagesArray });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" + error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { content, role, walletAddress } = await request.json();
    const timestamp = Date.now();

    const messagesRef = collection(db, "messages");
    const docRef = await addDoc(messagesRef, {
      content,
      role,
      timestamp,
      ...(walletAddress && { walletAddress }),
    });

    const statsRef = collection(db, "stats");
    const stats = await getDocs(statsRef);
    const statsArray = stats.docs
      .map((doc) => doc.data())
      .sort((a, b) => b.timestamp - a.timestamp);

    const currentStats = statsArray[0] || { messageNumber: 0 };

    const lastStatsDoc = stats.docs[0];
    if (lastStatsDoc) {
      await updateDoc(lastStatsDoc.ref, {
        messageNumber: currentStats.messageNumber + 1,
        timestamp,
      });
    } else {
      // If no stats exist yet, create first document
      await addDoc(statsRef, {
        messageNumber: 1,
        timestamp,
      });
    }

    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add message" + error },
      { status: 500 }
    );
  }
}
