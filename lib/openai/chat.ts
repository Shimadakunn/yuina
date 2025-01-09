import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants";
import { Thread } from "openai/resources/beta/threads/threads";
import { createOpenAIClient } from "./client";
import { performRun } from "./performRun";

export class Chat {
  private client: OpenAI;
  private assistant: Assistant;
  private thread: Thread;
  public static instance: Chat | null = null;

  private constructor(client: OpenAI, assistant: Assistant, thread: Thread) {
    this.client = client;
    this.assistant = assistant;
    this.thread = thread;
  }

  static async getInstance(): Promise<Chat> {
    if (!Chat.instance) {
      const client = createOpenAIClient();
      const assistant = await client.beta.assistants.retrieve(
        process.env.NEXT_PUBLIC_ASSISTANT_ID!
      );
      const thread = await client.beta.threads.retrieve(
        process.env.NEXT_PUBLIC_THREAD_ID!
      );

      Chat.instance = new Chat(client, assistant, thread);
      console.log("Chat instance created");
    }
    return Chat.instance;
  }

  async sendMessage(content: string, walletAddress: string): Promise<string> {
    await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        role: "user",
        walletAddress,
        timestamp: Date.now(),
      }),
    });
    console.log("message saved to db", content, walletAddress);

    await this.client.beta.threads.messages.create(this.thread.id, {
      role: "user",
      content,
    });

    const run = await this.client.beta.threads.runs.create(this.thread.id, {
      assistant_id: this.assistant.id,
    });

    let runStatus = await this.client.beta.threads.runs.retrieve(
      this.thread.id,
      run.id
    );
    console.log("runStatus", runStatus);

    while (
      runStatus.status === "in_progress" ||
      runStatus.status === "queued" ||
      runStatus.status === "requires_action"
    ) {
      if (runStatus.status === "requires_action") {
        const response = await performRun(runStatus, this.client, this.thread);
        if (response.type === "text") {
          await fetch("/api/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: response.text.value,
              role: "assistant",
              walletAddress,
              timestamp: Date.now(),
            }),
          });
          return response.text.value;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await this.client.beta.threads.runs.retrieve(
        this.thread.id,
        run.id
      );
      console.log("runStatus", runStatus);
    }

    if (runStatus.status === "completed") {
      console.log("run completed");
      const messages = await this.client.beta.threads.messages.list(
        this.thread.id
      );
      const lastMessage = messages.data[0];
      const aiResponse =
        lastMessage.content[0].type === "text"
          ? lastMessage.content[0].text.value
          : "No response";

      console.log("ai response saved to db", aiResponse);
      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: aiResponse,
          role: "assistant",
          walletAddress,
          timestamp: Date.now(),
        }),
      });

      return aiResponse;
    } else {
      const errorMessage = `Run failed with status: ${runStatus.status}`;

      return errorMessage;
    }
  }
}
