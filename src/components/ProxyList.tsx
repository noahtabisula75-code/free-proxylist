import React, { useEffect, useState } from 'react';
import { ProxyListResponse, ProxyData } from '../types';
import { ShieldCheck, RefreshCcw, Server, Globe, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export default function ProxyList() {
  const [proxies, setProxies] = useState<ProxyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [protocolFilter, setProtocolFilter] = useState('');
  const [anonymityFilter, setAnonymityFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [limit, setLimit] = useState(50);
  
  const fetchProxies = async (pageNum: number) => {
    setLoading(true);
    setError('');
    try {
      let url = `/api/proxies?page=${pageNum}&limit=${limit}`;
      if (protocolFilter) url += `&protocols=${protocolFilter}`;
      if (anonymityFilter) url += `&anonymityLevel=${anonymityFilter}`;
      if (countryFilter) url += `&country=${countryFilter}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch proxies');
      }
      const data: ProxyListResponse = await res.json();
      setProxies(data.data || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProxies(page);
  }, [page, protocolFilter, anonymityFilter, countryFilter, limit]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchProxies(page);
  };

  const getLatencyColor = (latency: number | undefined) => {
    if (!latency) return 'bg-slate-500 w-[10%]';
    if (latency < 100) return 'bg-emerald-500 w-[85%]';
    if (latency < 300) return 'bg-yellow-500 w-[45%]';
    return 'bg-red-500 w-[20%]';
  };
  
  const getLatencyTextColor = (latency: number | undefined) => {
    if (!latency) return 'text-slate-500';
    if (latency < 100) return 'text-emerald-400';
    if (latency < 300) return 'text-yellow-500';
    return 'text-red-400';
  };

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header Section */}
      <header className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Proxy<span className="text-indigo-400">List</span></h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 items-center gap-3">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">System Online</span>
          </div>
          <a
            href="/api/proxies/raw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg border border-white/10"
            title="Open raw IP:PORT list in new tab"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Raw TXT</span>
            <span className="sm:hidden">TXT</span>
          </a>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-3 sm:px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/30 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Fetch Latest</span>
          </button>
        </div>
      </header>

      {/* Filters Section */}
      <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-end gap-4 sm:gap-6">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Protocol</label>
              <select
                value={protocolFilter}
                onChange={handleFilterChange(setProtocolFilter)}
                className="bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none w-full"
              >
                <option value="" className="bg-slate-900">All Protocols</option>
                <option value="http" className="bg-slate-900">HTTP</option>
                <option value="https" className="bg-slate-900">HTTPS</option>
                <option value="socks4" className="bg-slate-900">SOCKS4</option>
                <option value="socks5" className="bg-slate-900">SOCKS5</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Anonymity</label>
              <select
                value={anonymityFilter}
                onChange={handleFilterChange(setAnonymityFilter)}
                className="bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none w-full"
              >
                <option value="" className="bg-slate-900">All Levels</option>
                <option value="elite" className="bg-slate-900">Elite</option>
                <option value="anonymous" className="bg-slate-900">Anonymous</option>
                <option value="transparent" className="bg-slate-900">Transparent</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Country (Code)</label>
              <input
                type="text"
                placeholder="e.g. US, DE"
                value={countryFilter}
                onChange={(e) => {
                   setCountryFilter(e.target.value.toUpperCase());
                   setPage(1);
                }}
                className="bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none w-full placeholder-slate-600 font-mono"
                maxLength={2}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Per Page</label>
              <select
                value={limit.toString()}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none w-full"
              >
                <option value="25" className="bg-slate-900">25 items</option>
                <option value="50" className="bg-slate-900">50 items</option>
                <option value="100" className="bg-slate-900">100 items</option>
                <option value="250" className="bg-slate-900">250 items</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* Main Data Grid */}
      <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl mb-6">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Port</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Country</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Latency</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && proxies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCcw className="w-6 h-6 animate-spin text-indigo-400" />
                      <span className="text-sm">Connecting to nexus...</span>
                    </div>
                  </td>
                </tr>
              )}
              
              {Math.abs(0) === 0 && error && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-400">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 inline-block">
                      {error}
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && proxies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No active proxies found at this time.
                  </td>
                </tr>
              )}

              {proxies.map((proxy, i) => {
                const latency = proxy.speed !== undefined ? proxy.speed : proxy.latency;
                return (
                  <tr key={proxy._id || i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-mono text-sm text-white">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        {proxy.ip}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs font-bold border border-indigo-500/20">
                        {proxy.port}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg" title={proxy.country}>{getFlagEmoji(proxy.country)}</span>
                        <span className="text-sm font-medium text-slate-200">{proxy.country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
                          <div className={`h-full ${getLatencyColor(latency)}`}></div>
                        </div>
                        <span className={`text-xs font-medium font-mono ${getLatencyTextColor(latency)}`}>
                          {latency ? `${latency}ms` : '--'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {proxy.protocols?.map((p) => (
                          <span key={p} className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/50 px-2 py-0.5 rounded border border-white/5">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Stats / Pagination */}
        <div className="border-t border-white/5 bg-slate-900/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto shrink-0">
          <div className="flex gap-6 sm:gap-8 justify-center w-full sm:w-auto">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Total Proxies</span>
              <span className="text-lg font-bold text-white">{total > 0 ? total.toLocaleString() : '--'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="p-2 hover:bg-white/10 rounded-lg border border-white/10 text-slate-400 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-slate-400 px-2 min-w-[4rem] text-center">
              Page {page}
            </span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={loading || proxies.length < 50}
              className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/30 text-indigo-300 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
