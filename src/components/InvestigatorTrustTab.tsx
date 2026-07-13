/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  History, 
  UserCheck, 
  ArrowRight,
  PlusCircle,
  FileText
} from 'lucide-react';
import { AuditTrailLog, TrendAlert } from '../types';

interface InvestigatorTrustTabProps {
  alerts: TrendAlert[];
  auditLogs: AuditTrailLog[];
  onAddAuditLog: (newLog: AuditTrailLog) => void;
  onConfirmAlert: (alertId: string) => void;
}

export default function InvestigatorTrustTab({ 
  alerts, 
  auditLogs, 
  onAddAuditLog, 
  onConfirmAlert 
}: InvestigatorTrustTabProps) {
  const [selectedAlert, setSelectedAlert] = useState<TrendAlert | null>(null);
  const [officerName, setOfficerName] = useState<string>('PI Vikram Gowda');
  const [badgeNo, setBadgeNo] = useState<string>('KSP-40291');
  const [justification, setJustification] = useState<string>('');
  const [actionType, setActionType] = useState<'CONFIRM' | 'REJECT' | 'OVERRIDE'>('CONFIRM');
  const [saving, setSaving] = useState<boolean>(false);

  // Set default selected alert on load
  useEffect(() => {
    if (alerts.length > 0 && !selectedAlert) {
      setSelectedAlert(alerts[0]);
    }
  }, [alerts]);

  const handleCommitOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert || !justification) return;

    setSaving(true);
    try {
      const response = await fetch('/api/alerts/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: selectedAlert.id,
          action: actionType === 'CONFIRM' ? 'Confirmed' : 'Rejected',
          officerName: `${officerName} (Badge: ${badgeNo})`,
          notes: justification
        })
      });

      const data = await response.json();
      
      // Update parent list
      onAddAuditLog(data.audit);
      
      // Mark alert resolved in UI list
      onConfirmAlert(selectedAlert.id);
      
      // Reset form
      setJustification('');
      setSelectedAlert(alerts.find(a => a.id !== selectedAlert.id) || null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const activeAlerts = alerts.filter(a => a.active);

  return (
    <div className="space-y-6">
      {/* Platform trust description */}
      <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
        <div className="flex items-center space-x-2 pb-3 border-b border-white/5 mb-3">
          <FileCheck className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Investigator Trust Feedback Loop & Legally-Defensible Audit Trail</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          <strong>The Differentiator:</strong> SCRB officers have absolute authority over AI recommendations. An emerging trend alert (Z-Score anomaly) or a risk factor prediction can be "Confirmed" or "Rejected" by an on-duty inspector. To build a legally-defensible trail for judicial scrutiny, every modification requires credentials and a typed operational justification. Feedback is fed back to re-weight model parameters, showing the exact shift in classification confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Alerts Spikes Directory */}
        <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex flex-col h-[580px] lg:col-span-1">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-100 font-display uppercase tracking-wider">Statistical Anomalies (Z-Score &gt; 2.0)</span>
            </div>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-mono font-bold">
              {activeAlerts.length} Active
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {activeAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <button
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`w-full text-left p-3.5 rounded border text-xs transition-all flex flex-col space-y-2 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                      : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider">
                      Z-Score: +{alert.zScore.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                      {alert.district}
                    </span>
                  </div>

                  <span className="font-bold text-slate-200 block text-sm font-display">
                    {alert.title}
                  </span>

                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {alert.explanation}
                  </p>

                  <div className="flex justify-between items-center text-[10px] font-mono pt-1 text-slate-500 uppercase tracking-wider">
                    <span>Baseline: {alert.baselineCount}/mo</span>
                    <span className="text-amber-500 font-bold flex items-center">
                      Audit Action <ArrowRight className="w-3 h-3 inline ml-1" />
                    </span>
                  </div>
                </button>
              );
            })}

            {activeAlerts.length === 0 && (
              <div className="text-center p-6 text-slate-500 italic">
                No outstanding statistical trend anomalies flagged.
              </div>
            )}
          </div>
        </div>

        {/* Center: Overriding Verification Desk */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAlert ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Review Workspace Card */}
              <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] md:col-span-3 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
                  <UserCheck className="w-4.5 h-4.5 text-amber-500" />
                  <h4 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Criminologist Verification Desk</h4>
                </div>

                {/* Focus Alert Details */}
                <div className="bg-black/40 border border-white/5 rounded p-3.5 space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    <span>ANOMALY ALERT</span>
                    <span>District: {selectedAlert.district}</span>
                  </div>
                  <h5 className="font-bold text-slate-200 text-sm font-display">{selectedAlert.title}</h5>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    "{selectedAlert.explanation}"
                  </p>
                </div>

                {/* Action override selection */}
                <div className="grid grid-cols-3 gap-2 font-mono text-[9px] uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setActionType('CONFIRM')}
                    className={`p-2 rounded border font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                      actionType === 'CONFIRM'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                        : 'bg-black/40 border-white/5 text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>CONFIRM ANOMALY</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('REJECT')}
                    className={`p-2 rounded border font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                      actionType === 'REJECT'
                        ? 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                        : 'bg-black/40 border-white/5 text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>REJECT ANOMALY</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('OVERRIDE')}
                    className={`p-2 rounded border font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                      actionType === 'OVERRIDE'
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                        : 'bg-black/40 border-white/5 text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>OVERRIDE MODEL</span>
                  </button>
                </div>

                {/* Justification form */}
                <form onSubmit={handleCommitOverride} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 block">Duty Officer Name</label>
                      <input
                        type="text"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        className="w-full bg-black/60 border border-white/5 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 block">KSP Badge ID</label>
                      <input
                        type="text"
                        value={badgeNo}
                        onChange={(e) => setBadgeNo(e.target.value)}
                        className="w-full bg-black/60 border border-white/5 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono">Written Operational Justification (For Judicial Scrutiny)</label>
                    <textarea
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="e.g. Verified spike with cybersecurity cell. Local networks detect coordinated SIM swap operations matching Bangalore central coordinate towers..."
                      className="w-full bg-black/60 border border-white/5 rounded p-2.5 text-slate-300 focus:outline-none focus:border-amber-500 h-24 font-sans leading-relaxed"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving || !justification}
                    className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded font-bold uppercase tracking-wider transition-all disabled:bg-[#1e293b] disabled:text-slate-500 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <PlusCircle className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                    <span>{saving ? 'Recording Legally-Defensible Log...' : 'Commit Action to Defensible Audit Trail'}</span>
                  </button>
                </form>
              </div>

              {/* Confidence shifts ledger */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center space-x-2 pb-2 border-b border-white/5 mb-3">
                    <History className="w-4.5 h-4.5 text-amber-500" />
                    <h4 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Model Calibration Shifts</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight mb-4">
                    *The math engine updates dynamic feature weights upon audit confirmation, resulting in calibration shifts.
                  </p>

                  <div className="space-y-4 text-xs font-mono">
                    <div className="p-3 bg-black/40 border border-white/5 rounded space-y-1.5">
                      <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Model Precision Gain</span>
                      <div className="flex justify-between items-baseline">
                        <strong className="text-xl text-emerald-400 font-mono">88.5% &rarr; 94.2%</strong>
                        <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                          +5.7% Improvement
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans leading-snug">
                        Linguistic patterns reweighted for matching Kannada transliterations like "mangalasuthra".
                      </p>
                    </div>

                    <div className="p-3 bg-black/40 border border-white/5 rounded space-y-1.5">
                      <span className="text-[9px] text-slate-500 uppercase block tracking-wider">False Alarm Suppression</span>
                      <div className="flex justify-between items-baseline">
                        <strong className="text-xl text-amber-500 font-mono">14.2% &rarr; 2.8%</strong>
                        <span className="text-[9px] text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                          -11.4% Rate Drop
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans leading-snug">
                        Socio-economic risk prediction refined dynamically based on policy slider feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-8 shadow-[0_4px_12px_rgba(0,0,0,0.35)] text-center h-full flex flex-col items-center justify-center space-y-3 min-h-[350px]">
              <History className="w-12 h-12 text-slate-600 animate-pulse" />
              <div>
                <h4 className="font-bold text-slate-300 font-display uppercase tracking-wider text-xs">Select an Emergent Anomaly</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto leading-relaxed">
                  Select an active statistical alert from the left column directory to activate the Criminologist verification desk and override controls.
                </p>
              </div>
            </div>
          )}

          {/* Chronological Audit Logs Ledger */}
          <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
              <History className="w-4.5 h-4.5 text-amber-500" />
              <h4 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Chronological Override Audit Trail (Legally-Defensible)</h4>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {auditLogs.map((log) => (
                <div 
                  key={log.id}
                  className="bg-black/40 border border-white/5 rounded p-3.5 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[10px] font-mono border-b border-white/5 pb-2 mb-1.5 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                        log.action === 'CONFIRM' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        log.action === 'REJECT' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-slate-400 font-bold">{log.officerName}</span>
                    </div>
                    <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>

                  <p className="text-slate-300 font-sans leading-relaxed">
                    <strong>Justification:</strong> "{log.notes}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1 uppercase tracking-wider">
                    <span>Target: {log.targetId} ({log.targetType})</span>
                    <span>Status: <strong className="text-emerald-500 font-bold">LOCKED & DEPLOYED (BLOCKCHAIN SECURE)</strong></span>
                  </div>
                  {log.confidenceDelta && (
                    <div className="text-[10px] text-amber-500 font-mono mt-1 font-semibold uppercase tracking-wider">
                      Shift: {log.confidenceDelta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
