'use client';

import { motion } from 'framer-motion';

interface LogoLoopProps {
    logos: { name: string; logo: string }[];
    speed?: number;
    direction?: 'left' | 'right';
    pauseOnHover?: boolean;
    className?: string;
}

export default function LogoLoop({
    logos,
    speed = 20,
    direction = 'left',
    pauseOnHover = true,
    className = ''
}: LogoLoopProps) {
    const duplicatedLogos = [...logos, ...logos];

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />

            <motion.div
                className="flex gap-16 items-center"
                animate={{
                    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: 'linear'
                }}
                whileHover={pauseOnHover ? { animationPlayState: 'paused' } : {}}
            >
                {duplicatedLogos.map((logo, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-3 min-w-[140px] group"
                    >
                        <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 backdrop-blur-xl group-hover:from-purple-500/20 group-hover:to-pink-500/10 group-hover:border-purple-500/40 transition-all duration-300 group-hover:scale-110">
                            <img
                                src={logo.logo}
                                alt={logo.name}
                                className="w-12 h-12 object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                                style={{
                                    filter: 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(270deg)'
                                }}
                            />
                        </div>
                        <span className="text-sm text-zinc-400 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all font-medium">
                            {logo.name}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
