"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { GradientBackground } from "@/components/shared/gradient-background";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      };

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <GradientBackground />

      <div className="container mx-auto relative max-w-screen-xl px-4 md:px-8">
        <motion.div
          className="flex flex-col items-center gap-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Developer tools that{" "}
              <span className="gradient-text">actually flow</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Fast, beautiful, 100% private &amp; client-side. Format JSON, decode JWTs,
              encode Base64, parse URLs, and test regex — all in your browser.
              Zero bytes sent to any server.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/tools"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 glow"
            >
              Browse all tools
            </Link>
            <span className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium text-muted-foreground glass">
              Press{" "}
              <kbd className="ml-1.5 mr-1 inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px]">
                ⌘K
              </kbd>{" "}
              to search
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
