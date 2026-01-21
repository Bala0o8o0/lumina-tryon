'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Camera, Shirt, ArrowRight, Star, Code, Palette, Cpu, Database } from 'lucide-react';

import TextMorph from '@/components/TextMorph';
import FadeIn from '@/components/FadeIn';
import Aurora from '@/components/Aurora';
import LogoLoop from '@/components/LogoLoop';
import { BentoGrid, BentoCard } from '@/components/MagicBento';
import ProfileCard from '@/components/ProfileCard';


const techStack = [
  {
    name: 'Next.js',
    logo: 'https://cdn.worldvectorlogo.com/logos/next-js.svg'
  },
  {
    name: 'Tailwind CSS',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg'
  },
  {
    name: 'Supabase',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg'
  },
  {
    name: ' Gemini 3 Pro',
    logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg'
  },
  {
    name: 'Razorpay',
    logo: 'https://razorpay.com/assets/razorpay-glyph.svg'
  }
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleTryOn = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push('/product');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl font-light tracking-[0.3em] uppercase text-purple-300"
          >
            INITIALIZING
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Aurora Background - Top Half */}
      <div className="fixed top-0 left-0 right-0 h-[50vh] z-0 opacity-70">
        <Aurora
          colorStops={['#a855f7', '#ec4899', '#8b5cf6']}
          amplitude={1.5}
          blend={0.7}
          speed={1.2}
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center">
            <TextMorph>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl mb-12"
              >
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Next-Generation AI Fashion
                </span>
              </motion.div>
            </TextMorph>

            <TextMorph>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 relative">
                <motion.span
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
                  style={{
                    backgroundSize: '200% 200%'
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Lumina Try
                </motion.span>
              </h1>
            </TextMorph>

            <FadeIn delay={0.3}>
              <p className="mt-8 max-w-3xl mx-auto text-xl md:text-2xl text-zinc-400 leading-relaxed font-light">
                Experience the future of fashion with our{' '}
                <span className="text-purple-400 font-semibold">neural rendering engine</span>.
                Try on any outfit instantly with physics-accurate fabric visualization.
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    onClick={handleTryOn}
                    className="group h-16 px-10 text-lg rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0 shadow-[0_0_40px_-10px_rgba(168,85,247,0.8)] hover:shadow-[0_0_60px_-10px_rgba(168,85,247,1)] transition-all duration-300"
                  >
                    {user ? 'Launch Studio' : 'Start Experience'}
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.div>
                  </Button>
                </motion.div>

                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="px-8 py-4 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl">
                      <span className="text-purple-400 font-bold text-lg">{user.user_metadata?.credits || 0}</span>
                      <span className="text-zinc-500 ml-2">Credits</span>
                    </div>
                    <Link href="/account">
                      <Button
                        variant="outline"
                        className="h-16 px-8 rounded-full border-purple-500/30 bg-transparent hover:bg-purple-500/10 text-white backdrop-blur-xl"
                      >
                        Account
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-16 px-10 text-lg rounded-full border-purple-500/30 bg-transparent hover:bg-purple-500/10 text-white backdrop-blur-xl"
                      onClick={() => router.push('/login')}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                )}
              </div>
            </FadeIn>

            {/* How to Use Section */}
            <FadeIn delay={0.7}>
              <div className="mt-24 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  How to Use
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      step: '01',
                      title: 'Upload Your Photo',
                      description: 'Take or upload a clear photo of yourself',
                      icon: '📸'
                    },
                    {
                      step: '02',
                      title: 'Choose Clothing',
                      description: 'Select the outfit you want to try on',
                      icon: '👕'
                    },
                    {
                      step: '03',
                      title: 'See the Magic',
                      description: 'AI instantly shows you wearing the outfit',
                      icon: '✨'
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="relative group"
                    >
                      <div className="p-8 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                        <div className="text-sm font-mono text-purple-400 mb-2">STEP {item.step}</div>
                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                      </div>
                      {/* Connecting line */}
                      {i < 2 && (
                        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Tech Stack Logo Loop */}
      <section className="py-20 border-y border-purple-500/20 bg-black/50 backdrop-blur-xl">
        <FadeIn>
          <div className="container mx-auto px-4">
            <h3 className="text-center text-sm uppercase tracking-widest text-zinc-500 mb-12">
              Built with cutting-edge technology
            </h3>
            <LogoLoop logos={techStack} speed={30} />
          </div>
        </FadeIn>
      </section>

      {/* Features with Magic Bento */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                  Powered by{' '}
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  Advanced AI
                </span>
              </h2>
              <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                State-of-the-art generative models for authentic virtual try-on experiences
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <BentoGrid>
              <BentoCard
                title="AI Diffusion Technology"
                description="Uses the latest Google Gemini AI models to preserve garment details with diffusion technology."
                icon={<Sparkles className="w-6 h-6 text-white" />}
                className="md:col-span-2"
              />
              <BentoCard
                title="Rapid AI Generation"
                description="Optimized for speed without compromising quality. Get photorealistic try-on results in seconds."
                icon={<Zap className="w-6 h-6 text-white" />}
                className="md:col-span-1"
              />
              <BentoCard
                title="Intelligent Pose Detection"
                description="Advanced Spatial Pointing identifies body keypoints and postures automatically from a single photo.."
                icon={<Camera className="w-6 h-6 text-white" />}
                className="md:col-span-1"
              />
              <BentoCard
                title="Realistic Fabric Adaptation"
                description="Neural networks simulate realistic fabric draping, wrinkles, and movement based on material properties."
                icon={<Shirt className="w-6 h-6 text-white" />}
                className="md:col-span-2"
              />
            </BentoGrid>
          </FadeIn>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-5xl font-black text-center mb-20">
              <span className="text-white">Live </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Showcase
              </span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item, i) => (
              <FadeIn key={item} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="w-12 h-12 text-purple-400 opacity-20" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-lg">Style #{item}</p>
                    <p className="text-zinc-400 text-sm">AI Generated</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="text-center mt-16">
              <Link href={user ? '/gallery' : '/login'}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="h-14 px-10 text-lg rounded-full border-purple-500/30 bg-transparent hover:bg-purple-500/10 text-white backdrop-blur-xl"
                  >
                    View Full Gallery
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="max-w-5xl mx-auto">
              <div className="relative rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                <div className="grid md:grid-cols-2 gap-12 p-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-5xl font-black text-white">
                      Unlock Your
                      <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Digital Wardrobe
                      </span>
                    </h2>
                    <p className="text-xl text-zinc-400 leading-relaxed">
                      Get premium credits for more try-ons. High speed processing and High quality downloads included.
                    </p>
                    <ul className="space-y-4">
                      {['Priority Processing', 'HD Downloads', 'Commercial Usage'].map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 text-zinc-300 text-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-black/40 rounded-3xl p-10 text-center border border-purple-500/20 backdrop-blur-xl"
                  >
                    <div className="text-sm text-purple-400 font-bold mb-3 uppercase tracking-widest">
                      Starter Pack
                    </div>
                    <div className="text-7xl font-black text-white mb-3">$0.55</div>
                    <div className="text-zinc-500 text-lg mb-10">for 50 credits</div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg shadow-[0_0_30px_-5px_rgba(168,85,247,0.6)]"
                        onClick={() => (user ? router.push('/subscription') : router.push('/login'))}
                      >
                        {user ? 'Purchase Now' : 'Get Started'}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}