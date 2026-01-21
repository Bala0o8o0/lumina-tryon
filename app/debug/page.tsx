'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';

export default function DebugPage() {
    const { user, session } = useAuth();
    const [dbUser, setDbUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function checkDb() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    setError(error.message);
                } else {
                    setDbUser(data);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        checkDb();
    }, [user]);

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono">
            <h1 className="text-2xl font-bold mb-4 text-purple-400">Debug Console</h1>

            <div className="space-y-6">
                <div className="border border-zinc-800 p-4 rounded bg-zinc-900/50">
                    <h2 className="text-xl font-bold mb-2">1. Auth Session Status</h2>
                    <pre className="whitespace-pre-wrap text-sm text-zinc-400">
                        {JSON.stringify({
                            hasUser: !!user,
                            userId: user?.id,
                            email: user?.email,
                            hasSession: !!session
                        }, null, 2)}
                    </pre>
                </div>

                <div className="border border-zinc-800 p-4 rounded bg-zinc-900/50">
                    <h2 className="text-xl font-bold mb-2">2. Database Record (public.users)</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <div className="text-red-400">
                            <p className="font-bold">Error fetching from DB:</p>
                            <p>{error}</p>
                            <p className="mt-2 text-xs text-zinc-500">
                                (If error is "JSON object requested, multiple (or no) rows returned", it means the user row does NOT exist in the table)
                            </p>
                        </div>
                    ) : dbUser ? (
                        <pre className="whitespace-pre-wrap text-sm text-green-400">
                            {JSON.stringify(dbUser, null, 2)}
                        </pre>
                    ) : (
                        <p className="text-yellow-400">No user record found in database.</p>
                    )}
                </div>

                <div className="border border-zinc-800 p-4 rounded bg-zinc-900/50">
                    <h2 className="text-xl font-bold mb-2">3. Manual Fix</h2>
                    <p className="mb-4 text-sm text-zinc-400">
                        If the DB record is missing or has low credits, use these buttons.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={async () => {
                                if (!user) return;
                                const { error } = await supabase.from('users').upsert({
                                    id: user.id,
                                    email: user.email,
                                    credits: 20,
                                    created_at: new Date().toISOString()
                                });
                                if (error) alert('Error: ' + error.message);
                                else {
                                    alert('Success! Reset user to 20 credits.');
                                    window.location.reload();
                                }
                            }}
                            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500 transition-colors"
                        >
                            Reset to 20 Credits
                        </button>

                        <button
                            onClick={async () => {
                                if (!user) return;
                                // Fetch current credits first to add to them
                                const { data } = await supabase.from('users').select('credits').eq('id', user.id).single();
                                const current = data?.credits || 0;

                                const { error } = await supabase.from('users').update({
                                    credits: current + 100
                                }).eq('id', user.id);

                                if (error) alert('Error: ' + error.message);
                                else {
                                    alert(`Success! Added 100 credits. Total: ${current + 100}`);
                                    window.location.reload();
                                }
                            }}
                            className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition-colors"
                        >
                            Add 100 Credits
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
