import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

export function AgentWalletClient() {
  if (!process.env.NEXT_PUBLIC_AGENT_PRIVATE_KEY) {
    throw new Error("⛔ AGENT_PRIVATE_KEY environment variable is not set.");
  }

  const account = privateKeyToAccount(
    process.env.NEXT_PUBLIC_AGENT_PRIVATE_KEY as `0x${string}`
  );

  return createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });
}
