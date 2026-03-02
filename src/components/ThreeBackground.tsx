"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// Rotating star field - the main visual element
function RotatingStars() {
    const starsRef = useRef<THREE.Points>(null);

    const [count, setCount] = useState(() => {
        if (typeof window === "undefined") return 1500;
        return window.matchMedia("(max-width: 768px)").matches ? 500 : 1500;
    });

    useEffect(() => {
        const media = window.matchMedia("(max-width: 768px)");
        const handleChange = (e: MediaQueryListEvent) => setCount(e.matches ? 500 : 1500);
        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, []);

    useFrame((state, delta) => {
        if (!starsRef.current) return;
        // Slow, majestic rotation
        // Use delta for frame-rate independent rotation speed
        starsRef.current.rotation.x -= delta * 0.05;
        starsRef.current.rotation.y -= delta * 0.07;
    });

    return (
        <Stars
            ref={starsRef}
            radius={80}
            depth={60}
            count={count} // Reduced for mobile
            factor={4}
            saturation={0.3}
            fade
            speed={1}
        />
    );
}









// Scene content
function Scene() {
    return (
        <>
            {/* Ambient light for basic visibility */}
            <ambientLight intensity={0.1} />

            {/* Main rotating star field */}
            <RotatingStars />


        </>
    );
}

export default function ThreeBackground() {
    const [reduceMotion, setReduceMotion] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    // Don't render 3D scene if reduced motion is preferred
    if (reduceMotion) {
        return null;
    }

    return (
        <div
            className="fixed top-0 left-0 w-full h-[100lvh] -z-20 pointer-events-none"
            aria-hidden="true"
        >
            <Canvas
                camera={{ position: [0, 0, 20], fov: 60 }}
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                style={{ background: "transparent" }}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
