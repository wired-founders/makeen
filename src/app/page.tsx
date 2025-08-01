// src\app\page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const agents = [
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function AgentHome() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-black text-black dark:text-white font-sans">
      {/* Hero */}
      <section className="text-center px-6 sm:px-12 pt-28 pb-16">
        <motion.h1
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-6xl font-bold tracking-tight max-w-4xl mx-auto mb-6"
        >
          Kordor AI Agents for Performance Teams
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10"
        >
          Plug-and-play AI agents to automate landing pages, split-tests,
          audience targeting, and analytics — built for scale.
        </motion.p>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-[#333] transition dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Join Waitlist
        </Link>
      </section>

      {/* Agent Cards */}
      <section className="bg-white dark:bg-zinc-900 py-20 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={i}
              viewport={{ once: true }}
              className="rounded-xl border border-gray-200 dark:border-white/10 bg-[#fafafa] dark:bg-[#111] p-6 shadow hover:shadow-md transition hover:scale-[1.02]"
            >
              <Link href={`/agents/${agent.slug}`}>
                <div className="h-full flex flex-col justify-between">
                  <h3 className="text-lg font-semibold mb-2">{agent.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {agent.desc}
                  </p>
                  <span className="mt-4 inline-block text-purple-500 text-sm font-medium">
                    Learn More →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Agents */}
      <section className="py-20 px-6 sm:px-12 text-center bg-[#f5f5f5] dark:bg-black">
        <h2 className="text-3xl font-bold mb-6">Why Kordor AI Agents?</h2>
        <ul className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-800 dark:text-gray-300 text-left">
          <li>✅ Real-time campaign optimization without dashboards</li>
          <li>✅ Built for modern performance teams and CRO workflows</li>
          <li>✅ Adaptive content and messaging per visitor segment</li>
          <li>✅ Works seamlessly with Meta, TikTok, Google, and more</li>
        </ul>
      </section>

      {/* Final CTA */}
      <section className="text-center py-20 px-6 sm:px-12 bg-white dark:bg-zinc-900">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to build your AI-powered growth stack?
        </h2>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-[#333] transition dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Kordor. All rights reserved.
      </footer>
    </div>
  );
}
