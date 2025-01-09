import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Disable static rendering and force dynamic behavior

export async function GET() {
  try {
    const statsRef = collection(db, "stats");
    const stats = await getDocs(statsRef);
    const statsArray = stats.docs
      .map((doc) => doc.data())
      .sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json(
      { statsArray },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" + error },
      { status: 500 }
    );
  }
}
