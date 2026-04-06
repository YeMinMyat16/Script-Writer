"use client";

import { motion } from "framer-motion";

export function BackgroundPaths({ title }: { title: string }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * Math.random()} -${189 + i * 6}C-${
            380 - i * 5 * Math.random()
        } -${189 + i * 6} -${312 - i * 5 * Math.random()} ${216 - i * 6} ${
            152 - i * 5 * Math.random()
        } ${343 - i * 6}C${616 - i * 5 * Math.random()} ${470 - i * 6} ${
            684 - i * 5 * Math.random()
        } ${875 - i * 6} ${684 - i * 5 * Math.random()} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full w-full dark:bg-black bg-white">
            <svg
                className="w-full h-full opacity-60 dark:opacity-40"
                viewBox="0 0 1000 1000"
                xmlns="http://www.w3.org/2000/svg"
            >
                {title && (
                    <defs>
                        <linearGradient
                            id="path-gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="rgba(220,38,38,0.2)" />
                            <stop offset="100%" stopColor="rgba(245,158,11,0.2)" />
                        </linearGradient>
                    </defs>
                )}
                {paths.map((path, i) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="url(#path-gradient)"
                        strokeWidth={path.width}
                        strokeOpacity={0.2 + (i % 3) * 0.1}
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}
