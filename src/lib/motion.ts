// src\lib\motion.ts
import type { Variants } from "framer-motion";

// Reusable fade-up variant with index-based staggering.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};
