import React, { useState } from 'react';
import ProxyList from './components/ProxyList';
import ProxyChecker from './components/ProxyChecker';
import { List, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'checker'>('list');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200 relative">
      {/* Background Mesh Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-[30%] h-[40%] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row flex-1 max-w-7xl mx-auto w-full">
        {/* Navigation - Bottom bar on mobile, Sidebar on desktop */}
        <nav className="w-full md:w-64 border-t md:border-t-0 md:border-r border-white/5 bg-slate-900/40 md:bg-slate-900/20 backdrop-blur-md p-3 md:p-6 flex flex-row md:flex-col gap-2 md:gap-4 order-last md:order-first z-50 shrink-0 sticky bottom-0 md:top-0 md:h-screen">
          <div className="hidden md:flex text-xl font-bold tracking-tight text-white mb-8 px-2 items-center gap-2">
            <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-indigo-500/20">PN</span>
            Nexus
          </div>
          
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'list' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
          >
            <List className="w-5 h-5" />
            <span className="font-medium text-xs sm:text-sm">Proxy List</span>
          </button>
          
          <button
            onClick={() => setActiveTab('checker')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 md:px-4 py-3 rounded-xl transition-all ${activeTab === 'checker' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
          >
            <Activity className="w-5 h-5" />
            <span className="font-medium text-xs sm:text-sm">Checker</span>
          </button>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 flex flex-col min-w-0">
          {activeTab === 'list' && <ProxyList />}
          {activeTab === 'checker' && <ProxyChecker />}
        </main>
      </div>
    </div>
  );
}
