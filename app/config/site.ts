interface SiteConfig {
	name: string;
	title: string;
	description: string;
	localeDefault: string;
	links: {
		discord: string;
		twitter: string;
		github: string;
	};
}

export const siteConfig: SiteConfig = {
	name: "VoiceDeck",
	title: "From individual actions to collective impact",
	description:
		"We enable journalists to effect real change by bringing critical stories to light. Your contributions directly support this mission, sustaining journalism and bolstering investigative reporting that matters.",
	localeDefault: "en",
	links: {
		discord: "https://discord.gg/EUUupE3J",
		twitter: "https://twitter.com/VoiceDeckDAO",
		github: "https://github.com/VoiceDeck/",
	},
};

// TODO: Clean up, add icon, add to sight config?
export const externalLinks = [
	{ title: "About", url: "http://about-example.com" },
	{ title: "FAQs", url: "http://faqs-example.com" },
	{ title: "GitHub", url: "https://github.com/VoiceDeck/" },
	{ title: "X", url: "https://twitter.com/VoiceDeckDAO" },
];
