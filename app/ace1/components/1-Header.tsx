"use client";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LogOut } from "lucide-react";

export default function Header() {
  return (
    <div className="flex justify-between items-end pb-4 px-16 h-[8vh]">
      <div className="text-2xl font-black">ユイナ</div>
      <div className="flex items-center gap-4">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        className="bg-gradient-to-r from-[#F48BC9] to-[#A67AEA] font-black text-lg px-8 py-5 rounded-[0.68rem]"
                        onClick={openConnectModal}
                        type="button"
                      >
                        プレイ
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button
                        variant={"noShadow"}
                        className="bg-red-400 rounded-2xl font-black"
                        onClick={openChainModal}
                        type="button"
                      >
                        ネットワークが違います
                      </Button>
                    );
                  }

                  return (
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-black">
                        プレイヤー: {account.displayName}
                      </p>
                      <p className="text-lg font-black">
                        お金: {account.displayBalance}
                      </p>
                      <Button
                        size="icon"
                        className="rounded-full h-8 w-8 flex-shrink-0 border-none"
                        variant="noShadow"
                        onClick={openAccountModal}
                      >
                        <LogOut className="h-6 w-6" />
                      </Button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
}
