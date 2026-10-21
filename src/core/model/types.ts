export type ElementSymbol =
  | 'H' | 'He' | 'Li' | 'Be' | 'B' | 'C' | 'N' | 'O' | 'F' | 'Ne'
  | 'Na' | 'Mg' | 'Al' | 'Si' | 'P' | 'S' | 'Cl' | 'Ar' | 'K' | 'Ca'
  | 'Sc' | 'Ti' | 'V' | 'Cr' | 'Mn' | 'Fe' | 'Co' | 'Ni' | 'Cu' | 'Zn'
  | 'Ga' | 'Ge' | 'As' | 'Se' | 'Br' | 'Kr' | 'Rb' | 'Sr' | 'Y' | 'Zr'
  | 'Nb' | 'Mo' | 'Tc' | 'Ru' | 'Rh' | 'Pd' | 'Ag' | 'Cd' | 'In' | 'Sn'
  | 'Sb' | 'Te' | 'I' | 'Xe' | 'Cs' | 'Ba' | 'La' | 'Ce' | 'Pr' | 'Nd'
  | 'Pm' | 'Sm' | 'Eu' | 'Gd' | 'Tb' | 'Dy' | 'Ho' | 'Er' | 'Tm' | 'Yb'
  | 'Lu' | 'Hf' | 'Ta' | 'W' | 'Re' | 'Os' | 'Ir' | 'Pt' | 'Au' | 'Hg'
  | 'Tl' | 'Pb' | 'Bi' | 'Po' | 'At' | 'Rn' | 'Fr' | 'Ra' | 'Ac' | 'Th'
  | 'Pa' | 'U' | 'Np' | 'Pu' | 'Am' | 'Cm' | 'Bk' | 'Cf' | 'Es' | 'Fm'
  | 'Md' | 'No' | 'Lr' | 'Rf' | 'Db' | 'Sg' | 'Bh' | 'Hs' | 'Mt' | 'Ds'
  | 'Rg' | 'Cn' | 'Nh' | 'Fl' | 'Mc' | 'Lv' | 'Ts' | 'Og';

export type BondOrder = 1 | 2 | 3;
export type ToolType = 'select' | 'atom' | 'bond' | 'eraser' | 'ring' | 'template';

export interface AtomNode {
  id: string;
  element: ElementSymbol;
  formalCharge: number; // Default: 0
  x: number;            // Coordenada X en espacio de lienzo (mundo)
  y: number;            // Coordenada Y en espacio de lienzo (mundo)
  isotope?: number;     // Número másico del isótopo (ej. 13 para 13C, 14 para 14C)
  isLocked?: boolean;   // Si es true, no se puede borrar ni transmutar
  hasError?: boolean;   // Flag visual activado por el validador
}

export interface BondEdge {
  id: string;
  sourceId: string;
  targetId: string;
  order: BondOrder;
  isLocked?: boolean;
}

export interface MolecularGraph {
  nodes: Record<string, AtomNode>;
  edges: Record<string, BondEdge>;
}

export interface ValidationIssue {
  code:
    | 'VALENCE_EXCEEDED'
    | 'DISCONNECTED_GRAPH'
    | 'INVALID_CHEMISTRY'
    | 'FORMULA_MISMATCH'
    | 'MISSING_FUNCTIONAL_GROUP'
    | 'FORBIDDEN_SUBSTRUCTURE'
    | 'STRUCTURE_MISMATCH';
  message: string;           // Explicación pedagógica para el estudiante
  affectedAtomIds: string[]; // IDs de nodos que deben iluminarse en el canvas
}

export interface MolecularDescriptors {
  formula: string;
  canonicalSmiles: string;
  atomCount: number;
  bondCount: number;
  ringCount: number;
}

export interface ValidationResult {
  isValid: boolean;
  passedLayer1: boolean;
  passedMission: boolean;
  issues: ValidationIssue[];
  descriptors?: MolecularDescriptors;
  detectedFunctionalGroups?: { name: string; count: number }[];
  differentialDiagnosis?: string;
}

export interface SubstructureRequirement {
  name: string;   // Ej: "Grupo Hidroxilo (-OH)"
  smarts: string; // Ej: "[OX2H]"
  minCount: number;
  description?: string;
}

export interface WinConditions {
  targetFormula?: string;
  targetCanonicalSmiles?: string;
  acceptedSmiles?: string[];
  requiredSubstructures?: SubstructureRequirement[];
  forbiddenSubstructures?: SubstructureRequirement[];
  expectedRingCount?: number;
  mustBeConnected: boolean;
}

export interface MissionConfig {
  id: string;
  world: 1 | 2 | 3 | 4;
  title: string;
  enzymeName?: string;
  objectiveDescription: string;
  pedagogicalHint: string;
  biochemicalContext?: string;
  allowedElements: ElementSymbol[];
  initialGraph?: MolecularGraph;
  winConditions: WinConditions;
}
