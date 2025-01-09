import { getBalanceTool } from "./getBalance";

import { getAgentWalletAddressTool } from "./getAgentWalletAddress";
import { getUserWalletAddressTool } from "./getUserWalletAddress";
import { sendTransactionTool } from "./sendTransaction";

export interface ToolConfig<T = any> {
  definition: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
      };
    };
  };
  handler: (args: T) => Promise<any>;
}

export const tools: Record<string, ToolConfig> = {
  // == READ == \\
  get_balance: getBalanceTool,
  get_user_wallet_address: getUserWalletAddressTool,
  get_agent_wallet_address: getAgentWalletAddressTool,

  // == WRITE == \\
  send_transaction: sendTransactionTool,
};
