import { Address, formatEther } from "viem";
import { PublicClient } from "../viem/PublicClient";
import { ToolConfig } from "./allTools";

interface GetBalanceArgs {
  wallet: Address;
}

export const getBalanceTool: ToolConfig<GetBalanceArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_balance",
      description: "Get the ETH balance of a wallet",
      parameters: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
            description: "The wallet address to get the balance of",
          },
        },
        required: ["wallet"],
      },
    },
  },
  handler: async ({ wallet }) => {
    return await getBalance(wallet);
  },
};

async function getBalance(wallet: Address) {
  const publicClient = PublicClient();
  const balance = await publicClient.getBalance({ address: wallet });
  return formatEther(balance);
}

export async function getPrizePool() {
  const publicClient = PublicClient();
  const prizePool = await publicClient.getBalance({
    address: "0xb3a60b7e3e0cD790a3a6cc1c59627B70e350eea1",
  });
  return formatEther(prizePool);
}
