'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

interface BentoCardProps {
    title: string;
    description: string;
    icon?: ReactNode;
    className?: string;
    children?: ReactNode;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
            {children}
        </div>
    );
}

export function BentoCard({
    title,
    description,
    icon,
    className = '',
    children
}: BentoCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className={`group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl p-6 ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500" />

            <div className="relative z-10">
                {icon && (
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="mb-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center"
                    >
                        {icon}
                    </motion.div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {description}
                </p>

                {children}
            </div>

            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 blur-xl opacity-50" />
            </div>
        </motion.div>
    );
}
