"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const tags = [
  { name: "Gaming Laptop", price: "148,500", rating: "4.4", rotate: -6, delay: 0.9, top: "0%", left: "58%" },
  { name: "Wireless Earbuds", price: "5,299", rating: "4.5", rotate: 4, delay: 1.05, top: "22%", left: "78%" },
  { name: "Smartphone", price: "54,999", rating: "4.5", rotate: -3, delay: 1.2, top: "48%", left: "62%" },
];

export default function AnimatedPriceTags() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Once the Framer Motion entrance finishes, hand off to GSAP for a
    // continuous, gentle idle float — the kind of subtle looping motion
    // GSAP's timeline/repeat handles more naturally than a one-shot
    // entrance animation.
    const timers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      return setTimeout(() => {
        gsap.to(el, {
          y: "+=8",
          duration: 2.2 + i * 0.3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, tags[i].delay * 1000 + 700);
    });

    return () => {
      timers.forEach((t) => t && clearTimeout(t));
      cardRefs.current.forEach((el) => el && gsap.killTweensOf(el));
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[360px]">
      {tags.map((tag, i) => (
        <motion.div
          key={tag.name}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          initial={{ opacity: 0, y: -24, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: tag.rotate }}
          transition={{ duration: 0.7, delay: tag.delay, ease: "easeOut" }}
          whileHover={{ rotate: 0, scale: 1.03 }}
          style={{ top: tag.top, left: tag.left }}
          className="absolute w-48 bg-card border border-ink/15 rounded-sm p-4 shadow-[2px_3px_0_rgba(27,36,32,0.08)]"
        >
          <div className="absolute -top-5 left-6 w-px h-6 bg-ink-soft/40" />
          <div className="absolute top-2.5 left-5 w-2.5 h-2.5 rounded-full bg-paper border border-ink/15" />

          {i === 0 && (
            <div className="absolute -top-3 -right-2 w-14 h-14 rounded-full border-2 border-dashed border-brick text-brick flex items-center justify-center text-center font-mono text-[9px] font-semibold rotate-12 leading-tight mix-blend-multiply">
              AI
              <br />
              PICK
            </div>
          )}

          <p className="font-body font-semibold text-sm mt-1 ml-3.5 leading-snug">
            {tag.name}
          </p>
          <p className="font-mono font-semibold text-lg text-teal-dark ml-3.5 mt-2">
            <span className="text-xs text-ink-soft font-normal mr-1">Rs.</span>
            {tag.price}
          </p>
          <p className="font-mono text-xs text-ink-soft ml-3.5 mt-1.5">
            <span className="text-gold">★★★★</span>☆ {tag.rating}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
