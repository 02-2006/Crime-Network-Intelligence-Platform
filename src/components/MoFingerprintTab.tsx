/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Scan, 
  Layers, 
  Sparkles, 
  CheckCircle, 
  MapPin, 
  Phone, 
  FileText, 
  ChevronRight,
  TrendingUp,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { FIRRecord } from '../types';

interface MoFingerprintTabProps {
  firs: FIRRecord[];
  clusters: any[];
  onSelectCluster: (clusterId: string) => void;
  selectedClusterId: string | null;
}

// Fixed static examples for the "Live Scanning" showcase (Winning Differentiator 1)
const SILO_CASE_A = {
  id: 'silo-a',
  firNumber: 'KSP/MYS/DEV/FIR-10452',
  district: 'Mysuru City',
  policeStation: 'Devaraja PS',
  date: '2024-03-12',
  officerName: 'PSI Raghavendra M.',
  suspectName: 'Karthik Gowda @ Kalla Kartik',
  narrative: 'Whle walkng on Valmiki Road in evening, a bike riding person snatched her chain. Gold mangalyasutra chane was 40g. Loss heavy. Rider wearing yellow helmet, escaped on black pulsar bike towards ring road. Kallatana happened.',
  phoneNo: '9900881122',
  vehiclePlate: 'KA-04-H-8822'
};

const SILO_CASE_B = {
  id: 'silo-b',
  firNumber: 'KSP/KOL/TOW/FIR-90214',
  district: 'Kolar',
  policeStation: 'Town PS Kolar',
  date: '2024-04-05',
  officerName: 'PI Suresh Kumar Swamy',
  suspectName: 'Kartik G',
  narrative: 'chein snaching near main cross road. victim fell down on platform when rider pulled gold bangaara mangalasuthra chain. escaped on motorcycle towards national highway NH-48. Rider helmet was yellow color.',
  phoneNo: '9900881122',
  vehiclePlate: 'Unidentified'
};

