import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lock, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, getStoredToken, login } from '../lib/api';

const AdminLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const requestedRedirect = searchParams.get('redirect');
  const redirectTo = requestedRedirect?.startsWith('/admin') && requestedRedirect !== '/admin/login'
    ? requestedRedirect
    : '/admin';

  useEffect(() => {
    if (getStoredToken()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'Could not log in.');
      setStatus('idle');
    }
  };

  const inputCls = 'w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition-all focus:border-purple-500/60 focus:outline-none';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A12] px-5 py-8 text-slate-300">
      <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <Link to="/" className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-slate-500 transition-colors hover:text-cyan-300">
          <ArrowLeft size={16} />
          Back to portfolio
        </Link>

        <section className="glass-card p-7 sm:p-8">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 text-white shadow-lg shadow-purple-500/25">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-white">Admin Login</h1>
              <p className="mt-1 text-sm text-slate-500">Sign in to update portfolio content.</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={17} />
                <input
                  className={inputCls}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={17} />
                <input
                  className={inputCls}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full justify-center py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} />
              {status === 'loading' ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AdminLogin;
