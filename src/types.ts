/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Basic Crime Types in Karnataka
export type CrimeType = 
  | 'Chain Snatching'
  | 'House Break-In (HBT)'
  | 'Vehicle Theft'
  | 'Robbery'
  | 'Cyber Fraud'
  | 'Assault'
  | 'Land Grab';

// Case Severity
export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

// Core First Information Report (FIR) interface
export interface FIRRecord {
  id: string;
  firNumber: string;
  date: string; // ISO format (2019-2024)
  district: string; // e.g., "Bengaluru City", "Mysuru City", "Hubballi-Dharwad"
  policeStation: string; // e.g., "Koramangala PS", "Vyalikaval PS"
  crimeType: CrimeType;
  narrative: string; // Free-text messy police description (mixed Kannadlish, typos)
  officerName: string; // Investigating officer
  suspectName: string; // Can be messy/different spellings or empty
  victimName: string;
  victimAge: number;
  victimGender: 'Male' | 'Female' | 'Other';
  phoneNo: string; // Phone number involved (crucial for linking)
  vehiclePlate: string; // Vehicle number involved (crucial for linking)
  latitude: number;
  longitude: number;
  status: 'Investigating' | 'Chargesheeted' | 'Closed' | 'Unresolved';
  moConfidenceScore?: number; // Calculated by MO clustering
  clusterId?: string; // Grouped cross-district crimes
}

// Criminal profile for repeat offenders
export interface CriminalProfile {
  id: string;
  name: string;
  aliases: string[];
  primaryCrimeType: CrimeType;
  moConsistencyScore: number; // 0-100% (assessed by similarity search)
  associatedCases: string[]; // List of FIR numbers
  centralityScore: number; // PageRank / Betweenness computed by graph engine
  betweennessScore: number;
  phoneNumbers: string[];
  vehicles: string[];
  status: 'Active' | 'Absconding' | 'In Custody';
  socioEconomicBackground?: string;
  lastKnownLocation: string;
}

// Socio-Economic Risk Indicators per Ward/Area
export interface AreaRiskIndicator {
  id: string;
  wardNumber: number;
  wardName: string;
  district: string;
  populationDensity: number; // people per sq km
  unemploymentProxy: number; // 0.0 - 1.0 (unemployment score)
  literacyRate: number; // percentage (e.g., 65 - 95%)
  liquorOutletDensity: number; // outlets per sq km
  streetlightCoverage: number; // percentage (e.g., 20 - 98%)
  migrantPopulationPct: number; // percentage
  predictedRiskScore: number; // 0.0 - 1.0
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  shapContributions: {
    unemployment: number;
    streetlightCoverage: number;
    liquorDensity: number;
    populationDensity: number;
    literacyRate: number;
    migrantPct: number;
  };
  explanation: string; // Automated plain-language CAUSAL text
}

// Graph Node and Edge definitions for Criminological Network
export interface NetworkNode {
  id: string;
  label: string;
  type: 'suspect' | 'victim' | 'phone' | 'vehicle' | 'location' | 'case';
  val?: number; // Size/Centrality weight
  details?: Record<string, string | number>;
  x?: number;
  y?: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label: string; // e.g. "USED_BY", "V_CALLS", "INVOLVED_IN"
  weight?: number;
}

// Graph Representation for the frontend Node-Graph
export interface CriminalNetwork {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

// Emerging Trend alerts triggered by rolling statistical deviations (z-scores)
export interface TrendAlert {
  id: string;
  title: string;
  district: string;
  policeStation: string;
  crimeType: CrimeType;
  currentCount: number; // Count in last 30 days
  baselineCount: number; // 90-day rolling baseline average
  zScore: number; // > 1.96 means statistically significant (95% confidence)
  active: boolean;
  timestamp: string;
  explanation: string;
  investigatorFeedback?: 'Confirmed' | 'Rejected' | 'Pending';
  reviewedBy?: string;
  reviewedAt?: string;
}

// Audit Log for feedback loops and decision tracking
export interface AuditTrailLog {
  id: string;
  timestamp: string;
  officerName: string;
  action: 'CONFIRM' | 'REJECT' | 'REVIEW';
  targetType: 'HOTSPOT_PREDICTION' | 'MO_CLUSTER' | 'NETWORK_KINGPIN';
  targetId: string;
  notes: string;
  confidenceDelta: string; // e.g., "Confidence updated from 72% to 91%"
}

// Criminological Intelligence Dashboard Statistics
export interface DashboardStats {
  totalFIRs: number;
  unresolvedCount: number;
  moClustersFound: number;
  repeatOffendersActive: number;
  criticalAlertCount: number;
  statewideCrimeRateTrend: { year: string; count: number }[];
}
