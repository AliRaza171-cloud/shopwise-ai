"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    num: "01",
    title: "You describe the need",
    body: "Product, budget, anything that matters to you — written the way you'd say it, not filled into a form.",
  },
  {
    num: "02",
    title: "We compare real listings",
    body: "Price, rating, and review volume are weighed together, so a product with 3 fake reviews doesn't outrank one with 3,000 honest ones.",
  },
  {
    num: "03",
    title: "You get one clear pick",
    body: "Not twenty tabs to compare — the one that's worth your money, with the reasoning shown.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!lineRef.current || !sectionRef.current) return;

    const line = lineRef.current;
    gsap.set(line, { strokeDasharray: 1000, strokeDashoffset: 1000 });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      end: "bottom 60%",
      scrub: 0.6,
      animation: gsap.to(line, { strokeDashoffset: 0, ease: "none" }),
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how"
      className="max-w-6xl mx-auto px-7 py-24 border-t border-ink/10 relative"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="font-display font-bold text-3xl mb-12 tracking-tight"
      >
        How the pick gets made
      </motion.h2>

      {/* Scroll-scrubbed connecting line — desktop only, purely decorative */}
      <svg
        className="hidden md:block absolute top-[7.2rem] left-0 w-full pointer-events-none"
        height="2"
        preserveAspectRatio="none"
      >
        <line
          ref={lineRef}
          x1="18%"
          y1="1"
          x2="82%"
          y2="1"
          stroke="rgb(var(--color-gold))"
          strokeWidth="2"
        />
      </svg>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: i * 0.15, ease: "easeOut" }}
          >
            <div className="font-mono text-gold text-sm mb-2.5">{step.num}</div>
            <h3 className="font-semibold text-base mb-2">{step.title}</h3>
            <p className="text-ink-soft text-[15px] leading-relaxed">{step.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
