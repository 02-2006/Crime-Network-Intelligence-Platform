/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FIRRecord, CriminalProfile, AreaRiskIndicator, CrimeType } from './types';

// Helper to generate random date between two dates
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

// Helper to pick random item from array
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Seeded random number generator for reproducibility
class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

const DISTRICTS_STATIONS: Record<string, string[]> = {
  'Bengaluru City': ['Koramangala PS', 'Indiranagar PS', 'Jayanagar PS', 'Whitefield PS', 'Malleshwaram PS', 'HSR Layout PS', 'Yelahanka PS', 'Vyalikaval PS', 'Kamashipalya PS', 'Kalyan Nagar PS'],
  'Mysuru City': ['Lashkar PS', 'Devaraja PS', 'KRS Road PS', 'Vidyaranyapuram PS', 'Vijayanagar PS', 'Jayalakshmipuram PS'],
  'Mangaluru City': ['Kadir PS', 'Urwa PS', 'Pandeshwar PS', 'Ullal PS', 'Bunder PS'],
  'Hubballi-Dharwad': ['Gokul Road PS', 'Suburban PS', 'Town PS Dharwad', 'Vidyagiri PS'],
  'Belagavi': ['Khade PS', 'Market PS', 'Udyambag PS', 'Camp PS'],
  'Kalaburagi': ['Chowk PS', 'Station Bazar PS', 'Raghavendra Nagar PS'],
  'Shivamogga': ['Kote PS', 'Tunga Nagar PS', 'Doddapete PS'],
  'Tumakuru': ['Town PS Tumakuru', 'Kyathasandra PS', 'New Extension PS'],
  'Udupi': ['Town PS Udupi', 'Manipal PS', 'Malpe PS'],
  'Kolar': ['Town PS Kolar', 'Galgali PS', 'KGF Oorgaum PS']
};

const KAN_FIRST_NAMES = ['Karthik', 'Suresh', 'Manjunath', 'Anand', 'Vijay', 'Shiva', 'Pradeep', 'Ramesh', 'Satish', 'Nagaraj', 'Kumar', 'Ganesh', 'Raghu', 'Vinay', 'Chethan', 'Sandeep', 'Harish', 'Abhishek', 'Rajesh', 'Murthy', 'Kiran', 'Lokesh', 'Basavaraj', 'Mallesh', 'Ningappa', 'Chandru', 'Siddappa', 'Yallappa', 'Prasanna', 'Darshan'];
const KAN_LAST_NAMES = ['Gowda', 'Nayak', 'Shetty', 'Pujari', 'Patil', 'Hegde', 'Chavan', 'Rao', 'Reddy', 'Acharya', 'Madhav', 'Kulkarni', 'Desai', 'Banakar', 'Hiremath', 'Kuruba', 'Bovi', 'Vokkaliga', 'Swamy', 'Prasad'];

const VICTIM_FIRST_NAMES = ['Priyanka', 'Sumitra', 'Lakshmi', 'Rupa', 'Aishwarya', 'Geetha', 'Savitha', 'Kavitha', 'Shalini', 'Nandini', 'Divya', 'Deepa', 'Radha', 'Meenakshi', 'Bharathi', 'Anupama', 'Swathi', 'Sushma', 'Girish', 'Guru', 'Amrutha', 'Srinivas', 'Subraya', 'Dinesh', 'Venkatesh', 'Bhaskar', 'Raghavendra', 'Manoj'];

const CRIME_TYPES: CrimeType[] = ['Chain Snatching', 'House Break-In (HBT)', 'Vehicle Theft', 'Robbery', 'Cyber Fraud', 'Assault', 'Land Grab'];

const STREETS = ['Mahatma Gandhi Road', 'Brigade Road', 'Double Road', 'Ring Road', 'Valmiki Road', 'Lalbagh Road', 'Bannerghatta Road', 'Kanakapura Road', 'Devi Temple Street', 'KRS Road', 'Main Bazar', 'Station Road', 'NH-48 Highway', 'Koramangala 8th Block', 'Jayanagar 4th T Block', 'Gokul Extension'];

