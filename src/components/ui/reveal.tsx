"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Fades + lifts its direct children into view on scroll (GSAP ScrollTrigger). */
export default function Reveal({
  children,
  className,
  as: Tag = "div",
  stagger = 0.08,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "ul";
  stagger?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(ref.current.children, {
        y: 34,
        opacity: 0,
        duration: 0.8,
        stagger,
        ease: "power3.out",
        ...(immediate ? {} : { scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } }),
      });
    },
    { scope: ref }
  );
  const Comp = Tag as "div";
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
