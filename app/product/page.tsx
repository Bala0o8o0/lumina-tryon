'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, X, Sparkles, Zap, ArrowLeft, User, Shirt, TrendingUp } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import GridPattern from '@/components/GridPattern';
import { supabase } from '@/lib/supabase';

export default function ProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits, setCredits] = useState<number>(0);

  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [topImage, setTopImage] = useState<string | null>(null);
  const [bottomImage, setBottomImage] = useState<string | null>(null);
  const [footwearImage, setFootwearImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  // Track filenames for intelligent matching
  const [bodyImageName, setBodyImageName] = useState<string>('');
  const [topImageName, setTopImageName] = useState<string>('');
  const [bottomImageName, setBottomImageName] = useState<string>('');
  const [footwearImageName, setFootwearImageName] = useState<string>('');

  const bodyImageRef = useRef<HTMLInputElement>(null);
  const topImageRef = useRef<HTMLInputElement>(null);
  const bottomImageRef = useRef<HTMLInputElement>(null);
  const footwearImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
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

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (url: string | null) => void,
    setImageName: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name); // Store the filename
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (setImage: (url: string | null) => void, ref: React.RefObject<HTMLInputElement | null>) => {
    setImage(null);
    if (ref.current) {
      ref.current.value = '';
    }
  };

  const validateUploads = () => {
    if (!bodyImage) {
      toast.error('Please upload your full-body photo');
      return false;
    }

    // Ensure at least one garment is selected
    const hasGarment = topImage || bottomImage || footwearImage;
    if (!hasGarment) {
      toast.error('Please upload at least one clothing item (Top, Bottom, or Footwear)');
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateUploads()) return;

    // Check credits before generating
    if (credits < 5) {
      toast.error('Insufficient credits', {
        description: 'You need 5 credits per generation. Please purchase more credits to continue.'
      });
      router.push('/subscription');
      return;
    }

    // Optional prompt for the AI
    const userPrompt = window.localStorage.getItem('user_prompt') || "clothing item";

    setIsGenerating(true);
    try {
      console.log('🚀 Sending request to AI API...');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bodyImage,
          topImage,
          bottomImage,
          footwearImage,
          bodyImageName,
          topImageName,
          bottomImageName,
          footwearImageName,
          prompt: userPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate try-on');
      }

      const data = await response.json();

      // Show mode-specific success message
      if (data.mode === 'demo') {
        toast.success('Demo try-on generated!', {
          description: 'Add GOOGLE_GEMINI_API_KEY for real AI generation'
        });
      } else {
        toast.success('Try-on generated successfully!');
      }

      setResultImage(data.output_url);

      // Refresh credits
      setCredits(data.credits_remaining || credits - 1);

    } catch (error) {
      console.error('❌ Error generating try-on:', error);
      const errorMessage = (error as Error).message || '';

      if (errorMessage.includes('Insufficient credits')) {
        router.push('/subscription');
      }

      toast.error('Generation failed', {
        description: errorMessage || 'Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const UploadCard = ({
    title,
    image,
    setImage,
    setImageName,
    imageRef,
    icon: Icon
  }: {
    title: string;
    image: string | null;
    setImage: (url: string | null) => void;
    setImageName: (name: string) => void;
    imageRef: React.RefObject<HTMLInputElement | null>;
    icon: any;
  }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group"
    >
      <Card className="border-purple-500/20 bg-purple-500/5 backdrop-blur-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>

          {image ? (
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-purple-500/20">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg"
                onClick={() => handleRemoveImage(setImage, imageRef)}
              >
                <X className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          ) : (
            <div
              className="aspect-square rounded-2xl border-2 border-dashed border-purple-500/30 bg-purple-500/5 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
              onClick={() => imageRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-purple-400 mb-3" />
              <p className="text-sm text-zinc-400 text-center px-4">
                Click to upload
              </p>
              <input
                type="file"
                ref={imageRef}
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setImage, setImageName)}
                className="hidden"
              />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );

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
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl mb-6"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                AI-Powered Virtual Try-On
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
                Try On Anything
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Upload your photo and clothing items to see yourself in a new outfit instantly
            </p>
          </div>
        </FadeIn>

        {/* Upload Grid */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <UploadCard
              title="Your Photo"
              image={bodyImage}
              setImage={setBodyImage}
              setImageName={setBodyImageName}
              imageRef={bodyImageRef}
              icon={User}
            />
            <UploadCard
              title="Top Wear"
              image={topImage}
              setImage={setTopImage}
              setImageName={setTopImageName}
              imageRef={topImageRef}
              icon={Shirt}
            />
            <UploadCard
              title="Bottom Wear"
              image={bottomImage}
              setImage={setBottomImage}
              setImageName={setBottomImageName}
              imageRef={bottomImageRef}
              icon={TrendingUp}
            />
            <UploadCard
              title="Footwear"
              image={footwearImage}
              setImage={setFootwearImage}
              setImageName={setFootwearImageName}
              imageRef={footwearImageRef}
              icon={Sparkles}
            />
          </div>

          <div className="max-w-xl mx-auto mb-12">
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Describe the clothing (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Black Cotton T-Shirt"
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-purple-500/20 text-white focus:outline-none focus:border-purple-500/50"
              onChange={(e) => window.localStorage.setItem('user_prompt', e.target.value)}
            />
          </div>
        </FadeIn>

        {/* Result Section */}
        {resultImage && (
          <FadeIn>
            <div id="result" className="mb-12 scroll-mt-20">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-5xl font-black mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    Your Try-On Result
                  </span>
                </h2>
              </div>
              <div className="max-w-xl mx-auto relative aspect-[3/4] rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20">
                <Image
                  src={resultImage || ''}
                  alt="Virtual Try-On Result"
                  fill
                  className="object-cover"
                  unoptimized // Bypass Next.js server optimization to avoid private IP errors
                />
                <a
                  href={resultImage || '#'}
                  download="lumina-tryon.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 right-6"
                >
                  <Button size="icon" className="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </Button>
                </a>
              </div>
              <div className="flex justify-center mt-8 gap-4">
                <Button
                  onClick={() => { setResultImage(null); }}
                  variant="outline"
                  className="rounded-full border-purple-500/30"
                >
                  Try Another
                </Button>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Actions */}
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 w-5 h-5" />
                    Generate Try-On
                  </>
                )}
              </Button>
            </motion.div>

            <Link href="/account">
              <Button
                variant="outline"
                className="h-14 px-8 rounded-full border-purple-500/30 bg-transparent hover:bg-purple-500/10 text-white"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Account
              </Button>
            </Link>
          </div>
        </FadeIn>

        {/* Info */}
        <FadeIn delay={0.6}>
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col gap-2 px-8 py-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-xl">
              <p className="text-sm text-zinc-400">
                Each generation costs <span className="text-purple-400 font-bold">5 credits</span>
              </p>
              <p className="text-sm text-zinc-400">
                Current balance: <span className="text-white font-bold">{credits} credits</span>
              </p>
            </div>
          </div>
        </FadeIn>
      </div >
    </div >
  );
}