"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-ink/10"
    >
      <div className="max-w-6xl mx-auto px-7 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-display font-bold text-2xl tracking-tight text-teal-dark">
            Sahi
          </span>
          <span className="font-mono text-[11px] text-ink-soft hidden sm:inline">
            sahi daam. sahi cheez.
          </span>
        </Link>

        <nav className="flex items-center gap-5 sm:gap-7 text-sm text-ink-soft">
          <Link href="#how" className="hidden sm:inline hover:text-teal-dark transition-colors">
            How it works
          </Link>
          <Link href="/login" className="hidden sm:inline hover:text-teal-dark transition-colors">
            Log in
          </Link>
          <Link
            href="/register"
            className="hidden sm:inline bg-teal text-paper px-5 py-2 rounded-sm font-medium hover:bg-teal-dark transition-colors"
          >
            Sign up
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  );
}
