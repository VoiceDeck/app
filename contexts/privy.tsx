
"use client";

import { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { optimism } from "wagmi/chains";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '';

export function PrivyContextProvider({ children }: { children: ReactNode }) {
    return (
        <PrivyProvider
            appId={appId}
            config={{
                loginMethods: ["email","wallet"],
                supportedChains:[optimism],

            }}
            
        >
            {children}
        </PrivyProvider>
    );
}
