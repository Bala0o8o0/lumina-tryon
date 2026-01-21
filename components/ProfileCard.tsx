'use client';

import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar } from 'lucide-react';

interface ProfileCardProps {
    name?: string;
    title?: string;
    email?: string;
    location?: string;
    joinedDate?: string;
    avatarUrl?: string;
    coverUrl?: string;
    stats?: {
        label: string;
        value: string;
    }[];
}

export default function ProfileCard({
    name = 'Alex Johnson',
    title = 'AI Fashion Enthusiast',
    email = 'alex@example.com',
    location = 'New York, USA',
    joinedDate = 'Jan 2024',
    avatarUrl = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    coverUrl,
    stats = [
        { label: 'Try-Ons', value: '24' },
        { label: 'Saved', value: '12' },
        { label: 'Shared', value: '8' }
    ]
}: ProfileCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-md mx-auto"
        >
            {/* Card Container */}
            <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-xl">
                {/* Cover Image */}
                <div className="relative h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 overflow-hidden">
                    {coverUrl ? (
                        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                            }}
                            transition={{ duration: 10, repeat: Infinity }}
                            style={{
                                background: 'linear-gradient(45deg, #a855f7, #ec4899, #8b5cf6, #3b82f6)',
                                backgroundSize: '400% 400%'
                            }}
                        />
                    )}
                </div>

                {/* Avatar */}
                <div className="relative px-6 -mt-16">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative inline-block"
                    >
                        <div className="w-28 h-28 rounded-full border-4 border-black bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                            <img
                                src={avatarUrl}
                                alt={name}
                                className="w-full h-full rounded-full object-cover bg-black"
                            />
                        </div>
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-black"></div>
                    </motion.div>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6 pt-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
                    <p className="text-purple-400 text-sm mb-4">{title}</p>

                    {/* Details */}
                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <Mail className="w-4 h-4" />
                            <span>{email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {joinedDate}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -2 }}
                                className="text-center p-3 rounded-xl bg-purple-500/10 border border-purple-500/20"
                            >
                                <div className="text-xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-zinc-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-shadow"
                        >
                            View Profile
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="py-3 px-6 rounded-xl border border-purple-500/30 bg-purple-500/10 text-white font-semibold text-sm hover:bg-purple-500/20 transition-colors"
                        >
                            <User className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-20 blur-xl -z-10"></div>
        </motion.div>
    );
}
