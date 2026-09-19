"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AnimatedCounter({
  value,
  duration = 1.2,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const counter = { val: 0 };
    const tween = gsap.to(counter, {
      val: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(counter.val).toLocaleString();
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, duration]);

  return <span ref={ref} className={className}>0</span>;
}
