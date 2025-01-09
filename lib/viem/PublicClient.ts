import { createPublicClient, http } from "viem";
import { holesky } from "viem/chains";

export function PublicClient() {
  return createPublicClient({
    chain: holesky,
    transport: http(),
  });
}
