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
	title: "VoiceDeck - From Individual Actions to Collective Impact",
	description:
		"We enable journalists to effect real change by bringing critical stories to light. Your contributions directly support this mission, sustaining  journalism and bolstering investigative reporting that matters.",
	localeDefault: "en",
	links: {
		discord: "https://discord.gg/EUUupE3J",
		twitter: "https://twitter.com/VoiceDeckDAO",
		github: "https://github.com/VoiceDeck/",
	},
};
