/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Network, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Car, 
  Info, 
  AlertTriangle, 
  Users, 
  Key, 
  CheckCircle2,
  TrendingUp,
  Sliders,
  Compass
} from 'lucide-react';
import { NetworkNode, NetworkEdge, CriminalProfile } from '../types';

interface NetworkLinkAnalysisTabProps {
  criminals: CriminalProfile[];
  onSelectCriminal: (criminalId: string) => void;
  selectedCriminalId: string | null;
}

export default function NetworkLinkAnalysisTab({ 
  criminals, 
  onSelectCriminal, 
  selectedCriminalId 
}: NetworkLinkAnalysisTabProps) {
  const [graphNodes, setGraphNodes] = useState<NetworkNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<NetworkEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [activeClusterId, setActiveClusterId] = useState<string>('cluster-temple-idols');
  const [kingpinsList, setKingpinsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch live network graph centralities from Express APIs
  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      try {
        const url = selectedCriminalId 
          ? `/api/network/graph?criminalId=${selectedCriminalId}`
          : `/api/network/graph?clusterId=${activeClusterId}`;
          
        const response = await fetch(url);
        const data = await response.json();
        setGraphNodes(data.nodes || []);
        setGraphEdges(data.edges || []);
        
        // Default select first node
        if (data.nodes && data.nodes.length > 0) {
          setSelectedNode(data.nodes[0]);
        }
      } catch (err) {
        console.error('Failed to load network graph:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [selectedCriminalId, activeClusterId]);

  // Fetch central kingpins
  useEffect(() => {
    const fetchKingpins = async () => {
      try {
        const res = await fetch('/api/network/kingpins');
        const data = await res.json();
        setKingpinsList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchKingpins();
  }, []);

  const handleSelectCriminal = (crimId: string) => {
    onSelectCriminal(crimId);
    setSelectedNode(null);
  };

  const getOffenderBadge = (status: string) => {
    switch (status) {
      case 'In Custody':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Absconding':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse';
      default:
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    }
  };

  const getNodeColorClass = (type: NetworkNode['type']) => {
    switch (type) {
      case 'suspect': return 'fill-rose-500 stroke-rose-300';
      case 'case': return 'fill-slate-700 stroke-slate-500';
      case 'phone': return 'fill-cyan-500 stroke-cyan-300';
      case 'vehicle': return 'fill-amber-500 stroke-amber-300';
      case 'location': return 'fill-indigo-500 stroke-indigo-300';
      default: return 'fill-slate-500 stroke-slate-400';
    }
  };

  const getNodeIcon = (type: NetworkNode['type']) => {
    switch (type) {
      case 'suspect': return <User className="w-4 h-4 text-rose-400" />;
      case 'phone': return <Phone className="w-4 h-4 text-cyan-400" />;
      case 'vehicle': return <Car className="w-4 h-4 text-amber-400" />;
      case 'location': return <MapPin className="w-4 h-4 text-indigo-400" />;
      case 'case': return <FileText className="w-4 h-4 text-slate-400" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
        <div className="flex items-center space-x-2 pb-3 border-b border-white/5 mb-3">
          <Network className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Criminological Link Analysis & Centrality Workshop</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          <strong>The Differentiator:</strong> Standard siloed police databases only link suspects to direct cases. By converting FIR metadata into a criminal network graph, Sentinel maps associations between <strong>Accused, Victims, Phone Numbers, and getaway Vehicles</strong> across different police districts. Dynamic PageRank & Betweenness Centrality algorithms run live on the graph nodes, mathematically identifying the most "influential" entity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Repeat Offenders Profile Registry */}
        <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex flex-col h-[600px] lg:col-span-1">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/5 mb-3">
            <Users className="w-4.5 h-4.5 text-amber-500" />
            <h4 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Offenders Database</h4>
          </div>
          
          <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {criminals.slice(0, 15).map((c) => {
              const isSelected = selectedCriminalId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCriminal(c.id)}
                  className={`w-full text-left p-3 rounded border text-xs transition-all flex flex-col space-y-2 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                      : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-200 text-sm flex items-center gap-1 font-display">
                      <User className="w-3.5 h-3.5 text-rose-400" />
                      {c.name}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${getOffenderBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>MO Consistency: <strong className="text-amber-500">{c.moConsistencyScore}%</strong></span>
                    <span>{c.associatedCases.length} Silos Linked</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Live Interactive Vector Graph */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex flex-col flex-1 h-[420px] relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3 z-10">
              <div className="flex items-center space-x-2">
                <Compass className="w-4.5 h-4.5 text-amber-500" />
                <h4 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Relational Graph Visualizer</h4>
              </div>
              <div className="flex items-center gap-2">
                {selectedCriminalId ? (
                  <button
                    onClick={() => {
                      onSelectCriminal(null);
                      setActiveClusterId('cluster-temple-idols');
                    }}
                    className="text-[9px] bg-black/60 border border-white/5 hover:border-white/10 text-slate-400 px-2.5 py-1 rounded font-mono uppercase tracking-wider"
                  >
                    Reset Filter
                  </button>
                ) : (
                  <select
                    value={activeClusterId}
                    onChange={(e) => {
                      onSelectCriminal(null);
                      setActiveClusterId(e.target.value);
                    }}
                    className="bg-black/60 border border-white/5 rounded px-2 py-1 text-[10px] text-slate-300 font-mono focus:outline-none focus:border-amber-500 uppercase tracking-wider"
                  >
                    <option value="cluster-temple-idols">Temple Idol Theft Network</option>
                    <option value="cluster-chain-pulsar">Gold Snatch Pulsar Network</option>
                    <option value="cluster-senior-pension">Senior Citizen Pension Fraud Network</option>
                    <option value="cluster-chalk-mark-hbt">Chalk Burglary Network</option>
                  </select>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              </div>
            ) : (
              <div className="flex-1 relative w-full h-full bg-black/60 rounded border border-white/5 flex items-center justify-center">
                
                {/* SVG Vector Nodes and Edges Graph Stage */}
                <svg viewBox="0 0 500 350" className="w-full h-full">
                  {/* Drawing edges */}
                  {graphEdges.map((edge) => {
                    // Match positions based on node index
                    const sourceNodeIdx = graphNodes.findIndex(n => n.id === edge.source);
                    const targetNodeIdx = graphNodes.findIndex(n => n.id === edge.target);

                    if (sourceNodeIdx === -1 || targetNodeIdx === -1) return null;

                    // Compute node locations distributed procedurally
                    const numNodes = graphNodes.length;
                    const getPos = (idx: number) => {
                      const angle = (idx * 2 * Math.PI) / numNodes;
                      // Place central suspect closer to center
                      const isSuspect = graphNodes[idx].type === 'suspect';
                      const radius = isSuspect ? 50 : 120;
                      return {
                        x: 250 + Math.cos(angle) * radius,
                        y: 175 + Math.sin(angle) * radius
                      };
                    };

                    const sPos = getPos(sourceNodeIdx);
                    const tPos = getPos(targetNodeIdx);

                    return (
                      <g key={edge.id}>
                        <line
                          x1={sPos.x}
                          y1={sPos.y}
                          x2={tPos.x}
                          y2={tPos.y}
                          stroke="#1e293b"
                          strokeWidth="1.5"
                          className="hover:stroke-amber-500/60 transition-colors"
                        />
                        <title>{edge.label}</title>
                      </g>
                    );
                  })}

                  {/* Drawing nodes */}
                  {graphNodes.map((node, idx) => {
                    const numNodes = graphNodes.length;
                    const angle = (idx * 2 * Math.PI) / numNodes;
                    const isSuspect = node.type === 'suspect';
                    const radius = isSuspect ? 50 : 120;
                    const nx = 250 + Math.cos(angle) * radius;
                    const ny = 175 + Math.sin(angle) * radius;

                    // Sizing node based on PageRank weight (val)
                    const nodeRadius = node.val ? node.val / 2 : 12;
                    const isSelected = selectedNode?.id === node.id;

                    return (
                      <g 
                        key={node.id} 
                        className="cursor-pointer"
                        onClick={() => setSelectedNode(node)}
                      >
                        <circle
                          cx={nx}
                          cy={ny}
                          r={isSelected ? nodeRadius * 1.3 : nodeRadius}
                          className={`${getNodeColorClass(node.type)} stroke-2 transition-all hover:r-1.2`}
                        />
                        {/* Shorthand text inside */}
                        <text
                          x={nx}
                          y={ny + 3}
                          textAnchor="middle"
                          className="text-[6px] fill-slate-950 font-bold select-none font-mono"
                        >
                          {node.label.slice(0, 3).toUpperCase()}
                        </text>
                        <title>{node.label} ({node.type})</title>
                      </g>
                    );
                  })}
                </svg>

                {/* Micro instruction bottom overlay */}
                <div className="absolute bottom-3 left-3 text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                  *Nodes sized by live PageRank influence score. Click nodes to inspect links.
                </div>
              </div>
            )}
          </div>

          {/* Node Metadata Detail Card */}
          {selectedNode && (
            <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-4 shadow-md flex items-start gap-4">
              <div className="p-3 bg-black/60 rounded border border-white/5">
                {getNodeIcon(selectedNode.type)}
              </div>
              <div className="flex-1 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-100 text-sm font-display">{selectedNode.label}</span>
                  <span className="text-[9px] font-mono font-bold text-slate-400 capitalize bg-black/60 border border-white/5 px-2.5 py-0.5 rounded-full">
                    {selectedNode.type} Node
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[10px] text-slate-400 pt-1.5">
                  {Object.entries(selectedNode.details || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-white/5 pb-1 uppercase tracking-wider">
                      <span className="text-slate-500">{key}:</span>
                      <strong className="text-slate-300">{val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Central Kingpin Detector Panel */}
        <div className="bg-[#0A0F18]/80 border border-white/5 rounded-lg p-5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] lg:col-span-1 space-y-4 h-[600px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
            <Key className="w-4.5 h-4.5 text-amber-500" />
            <h4 className="font-bold text-slate-100 font-display text-xs uppercase tracking-wider">Central Kingpins (PageRank)</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            *PageRank Centrality surfaces individuals connected to multiple cellular towers and getaway assets across different jurisdictions who have zero direct FIR claims filed against them in other districts!
          </p>

          <div className="space-y-3">
            {kingpinsList.map((kp) => (
              <div 
                key={kp.id}
                className="bg-black/40 border border-white/5 rounded p-3.5 space-y-2.5 relative"
              >
                {/* Visual badge indicator */}
                <div className="absolute top-3 right-3 flex items-center space-x-1 font-mono text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Rank: #1</span>
                </div>

                <div className="leading-tight">
                  <span className="text-[10px] text-amber-500 font-bold block uppercase font-mono tracking-wider">Kingpin Identified</span>
                  <h5 className="font-bold text-slate-200 text-sm font-display mt-0.5">{kp.name}</h5>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  <strong>How connected:</strong> {kp.reason}
                </p>

                <div className="bg-black/40 p-2 border border-white/5 rounded text-[10px] font-mono text-slate-500 space-y-1">
                  <span>Target Syndicates: <strong className="text-slate-300 font-sans">{kp.crimeType}</strong></span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {kp.connectedSuspects.map((susp: string, i: number) => (
                      <span key={i} className="bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-slate-400 border border-white/5">
                        {susp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