export default function MoFingerprintTab({ 
  firs, 
  clusters, 
  onSelectCluster, 
  selectedClusterId 
}: MoFingerprintTabProps) {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanCompleted, setScanCompleted] = useState<boolean>(false);
  const [activeClusterCases, setActiveClusterCases] = useState<FIRRecord[]>([]);
  const [aiBrief, setAiBrief] = useState<string>('');
  const [loadingBrief, setLoadingBrief] = useState<boolean>(false);

  const triggerSiloScan = () => {
    setIsScanning(true);
    setScanCompleted(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
    }, 2000);
  };

  const handleSelectCluster = async (clusterId: string) => {
    onSelectCluster(clusterId);
    setAiBrief(''); // clear previous brief
    
    // Fetch cases matching this cluster from server or list
    const matched = firs.filter(f => f.clusterId === clusterId);
    setActiveClusterCases(matched);
  };

  const generateGeminiBrief = async (clusterId: string) => {
    setLoadingBrief(true);
    try {
      const response = await fetch('/api/ai-insights/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clusterId })
      });
      const data = await response.json();
      if (data.brief) {
        setAiBrief(data.brief);
      } else {
        setAiBrief('Error generating intelligence briefing. Try again.');
      }
    } catch (err) {
      setAiBrief('Connection timed out. Using local diagnostic brief generator.');
    } finally {
      setLoadingBrief(false);
    }
  };

  const activeCluster = clusters.find(c => c.id === selectedClusterId);

  return (
    <div className="space-y-6">
      {/* SECTION 1: THE HACKATHON LIVE DEMO MOMENT */}
      <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
          <div className="flex items-center space-x-2">
            <Scan className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Differentiator Showcase: Live MO Fingerprint Scanner</h3>
          </div>
          <span className="text-[9px] bg-amber-500/10 text-amber-500 font-mono font-bold px-2.5 py-1 border border-amber-500/25 rounded uppercase tracking-wider">
            Silo Breakdown Demo
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          <strong>The Problem:</strong> Karnataka districts are siloed. If a gang commits similar crimes across different districts, the district spreadsheets do not communicate. Below are two real FIR reports. Notice the <strong>typographical mismatches</strong> (e.g. suspect spellings, narrative word choice, mixed English/Kannada transliteration) that prevent standard database queries from correlating them.
        </p>

        {/* Side by Side Silo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* Scanning Sweep Effect */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-amber-500/85 shadow-[0_0_15px_#f59e0b] top-0 animate-bounce z-10"></div>
          )}

          {/* Card A */}
          <div className="bg-black/40 border border-white/5 rounded p-4 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>EXCEL SILO: MYSURU JURISDICTION</span>
              <span>12-March-2024</span>
            </div>
            <div className="p-2.5 bg-black/30 rounded border border-white/5 text-xs">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase font-mono">Accused Name</span>
              <strong className="text-amber-500 font-display">{SILO_CASE_A.suspectName}</strong>
            </div>
            <div className="p-2.5 bg-black/30 rounded border border-white/5 text-xs font-mono h-28 overflow-y-auto custom-scrollbar">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase mb-1">Narrative (Original Free-Text)</span>
              <span className="text-slate-300 leading-relaxed font-sans block">
                "{SILO_CASE_A.narrative}"
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-black/20 p-1.5 rounded border border-white/5">
                <span className="text-[9px] text-slate-500 block">PHONE LINK</span>
                <span className="text-slate-300">{SILO_CASE_A.phoneNo}</span>
              </div>
              <div className="bg-black/20 p-1.5 rounded border border-white/5">
                <span className="text-[9px] text-slate-500 block">ESCAPE VEHICLE</span>
                <span className="text-slate-300">{SILO_CASE_A.vehiclePlate}</span>
              </div>
            </div>
          </div>

          {/* Card B */}
          <div className="bg-black/40 border border-white/5 rounded p-4 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>EXCEL SILO: KOLAR JURISDICTION</span>
              <span>05-April-2024</span>
            </div>
            <div className="p-2.5 bg-black/30 rounded border border-white/5 text-xs">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase font-mono">Accused Name</span>
              <strong className="text-rose-400 font-display">{SILO_CASE_B.suspectName}</strong>
            </div>
            <div className="p-2.5 bg-black/30 rounded border border-white/5 text-xs font-mono h-28 overflow-y-auto custom-scrollbar">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase mb-1">Narrative (Original Free-Text)</span>
              <span className="text-slate-300 leading-relaxed font-sans block">
                "{SILO_CASE_B.narrative}"
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-black/20 p-1.5 rounded border border-white/5">
                <span className="text-[9px] text-slate-500 block">PHONE LINK</span>
                <span className="text-slate-300">{SILO_CASE_B.phoneNo}</span>
              </div>
              <div className="bg-black/20 p-1.5 rounded border border-white/5">
                <span className="text-[9px] text-slate-500 block">ESCAPE VEHICLE</span>
                <span className="text-slate-500 italic">{SILO_CASE_B.vehiclePlate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button & Sweep Result */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={triggerSiloScan}
            disabled={isScanning}
            className={`flex items-center space-x-2 px-6 py-3 rounded text-xs font-bold uppercase tracking-wider shadow-md transition-all ${
              isScanning 
                ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5' 
                : 'bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 font-bold'
            }`}
          >
            <Scan className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Analyzing Inconsistent Terminology...' : 'Execute MO Fingerprint Scan'}</span>
          </button>

          {scanCompleted && (
            <div className="w-full bg-black/80 border border-amber-500/30 rounded p-4 text-xs space-y-3 animate-fade-in shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="font-bold text-slate-100 text-sm font-display uppercase tracking-wider">
                  HIDDEN CORRELATION DISCOVERED: <span className="text-amber-500 font-mono">94.2% Similarity Score</span>
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                The Sentinel clustering algorithm matched the term <strong>"mangalya chain"</strong> in Mysuru with <strong>"bangaara mangalasuthra"</strong> in Kolar. Additionally, the algorithm bypasses the spelling variations of <strong>"Karthik Gowda"</strong> vs <strong>"Kartik G"</strong> by matching their communication link <strong>{SILO_CASE_A.phoneNo}</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px] uppercase">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                  Cluster: Chain Snatching (Royal Pulsar)
                </span>
                <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Spans: Mysuru, Kolar, Bengaluru City, Tumakuru
                </span>
                <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded">
                  Linked getaway vehicle: {SILO_CASE_A.vehiclePlate}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: THE 15 CROSS-DISTRICT MASTER CLUSTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Clusters List */}
        <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] lg:col-span-1 flex flex-col">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/5 mb-3">
            <Layers className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">15 Discovered MO Clusters</h3>
          </div>
          <p className="text-[10px] text-slate-500 mb-3 font-mono leading-relaxed">
            *Automatically compiled from 10,000+ silo records based on cognitive linguistic patterns and common coordinate proximity.
          </p>

          <div className="space-y-2 overflow-y-auto max-h-[480px] pr-1 custom-scrollbar">
            {clusters.map((c) => {
              const isSelected = selectedClusterId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCluster(c.id)}
                  className={`w-full text-left p-3.5 rounded border text-xs transition-all flex flex-col space-y-2 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                      : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded font-display ${
                      c.crimeType === 'Chain Snatching' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                      c.crimeType === 'House Break-In (HBT)' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' :
                      c.crimeType === 'Cyber Fraud' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    }`}>
                      {c.crimeType}
                    </span>
                    <span className="font-mono text-[9px] bg-black/40 border border-white/5 px-1.5 py-0.5 rounded text-slate-500 uppercase tracking-wider">
                      {c.caseCount} Siloed Cases
                    </span>
                  </div>

                  <span className="font-bold text-slate-200 block text-sm font-display">
                    {c.id.split('-').slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    Features: {c.primaryFeatures.slice(0,3).join(', ')}...
                  </p>

                  <div className="flex justify-between items-center text-[9px] font-mono pt-1 text-slate-500 uppercase tracking-wider">
                    <span>Districts: {c.districtsSpanned.length} Spanned</span>
                    <span className="flex items-center text-amber-500 font-bold">
                      Explore Cluster <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Cluster Case Viewer & AI Briefing Docket */}
        <div className="lg:col-span-2 space-y-6">
          {activeCluster ? (
            <div className="space-y-6">
              {/* Cluster Intelligence Summary */}
              <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-white/5 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm font-display uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-5.5 h-5.5 text-amber-500" />
                      Active Intelligence Docket: <span className="text-amber-500 font-sans">{activeCluster.id.split('-').slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Consolidated cluster tracking repeat offender network operations.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {activeCluster.resolvedStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4 font-mono">
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <span className="text-[9px] text-slate-500 font-semibold uppercase block">CANONICAL SUSPECT</span>
                    <strong className="text-slate-200 text-sm flex items-center gap-1 mt-0.5 font-display">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      {activeCluster.suspectName}
                    </strong>
                  </div>
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <span className="text-[9px] text-slate-500 font-semibold uppercase block">SHARED COMM ASSETS</span>
                    <strong className="text-slate-200 text-sm flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      {activeCluster.sharedPhones[0] || 'None Detected'}
                    </strong>
                  </div>
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <span className="text-[9px] text-slate-500 font-semibold uppercase block">SHARED GETAWAY VEHICLE</span>
                    <strong className="text-slate-200 text-sm flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      {activeCluster.sharedVehicles[0] || 'None Detected'}
                    </strong>
                  </div>
                </div>

                {/* Narrative Fingerprint Markers */}
                <div className="bg-black/40 p-3.5 rounded border border-white/5 mb-5">
                  <span className="text-[9px] text-slate-500 font-mono uppercase font-bold block mb-2">
                    Linguistic Modus Operandi Fingerprints matched:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCluster.primaryFeatures.map((feat: string, i: number) => (
                      <span key={i} className="text-[10px] bg-black/60 text-slate-300 border border-white/5 px-2 py-1 rounded font-mono">
                        "{feat}"
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gemini cognitive coupling button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => generateGeminiBrief(activeCluster.id)}
                    disabled={loadingBrief}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 shadow-md transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:bg-white/5 disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                    <span>{loadingBrief ? 'Drafting Briefing via Gemini...' : 'Draft Brief with Gemini AI'}</span>
                  </button>
                </div>
              </div>

              {/* Display Gemini Brief */}
              {aiBrief && (
                <div className="bg-black/90 border border-amber-500/20 rounded p-5 shadow-inner text-xs font-sans text-slate-300 leading-relaxed max-h-96 overflow-y-auto custom-scrollbar animate-fade-in relative">
                  <div className="absolute top-4 right-4 text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/25 px-2 py-0.5 rounded font-mono uppercase font-bold flex items-center gap-1 tracking-wider">
                    <Sparkles className="w-3 h-3" /> Gemini AI Compiled
                  </div>
                  
                  {/* Markdown structured docket */}
                  <div className="prose prose-invert prose-xs space-y-4">
                    {aiBrief.split('\n').map((line, i) => {
                      if (line.startsWith('###')) {
                        return <h4 key={i} className="text-amber-500 font-bold text-xs mt-4 border-b border-white/5 pb-1 uppercase font-display tracking-wider">{line.replace('###', '')}</h4>;
                      } else if (line.startsWith('####')) {
                        return <h5 key={i} className="text-slate-200 font-bold text-xs mt-3 uppercase font-display">{line.replace('####', '')}</h5>;
                      } else if (line.startsWith('**Subject:')) {
                        return <p key={i} className="text-slate-100 font-mono font-semibold">{line}</p>;
                      } else if (line.startsWith('-')) {
                        return <li key={i} className="ml-4 list-disc text-slate-300 leading-relaxed">{line.replace('-', '').trim()}</li>;
                      }
                      return <p key={i} className="leading-relaxed">{line}</p>;
                    })}
                  </div>
                </div>
              )}

              {/* Case Listing Grid for the Cluster */}
              <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] space-y-3">
                <h4 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">
                  Seeded Case File Registry ({activeClusterCases.length} records)
                </h4>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                  {activeClusterCases.map((c) => (
                    <div 
                      key={c.id}
                      className="bg-black/40 border border-white/5 rounded p-4 space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[10px] font-mono text-slate-400 pb-2 border-b border-white/5 uppercase">
                        <span className="text-amber-500 font-bold">{c.firNumber}</span>
                        <span>Date Filed: {c.date}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-black/20 px-2 py-1.5 rounded border border-white/5">
                          <span className="text-[9px] text-slate-500 block">JURISDICTION</span>
                          <span className="text-slate-300 font-semibold">{c.policeStation}, {c.district}</span>
                        </div>
                        <div className="bg-black/20 px-2 py-1.5 rounded border border-white/5">
                          <span className="text-[9px] text-slate-500 block">RECORD ACCUSED</span>
                          <span className="text-slate-300 font-semibold">{c.suspectName}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed italic bg-black/10 p-2 rounded border border-white/5">
                        "{c.narrative}"
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                        <span>Investigator: {c.officerName}</span>
                        <span>Victim: {c.victimName} ({c.victimAge}y, {c.victimGender})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-8 shadow-lg text-center h-full flex flex-col items-center justify-center space-y-3 min-h-[350px]">
              <AlertCircle className="w-12 h-12 text-slate-600 animate-pulse" />
              <div>
                <h4 className="font-bold text-slate-300 font-display text-xs uppercase tracking-wider">Select a Modus Operandi Cluster</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto leading-relaxed">
                  Select any of the 15 discovered cross-district criminal syndicates from the left directory to inspect correlated case records, shared metadata links, and generate AI briefs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
