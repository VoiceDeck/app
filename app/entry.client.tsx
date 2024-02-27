import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import RootProvider from "./providers/root-provider";

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<RootProvider>
				<RemixBrowser />
			</RootProvider>
		</StrictMode>,
	);
});
