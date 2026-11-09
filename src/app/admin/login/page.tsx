'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  ShieldAlert,
  KeyRound,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Terminal,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { sound } from '@/lib/audio/sound-fx';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    sound.playClick(850);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        sound.playClick(400);
        throw new Error(data.error || 'Access Denied: Invalid security credentials.');
      }

      sound.playEngage();
      setSuccess(true);
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    sound.playClick(1000);
    setEmail('admin@quickcart.io');
    setPassword('admin');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blueprint Grid & Halo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Return link */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/"
            onClick={() => sound.playClick(600)}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[00/RETURN_STOREFRONT]</span>
          </Link>

          <span className="font-mono text-[10px] text-zinc-600">
            SECURITY_LEVEL: ALPHA-01
          </span>
        </div>

        {/* Tactical Login Card */}
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          {/* Mechanical corner pins */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-zinc-700" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-zinc-700" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-zinc-700" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-zinc-700" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/10">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono text-[10px] uppercase font-bold tracking-widest mb-2">
              <Terminal className="w-3 h-3 text-amber-500" />
              RESTRICTED_ACCESS // DEPOT_CONTROL
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white uppercase font-mono tracking-tight">
              ADMIN AUTHENTICATION
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Verify operator credentials to access fulfillment telemetries.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 font-mono text-xs animate-in fade-in duration-150">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 font-mono text-xs animate-in zoom-in-95 duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <p>ACCESS_GRANTED: Initializing secure console session...</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
                OPERATOR_EMAIL / HANDLE
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@quickcart.io"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500 text-white font-mono text-xs outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
                SECURITY_KEY / PASSPHRASE
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-amber-500 text-white font-mono text-xs outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-zinc-950 font-black text-xs font-mono tracking-wider transition-all shadow-lg shadow-orange-500/20 hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>VERIFYING SIGNATURE...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AUTHENTICATED</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 stroke-[2.5]" />
                  <span>AUTHENTICATE &amp; ENTER TERMINAL</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill Pill */}
          <div className="mt-5 pt-4 border-t border-zinc-900 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-400 text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>CLICK TO AUTO-FILL DEMO CREDENTIALS</span>
            </button>
            <p className="text-[10px] font-mono text-zinc-500 mt-2">
              Default Master Demo: <code>admin@quickcart.io</code> / <code>admin</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
