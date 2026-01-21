'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Download, Share2, Sparkles } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import GridPattern from '@/components/GridPattern';

interface Generation {
  id: string;
  output_url: string;
  created_at: string;
}

export default function GalleryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchGenerations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setGenerations(data || []);
      } catch (error) {
        console.error('Error fetching generations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenerations();
  }, [user]);

  if (!user) {
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-20 px-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <GridPattern />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
                  Your Gallery
                </span>
              </h1>
              <p className="text-xl text-zinc-400">
                {generations.length} {generations.length === 1 ? 'creation' : 'creations'}
              </p>
            </div>

            <Link href="/product">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="h-14 px-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30">
                  <Plus className="mr-2 w-5 h-5" />
                  Create New
                </Button>
              </motion.div>
            </Link>
          </div>
        </FadeIn>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        ) : generations.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mb-8"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>

              <h2 className="text-3xl font-bold mb-4 text-white">No creations yet</h2>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                Start your fashion journey by creating your first virtual try-on
              </p>

              <Link href="/product">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="h-14 px-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30">
                    <Plus className="mr-2 w-5 h-5" />
                    Create Your First Try-On
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {generations.map((generation, index) => (
              <FadeIn key={generation.id} delay={index * 0.05}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Card className="border-purple-500/20 bg-purple-500/5 backdrop-blur-xl overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={generation.output_url}
                        alt={`Try-on from ${new Date(generation.created_at).toLocaleDateString()}`}
                        fill
                        className="object-cover"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex-1 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Download className="w-4 h-4 text-white" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex-1 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Share2 className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-sm text-zinc-500">
                        {new Date(generation.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        )}

        {/* Back Button */}
        <FadeIn delay={0.4}>
          <div className="mt-12 text-center">
            <Link href="/account">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-full border-purple-500/30 bg-transparent hover:bg-purple-500/10 text-white"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Account
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}