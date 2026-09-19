"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedPriceTags from "./AnimatedPriceTags";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-7 pt-16 pb-10 grid md:grid-cols-2 gap-10 items-center">
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.h1
          variants={item}
          className="font-display font-bold text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.05] tracking-tight max-w-[15ch]"
        >
          Tell us what you want.{" "}
          <span className="text-teal">We&apos;ll find what&apos;s actually worth it.</span>
        </motion.h1>

        <motion.p variants={item} className="text-ink-soft text-lg mt-5 max-w-[46ch]">
          No inflated listings, no fake five-star noise — just the one product
          that fits your budget and holds up under real reviews.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-4 mt-8">
          <Link
            href="/register"
            className="bg-teal text-paper px-7 py-3.5 rounded-sm font-semibold hover:bg-teal-dark transition-colors"
          >
            Get started free
          </Link>
          <Link
            href="#how"
            className="border border-ink/15 px-7 py-3.5 rounded-sm font-medium text-ink-soft hover:border-teal hover:text-teal-dark transition-colors"
          >
            See how it works
          </Link>
        </motion.div>

        <motion.p variants={item} className="font-mono text-xs text-ink-soft mt-6">
          Built for the Pakistani market
        </motion.p>
      </motion.div>

      <div className="hidden md:block">
        <AnimatedPriceTags />
      </div>
    </section>
  );
}
