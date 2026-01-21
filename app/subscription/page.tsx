'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, Shield, Zap, Award, Sparkles } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import GridPattern from '@/components/GridPattern';

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    email: string | undefined;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => any;
  }
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function SubscriptionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loadingPayment, setLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const handlePayment = async (credits: number, price: number) => {
    if (!window.Razorpay) {
      toast.error('Payment gateway not loaded yet. Please try again.');
      return;
    }

    setLoading(true);

    try {
      console.log('💳 Starting payment process:', { credits, price, amount: price * 100 });

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credits,
          amount: price * 100, // Convert to paise
        }),
      });

      console.log('📡 Create order response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Create order failed:', error);
        throw new Error(error.error || 'Failed to create order');
      }

      const { order } = await response.json();
      console.log('✅ Order created:', order);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Lumina Try',
        description: `${credits} credits for AI try-on`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            console.log('💰 Payment successful, verifying...');

            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id,
                credits,
              }),
            });

            if (!verifyResponse.ok) {
              const error = await verifyResponse.json();
              console.error('❌ Payment verification failed:', error);
              throw new Error(error.error || 'Failed to verify payment');
            }

            await verifyResponse.json();
            console.log('✅ Payment verified successfully');
            toast.success(`Payment successful! ${credits} credits added to your account.`);
            router.push('/account');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error((error as Error).message || 'Payment verification failed');
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#a855f7',
        },
      };

      console.log('🚀 Opening Razorpay checkout...');
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error((error as Error).message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const packages = [
    { credits: 50, price: 50, description: 'Perfect for trying new looks', features: ['10 virtual try-ons', 'HD downloads', 'No expiration'] },
    { credits: 100, price: 90, description: 'Most popular choice', popular: true, features: ['20 virtual try-ons', 'HD downloads', 'Priority processing', 'No expiration'] },
    { credits: 500, price: 400, description: 'Best value for creators', features: ['100 virtual try-ons', '4K downloads', 'Priority processing', 'Commercial usage', 'No expiration'] },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-20 px-4">
      <div className="fixed inset-0 -z-10">
        <GridPattern />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      </div>

      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl mb-6"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Flexible Credit Packages
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
                Choose Your Plan
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Purchase credits to unlock unlimited virtual try-ons. Each try-on costs 1 credit.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative h-full"
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <Card className={`h-full border-purple-500/20 bg-purple-500/5 backdrop-blur-xl p-8 ${pkg.popular ? 'ring-2 ring-purple-500/50' : ''}`}>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-black text-white mb-2">{pkg.credits}</div>
                    <div className="text-zinc-400">Credits</div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                      ₹{pkg.price}
                    </div>
                    <div className="text-sm text-zinc-500 mt-1">{pkg.description}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-300">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => handlePayment(pkg.credits, pkg.price)}
                      disabled={loading}
                      className={`w-full h-12 rounded-xl font-semibold ${pkg.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30'
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                        }`}
                    >
                      {loading ? 'Processing...' : `Buy ${pkg.credits} Credits`}
                    </Button>
                  </motion.div>
                </Card>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Shield, title: 'Secure Payment', desc: 'All transactions are encrypted' },
              { icon: Zap, title: 'Instant Delivery', desc: 'Credits added immediately' },
              { icon: Award, title: 'Money Back', desc: '30-day satisfaction guarantee' }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="text-center">
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