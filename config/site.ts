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
  name: "Edge Esmeralda",
  title: "Measuring impact through Edge Esmeralda",
  description:
    "A month-long gathering for people building the future",
  localeDefault: "en",
  links: {
    discord: "https://discord.gg/EUUupE3J", // TODO: Update to @EdgeEsmeralda
    twitter: "https://twitter.com/VoiceDeckDAO", // TODO: Update to @EdgeEsmeralda
    github: "https://github.com/hypercerts-org/voicedeck-fork",
  },
};

// TODO: Clean up, add icon, add to sight config?
export const externalLinks = [
  { title: "FAQs", url: "https://testnet.hypercerts.org/docs/intro" },
  { title: "Terms of Use", url: "https://hypercerts.org/terms" },
  { title: "Privacy Policy", url: "https://hypercerts.org/privacy" },
  { title: "GitHub", url: "https://github.com/hypercerts-org" },
  { title: "X (Twitter)", url: "https://twitter.com/hypercerts" },
];
