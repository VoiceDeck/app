import React from "react";
import TanstackProvider from "./tanstack-provider";
import Web3Provider from "./web3-provider";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<Web3Provider>
			<TanstackProvider>{children}</TanstackProvider>
		</Web3Provider>
	);
};
