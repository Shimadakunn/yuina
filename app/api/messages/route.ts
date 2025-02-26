import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const beforeTimestamp = searchParams.get("before");

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      ...(beforeTimestamp
        ? [
            orderBy("timestamp", "desc"),
            where("timestamp", "<", parseInt(beforeTimestamp)),
          ]
        : [orderBy("timestamp", "desc")]),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const messagesArray = messages.reverse();

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
        love: Math.max(
          0,
          currentStats.love + Math.floor(Math.random() * 31) - 15
        ),
      });
    } else {
      await addDoc(statsRef, {
        messageNumber: 1,
        timestamp,
        love: 10,
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
