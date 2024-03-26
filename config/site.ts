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
    "Empower Journalism for Change: Support Critical Reporting in India. Your contributions fuel our mission to spotlight essential stories, sustain quality journalism, and enhance investigative reporting with significant impact.",
  localeDefault: "en",
  links: {
    discord: "https://discord.gg/EUUupE3J",
    twitter: "https://twitter.com/VoiceDeckDAO",
    github: "https://github.com/VoiceDeck/",
  },
};

// TODO: Clean up, add icon, add to sight config?
export const externalLinks = [
  { title: "About", url: "https://voicedeck.org" },
  { title: "FAQs", url: "https://voicedeck.org/faq" },
  { title: "GitHub", url: "https://github.com/VoiceDeck/" },
  { title: "X", url: "https://twitter.com/VoiceDeckDAO" },
];