const OFFICERS = [
  'PI G. B. Patil', 'PSI Raghavendra M.', 'PI Suresh Kumar Swamy', 'DySP Chandrashekar Gowda',
  'PSI Mallikarjuna', 'PI Anantha Murthy', 'PSI Nagaraj Rao', 'PI Vinayaka Chavan',
  'PSI Basavaraj Hiremath', 'PI Lokesha K.N.', 'PSI Sandeep Pujar', 'PI Girisha S.'
];

// Messy Typo variations of suspect names to simulate silos
const SUSPECT_VARIATIONS: Record<string, string[]> = {
  'Karthik Gowda': ['Karthik Gowda', 'Kartik G', 'Karthikeyan Gowda', 'Karthik Gowda @ Kalla Kartik', 'Karthik G.'],
  'Manjunatha Pujari': ['Manju Pujari', 'Manjunatha Pujari', 'Manja Pujari', 'Manjunath P', 'M. Pujari'],
  'Basavaraj Patil': ['Basavaraj Patil', 'Basu Patil', 'B. R. Patil', 'Basavaraju Patil', 'Basappa Patil'],
  'Lokesh Shetty': ['Lokesh Shetty', 'Loke Shetty', 'Lokesha Shetty', 'Shetty Lokesh', 'L. Shetty @ Bullet Lokesha'],
  'Sandeep Kulkarni': ['Sandeep Kulkarni', 'Sandip Kulkarni', 'Sandeep K.', 'S. Kulkarni', 'Sandeepa Kulkarni']
};

export function generateSocioEconomicIndicators(): AreaRiskIndicator[] {
  const list: AreaRiskIndicator[] = [];
  let wardId = 1;
  const rand = new SeededRandom(555);

  Object.keys(DISTRICTS_STATIONS).forEach((district) => {
    const numWards = district === 'Bengaluru City' ? 30 : 10;
    for (let w = 1; w <= numWards; w++) {
      const density = Math.floor(1000 + rand.next() * 15000);
      const unemployment = parseFloat((0.1 + rand.next() * 0.7).toFixed(2));
      const literacy = Math.floor(55 + rand.next() * 40);
      const liquorDensity = parseFloat((rand.next() * 8).toFixed(1));
      const streetlight = Math.floor(15 + rand.next() * 80);
      const migrantPct = Math.floor(5 + rand.next() * 60);

      // Simple pseudo-regressor model (XGBoost/RandomForest simulation)
      // High unemployment, high liquor, low streetlight, high density increases crime risk score
      const baseRisk = (unemployment * 0.35) + 
                       ((100 - streetlight) / 100 * 0.25) + 
                       (liquorDensity / 8 * 0.15) + 
                       (density / 16000 * 0.15) + 
                       ((100 - literacy) / 100 * 0.10);

      const riskScore = Math.min(Math.max(parseFloat(baseRisk.toFixed(2)), 0.05), 0.98);
      let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
      if (riskScore > 0.8) riskLevel = 'Critical';
      else if (riskScore > 0.6) riskLevel = 'High';
      else if (riskScore > 0.35) riskLevel = 'Medium';

      // SHAP contributions (feature attribution)
      const shapUnemployment = parseFloat((unemployment * 0.35 - 0.15).toFixed(2));
      const shapStreetlight = parseFloat((((100 - streetlight) / 100) * 0.25 - 0.10).toFixed(2));
      const shapLiquor = parseFloat((liquorDensity / 8 * 0.15 - 0.05).toFixed(2));
      const shapDensity = parseFloat((density / 16000 * 0.15 - 0.05).toFixed(2));
      const shapLiteracy = parseFloat((((100 - literacy) / 100) * 0.10 - 0.03).toFixed(2));
      const shapMigrant = parseFloat((migrantPct / 100 * 0.05 - 0.02).toFixed(2));

      // Automated plain-language causal explanation
      const factors: string[] = [];
      if (unemployment > 0.5) factors.push(`high unemployment index (+${shapUnemployment.toFixed(2)} contribution)`);
      if (streetlight < 40) factors.push(`extremely low streetlight coverage (+${shapStreetlight.toFixed(2)})`);
      if (liquorDensity > 4) factors.push(`elevated liquor outlet density (+${shapLiquor.toFixed(2)})`);
      if (density > 10000) factors.push(`high urban population density (+${shapDensity.toFixed(2)})`);
      
      const explanation = factors.length > 0 
        ? `${district} Ward ${w} flagged ${riskLevel.toUpperCase()} RISK driven by: ${factors.join(', ')}.`
        : `${district} Ward ${w} reports normal socio-economic baseline with balanced municipal coverage. Low predicted risk.`;

      list.push({
        id: `ward-${district.replace(/\s+/g, '-')}-${w}`,
        wardNumber: w,
        wardName: `Ward ${w} - ${district.split(' ')[0]}`,
        district,
        populationDensity: density,
        unemploymentProxy: unemployment,
        literacyRate: literacy,
        liquorOutletDensity: liquorDensity,
        streetlightCoverage: streetlight,
        migrantPopulationPct: migrantPct,
        predictedRiskScore: riskScore,
        riskLevel,
        shapContributions: {
          unemployment: shapUnemployment,
          streetlightCoverage: shapStreetlight,
          liquorDensity: shapLiquor,
          populationDensity: shapDensity,
          literacyRate: shapLiteracy,
          migrantPct: shapMigrant
        },
        explanation
      });
      wardId++;
    }
  });

  return list;
}

