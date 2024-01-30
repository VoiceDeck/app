import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

import { configureGlobalCache } from "remix-client-cache";

// You can use the configureGlobalCache function to override the libraries default in-memory cache adapter
configureGlobalCache(() => localStorage); // uses localStorage as the cache adapter

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<RemixBrowser />
		</StrictMode>,
	);
});
