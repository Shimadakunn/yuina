import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { holesky } from "viem/chains";

export function UserWalletClient() {
  if (!process.env.NEXT_PUBLIC_USER_PRIVATE_KEY) {
    throw new Error("⛔ USER_PRIVATE_KEY environment variable is not set.");
  }

  const account = privateKeyToAccount(
    process.env.NEXT_PUBLIC_USER_PRIVATE_KEY as `0x${string}`
  );

  return createWalletClient({
    account,
    chain: holesky,
    transport: http(),
  });
}
