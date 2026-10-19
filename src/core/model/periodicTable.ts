import { ElementSymbol } from './types';

export type ElementCategory =
  | 'nonmetal'
  | 'noble-gas'
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'metalloid'
  | 'halogen'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'lanthanide'
  | 'actinide';

export interface KeyIsotope {
  massNumber: number;
  symbol: string;      // ej: "¹³C", "¹⁴C", "²H"
  name: string;        // ej: "Carbono-13"
  abundance?: string;  // ej: "1.07%", "Trazas", "Sintético"
  isRadioactive?: boolean;
  description?: string; // ej: "RMN biomolecular", "Datación por radiocarbono"
}

export interface ElementData {
  atomicNumber: number;
  symbol: ElementSymbol;
  name: string;
  category: ElementCategory;
  period: number;
  group: number;
  atomicMass: number;
  cpkColor: string;
  textColor: string;
  radius: number;
  allowedValences: number[];
  keyIsotopes?: KeyIsotope[];
}

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'nonmetal': 'No metales',
  'noble-gas': 'Gases nobles',
  'alkali-metal': 'Metales alcalinos',
  'alkaline-earth': 'Alcalinotérreos',
  'metalloid': 'Metaloides',
  'halogen': 'Halógenos',
  'transition-metal': 'Metales de transición',
  'post-transition-metal': 'Metales post-transición',
  'lanthanide': 'Lantánidos',
  'actinide': 'Actínidos',
};

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'nonmetal': '#22c55e',          // Verde esmeralda
  'noble-gas': '#a855f7',         // Púrpura
  'alkali-metal': '#ef4444',      // Rojo carmín
  'alkaline-earth': '#f97316',    // Naranja
  'metalloid': '#14b8a6',         // Turquesa
  'halogen': '#eab308',           // Amarillo
  'transition-metal': '#3b82f6',  // Azul
  'post-transition-metal': '#6366f1', // Índigo
  'lanthanide': '#ec4899',        // Rosa
  'actinide': '#f43f5e',          // Fucsia coral
};

