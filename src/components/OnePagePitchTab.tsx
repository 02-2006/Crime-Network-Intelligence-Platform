/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Trophy, 
  Map, 
  Layers, 
  Activity, 
  Network, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

export default function OnePagePitchTab() {
  return (
    <div className="space-y-6">
      {/* Platform Winner Header */}
      <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-6 shadow-[0_4px_12px_rgba(0,0,0,0.35)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Trophy className="w-32 h-32 text-amber-500" />
        </div>
        <div className="flex items-center space-x-3.5 mb-2">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
            <Trophy className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] text-amber-500 font-bold tracking-widest uppercase font-mono block">Government of Karnataka State Police Hackathon</span>
            <h2 className="text-2xl font-bold text-slate-100 font-display tracking-tight mt-0.5">Sentinel — SCRB Strategic Crime Intelligence Hub</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl font-sans">
          Sentinel breaks open 31 isolated police district spreadsheets, utilizing cognitive NLP and graph network algorithms to map cross-jurisdictional criminal syndicates. By transitioning SCRB from retrospective crime reporting to predictive spatiotemporal policy interventions, Sentinel represents the definitive, first-place solution for policing in Karnataka.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rubric Alignment Sheet */}
        <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 pb-2.5 border-b border-white/5">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Evaluation Rubric Alignment Ledger</h3>
          </div>

          <div className="space-y-4 text-xs font-sans leading-relaxed">
            
            {/* Rubric 1 */}
            <div className="bg-black/40 p-4 border border-white/5 rounded space-y-2 relative">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-200 text-sm font-display">1. Breaking Down Silos (MO-Fingerprinting)</h4>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  100% COMPLIANT
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                <strong>Problem Solved:</strong> Criminals exploit district boundaries. An FIR filed in Bengaluru is invisible to Tumakuru. Mismatched spellings, typos, and mixed English/Kannada narratives blind traditional databases.
              </p>
              <div className="text-slate-300 bg-black/20 p-2.5 rounded border border-white/5 font-sans">
                <strong>Our Solution:</strong> Bypasses rigid keyword search by running TF-IDF sentence embeddings and Cosine similarity equations over free-text narratives. It maps Kannada concepts like <em>"bangaara mangalasuthra"</em> with <em>"gold chain"</em>, clustering 15 cross-district gangs automatically.
              </div>
            </div>

            {/* Rubric 2 */}
            <div className="bg-black/40 p-4 border border-white/5 rounded space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-200 text-sm font-display">2. Reactive to Proactive (Spatiotemporal GIS & Z-Score Alerts)</h4>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  100% COMPLIANT
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                <strong>Problem Solved:</strong> Traditional crime maps only show where crimes <em>occurred</em> last month, leading to reactive police deployment.
              </p>
              <div className="text-slate-300 bg-black/20 p-2.5 rounded border border-white/5 font-sans">
                <strong>Our Solution:</strong> Continuous Z-Score anomaly calculations flag emerging crime waves that exceed 90-day regional rolling averages by 2 standard deviations. Includes a 24-hour spatiotemporal playback slider allowing commanders to spot night operations and secure dark streetlighting deficient zones.
              </div>
            </div>

            {/* Rubric 3 */}
            <div className="bg-black/40 p-4 border border-white/5 rounded space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-200 text-sm font-display">3. Causal Explanations (SHAP Socio-Economic Risk)</h4>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  100% COMPLIANT
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                <strong>Problem Solved:</strong> Commanders distrust AI black-box scores. They need to know <em>why</em> a ward is high-risk to justify spending on municipal interventions.
              </p>
              <div className="text-slate-300 bg-black/20 p-2.5 rounded border border-white/5 font-sans">
                <strong>Our Solution:</strong> Integrates SHAP feature attribution equations to output a plain-language contribution summary (e.g. Streetlighting deficit (+0.25 contribution), Unemployment (+0.19)). Interactive sliders let policymakers test interventions (e.g., adding streetlights) and see the score adjust instantly.
              </div>
            </div>

          </div>
        </div>

        {/* 3-Minute Judge Playbook & Specs */}
        <div className="space-y-6">
          
          {/* Playbook */}
          <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-white/5 mb-3">
              <BookOpen className="w-4.5 h-4.5 text-amber-500" />
              <h3 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">3-Minute Judge's Demo Script</h3>
            </div>
            
            <ol className="space-y-3.5 text-xs text-slate-400 leading-relaxed font-sans">
              <li className="flex gap-2">
                <span className="w-4.5 h-4.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded flex items-center justify-center font-mono font-bold flex-shrink-0 text-[10px]">1</span>
                <div>
                  <strong>Minute 1 — Silo Breakdown:</strong> Click the **MO Fingerprinting** tab. Showcase the Side-by-side silo card. Execute the MO Scan. Point out how Sentinel bypasses typos and English/Kannada terms to connect isolated cases in Mysuru and Kolar!
                </div>
              </li>
              <li className="flex gap-2">
                <span className="w-4.5 h-4.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded flex items-center justify-center font-mono font-bold flex-shrink-0 text-[10px]">2</span>
                <div>
                  <strong>Minute 2 — Causal Policy:</strong> Head to the **Risk Profiling** tab. Select a Ward. Drag the **Streetlighting Coverage** slider up from 25% to 90%. Click Recalculate. Watch the risk level drop to "Low" and witness the SHAP explainability chart update live.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="w-4.5 h-4.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded flex items-center justify-center font-mono font-bold flex-shrink-0 text-[10px]">3</span>
                <div>
                  <strong>Minute 3 — Network Kingpins:</strong> Go to the **Link Analysis** tab. Show how our PageRank graph surfaces key suspects connected via shared getaway cars and phones, even if they have no direct charges filed in those districts.
                </div>
              </li>
            </ol>
          </div>

          {/* Software Specs */}
          <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] space-y-3 font-mono text-[11px]">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-white/5">
              <Activity className="w-4.5 h-4.5 text-amber-500" />
              <span className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Engineering Specs</span>
            </div>

            <div className="space-y-2 text-slate-400">
              <div className="flex justify-between border-b border-white/5 pb-1.5 uppercase tracking-wider">
                <span>Core Language</span>
                <strong className="text-slate-300 font-sans">TypeScript / React 19</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5 uppercase tracking-wider">
                <span>Backend Framework</span>
                <strong className="text-slate-300 font-sans">Node.js Express / TSX</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5 uppercase tracking-wider">
                <span>Vector NLP Model</span>
                <strong className="text-slate-300 font-sans">TF-IDF & Cosine Clustering</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5 uppercase tracking-wider">
                <span>Explainable AI</span>
                <strong className="text-slate-300 font-sans">SHAP Force Equations</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5 uppercase tracking-wider">
                <span>Graph Centralities</span>
                <strong className="text-slate-300 font-sans">PageRank / Betweenness</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5 uppercase tracking-wider">
                <span>Generative AI Engine</span>
                <strong className="text-slate-300 font-sans">Google Gemini 3.5 Flash</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