// 15 MO-Linked Case Clusters to seed (Winning Differentiator 1)
export interface SeededCluster {
  id: string;
  crimeType: CrimeType;
  primaryNarrativeFeatures: string[];
  districtDistribution: string[];
  suspectName: string;
  phoneNo: string;
  vehiclePlate: string;
}

export const SEEDED_CLUSTERS: SeededCluster[] = [
  {
    id: 'cluster-temple-idols',
    crimeType: 'House Break-In (HBT)',
    primaryNarrativeFeatures: ['devi vigraha', 'lock of temple broken', 'garbhagriha door broken using crowbar', 'took panchadhatu idols', 'happened at midnight hours', 'bhadrakali gudi'],
    districtDistribution: ['Mysuru City', 'Kolar', 'Tumakuru', 'Shivamogga'],
    suspectName: 'Basavaraj Patil',
    phoneNo: '9845012345',
    vehiclePlate: 'KA-09-EA-3341'
  },
  {
    id: 'cluster-chain-pulsar',
    crimeType: 'Chain Snatching',
    primaryNarrativeFeatures: ['black pulsar bike', 'rider wearing yellow helmet', 'snatched mangalya chain', 'victim fell down on platform', 'ran towards ring road', 'unidentified co-rider'],
    districtDistribution: ['Bengaluru City', 'Tumakuru', 'Kolar'],
    suspectName: 'Karthik Gowda',
    phoneNo: '9900881122',
    vehiclePlate: 'KA-04-H-8822'
  },
  {
    id: 'cluster-senior-pension',
    crimeType: 'Cyber Fraud',
    primaryNarrativeFeatures: ['pension fund activation scam', 'caller speaking sweet Kannada', 'treasury officer drama', 'sent apk on WhatsApp', 'deducted 2 lakhs from SBI account', 'OTP shared by senior citizen'],
    districtDistribution: ['Bengaluru City', 'Hubballi-Dharwad', 'Mangaluru City'],
    suspectName: 'Sandeep Kulkarni',
    phoneNo: '8877665544',
    vehiclePlate: 'MH-12-PQ-9999'
  },
  {
    id: 'cluster-chalk-mark-hbt',
    crimeType: 'House Break-In (HBT)',
    primaryNarrativeFeatures: ['chalk mark on gate compound', 'piled up newspaper outside', 'family gone to native place', 'rear door latches cut using hydraulic cutter', 'only gold jewelry stolen', 'wardrobe ransacked'],
    districtDistribution: ['Bengaluru City', 'Mysuru City', 'Belagavi', 'Udupi'],
    suspectName: 'Manjunatha Pujari',
    phoneNo: '9448099881',
    vehiclePlate: 'KA-20-M-4421'
  },
  {
    id: 'cluster-land-grab-fake-doc',
    crimeType: 'Land Grab',
    primaryNarrativeFeatures: ['forged khata document', 'revenue stamp of 1995 falsified', 'vacant site belonging to NRI', 'threatened with goons', 'fabricated gift deed registered at sub-registrar office', 'illegal fence erected'],
    districtDistribution: ['Bengaluru City', 'Mysuru City', 'Tumakuru'],
    suspectName: 'Lokesh Shetty',
    phoneNo: '9111222333',
    vehiclePlate: 'KA-51-S-7722'
  },
  {
    id: 'cluster-night-highway-dacoity',
    crimeType: 'Robbery',
    primaryNarrativeFeatures: ['scattered nails on highway', 'puncture vehicle stop', 'iron rod threat', 'snatched wallets and cash from truck driver', 'escaped into forest road', 'face covered with black cloth'],
    districtDistribution: ['Kolar', 'Tumakuru', 'Belagavi'],
    suspectName: 'Ningappa @ Kariya',
    phoneNo: '9880123999',
    vehiclePlate: 'KA-13-T-4512'
  },
  {
    id: 'cluster-delivery-boy-recon',
    crimeType: 'House Break-In (HBT)',
    primaryNarrativeFeatures: ['recon as e-commerce delivery boy', 'asking for non-existent names', 'checking if lock is present', 'side window broken using hammer', 'stole laptops and camera gear'],
    districtDistribution: ['Bengaluru City', 'Mangaluru City', 'Udupi'],
    suspectName: 'Harish @ Parcel Harisha',
    phoneNo: '9008123456',
    vehiclePlate: 'KA-19-JK-5452'
  },
  {
    id: 'cluster-atm-card-swap',
    crimeType: 'Cyber Fraud',
    primaryNarrativeFeatures: ['stood inside ATM booth on pretense of helping', 'swapped original SBI card with dummy card', 'saw PIN over shoulder', 'withdrew maximum limit of 40000', 'victim is village farmer'],
    districtDistribution: ['Shivamogga', 'Kalaburagi', 'Belagavi'],
    suspectName: 'Ramesh @ ATM Raama',
    phoneNo: '9444555666',
    vehiclePlate: 'KA-14-Y-8877'
  },
  {
    id: 'cluster-construction-iron-theft',
    crimeType: 'Vehicle Theft',
    primaryNarrativeFeatures: ['tata ace transport vehicle stolen', 'loaded with centering sheets and iron rods', 'from construction site', 'site watchman was sleeping', 'vehicle engine started with direct wiring', 'escaped via national highway'],
    districtDistribution: ['Bengaluru City', 'Tumakuru', 'Kolar'],
    suspectName: 'Mallesh @ Centering Mallesha',
    phoneNo: '9945112233',
    vehiclePlate: 'KA-03-TR-9021'
  },
  {
    id: 'cluster-apartment-maid-recon',
    crimeType: 'House Break-In (HBT)',
    primaryNarrativeFeatures: ['hired as part-time domestic maid', 'did not submit Aadhaar card', 'located key hiding spots in flower pot', 'stole locker keys', 'absconded with gold bangles and diamond rings', 'switched off phone'],
    districtDistribution: ['Bengaluru City', 'Mysuru City'],
    suspectName: 'Lakshmi @ Maya Maid',
    phoneNo: '8111999888',
    vehiclePlate: 'KA-05-AA-1122'
  },
  {
    id: 'cluster-fake-gold-loan-scam',
    crimeType: 'Cyber Fraud',
    primaryNarrativeFeatures: ['fake copper-gold alloy jewelry', 'pledged at finance company', 'counterfeit hallmarking stamps', 'taken cash loan of 5 lakhs', 'audit discovered fake metal', 'provided fake address in Aadhaar card'],
    districtDistribution: ['Mangaluru City', 'Udupi', 'Belagavi'],
    suspectName: 'Vijay @ Swarna Swamy',
    phoneNo: '7766554433',
    vehiclePlate: 'KA-20-V-3456'
  },
  {
    id: 'cluster-valuable-tree-smuggling',
    crimeType: 'Robbery',
    primaryNarrativeFeatures: ['sandalwood tree cut', 'farmhouse compound gate breached', 'barking dog poisoned', 'electric chainsaw used silently', 'loaded logs in white bolero', 'threatened security guard with machete'],
    districtDistribution: ['Shivamogga', 'Mysuru City', 'Kolar'],
    suspectName: 'Satish @ Sandalwood Sata',
    phoneNo: '9844005511',
    vehiclePlate: 'KA-12-B-9988'
  },
  {
    id: 'cluster-fake-tollbooth-receipts',
    crimeType: 'Robbery',
    primaryNarrativeFeatures: ['counterfeit toll tickets', 'stopping commercial trucks on bypass', 'demanding high local panchayat fee', 'holding wooden club in hand', 'beaten truck cleaner when refused', 'snatched diesel money'],
    districtDistribution: ['Kalaburagi', 'Hubballi-Dharwad'],
    suspectName: 'Kumar @ Toll Raaja',
    phoneNo: '9886001122',
    vehiclePlate: 'KA-32-N-3312'
  },
  {
    id: 'cluster-rental-bike-theft',
    crimeType: 'Vehicle Theft',
    primaryNarrativeFeatures: ['rented high-end Royal Enfield', 'submitted fake DL copy', 'GPS tracker wire snapped under seat', 'disappeared in rural area', 'used fake registration plate on same bike to commit crimes'],
    districtDistribution: ['Bengaluru City', 'Mysuru City', 'Mangaluru City'],
    suspectName: 'Chethan @ Enfield Chethu',
    phoneNo: '9480112233',
    vehiclePlate: 'KA-01-EE-4552'
  },
  {
    id: 'cluster-rice-pulling-scam',
    crimeType: 'Cyber Fraud',
    primaryNarrativeFeatures: ['iridium metal copper vessel scam', 'supposed to pull rice grains with cosmic energy', 'demanded 10 lakhs for chemical testing', 'performed fake demo using chemical coated rice', 'absconded with advanced cash deposit'],
    districtDistribution: ['Mysuru City', 'Shivamogga', 'Kalaburagi'],
    suspectName: 'Prasanna @ Iridium Swamy',
    phoneNo: '9449112233',
    vehiclePlate: 'KA-14-H-7654'
  }
];

