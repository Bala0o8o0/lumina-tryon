'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ArrowLeft, Mail, Lock, Sparkles } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import GridPattern from '@/components/GridPattern';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Welcome back!', {
          description: 'You have successfully logged in.'
        });
      } else {
        await signUp(email, password);
        toast.success('Account created!', {
          description: 'Welcome to Lumina Try.'
        });
      }
      router.push('/');
    } catch (error) {
      toast.error(isLogin ? 'Login failed' : 'Sign up failed', {
        description: (error as Error).message || 'Please try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <GridPattern />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <FadeIn>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-purple-500/20 bg-black/40 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                  {isLogin ? (
                    <LogIn className="w-8 h-8 text-white" />
                  ) : (
                    <UserPlus className="w-8 h-8 text-white" />
                  )}
                </div>
              </motion.div>

              <CardTitle className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
                {isLogin ? 'Welcome Back' : 'Join Lumina Try'}
              </CardTitle>

              <CardDescription className="text-zinc-400">
                {isLogin
                  ? 'Sign in to access your account'
                  : 'Create an account to start your fashion journey'}
              </CardDescription>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-sm text-purple-300"
                >
                  <Sparkles className="w-4 h-4" />
                  Get 20 free credits on signup!
                </motion.div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-12 bg-white text-black hover:bg-zinc-200 hover:text-black border-none font-semibold transition-all"
                  onClick={async () => {
                    try {
                      await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback`
                        }
                      });
                    } catch (error) {
                      toast.error('Google login failed. Please ensure Google Auth is enabled in Supabase.');
                    }
                  }}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="h-12 bg-[#F6851B] text-white hover:bg-[#E2761B] hover:text-white border-none font-semibold transition-all"
                  onClick={async () => {
                    if (typeof window !== 'undefined' && (window as any).ethereum) {
                      try {
                        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                        if (accounts.length > 0) {
                          toast.success('Wallet connected!', {
                            description: `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
                          });
                        }
                      } catch (error) {
                        toast.error('Failed to connect wallet');
                      }
                    } else {
                      toast.error('MetaMask not found', {
                        description: 'Please install MetaMask extension'
                      });
                      window.open('https://metamask.io/download/', '_blank');
                    }
                  }}
                >
                  <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.7222 11.5556L12.5556 3.22222L4.38889 11.5556H20.7222ZM20.7222 11.5556L12.5556 20.7222L4.38889 11.5556H20.7222Z" fill="white" fillOpacity="0.8" />
                    <path d="M4.38889 11.5556H20.7222L12.5556 3.22222L4.38889 11.5556Z" fill="white" fillOpacity="0.2" />
                    <path d="M20.7222 11.5556H4.38889L12.5556 20.7222L20.7222 11.5556Z" fill="white" fillOpacity="0.2" />
                  </svg>
                  MetaMask
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-2 text-zinc-500">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-zinc-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-purple-500/20 text-white placeholder:text-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/50 h-12"
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-zinc-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/5 border-purple-500/20 text-white placeholder:text-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/50 h-12"
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full pt-2"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        {isLogin ? <LogIn className="ml-2 w-4 h-4" /> : <UserPlus className="ml-2 w-4 h-4" />}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <div className="text-center text-sm text-zinc-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>

              <Link href="/" className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-purple-400 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </CardFooter>

          </Card>
        </motion.div>
      </FadeIn>
    </div >
  );
}