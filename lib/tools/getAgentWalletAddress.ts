import { Address } from "viem";
import { AgentWalletClient } from "../viem/AgentWalletClient";
import { ToolConfig } from "./allTools";

// No arguments needed since we're getting the connected wallet
interface GetAgentWalletAddressArgs {
  walletAddress: Address;
}

export const getAgentWalletAddressTool: ToolConfig<GetAgentWalletAddressArgs> =
  {
    definition: {
      type: "function",
      function: {
        name: "get_agent_wallet_address",
        description: "Get the agent's wallet address",
        // No parameters needed since we're getting the connected wallet
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    },
    handler: async () => {
      return await getAgentWalletAddress();
    },
  };

async function getAgentWalletAddress(): Promise<Address> {
  const walletClient = AgentWalletClient();
  const [address] = await walletClient.getAddresses();
  return address;
}
