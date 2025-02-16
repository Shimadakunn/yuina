import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Disable static rendering and force dynamic behavior

export async function GET() {
  try {
    const price = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_PRICE_API_KEY}`
    );
    if (!price.ok) {
      throw new Error(`HTTP error! status: ${price.status}`);
    }
    const priceData = await price.json();
    const pricing = priceData.USD;

    return NextResponse.json(
      { pricing },
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
