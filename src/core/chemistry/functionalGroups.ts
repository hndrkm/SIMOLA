export interface FunctionalGroupDef {
  id: string;
  name: string;
  description: string;
  smarts: string;
}

export const BIOCHEMICAL_FUNCTIONAL_GROUPS: FunctionalGroupDef[] = [
  {
    id: 'alcohol',
    name: 'Alcohol (-OH)',
    description: 'Grupo hidroxilo unido a carbono alifático (ej. etanol, glucosa, serina).',
    smarts: '[#6][OX2H]',
  },
  {
    id: 'aldehyde',
    name: 'Aldehído (-CHO)',
    description: 'Carbonilo terminal (ej. gliceraldehído, formaldehído).',
    smarts: '[CX3H1](=O)[#6,H]',
  },
  {
    id: 'ketone',
    name: 'Cetona (C=O)',
    description: 'Carbonilo interno flanqueado por carbonos (ej. acetona, fructosa, piruvato).',
    smarts: '[#6][CX3](=O)[#6]',
  },
  {
    id: 'carboxylic_acid',
    name: 'Ácido Carboxílico (-COOH / -COO⁻)',
    description: 'Grupo carboxilo o carboxilato desprotonado (ej. acetato, aminoácidos, ácidos grasos).',
    smarts: '[CX3](=O)[OX2H1,OX1-]',
  },
  {
    id: 'ester',
    name: 'Éster (-COOR)',
    description: 'Enlace éster de condensación carboxílica (ej. triglicéridos, acetil-CoA).',
    smarts: '[#6][CX3](=O)[OX2][#6]',
  },
  {
    id: 'ether',
    name: 'Éter (R-O-R)',
    description: 'Átomo de oxígeno puente entre dos carbonos (ej. dimetil éter, enlaces glucosídicos).',
    smarts: '[#6][OX2][#6]',
  },
  {
    id: 'amine_primary',
    name: 'Amina Primaria (-NH₂)',
    description: 'Grupo amino libre primario (ej. lisina, dopamina).',
    smarts: '[NX3;H2;!$(NC=O)]',
  },
  {
    id: 'amine_secondary',
    name: 'Amina Secundaria (-NH-)',
    description: 'Grupo amino secundario (ej. prolina, epinefrina).',
    smarts: '[NX3;H1;!$(NC=O)]',
  },
  {
    id: 'amine_tertiary',
    name: 'Amina Terciaria (-N-)',
    description: 'Nitrógeno con tres sustituyentes de carbono.',
    smarts: '[NX3;H0;!$(NC=O)]',
  },
  {
    id: 'amide',
    name: 'Amida / Enlace Peptídico (-CONH-)',
    description: 'Enlace peptídico fundamental de proteínas y péptidos.',
    smarts: '[NX3][CX3](=[OX1])',
  },
  {
    id: 'thiol',
    name: 'Tiol / Sulfhidrilo (-SH)',
    description: 'Grupo tiol reactivo (ej. cisteína, Coenzima A).',
    smarts: '[#6][SX2H]',
  },
  {
    id: 'disulfide',
    name: 'Puente Disulfuro (R-S-S-R)',
    description: 'Enlace disulfuro covalente estabilizador de estructuras terciarias de proteínas.',
    smarts: '[#6][SX2][SX2][#6]',
  },
  {
    id: 'phosphate',
    name: 'Grupo Fosfato (PO₄)',
    description: 'Éster o ion fosfato reactivo (ej. ATP, Glucosa-6-fosfato, ADN/ARN).',
    smarts: '[PX4](=[OX1,OX2])([OX1-,OX2H0,OX2H1])([OX1-,OX2H0,OX2H1])[OX1-,OX2H0,OX2H1]',
  },
  {
    id: 'aromatic_ring',
    name: 'Anillo Aromático (Areno)',
    description: 'Sistema conjugado cerrado de electrones pi (ej. benceno, tirosina, triptófano).',
    smarts: 'a1aaaaa1',
  },
  {
    id: 'alkene',
    name: 'Alqueno (C=C)',
    description: 'Doble enlace carbono-carbono insaturado (ej. fumarato, ácidos grasos insaturados).',
    smarts: '[CX3]=[CX3]',
  },
  {
    id: 'alkyne',
    name: 'Alquino (C≡C)',
    description: 'Triple enlace carbono-carbono.',
    smarts: '[CX2]#[CX2]',
  },
];
