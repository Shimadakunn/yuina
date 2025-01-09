import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "91952d356d7d1978e097ef1fc4150f76",
  chains: [sepolia],
  ssr: true,
});