export const PERIODIC_TABLE: ElementData[] = [
  // Periodo 1
  {
    atomicNumber: 1,
    symbol: 'H',
    name: 'Hidrógeno',
    category: 'nonmetal',
    period: 1,
    group: 1,
    atomicMass: 1.008,
    cpkColor: '#f8fafc',
    textColor: '#0f172a',
    radius: 18,
    allowedValences: [1],
    keyIsotopes: [
      { massNumber: 1, symbol: '¹H', name: 'Protio', abundance: '99.98%', description: 'Isótopo más abundante del universo' },
      { massNumber: 2, symbol: '²H', name: 'Deuterio (D)', abundance: '0.015%', description: 'Estudios cinéticos y disolventes RMN' },
      { massNumber: 3, symbol: '³H', name: 'Tritio (T)', abundance: 'Trazas', isRadioactive: true, description: 'Radiomarcaje y física nuclear' },
    ],
  },
  {
    atomicNumber: 2,
    symbol: 'He',
    name: 'Helio',
    category: 'noble-gas',
    period: 1,
    group: 18,
    atomicMass: 4.0026,
    cpkColor: '#c7d2fe',
    textColor: '#1e1b4b',
    radius: 18,
    allowedValences: [0],
    keyIsotopes: [
      { massNumber: 4, symbol: '⁴He', name: 'Helio-4', abundance: '99.999%', description: 'Isótopo principal' },
      { massNumber: 3, symbol: '³He', name: 'Helio-3', abundance: '0.0001%', description: 'Criogenia avanzada' },
    ],
  },

  // Periodo 2
  {
    atomicNumber: 3,
    symbol: 'Li',
    name: 'Litio',
    category: 'alkali-metal',
    period: 2,
    group: 1,
    atomicMass: 6.94,
    cpkColor: '#cc80ff',
    textColor: '#ffffff',
    radius: 24,
    allowedValences: [1],
    keyIsotopes: [
      { massNumber: 7, symbol: '⁷Li', name: 'Litio-7', abundance: '92.41%' },
      { massNumber: 6, symbol: '⁶Li', name: 'Litio-6', abundance: '7.59%' },
    ],
  },
  {
    atomicNumber: 4,
    symbol: 'Be',
    name: 'Berilio',
    category: 'alkaline-earth',
    period: 2,
    group: 2,
    atomicMass: 9.0122,
    cpkColor: '#c2e5a3',
    textColor: '#14532d',
    radius: 22,
    allowedValences: [2],
  },
  {
    atomicNumber: 5,
    symbol: 'B',
    name: 'Boro',
    category: 'metalloid',
    period: 2,
    group: 13,
    atomicMass: 10.81,
    cpkColor: '#ffb5b5',
    textColor: '#7f1d1d',
    radius: 22,
    allowedValences: [3],
    keyIsotopes: [
      { massNumber: 11, symbol: '¹¹B', name: 'Boro-11', abundance: '80.1%' },
      { massNumber: 10, symbol: '¹⁰B', name: 'Boro-10', abundance: '19.9%' },
    ],
  },
  {
    atomicNumber: 6,
    symbol: 'C',
    name: 'Carbono',
    category: 'nonmetal',
    period: 2,
    group: 14,
    atomicMass: 12.011,
    cpkColor: '#334155',
    textColor: '#f8fafc',
    radius: 22,
    allowedValences: [4],
    keyIsotopes: [
      { massNumber: 12, symbol: '¹²C', name: 'Carbono-12', abundance: '98.93%', description: 'Base del peso atómico estándar' },
      { massNumber: 13, symbol: '¹³C', name: 'Carbono-13', abundance: '1.07%', description: 'Espectroscopía RMN de carbono' },
      { massNumber: 14, symbol: '¹⁴C', name: 'Carbono-14', abundance: '1 ppt', isRadioactive: true, description: 'Datación arqueológica y metabólica' },
    ],
  },
  {
    atomicNumber: 7,
    symbol: 'N',
    name: 'Nitrógeno',
    category: 'nonmetal',
    period: 2,
    group: 15,
    atomicMass: 14.007,
    cpkColor: '#3b82f6',
    textColor: '#ffffff',
    radius: 22,
    allowedValences: [3, 4, 5],
    keyIsotopes: [
      { massNumber: 14, symbol: '¹⁴N', name: 'Nitrógeno-14', abundance: '99.63%' },
      { massNumber: 15, symbol: '¹⁵N', name: 'Nitrógeno-15', abundance: '0.37%', description: 'Trazador en bioquímica y proteínas' },
    ],
  },
  {
    atomicNumber: 8,
    symbol: 'O',
    name: 'Oxígeno',
    category: 'nonmetal',
    period: 2,
    group: 16,
    atomicMass: 15.999,
    cpkColor: '#ef4444',
    textColor: '#ffffff',
    radius: 22,
    allowedValences: [2, 1, 3],
    keyIsotopes: [
      { massNumber: 16, symbol: '¹⁶O', name: 'Oxígeno-16', abundance: '99.76%' },
      { massNumber: 17, symbol: '¹⁷O', name: 'Oxígeno-17', abundance: '0.04%', description: 'Estudios de RMN de espín 5/2' },
      { massNumber: 18, symbol: '¹⁸O', name: 'Oxígeno-18', abundance: '0.20%', description: 'Trazador metabólico y paleoclimático' },
    ],
  },
  {
    atomicNumber: 9,
    symbol: 'F',
    name: 'Flúor',
    category: 'halogen',
    period: 2,
    group: 17,
    atomicMass: 18.998,
    cpkColor: '#90e0ef',
    textColor: '#0f172a',
    radius: 20,
    allowedValences: [1],
    keyIsotopes: [
      { massNumber: 19, symbol: '¹⁹F', name: 'Flúor-19', abundance: '100%', description: 'RMN ¹⁹F en diseño de fármacos' },
      { massNumber: 18, symbol: '¹⁸F', name: 'Flúor-18', abundance: 'Sintético', isRadioactive: true, description: 'Tomografía PET (ej. ¹⁸F-FDG)' },
    ],
  },
  {
    atomicNumber: 10,
    symbol: 'Ne',
    name: 'Neón',
    category: 'noble-gas',
    period: 2,
    group: 18,
    atomicMass: 20.180,
    cpkColor: '#b3e5fc',
    textColor: '#01579b',
    radius: 20,
    allowedValences: [0],
  },

  // Periodo 3
  {
    atomicNumber: 11,
    symbol: 'Na',
    name: 'Sodio',
    category: 'alkali-metal',
    period: 3,
    group: 1,
    atomicMass: 22.990,
    cpkColor: '#ab5cf2',
    textColor: '#ffffff',
    radius: 25,
    allowedValences: [1],
    keyIsotopes: [
      { massNumber: 23, symbol: '²³Na', name: 'Sodio-23', abundance: '100%' },
      { massNumber: 22, symbol: '²²Na', name: 'Sodio-22', abundance: 'Sintético', isRadioactive: true },
    ],
  },
  {
    atomicNumber: 12,
    symbol: 'Mg',
    name: 'Magnesio',
    category: 'alkaline-earth',
    period: 3,
    group: 2,
    atomicMass: 24.305,
    cpkColor: '#8ae234',
    textColor: '#1f2937',
    radius: 24,
    allowedValences: [2],
    keyIsotopes: [
      { massNumber: 24, symbol: '²⁴Mg', name: 'Magnesio-24', abundance: '78.99%' },
      { massNumber: 25, symbol: '²⁵Mg', name: 'Magnesio-25', abundance: '10.00%' },
      { massNumber: 26, symbol: '²⁶Mg', name: 'Magnesio-26', abundance: '11.01%' },
    ],
  },
  {
    atomicNumber: 13,
    symbol: 'Al',
    name: 'Aluminio',
    category: 'post-transition-metal',
    period: 3,
    group: 13,
    atomicMass: 26.982,
    cpkColor: '#bfa6a6',
    textColor: '#1f2937',
    radius: 24,
    allowedValences: [3],
  },
  {
    atomicNumber: 14,
    symbol: 'Si',
    name: 'Silicio',
    category: 'metalloid',
    period: 3,
    group: 14,
    atomicMass: 28.085,
    cpkColor: '#f0c8a0',
    textColor: '#78350f',
    radius: 24,
    allowedValences: [4],
    keyIsotopes: [
      { massNumber: 28, symbol: '²⁸Si', name: 'Silicio-28', abundance: '92.2%' },
      { massNumber: 29, symbol: '²⁹Si', name: 'Silicio-29', abundance: '4.7%', description: 'RMN de estado sólido' },
    ],
  },
  {
    atomicNumber: 15,
    symbol: 'P',
    name: 'Fósforo',
    category: 'nonmetal',
    period: 3,
    group: 15,
    atomicMass: 30.974,
    cpkColor: '#f97316',
    textColor: '#ffffff',
    radius: 25,
    allowedValences: [3, 5],
    keyIsotopes: [
      { massNumber: 31, symbol: '³¹P', name: 'Fósforo-31', abundance: '100%', description: 'Isótopo natural para RMN de ATP y ADN' },
      { massNumber: 32, symbol: '³²P', name: 'Fósforo-32', abundance: 'Sintético', isRadioactive: true, description: 'Radiomarcaje de ácidos nucleicos y fosforilación' },
      { massNumber: 33, symbol: '³³P', name: 'Fósforo-33', abundance: 'Sintético', isRadioactive: true, description: 'Emisor beta de baja energía' },
    ],
  },
  {
    atomicNumber: 16,
    symbol: 'S',
    name: 'Azufre',
    category: 'nonmetal',
    period: 3,
    group: 16,
    atomicMass: 32.06,
    cpkColor: '#eab308',
    textColor: '#0f172a',
    radius: 25,
    allowedValences: [2, 4, 6],
    keyIsotopes: [
      { massNumber: 32, symbol: '³²S', name: 'Azufre-32', abundance: '94.99%' },
      { massNumber: 34, symbol: '³⁴S', name: 'Azufre-34', abundance: '4.25%' },
      { massNumber: 35, symbol: '³⁵S', name: 'Azufre-35', abundance: 'Sintético', isRadioactive: true, description: 'Radiomarcaje de metionina y cisteína' },
    ],
  },
  {
    atomicNumber: 17,
    symbol: 'Cl',
    name: 'Cloro',
    category: 'halogen',
    period: 3,
    group: 17,
    atomicMass: 35.45,
    cpkColor: '#10b981',
    textColor: '#ffffff',
    radius: 24,
    allowedValences: [1, 3, 5, 7],
    keyIsotopes: [
      { massNumber: 35, symbol: '³⁵Cl', name: 'Cloro-35', abundance: '75.78%' },
      { massNumber: 37, symbol: '³⁷Cl', name: 'Cloro-37', abundance: '24.22%' },
    ],
  },
  {
    atomicNumber: 18,
    symbol: 'Ar',
    name: 'Argón',
    category: 'noble-gas',
    period: 3,
    group: 18,
    atomicMass: 39.948,
    cpkColor: '#80e1d1',
    textColor: '#064e3b',
    radius: 22,
    allowedValences: [0],
  },

  // Periodo 4
  { atomicNumber: 19, symbol: 'K', name: 'Potasio', category: 'alkali-metal', period: 4, group: 1, atomicMass: 39.098, cpkColor: '#8f40d4', textColor: '#ffffff', radius: 26, allowedValences: [1] },
  { atomicNumber: 20, symbol: 'Ca', name: 'Calcio', category: 'alkaline-earth', period: 4, group: 2, atomicMass: 40.078, cpkColor: '#3dff00', textColor: '#0f172a', radius: 26, allowedValences: [2] },
  { atomicNumber: 21, symbol: 'Sc', name: 'Escandio', category: 'transition-metal', period: 4, group: 3, atomicMass: 44.956, cpkColor: '#e6e6e6', textColor: '#0f172a', radius: 24, allowedValences: [3] },
  { atomicNumber: 22, symbol: 'Ti', name: 'Titanio', category: 'transition-metal', period: 4, group: 4, atomicMass: 47.867, cpkColor: '#bfc2c7', textColor: '#0f172a', radius: 24, allowedValences: [2, 3, 4] },
  { atomicNumber: 23, symbol: 'V', name: 'Vanadio', category: 'transition-metal', period: 4, group: 5, atomicMass: 50.942, cpkColor: '#a6a6ab', textColor: '#0f172a', radius: 24, allowedValences: [2, 3, 4, 5] },
  { atomicNumber: 24, symbol: 'Cr', name: 'Cromo', category: 'transition-metal', period: 4, group: 6, atomicMass: 51.996, cpkColor: '#8a99c7', textColor: '#0f172a', radius: 24, allowedValences: [2, 3, 6] },
  { atomicNumber: 25, symbol: 'Mn', name: 'Manganeso', category: 'transition-metal', period: 4, group: 7, atomicMass: 54.938, cpkColor: '#9c7ac7', textColor: '#ffffff', radius: 24, allowedValences: [2, 3, 4, 7] },
  {
    atomicNumber: 26,
    symbol: 'Fe',
    name: 'Hierro',
    category: 'transition-metal',
    period: 4,
    group: 8,
    atomicMass: 55.845,
    cpkColor: '#e06633',
    textColor: '#ffffff',
    radius: 25,
    allowedValences: [2, 3],
    keyIsotopes: [
      { massNumber: 56, symbol: '⁵⁶Fe', name: 'Hierro-56', abundance: '91.75%' },
      { massNumber: 57, symbol: '⁵⁷Fe', name: 'Hierro-57', abundance: '2.12%', description: 'Espectroscopía Mössbauer del hemo' },
    ],
  },
  { atomicNumber: 27, symbol: 'Co', name: 'Cobalto', category: 'transition-metal', period: 4, group: 9, atomicMass: 58.933, cpkColor: '#f090a0', textColor: '#0f172a', radius: 24, allowedValences: [2, 3] },
  { atomicNumber: 28, symbol: 'Ni', name: 'Níquel', category: 'transition-metal', period: 4, group: 10, atomicMass: 58.693, cpkColor: '#50d050', textColor: '#0f172a', radius: 24, allowedValences: [2, 3] },
  {
    atomicNumber: 29,
    symbol: 'Cu',
    name: 'Cobre',
    category: 'transition-metal',
    period: 4,
    group: 11,
    atomicMass: 63.546,
    cpkColor: '#c88033',
    textColor: '#ffffff',
    radius: 24,
    allowedValences: [1, 2],
    keyIsotopes: [
      { massNumber: 63, symbol: '⁶³Cu', name: 'Cobre-63', abundance: '69.15%' },
      { massNumber: 64, symbol: '⁶⁴Cu', name: 'Cobre-64', abundance: 'Sintético', isRadioactive: true, description: 'PET e investigación oncológica' },
    ],
  },
  {
    atomicNumber: 30,
    symbol: 'Zn',
    name: 'Zinc',
    category: 'transition-metal',
    period: 4,
    group: 12,
    atomicMass: 65.38,
    cpkColor: '#7d80b0',
    textColor: '#ffffff',
    radius: 24,
    allowedValences: [2],
    keyIsotopes: [
      { massNumber: 64, symbol: '⁶⁴Zn', name: 'Zinc-64', abundance: '49.2%' },
      { massNumber: 65, symbol: '⁶⁵Zn', name: 'Zinc-65', abundance: 'Sintético', isRadioactive: true, description: 'Estudios de metaloproteínas de zinc' },
    ],
  },
  { atomicNumber: 31, symbol: 'Ga', name: 'Galio', category: 'post-transition-metal', period: 4, group: 13, atomicMass: 69.723, cpkColor: '#c28f8f', textColor: '#0f172a', radius: 23, allowedValences: [3] },
  { atomicNumber: 32, symbol: 'Ge', name: 'Germanio', category: 'metalloid', period: 4, group: 14, atomicMass: 72.630, cpkColor: '#668f8f', textColor: '#ffffff', radius: 23, allowedValences: [2, 4] },
  { atomicNumber: 33, symbol: 'As', name: 'Arsénico', category: 'metalloid', period: 4, group: 15, atomicMass: 74.922, cpkColor: '#bd80e3', textColor: '#ffffff', radius: 23, allowedValences: [3, 5] },
  {
    atomicNumber: 34,
    symbol: 'Se',
    name: 'Selenio',
    category: 'nonmetal',
    period: 4,
    group: 16,
    atomicMass: 78.971,
    cpkColor: '#ffa100',
    textColor: '#0f172a',
    radius: 24,
    allowedValences: [2, 4, 6],
    keyIsotopes: [
      { massNumber: 77, symbol: '⁷⁷Se', name: 'Selenio-77', abundance: '7.6%', description: 'RMN en selenoproteínas' },
      { massNumber: 75, symbol: '⁷⁵Se', name: 'Selenio-75', abundance: 'Sintético', isRadioactive: true },
    ],
  },
  {
    atomicNumber: 35,
    symbol: 'Br',
    name: 'Bromo',
    category: 'halogen',
    period: 4,
    group: 17,
    atomicMass: 79.904,
    cpkColor: '#a52a2a',
    textColor: '#ffffff',
    radius: 24,
    allowedValences: [1, 3, 5],
    keyIsotopes: [
      { massNumber: 79, symbol: '⁷⁹Br', name: 'Bromo-79', abundance: '50.69%' },
      { massNumber: 81, symbol: '⁸¹Br', name: 'Bromo-81', abundance: '49.31%' },
    ],
  },
  { atomicNumber: 36, symbol: 'Kr', name: 'Kriptón', category: 'noble-gas', period: 4, group: 18, atomicMass: 83.798, cpkColor: '#5cb8d1', textColor: '#0f172a', radius: 23, allowedValences: [0, 2] },

  // Periodo 5
  { atomicNumber: 37, symbol: 'Rb', name: 'Rubidio', category: 'alkali-metal', period: 5, group: 1, atomicMass: 85.468, cpkColor: '#702eb0', textColor: '#ffffff', radius: 26, allowedValences: [1] },
  { atomicNumber: 38, symbol: 'Sr', name: 'Estroncio', category: 'alkaline-earth', period: 5, group: 2, atomicMass: 87.62, cpkColor: '#00ff00', textColor: '#0f172a', radius: 26, allowedValences: [2] },
  { atomicNumber: 39, symbol: 'Y', name: 'Itrio', category: 'transition-metal', period: 5, group: 3, atomicMass: 88.906, cpkColor: '#94ffff', textColor: '#0f172a', radius: 24, allowedValences: [3] },
  { atomicNumber: 40, symbol: 'Zr', name: 'Circonio', category: 'transition-metal', period: 5, group: 4, atomicMass: 91.224, cpkColor: '#94e0e0', textColor: '#0f172a', radius: 24, allowedValences: [4] },
  { atomicNumber: 41, symbol: 'Nb', name: 'Niobio', category: 'transition-metal', period: 5, group: 5, atomicMass: 92.906, cpkColor: '#73c2c9', textColor: '#0f172a', radius: 24, allowedValences: [3, 5] },
  { atomicNumber: 42, symbol: 'Mo', name: 'Molibdeno', category: 'transition-metal', period: 5, group: 6, atomicMass: 95.95, cpkColor: '#54b5b5', textColor: '#0f172a', radius: 24, allowedValences: [4, 6] },
  { atomicNumber: 43, symbol: 'Tc', name: 'Tecnecio', category: 'transition-metal', period: 5, group: 7, atomicMass: 98, cpkColor: '#3b9e9e', textColor: '#ffffff', radius: 24, allowedValences: [4, 7] },
  { atomicNumber: 44, symbol: 'Ru', name: 'Rutenio', category: 'transition-metal', period: 5, group: 8, atomicMass: 101.07, cpkColor: '#248f8f', textColor: '#ffffff', radius: 24, allowedValences: [3, 4] },
  { atomicNumber: 45, symbol: 'Rh', name: 'Rodio', category: 'transition-metal', period: 5, group: 9, atomicMass: 102.91, cpkColor: '#0a7d8c', textColor: '#ffffff', radius: 24, allowedValences: [3] },
  { atomicNumber: 46, symbol: 'Pd', name: 'Paladio', category: 'transition-metal', period: 5, group: 10, atomicMass: 106.42, cpkColor: '#006985', textColor: '#ffffff', radius: 24, allowedValences: [2, 4] },
  { atomicNumber: 47, symbol: 'Ag', name: 'Plata', category: 'transition-metal', period: 5, group: 11, atomicMass: 107.87, cpkColor: '#c0c0c0', textColor: '#0f172a', radius: 24, allowedValences: [1] },
  { atomicNumber: 48, symbol: 'Cd', name: 'Cadmio', category: 'transition-metal', period: 5, group: 12, atomicMass: 112.41, cpkColor: '#ffd98f', textColor: '#0f172a', radius: 24, allowedValences: [2] },
  { atomicNumber: 49, symbol: 'In', name: 'Indio', category: 'post-transition-metal', period: 5, group: 13, atomicMass: 114.82, cpkColor: '#a67573', textColor: '#ffffff', radius: 24, allowedValences: [3] },
  { atomicNumber: 50, symbol: 'Sn', name: 'Estaño', category: 'post-transition-metal', period: 5, group: 14, atomicMass: 118.71, cpkColor: '#668080', textColor: '#ffffff', radius: 24, allowedValences: [2, 4] },
  { atomicNumber: 51, symbol: 'Sb', name: 'Antimonio', category: 'metalloid', period: 5, group: 15, atomicMass: 121.76, cpkColor: '#9e63b5', textColor: '#ffffff', radius: 24, allowedValences: [3, 5] },
  { atomicNumber: 52, symbol: 'Te', name: 'Telurio', category: 'metalloid', period: 5, group: 16, atomicMass: 127.60, cpkColor: '#d47a00', textColor: '#ffffff', radius: 24, allowedValences: [2, 4, 6] },
  {
    atomicNumber: 53,
    symbol: 'I',
    name: 'Yodo',
    category: 'halogen',
    period: 5,
    group: 17,
    atomicMass: 126.90,
    cpkColor: '#940094',
    textColor: '#ffffff',
    radius: 25,
    allowedValences: [1, 3, 5, 7],
    keyIsotopes: [
      { massNumber: 127, symbol: '¹²⁷I', name: 'Yodo-127', abundance: '100%' },
      { massNumber: 125, symbol: '¹²⁵I', name: 'Yodo-125', abundance: 'Sintético', isRadioactive: true, description: 'Radioinmunoensayos (RIA)' },
      { massNumber: 131, symbol: '¹³¹I', name: 'Yodo-131', abundance: 'Sintético', isRadioactive: true, description: 'Medicina nuclear y tiroides' },
    ],
  },
  { atomicNumber: 54, symbol: 'Xe', name: 'Xenón', category: 'noble-gas', period: 5, group: 18, atomicMass: 131.29, cpkColor: '#429eb0', textColor: '#ffffff', radius: 24, allowedValences: [0, 2, 4, 6] },

  // Periodo 6
  { atomicNumber: 55, symbol: 'Cs', name: 'Cesio', category: 'alkali-metal', period: 6, group: 1, atomicMass: 132.91, cpkColor: '#57178f', textColor: '#ffffff', radius: 27, allowedValences: [1] },
  { atomicNumber: 56, symbol: 'Ba', name: 'Bario', category: 'alkaline-earth', period: 6, group: 2, atomicMass: 137.33, cpkColor: '#00c900', textColor: '#0f172a', radius: 27, allowedValences: [2] },
  { atomicNumber: 57, symbol: 'La', name: 'Lantano', category: 'lanthanide', period: 6, group: 3, atomicMass: 138.91, cpkColor: '#70d4ff', textColor: '#0f172a', radius: 25, allowedValences: [3] },
  { atomicNumber: 58, symbol: 'Ce', name: 'Cerio', category: 'lanthanide', period: 6, group: 3, atomicMass: 140.12, cpkColor: '#ffffc7', textColor: '#0f172a', radius: 25, allowedValences: [3, 4] },
  { atomicNumber: 59, symbol: 'Pr', name: 'Praseodimio', category: 'lanthanide', period: 6, group: 3, atomicMass: 140.91, cpkColor: '#d9ffc7', textColor: '#0f172a', radius: 25, allowedValences: [3] },
  { atomicNumber: 60, symbol: 'Nd', name: 'Neodimio', category: 'lanthanide', period: 6, group: 3, atomicMass: 144.24, cpkColor: '#c7ffc7', textColor: '#0f172a', radius: 25, allowedValences: [3] },
  { atomicNumber: 61, symbol: 'Pm', name: 'Prometio', category: 'lanthanide', period: 6, group: 3, atomicMass: 145, cpkColor: '#a3ffc7', textColor: '#0f172a', radius: 25, allowedValences: [3] },
  { atomicNumber: 62, symbol: 'Sm', name: 'Samario', category: 'lanthanide', period: 6, group: 3, atomicMass: 150.36, cpkColor: '#8fffc7', textColor: '#0f172a', radius: 25, allowedValences: [3] },
  { atomicNumber: 63, symbol: 'Eu', name: 'Europio', category: 'lanthanide', period: 6, group: 3, atomicMass: 151.96, cpkColor: '#61ffc7', textColor: '#0f172a', radius: 25, allowedValences: [2, 3] },
  { atomicNumber: 64, symbol: 'Gd', name: 'Gadolinio', category: 'lanthanide', period: 6, group: 3, atomicMass: 157.25, cpkColor: '#45ffc7', textColor: '#0f172a', radius: 25, allowedValences: [3] },
  { atomicNumber: 65, symbol: 'Tb', name: 'Terbio', category: 'lanthanide', period: 6, group: 3, atomicMass: 158.93, cpkColor: '#30ffc7', textColor: '#0f172a', radius: 25, allowedValences: [3, 4] },
  { atomicNumber: 66, symbol: 'Dy', name: 'Disprosio', category: 'lanthanide', period: 6, group: 3, atomicMass: 162.50, cpkColor: '#1fffc7', textColor: '#0f172a', radius: 25, allowedValences: [3] },
  { atomicNumber: 67, symbol: 'Ho', name: 'Holmio', category: 'lanthanide', period: 6, group: 3, atomicMass: 164.93, cpkColor: '#00ff9c', textColor: '#0f172a', radius: 25, allowedValences: [3] },
  { atomicNumber: 68, symbol: 'Er', name: 'Erbio', category: 'lanthanide', period: 6, group: 3, atomicMass: 167.26, cpkColor: '#00e675', textColor: '#0f172a', radius: 25, allowedValences: [3] },
  { atomicNumber: 69, symbol: 'Tm', name: 'Tulio', category: 'lanthanide', period: 6, group: 3, atomicMass: 168.93, cpkColor: '#00d452', textColor: '#0f172a', radius: 25, allowedValences: [3] },
  { atomicNumber: 70, symbol: 'Yb', name: 'Iterbio', category: 'lanthanide', period: 6, group: 3, atomicMass: 173.05, cpkColor: '#00bf38', textColor: '#ffffff', radius: 25, allowedValences: [2, 3] },
  { atomicNumber: 71, symbol: 'Lu', name: 'Lutecio', category: 'lanthanide', period: 6, group: 3, atomicMass: 174.97, cpkColor: '#00ab24', textColor: '#ffffff', radius: 25, allowedValences: [3] },
  { atomicNumber: 72, symbol: 'Hf', name: 'Hafnio', category: 'transition-metal', period: 6, group: 4, atomicMass: 178.49, cpkColor: '#4dc2ff', textColor: '#0f172a', radius: 24, allowedValences: [4] },
  { atomicNumber: 73, symbol: 'Ta', name: 'Tántalo', category: 'transition-metal', period: 6, group: 5, atomicMass: 180.95, cpkColor: '#4da6ff', textColor: '#0f172a', radius: 24, allowedValences: [5] },
  { atomicNumber: 74, symbol: 'W', name: 'Wolframio', category: 'transition-metal', period: 6, group: 6, atomicMass: 183.84, cpkColor: '#2194d6', textColor: '#ffffff', radius: 24, allowedValences: [4, 6] },
  { atomicNumber: 75, symbol: 'Re', name: 'Renio', category: 'transition-metal', period: 6, group: 7, atomicMass: 186.21, cpkColor: '#267dab', textColor: '#ffffff', radius: 24, allowedValences: [4, 7] },
  { atomicNumber: 76, symbol: 'Os', name: 'Osmio', category: 'transition-metal', period: 6, group: 8, atomicMass: 190.23, cpkColor: '#266696', textColor: '#ffffff', radius: 24, allowedValences: [4, 8] },
  { atomicNumber: 77, symbol: 'Ir', name: 'Iridio', category: 'transition-metal', period: 6, group: 9, atomicMass: 192.22, cpkColor: '#175487', textColor: '#ffffff', radius: 24, allowedValences: [3, 4] },
  {
    atomicNumber: 78,
    symbol: 'Pt',
    name: 'Platino',
    category: 'transition-metal',
    period: 6,
    group: 10,
    atomicMass: 195.08,
    cpkColor: '#d0d0e0',
    textColor: '#0f172a',
    radius: 25,
    allowedValences: [2, 4],
    keyIsotopes: [
      { massNumber: 195, symbol: '¹⁹⁵Pt', name: 'Platino-195', abundance: '33.8%', description: 'Quimioterapia (Cisplatino) y RMN' },
    ],
  },
  { atomicNumber: 79, symbol: 'Au', name: 'Oro', category: 'transition-metal', period: 6, group: 11, atomicMass: 196.97, cpkColor: '#ffd123', textColor: '#0f172a', radius: 25, allowedValences: [1, 3] },
  { atomicNumber: 80, symbol: 'Hg', name: 'Mercurio', category: 'transition-metal', period: 6, group: 12, atomicMass: 200.59, cpkColor: '#b8b8d0', textColor: '#0f172a', radius: 25, allowedValences: [1, 2] },
  { atomicNumber: 81, symbol: 'Tl', name: 'Talio', category: 'post-transition-metal', period: 6, group: 13, atomicMass: 204.38, cpkColor: '#a6544d', textColor: '#ffffff', radius: 25, allowedValences: [1, 3] },
  { atomicNumber: 82, symbol: 'Pb', name: 'Plomo', category: 'post-transition-metal', period: 6, group: 14, atomicMass: 207.2, cpkColor: '#575961', textColor: '#ffffff', radius: 25, allowedValences: [2, 4] },
  { atomicNumber: 83, symbol: 'Bi', name: 'Bismuto', category: 'post-transition-metal', period: 6, group: 15, atomicMass: 208.98, cpkColor: '#9e4fb5', textColor: '#ffffff', radius: 25, allowedValences: [3, 5] },
  { atomicNumber: 84, symbol: 'Po', name: 'Polonio', category: 'post-transition-metal', period: 6, group: 16, atomicMass: 209, cpkColor: '#ab5c00', textColor: '#ffffff', radius: 25, allowedValences: [2, 4] },
  { atomicNumber: 85, symbol: 'At', name: 'Ástato', category: 'halogen', period: 6, group: 17, atomicMass: 210, cpkColor: '#751e00', textColor: '#ffffff', radius: 25, allowedValences: [1, 3] },
  { atomicNumber: 86, symbol: 'Rn', name: 'Radón', category: 'noble-gas', period: 6, group: 18, atomicMass: 222, cpkColor: '#428296', textColor: '#ffffff', radius: 25, allowedValences: [0, 2] },

  // Periodo 7
  { atomicNumber: 87, symbol: 'Fr', name: 'Francio', category: 'alkali-metal', period: 7, group: 1, atomicMass: 223, cpkColor: '#420066', textColor: '#ffffff', radius: 28, allowedValences: [1] },
  { atomicNumber: 88, symbol: 'Ra', name: 'Radio', category: 'alkaline-earth', period: 7, group: 2, atomicMass: 226, cpkColor: '#007d00', textColor: '#ffffff', radius: 28, allowedValences: [2] },
  { atomicNumber: 89, symbol: 'Ac', name: 'Actinio', category: 'actinide', period: 7, group: 3, atomicMass: 227, cpkColor: '#70abfa', textColor: '#0f172a', radius: 26, allowedValences: [3] },
  { atomicNumber: 90, symbol: 'Th', name: 'Torio', category: 'actinide', period: 7, group: 3, atomicMass: 232.04, cpkColor: '#00baff', textColor: '#0f172a', radius: 26, allowedValences: [4] },
  { atomicNumber: 91, symbol: 'Pa', name: 'Protactinio', category: 'actinide', period: 7, group: 3, atomicMass: 231.04, cpkColor: '#00a1ff', textColor: '#0f172a', radius: 26, allowedValences: [4, 5] },
  {
    atomicNumber: 92,
    symbol: 'U',
    name: 'Uranio',
    category: 'actinide',
    period: 7,
    group: 3,
    atomicMass: 238.03,
    cpkColor: '#008fff',
    textColor: '#ffffff',
    radius: 26,
    allowedValences: [4, 6],
    keyIsotopes: [
      { massNumber: 238, symbol: '²³⁸U', name: 'Uranio-238', abundance: '99.27%' },
      { massNumber: 235, symbol: '²³⁵U', name: 'Uranio-235', abundance: '0.72%', isRadioactive: true },
    ],
  },
  { atomicNumber: 93, symbol: 'Np', name: 'Neptunio', category: 'actinide', period: 7, group: 3, atomicMass: 237, cpkColor: '#0080ff', textColor: '#ffffff', radius: 26, allowedValences: [4, 5] },
  { atomicNumber: 94, symbol: 'Pu', name: 'Plutonio', category: 'actinide', period: 7, group: 3, atomicMass: 244, cpkColor: '#006bff', textColor: '#ffffff', radius: 26, allowedValences: [4, 6] },
  { atomicNumber: 95, symbol: 'Am', name: 'Americio', category: 'actinide', period: 7, group: 3, atomicMass: 243, cpkColor: '#545cf2', textColor: '#ffffff', radius: 26, allowedValences: [3, 4] },
  { atomicNumber: 96, symbol: 'Cm', name: 'Curio', category: 'actinide', period: 7, group: 3, atomicMass: 247, cpkColor: '#785ce3', textColor: '#ffffff', radius: 26, allowedValences: [3] },
  { atomicNumber: 97, symbol: 'Bk', name: 'Berkelio', category: 'actinide', period: 7, group: 3, atomicMass: 247, cpkColor: '#8a4fe3', textColor: '#ffffff', radius: 26, allowedValences: [3, 4] },
  { atomicNumber: 98, symbol: 'Cf', name: 'Californio', category: 'actinide', period: 7, group: 3, atomicMass: 251, cpkColor: '#a136d4', textColor: '#ffffff', radius: 26, allowedValences: [3] },
  { atomicNumber: 99, symbol: 'Es', name: 'Einstenio', category: 'actinide', period: 7, group: 3, atomicMass: 252, cpkColor: '#b31fd4', textColor: '#ffffff', radius: 26, allowedValences: [3] },
  { atomicNumber: 100, symbol: 'Fm', name: 'Fermio', category: 'actinide', period: 7, group: 3, atomicMass: 257, cpkColor: '#b31fba', textColor: '#ffffff', radius: 26, allowedValences: [3] },
  { atomicNumber: 101, symbol: 'Md', name: 'Mendelevio', category: 'actinide', period: 7, group: 3, atomicMass: 258, cpkColor: '#b30da6', textColor: '#ffffff', radius: 26, allowedValences: [2, 3] },
  { atomicNumber: 102, symbol: 'No', name: 'Nobelio', category: 'actinide', period: 7, group: 3, atomicMass: 259, cpkColor: '#bd0d87', textColor: '#ffffff', radius: 26, allowedValences: [2, 3] },
  { atomicNumber: 103, symbol: 'Lr', name: 'Laurencio', category: 'actinide', period: 7, group: 3, atomicMass: 266, cpkColor: '#c70066', textColor: '#ffffff', radius: 26, allowedValences: [3] },
  { atomicNumber: 104, symbol: 'Rf', name: 'Rutherfordio', category: 'transition-metal', period: 7, group: 4, atomicMass: 267, cpkColor: '#cc0059', textColor: '#ffffff', radius: 25, allowedValences: [4] },
  { atomicNumber: 105, symbol: 'Db', name: 'Dubnio', category: 'transition-metal', period: 7, group: 5, atomicMass: 268, cpkColor: '#d1004f', textColor: '#ffffff', radius: 25, allowedValences: [5] },
  { atomicNumber: 106, symbol: 'Sg', name: 'Seaborgio', category: 'transition-metal', period: 7, group: 6, atomicMass: 269, cpkColor: '#d90045', textColor: '#ffffff', radius: 25, allowedValences: [6] },
  { atomicNumber: 107, symbol: 'Bh', name: 'Bohrio', category: 'transition-metal', period: 7, group: 7, atomicMass: 270, cpkColor: '#e00038', textColor: '#ffffff', radius: 25, allowedValences: [7] },
  { atomicNumber: 108, symbol: 'Hs', name: 'Hassio', category: 'transition-metal', period: 7, group: 8, atomicMass: 277, cpkColor: '#e6002e', textColor: '#ffffff', radius: 25, allowedValences: [8] },
  { atomicNumber: 109, symbol: 'Mt', name: 'Meitnerio', category: 'transition-metal', period: 7, group: 9, atomicMass: 278, cpkColor: '#eb0026', textColor: '#ffffff', radius: 25, allowedValences: [3, 4] },
  { atomicNumber: 110, symbol: 'Ds', name: 'Darmstadtio', category: 'transition-metal', period: 7, group: 10, atomicMass: 281, cpkColor: '#eb0026', textColor: '#ffffff', radius: 25, allowedValences: [2, 4] },
  { atomicNumber: 111, symbol: 'Rg', name: 'Roentgenio', category: 'transition-metal', period: 7, group: 11, atomicMass: 282, cpkColor: '#eb0026', textColor: '#ffffff', radius: 25, allowedValences: [3] },
  { atomicNumber: 112, symbol: 'Cn', name: 'Copernicio', category: 'transition-metal', period: 7, group: 12, atomicMass: 285, cpkColor: '#eb0026', textColor: '#ffffff', radius: 25, allowedValences: [2] },
  { atomicNumber: 113, symbol: 'Nh', name: 'Nihonio', category: 'post-transition-metal', period: 7, group: 13, atomicMass: 286, cpkColor: '#eb0026', textColor: '#ffffff', radius: 25, allowedValences: [1, 3] },
  { atomicNumber: 114, symbol: 'Fl', name: 'Flerovio', category: 'post-transition-metal', period: 7, group: 14, atomicMass: 289, cpkColor: '#eb0026', textColor: '#ffffff', radius: 25, allowedValences: [2, 4] },
  { atomicNumber: 115, symbol: 'Mc', name: 'Moscovio', category: 'post-transition-metal', period: 7, group: 15, atomicMass: 290, cpkColor: '#eb0026', textColor: '#ffffff', radius: 25, allowedValences: [1, 3] },
  { atomicNumber: 116, symbol: 'Lv', name: 'Livermorio', category: 'post-transition-metal', period: 7, group: 16, atomicMass: 293, cpkColor: '#eb0026', textColor: '#ffffff', radius: 25, allowedValences: [2, 4] },
  { atomicNumber: 117, symbol: 'Ts', name: 'Teneso', category: 'halogen', period: 7, group: 17, atomicMass: 294, cpkColor: '#eb0026', textColor: '#ffffff', radius: 25, allowedValences: [1, 3] },
  { atomicNumber: 118, symbol: 'Og', name: 'Oganesón', category: 'noble-gas', period: 7, group: 18, atomicMass: 294, cpkColor: '#eb0026', textColor: '#ffffff', radius: 25, allowedValences: [0, 2] },
];

const ELEMENT_BY_SYMBOL = new Map<string, ElementData>(
  PERIODIC_TABLE.map((elem) => [elem.symbol, elem])
);

export function getElement(symbol: string): ElementData | undefined {
  return ELEMENT_BY_SYMBOL.get(symbol);
}

/**
 * Convierte un número entero a superíndice unicode (ej. 13 -> "¹³", 14 -> "¹⁴")
 */
export function toSuperscript(num: number): string {
  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻',
  };
  return num
    .toString()
    .split('')
    .map((char) => superscripts[char] || char)
    .join('');
}
