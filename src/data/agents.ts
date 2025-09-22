// src\data\agents.ts
// Keep plain data here. Add types so you stop guessing later.
export type AgentCard = {
  title: string;
  slug: string;
  desc: string;
};

export const agents: AgentCard[] = [
  {
    title: "Landing Page Agent",
    slug: "landing-page",
    desc: "Auto-generates high-performing variants based on real-time funnel data.",
  },
  {
    title: "Audience Agent",
    slug: "audience",
    desc: "Identifies and segments visitors live — and adapts copy and creative instantly.",
  },
  {
    title: "Split-Test Agent",
    slug: "split-test",
    desc: "Launches multivariate tests without setup or dashboards. Learns what converts.",
  },
  {
    title: "Analytics Agent",
    slug: "analytics",
    desc: "Tracks ROAS, conversions, drop-off, and notifies you of performance drops.",
  },
];
