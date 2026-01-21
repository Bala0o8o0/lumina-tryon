'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/logout-button';
import { motion } from 'framer-motion';
import { User, CreditCard, Image as ImageIcon, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import GridPattern from '@/components/GridPattern';
import { BentoGrid, BentoCard } from '@/components/MagicBento';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [credits, setCredits] = useState<number>(0);
  const [loadingCredits, setLoadingCredits] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchCredits = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('credits')
          .eq('id', user.id)
          .single();

        if (data) {
          setCredits(data.credits || 0);
        }
        setLoadingCredits(false);
      }
    };

    fetchCredits();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-20 px-4">
      <div className="fixed inset-0 -z-10">
        <GridPattern />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
                  Dashboard
                </span>
              </h1>
              <p className="text-xl text-zinc-400">Welcome back, {user.email?.split('@')[0]}</p>
            </div>

            <LogoutButton />
          </div>
        </FadeIn>

        {/* Stats Grid */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Credits Card */}
            <motion.div whileHover={{ y: -5 }}>
              <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">Available Credits</div>
                    <div className="text-3xl font-black text-white">{credits}</div>
                  </div>
                </div>
                <Link href="/subscription">
                  <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20">
                    Buy More Credits
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* User Info Card */}
            <motion.div whileHover={{ y: -5 }}>
              <Card className="border-purple-500/20 bg-purple-500/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">Account Email</div>
                    <div className="text-lg font-semibold text-white truncate">{user.email}</div>
                  </div>
                </div>
                <div className="text-sm text-zinc-500">
                  Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </Card>
            </motion.div>

            {/* Usage Card */}
            <motion.div whileHover={{ y: -5 }}>
              <Card className="border-purple-500/20 bg-purple-500/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">Total Try-Ons</div>
                    <div className="text-3xl font-black text-white">0</div>
                  </div>
                </div>
                <Link href="/gallery">
                  <Button variant="outline" className="w-full border-white/20 bg-transparent hover:bg-white/10">
                    View Gallery
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </FadeIn>

        {/* Quick Actions */}
        <FadeIn delay={0.4}>
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Quick Actions</h2>
            <BentoGrid>
              <BentoCard
                title="Create Try-On"
                description="Upload your photo and clothing items to generate a virtual try-on"
                icon={<Sparkles className="w-6 h-6 text-white" />}
                className="md:col-span-2"
              >
                <Link href="/product">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                      Start Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
              </BentoCard>

              <BentoCard
                title="View Gallery"
                description="Browse all your generated try-on results"
                icon={<ImageIcon className="w-6 h-6 text-white" />}
              >
                <Link href="/gallery">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="mt-4 border-white/20 bg-transparent hover:bg-white/10">
                      Open Gallery
                    </Button>
                  </motion.div>
                </Link>
              </BentoCard>

              <BentoCard
                title="Buy Credits"
                description="Purchase more credits to continue creating amazing try-ons"
                icon={<CreditCard className="w-6 h-6 text-white" />}
              >
                <Link href="/subscription">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="mt-4 border-white/20 bg-transparent hover:bg-white/10">
                      View Plans
                    </Button>
                  </motion.div>
                </Link>
              </BentoCard>

              <BentoCard
                title="Account Status"
                description="Free plan with pay-as-you-go credits"
                icon={<User className="w-6 h-6 text-white" />}
                className="md:col-span-2"
              >
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-zinc-400">Active Account</span>
                </div>
              </BentoCard>
            </BentoGrid>
          </div>
        </FadeIn>

        {/* Info Banner */}
        <FadeIn delay={0.6}>
          <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Need more credits?</h3>
                <p className="text-zinc-400">Get unlimited try-ons with our credit packages</p>
              </div>
              <Link href="/subscription">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30">
                    View Pricing
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}