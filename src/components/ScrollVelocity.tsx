"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue
} from "framer-motion";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  // Wrap between -20% and -45% for infinite scroll
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  
  useAnimationFrame((time, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden tracking-tighter whitespace-nowrap flex flex-nowrap w-full py-4 bg-[#E21F1F] text-white border-y border-red-500/20">
      <motion.div 
        className="font-black uppercase text-sm sm:text-lg md:text-xl whitespace-nowrap flex flex-nowrap gap-8" 
        style={{ x }}
      >
        <span>{children}</span>
        <span>{children}</span>
        <span>{children}</span>
        <span>{children}</span>
      </motion.div>
    </div>
  );
}

export default function ScrollVelocity() {
  return (
    <section className="relative w-full overflow-hidden bg-[#E21F1F]">
      <ParallaxText baseVelocity={-2}>
        Netflix Premium • Spotify Family • Claude Pro • ChatGPT Plus • YouTube Premium • Canva Pro • Midjourney • 
      </ParallaxText>
      <ParallaxText baseVelocity={2}>
        Patungan Instan • Akun Legal • Garansi Full Bulanan • Layanan Aktif • Matchmaking Cepat • CS WA 24 Jam • 
      </ParallaxText>
    </section>
  );
}
