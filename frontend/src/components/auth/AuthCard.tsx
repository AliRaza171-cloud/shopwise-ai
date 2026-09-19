"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}) {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-card border border-ink/10 rounded-sm p-9 shadow-[2px_3px_0_rgba(27,36,32,0.05)]"
      >
        <Link href="/" className="font-display font-bold text-2xl text-teal-dark">
          Sahi
        </Link>
        <h1 className="font-display font-bold text-2xl mt-5 mb-1.5 tracking-tight">
          {title}
        </h1>
        <p className="text-ink-soft text-sm mb-7">{subtitle}</p>

        {children}

        <p className="text-sm text-ink-soft mt-7 text-center">
          {footerText}{" "}
          <Link href={footerLinkHref} className="text-teal-dark font-medium hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
