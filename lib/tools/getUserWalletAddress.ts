import { Address } from "viem";
import { UserWalletClient } from "../viem/UserWalletClient";
import { ToolConfig } from "./allTools";

// No arguments needed since we're getting the connected wallet
interface GetUserWalletAddressArgs {
  walletAddress: Address;
}

export const getUserWalletAddressTool: ToolConfig<GetUserWalletAddressArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_user_wallet_address",
      description: "Get the user's wallet address",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  handler: async () => {
    return await getUserWalletAddress();
  },
};

async function getUserWalletAddress(): Promise<Address> {
  const walletClient = UserWalletClient();
  const [address] = await walletClient.getAddresses();
  return address;
}
