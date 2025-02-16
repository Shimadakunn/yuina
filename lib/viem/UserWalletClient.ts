import { useMemo } from "react";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

export function UserWalletClient() {
  if (!window.ethereum) {
    throw new Error("⛔ MetaMask is not installed.");
  }

  return createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!),
  });
}

export function useUserWalletClient() {
  return useMemo(() => UserWalletClient(), []);
}
