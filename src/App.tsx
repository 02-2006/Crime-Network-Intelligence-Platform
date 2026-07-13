/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Map, 
  Layers, 
  Activity, 
  Network, 
  FileCheck, 
  Trophy, 
  LayoutDashboard,
  AlertTriangle,
  Server,
  UserCheck
} from 'lucide-react';

// Subcomponents
import DashboardStatsPanel from './components/DashboardStatsPanel';
import MapGISLayer from './components/MapGISLayer';
import MoFingerprintTab from './components/MoFingerprintTab';
import SocioEconomicRiskTab from './components/SocioEconomicRiskTab';
import NetworkLinkAnalysisTab from './components/NetworkLinkAnalysisTab';
import InvestigatorTrustTab from './components/InvestigatorTrustTab';
import OnePagePitchTab from './components/OnePagePitchTab';

// Types
import { 
  FIRRecord, 
  AreaRiskIndicator, 
  CriminalProfile, 
  AuditTrailLog, 
  TrendAlert, 
  DashboardStats 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [firs, setFirs] = useState<FIRRecord[]>([]);
  const [wards, setWards] = useState<AreaRiskIndicator[]>([]);
  const [criminals, setCriminals] = useState<CriminalProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditTrailLog[]>([]);
  const [alerts, setAlerts] = useState<TrendAlert[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // Selection states
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [selectedCriminalId, setSelectedCriminalId] = useState<string | null>(null);

  // Loading indicator
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch initial REST data from Express Server
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [
          statsRes, 
          firsRes, 
          wardsRes, 
          crimsRes, 
          alertsRes, 
          auditRes
        ] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/firs'),
          fetch('/api/wards'),
          fetch('/api/criminals'),
          fetch('/api/alerts'),
          fetch('/api/audit-trail')
        ]);

        const statsData = await statsRes.json();
        const firsData = await firsRes.json();
        const wardsData = await wardsRes.json();
        const crimsData = await crimsRes.json();
        const alertsData = await alertsRes.json();
        const auditData = await auditRes.json();

        setStats(statsData);
        setFirs(firsData);
        setWards(wardsData);
        setCriminals(crimsData);
        setAlerts(alertsData);
        setAuditLogs(auditData);
      } catch (err) {
        console.error('Failed to load application dataset:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleUpdateWards = (updatedList: AreaRiskIndicator[]) => {
    setWards(updatedList);
  };

  const handleAddAuditLog = (newLog: AuditTrailLog) => {
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleConfirmAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, active: false } : a));
    // decrease stats critical alert count
    if (stats) {
      setStats({
        ...stats,
        criticalAlertCount: Math.max(0, stats.criticalAlertCount - 1)
      });
    }
  };

  const handleTabNavigation = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'mo-clustering' && !selectedClusterId && firs.length > 0) {
      // pre-select first cluster
      const clusterWithId = firs.find(f => f.clusterId);
      if (clusterWithId) {
        setSelectedClusterId(clusterWithId.clusterId || null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col justify-center items-center font-mono text-slate-400 space-y-4">
        <Shield className="w-16 h-16 text-amber-500 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
        <div className="space-y-1.5 text-center">
          <p className="text-sm font-bold text-slate-200 font-display uppercase tracking-wider">INITIATING SENTINEL CORE SECURE VM</p>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Retrieving 10,000+ SCRB multi-district records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-300 font-sans flex flex-col antialiased selection:bg-amber-500/30 selection:text-white">
      {/* State Gov Header Banner */}
      <header className="bg-[#0A0F18] border-b border-white/10 px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.35)] shrink-0 text-black">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-amber-500/15 text-amber-500 border border-amber-500/25 px-2 py-0.5 rounded font-bold font-mono tracking-wider">
                GOVERNMENT OF KARNATAKA
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] text-slate-500 font-mono tracking-wider font-semibold">SCRB LIVE LINK SYNCED</span>
            </div>
            <h1 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2 mt-0.5">
              Sentinel <span className="text-amber-500">v2.4</span> <span className="text-slate-500 font-normal normal-case text-xs">| Crime Network Intelligence Platform</span>
            </h1>
          </div>
        </div>

        {/* Live System Diagnostics Tracker */}
        <div className="flex items-center space-x-4 font-mono text-[10px] text-slate-400 bg-black/60 backdrop-blur border border-white/10 px-4 py-2 rounded-lg shadow-inner">
          <div className="flex items-center space-x-1.5">
            <Server className="w-3.5 h-3.5 text-amber-500" />
            <span>EXPRESS PORT: <strong className="text-white">3000</strong></span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>RECORDS PARSED: <strong className="text-white">10,000+</strong></span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="w-full lg:w-64 bg-[#0A0F18]/80 border-r border-white/5 p-4 space-y-1.5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2.5 mb-3 font-mono">
              Intelligence Desk
            </span>

            {/* Dashboard Link */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500/10 border-l-2 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)] rounded-r'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white rounded'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Statewide Dashboard</span>
            </button>

            {/* GIS Map Link */}
            <button
              onClick={() => setActiveTab('gis-map')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'gis-map'
                  ? 'bg-amber-500/10 border-l-2 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)] rounded-r'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white rounded'
              }`}
            >
              <Map className="w-4.5 h-4.5" />
              <span>Interactive GIS Map</span>
            </button>

            {/* MO Fingerprint Link */}
            <button
              onClick={() => handleTabNavigation('mo-clustering')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'mo-clustering'
                  ? 'bg-amber-500/10 border-l-2 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)] rounded-r'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white rounded'
              }`}
            >
              <Layers className="w-4.5 h-4.5" />
              <span>MO Fingerprinting Hub</span>
            </button>

            {/* Socio-Economic Link */}
            <button
              onClick={() => setActiveTab('risk-profiling')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'risk-profiling'
                  ? 'bg-amber-500/10 border-l-2 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)] rounded-r'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white rounded'
              }`}
            >
              <Activity className="w-4.5 h-4.5" />
              <span>Socio-Economic Risk</span>
            </button>

            {/* Link Analysis Link */}
            <button
              onClick={() => setActiveTab('network')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'network'
                  ? 'bg-amber-500/10 border-l-2 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)] rounded-r'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white rounded'
              }`}
            >
              <Network className="w-4.5 h-4.5" />
              <span>Link Analysis Graph</span>
            </button>

            {/* Investigator Trust Link */}
            <button
              onClick={() => setActiveTab('investigator-trust')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'investigator-trust'
                  ? 'bg-amber-500/10 border-l-2 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)] rounded-r'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white rounded'
              }`}
            >
              <FileCheck className="w-4.5 h-4.5" />
              <span>Trust & Overrides</span>
              {alerts.filter(a => a.active).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-auto"></span>
              )}
            </button>

            {/* Pitch Link */}
            <button
              onClick={() => setActiveTab('pitch')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'pitch'
                  ? 'bg-amber-500/10 border-l-2 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)] rounded-r'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white rounded'
              }`}
            >
              <Trophy className="w-4.5 h-4.5 text-amber-500" />
              <span className="font-bold">SCRB Evaluation Rubric</span>
            </button>
          </div>

          {/* Secure Officer badge */}
          <div className="pt-4 border-t border-white/5 hidden lg:block text-[10px] font-mono text-slate-500 space-y-1 leading-snug">
            <span>OFFICER ACCREDITED</span>
            <span className="block text-slate-300 font-bold">PI Vikram Gowda</span>
            <span>Badge: KSP-40291 (SCRB)</span>
          </div>
        </nav>

        {/* Content View Area */}
        <main className="flex-1 p-5 lg:p-6 overflow-y-auto max-h-[calc(100vh-66px)] custom-scrollbar bg-[#05070A]">
          {activeTab === 'dashboard' && (
            <DashboardStatsPanel stats={stats} onNavigate={handleTabNavigation} />
          )}

          {activeTab === 'gis-map' && (
            <MapGISLayer firs={firs} wards={wards} alerts={alerts} />
          )}

          {activeTab === 'mo-clustering' && (
            <MoFingerprintTab 
              firs={firs} 
              clusters={stats?.clustersList || []} 
              onSelectCluster={setSelectedClusterId} 
              selectedClusterId={selectedClusterId} 
            />
          )}

          {activeTab === 'risk-profiling' && (
            <SocioEconomicRiskTab wards={wards} onUpdateWards={handleUpdateWards} />
          )}

          {activeTab === 'network' && (
            <NetworkLinkAnalysisTab 
              criminals={criminals} 
              onSelectCriminal={setSelectedCriminalId} 
              selectedCriminalId={selectedCriminalId} 
            />
          )}

          {activeTab === 'investigator-trust' && (
            <InvestigatorTrustTab 
              alerts={alerts} 
              auditLogs={auditLogs} 
              onAddAuditLog={handleAddAuditLog} 
              onConfirmAlert={handleConfirmAlert} 
            />
          )}

          {activeTab === 'pitch' && (
            <OnePagePitchTab />
          )}
        </main>
      </div>
    </div>
  );
}
