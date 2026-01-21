'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';

export default function CardNav() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const [credits, setCredits] = useState<number>(0);

    const fetchCredits = async () => {
        if (user) {
            const { data } = await supabase
                .from('users')
                .select('credits')
                .eq('id', user.id)
                .single();

            if (data) {
                setCredits(data.credits || 0);
            }
        }
    };

    useEffect(() => {
        fetchCredits();

        // Refetch credits when window regains focus
        const handleFocus = () => {
            fetchCredits();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [user]);

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Try-On', href: '/product' },
        { label: 'Gallery', href: '/gallery' },
        { label: 'Pricing', href: '/subscription' },
        { label: 'Account', href: '/account' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl"
            >
                <div className="relative rounded-2xl border border-purple-500/20 bg-black/40 backdrop-blur-2xl shadow-2xl shadow-purple-500/10">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/80 transition-shadow"
                            >
                                <Sparkles className="w-5 h-5 text-white" />
                            </motion.div>
                            <motion.span
                                className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 hidden sm:block"
                                style={{
                                    backgroundSize: '200% 200%'
                                }}
                                animate={{
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'linear'
                                }}
                            >
                                Lumina Try
                            </motion.span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        {item.label}
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <div className="px-4 py-2 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-semibold">
                                    {credits} Credits
                                </div>
                            ) : (
                                <Link href="/login">
                                    <Button className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                                        Get Started
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
                        >
                            {isOpen ? (
                                <X className="w-5 h-5 text-white" />
                            ) : (
                                <Menu className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden overflow-hidden border-t border-purple-500/20"
                            >
                                <div className="p-4 space-y-2">
                                    {navItems.map((item) => (
                                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                                            <div className="px-4 py-3 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors">
                                                {item.label}
                                            </div>
                                        </Link>
                                    ))}
                                    {user ? (
                                        <div className="px-4 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-semibold text-center">
                                            {credits} Credits
                                        </div>
                                    ) : (
                                        <Link href="/login" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                                                Get Started
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>

            {/* Spacer to prevent content from going under fixed nav */}
            <div className="h-24" />
        </>
    );
}
