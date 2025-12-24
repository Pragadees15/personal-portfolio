"use client";

import { useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
    }, []);

    useEffect(() => {
        // Only enable smooth scroll on non-touch devices to prevent flickering/performance issues on mobile
        const isTouch = window.matchMedia("(pointer: coarse)").matches;
        if (isTouch) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
            touchMultiplier: 2,
        });

        // Synchronize Lenis scroll with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        // Add Lenis's requestAnimationFrame method to GSAP's ticker
        // This ensures generic GSAP animations and ScrollTrigger animations play well together
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // Disable lag smoothing in GSAP to prevent jumps during heavy load
        gsap.ticker.lagSmoothing(0);

        return () => {
            // Clean up on unmount
            lenis.destroy();
            gsap.ticker.remove((time) => lenis.raf(time * 1000));
        };
    }, []);

    return <>{children}</>;
}
