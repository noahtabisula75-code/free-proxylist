import React, { useState } from 'react';
import { ShieldCheck, Activity, CheckCircle2, XCircle, Globe, Box } from 'lucide-react';

export default function ProxyChecker() {
  const [proxy, setProxy] = useState('');
  const [protocol, setProtocol] = useState('http');
  const [website, setWebsite] = useState('https://example.com');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proxy || !website) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/check-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxy, protocol, website })
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ success: false, error: err.message || 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <header className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Proxy<span className="text-emerald-400">Checker</span></h1>
        </div>
      </header>

      <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <form onSubmit={handleCheck} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Proxy (IP:PORT)</label>
              <div className="flex items-center gap-3 bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3">
                <Box className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.1:8080"
                  value={proxy}
                  onChange={(e) => setProxy(e.target.value)}
                  className="bg-transparent border-none text-white text-sm outline-none w-full placeholder-slate-600 font-mono"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Protocol</label>
              <div className="flex items-center gap-3 bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-slate-500" />
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value)}
                  className="bg-transparent border-none text-white text-sm outline-none w-full"
                >
                  <option value="http" className="bg-slate-900">HTTP/HTTPS</option>
                  <option value="socks4" className="bg-slate-900">SOCKS4</option>
                  <option value="socks5" className="bg-slate-900">SOCKS5</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Website to check</label>
            <div className="flex items-center gap-3 bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3">
              <Globe className="h-4 w-4 text-slate-500" />
              <input
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="bg-transparent border-none text-white text-sm outline-none w-full placeholder-slate-600 font-mono"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !proxy || !website}
            className="mt-2 w-full md:w-auto md:self-end bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/30 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Check Proxy'}
          </button>
        </form>
      </section>

      {result && (
        <section className={`mt-6 backdrop-blur-xl border rounded-2xl p-6 shadow-2xl transition-all ${result.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className="flex items-start gap-4">
            {result.success ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
            )}
            
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.success ? 'Connection Successful' : 'Connection Failed'}
              </h3>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.success ? (
                  <>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Status</span>
                      <span className="text-sm font-medium text-white">{result.status} {result.statusText}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Latency</span>
                      <span className="text-sm font-mono text-emerald-400">{result.latency} ms</span>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Error Details</span>
                    <span className="text-sm font-mono text-red-300 break-all">{result.error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
