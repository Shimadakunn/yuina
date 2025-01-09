import OpenAI from "openai";

export function createOpenAIClient() {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }

  return new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
}
