/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  Layers, 
  AlertTriangle, 
  UserCheck, 
  ShieldAlert,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DashboardStats } from '../types';

interface DashboardStatsPanelProps {
  stats: DashboardStats | null;
  onNavigate: (tab: string) => void;
}

export default function DashboardStatsPanel({ stats, onNavigate }: DashboardStatsPanelProps) {
  if (!stats) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Calculate percentage ratios
  const unresolvedPct = ((stats.unresolvedCount / stats.totalFIRs) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total FIRs */}
        <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-20 h-20 text-slate-400" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-display">Total Siloed FIRs</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white font-mono tracking-tight">
              {stats.totalFIRs.toLocaleString()}
            </span>
            <span className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-medium uppercase tracking-wider">
              Siloed Excel Imports
            </span>
          </div>
        </div>

        {/* Unresolved Cases */}
        <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert className="w-20 h-20 text-slate-400" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-display">Unresolved Rate</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white font-mono tracking-tight">
              {stats.unresolvedCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded font-mono font-medium">
              {unresolvedPct}% Pending
            </span>
          </div>
        </div>

        {/* MO Clusters Found */}
        <div 
          onClick={() => onNavigate('mo-clustering')}
          className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] relative overflow-hidden group cursor-pointer hover:border-amber-500/35 hover:shadow-[0_4px_20px_rgba(245,158,11,0.05)] transition-all"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers className="w-20 h-20 text-slate-400" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-display">MO Clusters Found</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white font-mono tracking-tight">
              {stats.moClustersFound}
            </span>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-medium uppercase tracking-wider">
              Cross-Jurisdiction
            </span>
          </div>
        </div>

        {/* Active Repeat Offenders */}
        <div 
          onClick={() => onNavigate('network')}
          className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] relative overflow-hidden group cursor-pointer hover:border-amber-500/35 hover:shadow-[0_4px_20px_rgba(245,158,11,0.05)] transition-all"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserCheck className="w-20 h-20 text-slate-400" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-display">Centralized Offenders</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white font-mono tracking-tight">
              {stats.repeatOffendersActive}
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-medium uppercase tracking-wider">
              Active Network Nodes
            </span>
          </div>
        </div>

        {/* Pulsing Trend Alerts */}
        <div 
          onClick={() => onNavigate('investigator-trust')}
          className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] relative overflow-hidden group cursor-pointer hover:border-rose-500/35 hover:shadow-[0_4px_20px_rgba(244,63,94,0.05)] transition-all"
        >
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle className="w-20 h-20 text-rose-500" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-lg animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-display">Emerging Alerts</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-rose-400 font-mono tracking-tight">
              {stats.criticalAlertCount}
            </span>
            <span className="text-[10px] text-rose-400 bg-rose-950/40 border border-rose-500/20 px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              Z-Score Triggered
            </span>
          </div>
        </div>
      </div>

      {/* Analytics & System Logs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Karnataka Statewide Annual Crime Trend (SCRB Consolidated)</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Updated Real-time
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.statewideCrimeRateTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0F18', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '11px' }}
                  itemStyle={{ color: '#f59e0b', fontSize: '11px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTrend)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Sentinel Platform Diagnostics */}
        <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">SCRB Sentinel Integration Diagnostics</h3>
            </div>
            
            <div className="space-y-4 text-[11px]">
              <div className="p-3 bg-black/40 rounded border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 font-semibold font-display">Excel Silo Parser</span>
                  <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider">ONLINE</span>
                </div>
                <p className="text-slate-500 font-mono leading-relaxed">Consolidated 31 District police superintendent spreadsheets.</p>
              </div>

              <div className="p-3 bg-black/40 rounded border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 font-semibold font-display">Cognitive NLP Clustering (TF-IDF)</span>
                  <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider">ACTIVE</span>
                </div>
                <p className="text-slate-500 font-mono leading-relaxed">Vocabulary index size: 14,212 unique crime stems matched.</p>
              </div>

              <div className="p-3 bg-black/40 rounded border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 font-semibold font-display">Graph Centrality Engine</span>
                  <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider">READY</span>
                </div>
                <p className="text-slate-500 font-mono leading-relaxed">PageRank convergence reached at 14 iterations.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>UPTIME: 100% STABLE</span>
            <span className="text-amber-500 font-bold uppercase tracking-wider">v1.1.0-Hackathon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
