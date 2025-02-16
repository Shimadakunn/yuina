import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

export function PublicClient() {
  return createPublicClient({
    chain: sepolia,
    transport: http(),
  });
}
