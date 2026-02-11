'use client';

import React from "react";
import { useRouter } from 'next/navigation';

// Define the LandingPage component at the top level
const LandingPage: React.FC<{ handleLogin: () => void  ; handleSignup: () => void }> = ({ handleLogin, handleSignup })=> {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-600" />
            <span className="text-lg font-semibold tracking-tight">SubWallet</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
              onClick={handleLogin} // Attach the handleLogin function here
            >
              Login
            </button>
            <button
              type="button"
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            onClick={handleSignup}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                Digital Wallet + Subscriptions
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Control every recurring payment from one secure student wallet.
              </h1>
              <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
                SubWallet helps students manage subscriptions, hold funds in an escrow-style
                flow, and release payments only when charges are validated.
              </p>
              <button
                type="button"
                className="mt-8 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
              onClick={handleSignup}
              >
                Get Started
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                    Wallet Balance
                  </p>
                  <p className="mt-2 text-3xl font-semibold">$1,420.50</p>
                  <p className="mt-1 text-sm text-slate-600">Available for verified payments</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Netflix Student</span>
                    <span className="font-semibold text-indigo-600">Queued</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Escrow release planned after renewal check
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Notion Pro</span>
                    <span className="font-semibold text-indigo-600">Protected</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Charge held until usage cycle confirms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Built for smarter subscription control
              </h2>
              <p className="mt-3 text-sm text-slate-600 sm:text-base">
                A clean student-focused wallet interface with escrow-inspired transaction safety.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Virtual Wallet</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Keep your balance organized for tuition tools, streaming, and campus services.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Auto Subscriptions</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Track recurring plans with clear schedules and simplified renewal visibility.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Secure Escrow Ledger</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Hold funds before release so every payment follows a transparent verification flow.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-slate-500 sm:px-6">
          © 2026 SubWallet. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// Use the LandingPage component directly
export default function LandingPageWrapper() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login'); // Navigate to the login page
  };
  
  const handleSignup = () => {
    router.push('/signup'); //Navigate to sign up page
  };

  return <LandingPage handleLogin={handleLogin} handleSignup={handleSignup} />;
}