export interface MessyDataResult {
  firs: FIRRecord[];
  criminals: CriminalProfile[];
  wards: AreaRiskIndicator[];
}

export function generateDataset(): MessyDataResult {
  const firs: FIRRecord[] = [];
  const rand = new SeededRandom(777);

  // Generate Wards first
  const wards = generateSocioEconomicIndicators();

  // 1. Generate normal cases first (~9,000 cases to achieve 10,000+)
  // For standard performance inside sandboxed container, let's generate exactly 10,200 cases
  // 10,000 cases will be programmatic variations of templates.
  const baseCount = 10050; 
  
  const KAN_TRANSLITERATIONS = [
    'Kalla came inside house', 'chein snatched near cross road', 'bangaara (gold) ornaments stolen', 'HBT at locked mane',
    'kallatana (theft) happened', 'breaking kadi door lock', 'mobile phona lift maadidaru', 'kaige dhakke maadi wallet dhosti',
    'pulled gold mangalasuthra', 'kaddidare bendi and bangles', 'motor cycle theft in front of mane', 'window glass break',
    'swiped card and cheated', 'threatened with kadi tool', 'gave fake raste map and robbed'
  ];

  for (let i = 1; i <= baseCount; i++) {
    const district = pickRandom(Object.keys(DISTRICTS_STATIONS));
    const station = pickRandom(DISTRICTS_STATIONS[district]);
    const crimeType = pickRandom(CRIME_TYPES);
    const date = randomDate(new Date(2019, 0, 1), new Date(2024, 11, 31));
    const street = pickRandom(STREETS);
    const officer = pickRandom(OFFICERS);

    // Create realistic messy narrative
    const kanPhrases = [pickRandom(KAN_TRANSLITERATIONS), pickRandom(KAN_TRANSLITERATIONS)].join('; ');
    const typoNarratives: Record<CrimeType, string[]> = {
      'Chain Snatching': [
        `Whle walkng on ${street}, a bike riding person snatched her chain. Gold chane was 40g. Loss of 2,00,000 Rs. ${kanPhrases}`,
        `incident of chain-snaching by two persons on motorcycle. No number plate seen. Snatched gold thali. ${kanPhrases}`,
        `Complaint of chain snatching. Bike speed was high. Snatched mangalya chain in morning. ${kanPhrases}`
      ],
      'House Break-In (HBT)': [
        `HBT theft at ${street}. Rear lock of house broken with crow-bar and gold bendi stolen. Loss heavy. ${kanPhrases}`,
        `Locked house burglary. Almirah locks are brokn. Cash 45000 and gold chain caddukondu hodaru. ${kanPhrases}`,
        `house-breaking during holiday. entry from back doore. locker broken, keys found on table. ${kanPhrases}`
      ],
      'Vehicle Theft': [
        `Two-wheeler vehicle parked in front of house stolen by unknown thieves. Bike KA-01-E-${Math.floor(1000 + rand.next() * 9000)}. ${kanPhrases}`,
        `Scooter stolen from metro station parkng. key was with me. No suspect trace yet. ${kanPhrases}`,
        `Active vehicle theft in midnight. parked on side of raste ${street}. lock broken. ${kanPhrases}`
      ],
      'Robbery': [
        `robbery at knife point near ${street}. Suspect came in auto and took wallet containing 5000 rs. ${kanPhrases}`,
        `attack by unknown gangs. threatned using long metal cutter, snatched mobile phone. ${kanPhrases}`,
        `robbed of purse and watch during night walk. 3 boys age around 20 years. ${kanPhrases}`
      ],
      'Cyber Fraud': [
        `fraud call claiming from karnataka bank. OTP shared for KYC update. 75000 rs debited. ${kanPhrases}`,
        `Invested in part time jobs online, lost 120000 rs via telegram link scam. ${kanPhrases}`,
        `olx scam. seller claimed police officer, demanded advance token money of 20000. ${kanPhrases}`
      ],
      'Assault': [
        `fight in ${street} over parking site dispute. Accused beat him with iron stick. Injury on head. ${kanPhrases}`,
        `Assaulted by neighber regarding trash disposal. Used bad language. ${kanPhrases}`,
        `verbal altercation turned physical. accused assaulted victim with wooden piece. ${kanPhrases}`
      ],
      'Land Grab': [
        `Attempt to illegally grab 30x40 site on ${street} by fabricating general power of attorney docs. ${kanPhrases}`,
        `accused claiming ownership of ancestral land using forged revenue stamp certificates. ${kanPhrases}`,
        `encroachment of vacant plot with tin sheets overnight and threatening the NRI owner. ${kanPhrases}`
      ]
    };

    const narrative = pickRandom(typoNarratives[crimeType]);
    const suspectSeed = rand.next();
    // Mostly unknown suspects (90%) but some repeat ones (10%)
    let suspectName = 'Unidentified / Unknown Suspect';
    if (suspectSeed < 0.1) {
      const parentName = pickRandom(Object.keys(SUSPECT_VARIATIONS));
      suspectName = pickRandom(SUSPECT_VARIATIONS[parentName]);
    }

    const victimGender = rand.next() > 0.5 ? 'Female' : 'Male';
    const victimName = pickRandom(VICTIM_FIRST_NAMES) + ' ' + pickRandom(KAN_LAST_NAMES);
    const victimAge = Math.floor(18 + rand.next() * 65);
    const phoneNo = suspectName !== 'Unidentified / Unknown Suspect' && rand.next() > 0.5 
      ? `9${Math.floor(100000000 + rand.next() * 800000000)}` 
      : '9986' + Math.floor(100000 + rand.next() * 800000);
    const vehiclePlate = suspectName !== 'Unidentified / Unknown Suspect' && rand.next() > 0.5
      ? `KA-${Math.floor(10 + rand.next() * 40)}-M-${Math.floor(1000 + rand.next() * 9000)}`
      : 'KA-01-' + pickRandom(['A', 'B', 'M', 'N']) + 'X-' + Math.floor(1000 + rand.next() * 9000);

    firs.push({
      id: `FIR-${20000 + i}`,
      firNumber: `KSP/${district.slice(0,3).toUpperCase()}/${station.slice(0,3).toUpperCase()}/FIR-${20000 + i}`,
      date,
      district,
      policeStation: station,
      crimeType,
      narrative,
      officerName: officer,
      suspectName,
      victimName,
      victimAge,
      victimGender,
      phoneNo,
      vehiclePlate,
      latitude: district === 'Bengaluru City' ? 12.9 + rand.next() * 0.15 : 12.0 + rand.next() * 4.0, // spread in karnataka
      longitude: district === 'Bengaluru City' ? 77.5 + rand.next() * 0.2 : 74.0 + rand.next() * 3.5,
      status: rand.next() > 0.65 ? 'Chargesheeted' : (rand.next() > 0.5 ? 'Investigating' : 'Unresolved')
    });
  }

  // 2. Inject exactly 15 "hidden" cross-district MO-linked case clusters (Winning Differentiator 1)
  // Each cluster will have 8 cases (totaling 120 cases) carefully seeded in different districts,
  // filed by different officers, with mismatched suspect spelling but EXACT shared phone/vehicle links
  // which will allow both MO fingerprinting (text cluster) AND criminal graph network analysis to connect them!
  let clusterCaseIdCount = 1;
  SEEDED_CLUSTERS.forEach((cluster) => {
    // Generate 8 cases for this cluster
    for (let c = 0; c < 8; c++) {
      const district = cluster.districtDistribution[c % cluster.districtDistribution.length];
      const station = pickRandom(DISTRICTS_STATIONS[district]);
      
      // Deliberately introduce messy spelling for suspect name in different districts
      let messySuspect = cluster.suspectName;
      if (SUSPECT_VARIATIONS[cluster.suspectName]) {
        messySuspect = SUSPECT_VARIATIONS[cluster.suspectName][c % SUSPECT_VARIATIONS[cluster.suspectName].length];
      } else {
        // Fallback messy spelling
        if (c % 2 === 0) messySuspect = cluster.suspectName.replace('a ', ' ');
        if (c % 3 === 0) messySuspect = cluster.suspectName.replace('@', 'alias');
      }

      // Narrative combines random primary features with messy transliterations
      const features = [...cluster.primaryNarrativeFeatures];
      // Shuffle slightly or pick 3-4 features
      const narrativeText = `Incident report: ${features[0]}, ${features[1]}. Reported on street. ${features[2] || ''}. ${features[3] || ''}. Suspect seen near location. ${pickRandom(KAN_TRANSLITERATIONS)}`;

      const victimGender = rand.next() > 0.4 ? 'Male' : 'Female';
      const victimName = pickRandom(VICTIM_FIRST_NAMES) + ' ' + pickRandom(KAN_LAST_NAMES);

      // Seed EXACT same or slightly varied phone/vehicle to allow graph link analysis
      // Case 0, 1, 2 have phone, Case 2, 3, 4 have vehicle, creating a connected "hidden association" network!
      const phoneNo = c < 5 ? cluster.phoneNo : `9880${Math.floor(100000 + rand.next() * 800000)}`;
      const vehiclePlate = c >= 3 ? cluster.vehiclePlate : `KA-01-${pickRandom(['A','C','Z'])}-${Math.floor(1000 + rand.next() * 9000)}`;

      const date = randomDate(new Date(2022, 0, 1), new Date(2024, 11, 31));

      firs.push({
        id: `FIR-CL-${1000 + clusterCaseIdCount}`,
        firNumber: `KSP/${district.slice(0,3).toUpperCase()}/${station.slice(0,3).toUpperCase()}/FIR-CL-${1000 + clusterCaseIdCount}`,
        date,
        district,
        policeStation: station,
        crimeType: cluster.crimeType,
        narrative: narrativeText,
        officerName: pickRandom(OFFICERS),
        suspectName: messySuspect,
        victimName,
        victimAge: Math.floor(22 + rand.next() * 50),
        victimGender,
        phoneNo,
        vehiclePlate,
        latitude: district === 'Bengaluru City' ? 12.95 + (c * 0.01) : 13.0 + (c * 0.2), // clustered in GIS
        longitude: district === 'Bengaluru City' ? 77.58 + (c * 0.01) : 75.0 + (c * 0.2),
        status: 'Unresolved', // Keep them unresolved for investigator to solve in demo!
        clusterId: cluster.id
      });
      clusterCaseIdCount++;
    }
  });

  // 3. Generate 500 Criminal profiles (including our seeded cluster suspects)
  const criminals: CriminalProfile[] = [];
  
  // Seed the 15 master suspects first
  SEEDED_CLUSTERS.forEach((sc, idx) => {
    // Collect their associated seeded cases
    const associated = firs
      .filter((f) => f.clusterId === sc.id)
      .map((f) => f.firNumber);

    criminals.push({
      id: `CRIM-${300 + idx}`,
      name: sc.suspectName,
      aliases: SUSPECT_VARIATIONS[sc.suspectName] ? SUSPECT_VARIATIONS[sc.suspectName].slice(1) : ['No aliases'],
      primaryCrimeType: sc.crimeType,
      moConsistencyScore: Math.floor(82 + rand.next() * 15), // highly consistent MO
      associatedCases: associated,
      centralityScore: parseFloat((0.4 + rand.next() * 0.5).toFixed(3)), // High centrality because they link multiple cases
      betweennessScore: parseFloat((0.3 + rand.next() * 0.6).toFixed(3)),
      phoneNumbers: [sc.phoneNo, `9845${Math.floor(100000 + rand.next() * 800000)}`],
      vehicles: [sc.vehiclePlate],
      status: 'Active',
      lastKnownLocation: sc.districtDistribution[0]
    });
  });

  // Generate remainder of 500 criminals
  for (let c = 1; c <= 485; c++) {
    const parentName = pickRandom(KAN_FIRST_NAMES) + ' ' + pickRandom(KAN_LAST_NAMES);
    const mainCrime = pickRandom(CRIME_TYPES);
    const aliases = [parentName.split(' ')[0] + ' @ Kalla ' + pickRandom(['Kariya', 'Chikka', 'Raaja', 'Bailu', 'Mani'])];
    
    // Pick cases matching their name
    const associated = firs
      .filter((f) => f.suspectName.includes(parentName.split(' ')[0]))
      .map((f) => f.firNumber)
      .slice(0, 3);

    criminals.push({
      id: `CRIM-${500 + c}`,
      name: parentName,
      aliases,
      primaryCrimeType: mainCrime,
      moConsistencyScore: Math.floor(40 + rand.next() * 45),
      associatedCases: associated,
      centralityScore: parseFloat((rand.next() * 0.15).toFixed(3)),
      betweennessScore: parseFloat((rand.next() * 0.1).toFixed(3)),
      phoneNumbers: [`9${Math.floor(100000000 + rand.next() * 800000000)}`],
      vehicles: [`KA-${Math.floor(10 + rand.next() * 40)}-E-${Math.floor(1000 + rand.next() * 9000)}`],
      status: rand.next() > 0.7 ? 'In Custody' : (rand.next() > 0.5 ? 'Absconding' : 'Active'),
      lastKnownLocation: pickRandom(Object.keys(DISTRICTS_STATIONS))
    });
  }

  return {
    firs,
    criminals,
    wards
  };
}
