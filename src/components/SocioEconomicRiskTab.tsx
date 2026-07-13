/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Sun, 
  ShoppingBag, 
  Users, 
  GraduationCap, 
  Map, 
  Activity, 
  Sliders, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';
import { AreaRiskIndicator } from '../types';

interface SocioEconomicRiskTabProps {
  wards: AreaRiskIndicator[];
  onUpdateWards: (updatedWards: AreaRiskIndicator[]) => void;
}

export default function SocioEconomicRiskTab({ wards, onUpdateWards }: SocioEconomicRiskTabProps) {
  const [selectedWard, setSelectedWard] = useState<AreaRiskIndicator | null>(null);
  const [districtFilter, setDistrictFilter] = useState<string>('Bengaluru City');
  
  // Local slider states for dynamic modeling
  const [density, setDensity] = useState<number>(5000);
  const [unemployment, setUnemployment] = useState<number>(0.4);
  const [literacy, setLiteracy] = useState<number>(75);
  const [liquor, setLiquor] = useState<number>(3.0);
  const [streetlight, setStreetlight] = useState<number>(70);
  const [migrant, setMigrant] = useState<number>(20);
  const [saving, setSaving] = useState<boolean>(false);

  // Sync sliders when selected ward changes
  useEffect(() => {
    if (selectedWard) {
      setDensity(selectedWard.populationDensity);
      setUnemployment(selectedWard.unemploymentProxy);
      setLiteracy(selectedWard.literacyRate);
      setLiquor(selectedWard.liquorOutletDensity);
      setStreetlight(selectedWard.streetlightCoverage);
      setMigrant(selectedWard.migrantPopulationPct);
    }
  }, [selectedWard]);

  // Set default ward on load
  useEffect(() => {
    const filtered = wards.filter(w => w.district === districtFilter);
    if (filtered.length > 0 && !selectedWard) {
      setSelectedWard(filtered[0]);
    }
  }, [wards, districtFilter]);

  // API Call to recalculate on the server (Differentiator 2)
  const handleRecalculateRisk = async () => {
    if (!selectedWard) return;
    setSaving(true);
    try {
      const response = await fetch('/api/wards/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedWard.id,
          populationDensity: density,
          unemploymentProxy: parseFloat(unemployment.toFixed(2)),
          literacyRate: literacy,
          liquorOutletDensity: parseFloat(liquor.toFixed(1)),
          streetlightCoverage: streetlight,
          migrantPopulationPct: migrant
        })
      });
      const updatedNode = await response.json();
      
      // Update in local parent state
      const updatedWardsList = wards.map(w => w.id === updatedNode.id ? updatedNode : w);
      onUpdateWards(updatedWardsList);
      setSelectedWard(updatedNode);
    } catch (err) {
      console.error('Failed to recalculate risk:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredWards = wards.filter(w => w.district === districtFilter);

  // Helper to determine badge color
  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse';
      case 'High':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Intro */}
      <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
        <div className="flex items-center space-x-2 pb-3 border-b border-white/5 mb-3">
          <Activity className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Explainable Socio-Economic Risk Profiling Engine</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          <strong>How it works:</strong> Sentinel does not run "black box" prediction. We fuse case rates with synthetic ward-level socio-economic indicators. Using an interpretable regression/forest modeling process, we compute <strong>SHAP Values (feature attribution)</strong> that quantify exactly how much each localized municipal indicator pushes crime risk up or down from the Karnataka state average baseline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ward Selector */}
        <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] lg:col-span-1 flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Wards Registry</span>
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setSelectedWard(null); // trigger reset
              }}
              className="bg-black/60 border border-white/5 rounded px-2.5 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-500 uppercase tracking-wider"
            >
              <option value="Bengaluru City">Bengaluru City</option>
              <option value="Mysuru City">Mysuru City</option>
              <option value="Mangaluru City">Mangaluru City</option>
              <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
              <option value="Kalaburagi">Kalaburagi</option>
            </select>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {filteredWards.map((w) => {
              const isSelected = selectedWard?.id === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWard(w)}
                  className={`w-full text-left p-3 rounded border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                      : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-200 block font-display">
                      {w.wardName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Pop: {w.populationDensity.toLocaleString()}/km²
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono uppercase tracking-wider ${getRiskBadgeClass(w.riskLevel)}`}>
                      {w.riskLevel}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Risk: {(w.predictedRiskScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Dynamic SHAP Simulation Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {selectedWard ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Sliders Panel */}
              <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
                  <Sliders className="w-4.5 h-4.5 text-amber-500" />
                  <h4 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Policy Intervention Panel</h4>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  *Simulate municipal interventions. Slide to adjust indicators and click Recalculate to retrain the SHAP regression model live.
                </p>

                {/* Slider: Streetlighting */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" /> Streetlighting Coverage
                    </span>
                    <span className="text-slate-200 font-bold">{streetlight}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="98"
                    value={streetlight}
                    onChange={(e) => setStreetlight(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-black/40 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Slider: Unemployment */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-rose-400" /> Unemployment Stress Index
                    </span>
                    <span className="text-slate-200 font-bold">{(unemployment * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.05"
                    value={unemployment}
                    onChange={(e) => setUnemployment(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black/40 rounded appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                {/* Slider: Liquor Outlets */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-500" /> Retail Liquor Outlets
                    </span>
                    <span className="text-slate-200 font-bold">{liquor}/km²</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={liquor}
                    onChange={(e) => setLiquor(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black/40 rounded appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                {/* Slider: Population Density */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-500" /> Population Density
                    </span>
                    <span className="text-slate-200 font-bold">{density.toLocaleString()}/km²</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="16000"
                    step="500"
                    value={density}
                    onChange={(e) => setDensity(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-black/40 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Slider: Literacy Rate */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Literacy Rate
                    </span>
                    <span className="text-slate-200 font-bold">{literacy}%</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="99"
                    value={literacy}
                    onChange={(e) => setLiteracy(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-black/40 rounded appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Slider: Migrant % */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Map className="w-3.5 h-3.5 text-cyan-400" /> Migrant Population
                    </span>
                    <span className="text-slate-200 font-bold">{migrant}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="70"
                    value={migrant}
                    onChange={(e) => setMigrant(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-black/40 rounded appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <button
                  onClick={handleRecalculateRisk}
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black py-2.5 rounded text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:bg-white/5 disabled:text-slate-500"
                >
                  <Activity className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                  <span>{saving ? 'Retraining Causal Model...' : 'Trigger SHAP Recalculation'}</span>
                </button>
              </div>

              {/* SHAP Output Panel */}
              <div className="space-y-4">
                {/* Explainability Bar Chart (SHAP Force Plot) */}
                <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center space-x-2 pb-2 border-b border-white/5 mb-3">
                    <Info className="w-4.5 h-4.5 text-amber-500" />
                    <h4 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">SHAP Feature Attribution Plot</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight mb-4">
                    *Quantifying the mathematical contribution (positive pushes crime risk up, negative suppresses it) from State Base Rates.
                  </p>

                  <div className="space-y-3.5 font-mono text-[10px]">
                    {/* Unemployment SHAP */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Unemployment Rate Contribution</span>
                        <span className={selectedWard.shapContributions.unemployment >= 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {selectedWard.shapContributions.unemployment >= 0 ? '+' : ''}{selectedWard.shapContributions.unemployment.toFixed(3)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/60 rounded-full border border-white/5 overflow-hidden flex">
                        <div className="w-1/2 flex justify-end">
                          {selectedWard.shapContributions.unemployment < 0 && (
                            <div 
                              className="bg-emerald-500 h-full rounded-l" 
                              style={{ width: `${Math.min(Math.abs(selectedWard.shapContributions.unemployment) * 200, 100)}%` }}
                            ></div>
                          )}
                        </div>
                        <div className="w-1/2 flex justify-start">
                          {selectedWard.shapContributions.unemployment >= 0 && (
                            <div 
                              className="bg-rose-500 h-full rounded-r" 
                              style={{ width: `${Math.min(selectedWard.shapContributions.unemployment * 200, 100)}%` }}
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Streetlighting SHAP */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Streetlight Deficit Contribution</span>
                        <span className={selectedWard.shapContributions.streetlightCoverage >= 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {selectedWard.shapContributions.streetlightCoverage >= 0 ? '+' : ''}{selectedWard.shapContributions.streetlightCoverage.toFixed(3)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/60 rounded-full border border-white/5 overflow-hidden flex">
                        <div className="w-1/2 flex justify-end">
                          {selectedWard.shapContributions.streetlightCoverage < 0 && (
                            <div 
                              className="bg-emerald-500 h-full rounded-l" 
                              style={{ width: `${Math.min(Math.abs(selectedWard.shapContributions.streetlightCoverage) * 200, 100)}%` }}
                            ></div>
                          )}
                        </div>
                        <div className="w-1/2 flex justify-start">
                          {selectedWard.shapContributions.streetlightCoverage >= 0 && (
                            <div 
                              className="bg-rose-500 h-full rounded-r" 
                              style={{ width: `${Math.min(selectedWard.shapContributions.streetlightCoverage * 200, 100)}%` }}
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Liquor Density SHAP */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Liquor Outlet Density Contribution</span>
                        <span className={selectedWard.shapContributions.liquorDensity >= 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {selectedWard.shapContributions.liquorDensity >= 0 ? '+' : ''}{selectedWard.shapContributions.liquorDensity.toFixed(3)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/60 rounded-full border border-white/5 overflow-hidden flex">
                        <div className="w-1/2 flex justify-end">
                          {selectedWard.shapContributions.liquorDensity < 0 && (
                            <div 
                              className="bg-emerald-500 h-full rounded-l" 
                              style={{ width: `${Math.min(Math.abs(selectedWard.shapContributions.liquorDensity) * 200, 100)}%` }}
                            ></div>
                          )}
                        </div>
                        <div className="w-1/2 flex justify-start">
                          {selectedWard.shapContributions.liquorDensity >= 0 && (
                            <div 
                              className="bg-rose-500 h-full rounded-r" 
                              style={{ width: `${Math.min(selectedWard.shapContributions.liquorDensity * 200, 100)}%` }}
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Population Density SHAP */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Demographic Load Contribution</span>
                        <span className={selectedWard.shapContributions.populationDensity >= 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {selectedWard.shapContributions.populationDensity >= 0 ? '+' : ''}{selectedWard.shapContributions.populationDensity.toFixed(3)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/60 rounded-full border border-white/5 overflow-hidden flex">
                        <div className="w-1/2 flex justify-end">
                          {selectedWard.shapContributions.populationDensity < 0 && (
                            <div 
                              className="bg-emerald-500 h-full rounded-l" 
                              style={{ width: `${Math.min(Math.abs(selectedWard.shapContributions.populationDensity) * 200, 100)}%` }}
                            ></div>
                          )}
                        </div>
                        <div className="w-1/2 flex justify-start">
                          {selectedWard.shapContributions.populationDensity >= 0 && (
                            <div 
                              className="bg-rose-500 h-full rounded-r" 
                              style={{ width: `${Math.min(selectedWard.shapContributions.populationDensity * 200, 100)}%` }}
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plain-Language Causal Explanation Block */}
                <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] relative overflow-hidden">
                  <div className="flex items-center space-x-2 pb-2 border-b border-white/5 mb-3">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
                    <h4 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Causal Explanatory Summary</h4>
                  </div>
                  
                  <div className="bg-black/60 border border-white/5 rounded p-3.5 text-xs text-slate-300 leading-relaxed font-sans shadow-inner">
                    <span className="text-[9px] font-bold text-amber-500 font-mono uppercase block mb-1 tracking-wider">
                      AI Diagnostic Causal Log:
                    </span>
                    "{selectedWard.explanation}"
                  </div>

                  <div className="mt-3.5 flex items-center justify-between font-mono text-[10px]">
                    <span className="text-slate-500">Predicted Risk:</span>
                    <strong className={`px-2 py-0.5 rounded font-display text-[9px] uppercase border tracking-wider ${
                      selectedWard.riskLevel === 'Critical' ? 'bg-rose-500/15 text-rose-400 border-rose-500/25' :
                      selectedWard.riskLevel === 'High' ? 'bg-orange-500/15 text-orange-400 border-orange-500/25' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                    }`}>
                      {selectedWard.riskLevel} ({(selectedWard.predictedRiskScore * 100).toFixed(0)}%)
                    </strong>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-8 shadow-lg text-center h-full flex flex-col items-center justify-center space-y-3 min-h-[350px]">
              <Info className="w-12 h-12 text-slate-600 animate-pulse" />
              <div>
                <h4 className="font-bold text-slate-300 font-display text-xs uppercase tracking-wider">Select a Municipal Ward</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto leading-relaxed">
                  Select a ward zone from the registry directory on the left to activate the dynamic policy parameter adjustment workshop and see real-time SHAP attributions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
