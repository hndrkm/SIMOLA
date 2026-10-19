import { BondOrder, ElementSymbol, MolecularGraph } from './types';
import { getMaxValence } from './constants';

export type TemplateCategory = 'functional_group' | 'coenzyme' | 'base_skeleton';

export interface TemplateAtom {
  tempId: string;
  element: ElementSymbol;
  x: number; // Coordenadas relativas en píxeles
  y: number;
  formalCharge?: number;
}

export interface TemplateBond {
  sourceTempId: string;
  targetTempId: string;
  order: BondOrder;
}

export interface MolecularTemplate {
  id: string;
  name: string;
  abbreviation: string; // ej: "-PO₃²⁻", "-OH", "CoA-SH"
  category: TemplateCategory;
  description: string;
  biochemicalRole: string;
  attachmentAtomTempId: string; // Átomo que se une al hacer Sprout
  atoms: TemplateAtom[];
  bonds: TemplateBond[];
}

export const TEMPLATES: MolecularTemplate[] = [
  // ==========================================
  // 1. GRUPOS FUNCIONALES
  // ==========================================
  {
    id: 'fg_phosphate',
    name: 'Grupo Fosfato',
    abbreviation: '-PO₃²⁻',
    category: 'functional_group',
    description: 'Éster fosfórico ionizado a pH fisiológico',
    biochemicalRole: 'Transferencia de energía (ATP/ADP), activación metabólica y señalización celular',
    attachmentAtomTempId: 'P',
    atoms: [
      { tempId: 'P', element: 'P', x: 0, y: 0, formalCharge: 0 },
      { tempId: 'O_dbl', element: 'O', x: 0, y: -45, formalCharge: 0 },
      { tempId: 'O_neg1', element: 'O', x: 42, y: 22, formalCharge: -1 },
      { tempId: 'O_neg2', element: 'O', x: -42, y: 22, formalCharge: -1 },
    ],
    bonds: [
      { sourceTempId: 'P', targetTempId: 'O_dbl', order: 2 },
      { sourceTempId: 'P', targetTempId: 'O_neg1', order: 1 },
      { sourceTempId: 'P', targetTempId: 'O_neg2', order: 1 },
    ],
  },
  {
    id: 'fg_hydroxyl',
    name: 'Grupo Hidroxilo',
    abbreviation: '-OH',
    category: 'functional_group',
    description: 'Función alcohol o fenol polar',
    biochemicalRole: 'Puentes de hidrógeno, solubilidad acuosa y reactividad en azúcares y aminoácidos (Ser, Thr, Tyr)',
    attachmentAtomTempId: 'O',
    atoms: [
      { tempId: 'O', element: 'O', x: 0, y: 0, formalCharge: 0 },
      { tempId: 'H', element: 'H', x: 38, y: -22, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'O', targetTempId: 'H', order: 1 },
    ],
  },
  {
    id: 'fg_carbonyl',
    name: 'Grupo Carbonilo',
    abbreviation: 'C=O',
    category: 'functional_group',
    description: 'Carbonilo electrófilo de aldehídos y cetonas',
    biochemicalRole: 'Intermediarios de glucólisis, tautomería ceto-enólica y adición nucleofílica',
    attachmentAtomTempId: 'C',
    atoms: [
      { tempId: 'C', element: 'C', x: 0, y: 0, formalCharge: 0 },
      { tempId: 'O', element: 'O', x: 0, y: -45, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'C', targetTempId: 'O', order: 2 },
    ],
  },
  {
    id: 'fg_carboxyl',
    name: 'Grupo Carboxilo',
    abbreviation: '-COOH',
    category: 'functional_group',
    description: 'Ácido carboxílico ionizable a carboxilato (-COO⁻)',
    biochemicalRole: 'Ácidos grasos, aminoácidos e intermediarios del ciclo de Krebs (citrato, malato)',
    attachmentAtomTempId: 'C',
    atoms: [
      { tempId: 'C', element: 'C', x: 0, y: 0, formalCharge: 0 },
      { tempId: 'O_dbl', element: 'O', x: 35, y: -35, formalCharge: 0 },
      { tempId: 'O_neg', element: 'O', x: 38, y: 35, formalCharge: -1 },
    ],
    bonds: [
      { sourceTempId: 'C', targetTempId: 'O_dbl', order: 2 },
      { sourceTempId: 'C', targetTempId: 'O_neg', order: 1 },
    ],
  },
  {
    id: 'fg_amino',
    name: 'Grupo Amino',
    abbreviation: '-NH₂',
    category: 'functional_group',
    description: 'Amina primaria básica',
    biochemicalRole: 'Eslabón para enlaces peptídicos, bases nitrogenadas y transporte de nitrógeno (glutamina)',
    attachmentAtomTempId: 'N',
    atoms: [
      { tempId: 'N', element: 'N', x: 0, y: 0, formalCharge: 0 },
      { tempId: 'H1', element: 'H', x: 38, y: -22, formalCharge: 0 },
      { tempId: 'H2', element: 'H', x: 38, y: 22, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'N', targetTempId: 'H1', order: 1 },
      { sourceTempId: 'N', targetTempId: 'H2', order: 1 },
    ],
  },
  {
    id: 'fg_thiol',
    name: 'Grupo Tiol (Sulfhidrilo)',
    abbreviation: '-SH',
    category: 'functional_group',
    description: 'Análogo azufrado del hidroxilo con alta reactividad redox',
    biochemicalRole: 'Puentes disulfuro en proteínas (cisteína) y formación de tioésteres de alta energía',
    attachmentAtomTempId: 'S',
    atoms: [
      { tempId: 'S', element: 'S', x: 0, y: 0, formalCharge: 0 },
      { tempId: 'H', element: 'H', x: 42, y: -22, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'S', targetTempId: 'H', order: 1 },
    ],
  },
  {
    id: 'fg_acetyl',
    name: 'Grupo Acetilo',
    abbreviation: '-COCH₃',
    category: 'functional_group',
    description: 'Radical acilo derivado del ácido acético',
    biochemicalRole: 'Sustrato central del ciclo de Krebs (Acetil-CoA) y modificación epigenética de histonas',
    attachmentAtomTempId: 'C_carbonyl',
    atoms: [
      { tempId: 'C_carbonyl', element: 'C', x: 0, y: 0, formalCharge: 0 },
      { tempId: 'O_carbonyl', element: 'O', x: 0, y: -45, formalCharge: 0 },
      { tempId: 'C_methyl', element: 'C', x: 45, y: 22, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'C_carbonyl', targetTempId: 'O_carbonyl', order: 2 },
      { sourceTempId: 'C_carbonyl', targetTempId: 'C_methyl', order: 1 },
    ],
  },

  // ==========================================
  // 2. COENZIMAS Y MEDIADORES
  // ==========================================
  {
    id: 'co_acetyl_coa',
    name: 'Acetil-Coenzima A',
    abbreviation: 'CH₃CO-S-CoA',
    category: 'coenzyme',
    description: 'Tioéster de alta energía que transporta grupos acetilo al ciclo de Krebs',
    biochemicalRole: 'Encrucijada metabólica entre glucólisis, beta-oxidación de lípidos y cetogénesis',
    attachmentAtomTempId: 'C1',
    atoms: [
      { tempId: 'C_me', element: 'C', x: -90, y: 25, formalCharge: 0 },
      { tempId: 'C1', element: 'C', x: -45, y: 0, formalCharge: 0 },
      { tempId: 'O1', element: 'O', x: -45, y: -45, formalCharge: 0 },
      { tempId: 'S', element: 'S', x: 0, y: 22, formalCharge: 0 },
      { tempId: 'C_pant1', element: 'C', x: 45, y: 0, formalCharge: 0 },
      { tempId: 'C_pant2', element: 'C', x: 90, y: 22, formalCharge: 0 },
      { tempId: 'N_pant', element: 'N', x: 135, y: 0, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'C_me', targetTempId: 'C1', order: 1 },
      { sourceTempId: 'C1', targetTempId: 'O1', order: 2 },
      { sourceTempId: 'C1', targetTempId: 'S', order: 1 },
      { sourceTempId: 'S', targetTempId: 'C_pant1', order: 1 },
      { sourceTempId: 'C_pant1', targetTempId: 'C_pant2', order: 1 },
      { sourceTempId: 'C_pant2', targetTempId: 'N_pant', order: 1 },
    ],
  },
  {
    id: 'co_lipoamide',
    name: 'Lipoamida (Esqueleto Redox)',
    abbreviation: 'Lipoamida',
    category: 'coenzyme',
    description: 'Brazo oscilante ditiolano de 14 Ångströms de la enzima E2 del complejo PDH',
    biochemicalRole: 'Acopla la descarboxilación oxidativa del piruvato a la reducción de NAD⁺ y síntesis de Acetil-CoA',
    attachmentAtomTempId: 'C_head',
    atoms: [
      // Anillo de 1,2-ditiolano de 5 miembros
      { tempId: 'C_head', element: 'C', x: -120, y: 0, formalCharge: 0 },
      { tempId: 'C_ring1', element: 'C', x: -90, y: -35, formalCharge: 0 },
      { tempId: 'S1', element: 'S', x: -45, y: -30, formalCharge: 0 },
      { tempId: 'S2', element: 'S', x: -45, y: 20, formalCharge: 0 },
      { tempId: 'C_ring2', element: 'C', x: -90, y: 30, formalCharge: 0 },
      // Cadena hidrocarbonada y amida
      { tempId: 'C_chain1', element: 'C', x: -160, y: 25, formalCharge: 0 },
      { tempId: 'C_chain2', element: 'C', x: -205, y: 0, formalCharge: 0 },
      { tempId: 'C_carbonyl', element: 'C', x: -250, y: 25, formalCharge: 0 },
      { tempId: 'O_amide', element: 'O', x: -250, y: 70, formalCharge: 0 },
      { tempId: 'N_amide', element: 'N', x: -295, y: 0, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'C_head', targetTempId: 'C_ring1', order: 1 },
      { sourceTempId: 'C_ring1', targetTempId: 'S1', order: 1 },
      { sourceTempId: 'S1', targetTempId: 'S2', order: 1 },
      { sourceTempId: 'S2', targetTempId: 'C_ring2', order: 1 },
      { sourceTempId: 'C_ring2', targetTempId: 'C_head', order: 1 },
      { sourceTempId: 'C_head', targetTempId: 'C_chain1', order: 1 },
      { sourceTempId: 'C_chain1', targetTempId: 'C_chain2', order: 1 },
      { sourceTempId: 'C_chain2', targetTempId: 'C_carbonyl', order: 1 },
      { sourceTempId: 'C_carbonyl', targetTempId: 'O_amide', order: 2 },
      { sourceTempId: 'C_carbonyl', targetTempId: 'N_amide', order: 1 },
    ],
  },
  {
    id: 'co_pyrophosphate',
    name: 'Pirofosfato Inorgánico (PPi)',
    abbreviation: 'PPi',
    category: 'coenzyme',
    description: 'Dímero de fosfato unido por enlace anhídrido fosfórico',
    biochemicalRole: 'Subproducto de la síntesis de ácidos nucleicos; su hidrólisis termodinámica impulsa reacciones endergónicas',
    attachmentAtomTempId: 'P1',
    atoms: [
      { tempId: 'P1', element: 'P', x: -50, y: 0, formalCharge: 0 },
      { tempId: 'O1_dbl', element: 'O', x: -50, y: -45, formalCharge: 0 },
      { tempId: 'O1_neg', element: 'O', x: -92, y: 22, formalCharge: -1 },
      { tempId: 'O_bridge', element: 'O', x: 0, y: 0, formalCharge: 0 },
      { tempId: 'P2', element: 'P', x: 50, y: 0, formalCharge: 0 },
      { tempId: 'O2_dbl', element: 'O', x: 50, y: -45, formalCharge: 0 },
      { tempId: 'O2_neg1', element: 'O', x: 92, y: 22, formalCharge: -1 },
      { tempId: 'O2_neg2', element: 'O', x: 50, y: 45, formalCharge: -1 },
    ],
    bonds: [
      { sourceTempId: 'P1', targetTempId: 'O1_dbl', order: 2 },
      { sourceTempId: 'P1', targetTempId: 'O1_neg', order: 1 },
      { sourceTempId: 'P1', targetTempId: 'O_bridge', order: 1 },
      { sourceTempId: 'O_bridge', targetTempId: 'P2', order: 1 },
      { sourceTempId: 'P2', targetTempId: 'O2_dbl', order: 2 },
      { sourceTempId: 'P2', targetTempId: 'O2_neg1', order: 1 },
      { sourceTempId: 'P2', targetTempId: 'O2_neg2', order: 1 },
    ],
  },

  // ==========================================
  // 3. ESTRUCTURAS BASE
  // ==========================================
  {
    id: 'base_glucopyranose',
    name: 'Glucopiranosa (Esqueleto)',
    abbreviation: 'Glc',
    category: 'base_skeleton',
    description: 'Forma hemiacetálica cíclica de 6 miembros de la D-glucosa',
    biochemicalRole: 'Monosacárido combustible fundamental y precursor de glucógeno y ATP en la glucólisis',
    attachmentAtomTempId: 'C1',
    atoms: [
      { tempId: 'O5', element: 'O', x: 30, y: -50, formalCharge: 0 },
      { tempId: 'C1', element: 'C', x: 75, y: -15, formalCharge: 0 },
      { tempId: 'C2', element: 'C', x: 50, y: 35, formalCharge: 0 },
      { tempId: 'C3', element: 'C', x: -10, y: 50, formalCharge: 0 },
      { tempId: 'C4', element: 'C', x: -55, y: 15, formalCharge: 0 },
      { tempId: 'C5', element: 'C', x: -30, y: -35, formalCharge: 0 },
      { tempId: 'C6', element: 'C', x: -75, y: -70, formalCharge: 0 },
      { tempId: 'O6', element: 'O', x: -120, y: -60, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'O5', targetTempId: 'C1', order: 1 },
      { sourceTempId: 'C1', targetTempId: 'C2', order: 1 },
      { sourceTempId: 'C2', targetTempId: 'C3', order: 1 },
      { sourceTempId: 'C3', targetTempId: 'C4', order: 1 },
      { sourceTempId: 'C4', targetTempId: 'C5', order: 1 },
      { sourceTempId: 'C5', targetTempId: 'O5', order: 1 },
      { sourceTempId: 'C5', targetTempId: 'C6', order: 1 },
      { sourceTempId: 'C6', targetTempId: 'O6', order: 1 },
    ],
  },
  {
    id: 'base_fructofuranose',
    name: 'Fructofuranosa (Esqueleto)',
    abbreviation: 'Fru',
    category: 'base_skeleton',
    description: 'Anillo hemicetálico de 5 miembros de la D-fructosa',
    biochemicalRole: 'Intermediario glucolítico (Fructosa-6-fosfato y Fructosa-1,6-bisfosfato)',
    attachmentAtomTempId: 'C2',
    atoms: [
      { tempId: 'O', element: 'O', x: 0, y: -45, formalCharge: 0 },
      { tempId: 'C2', element: 'C', x: 48, y: -15, formalCharge: 0 },
      { tempId: 'C3', element: 'C', x: 30, y: 38, formalCharge: 0 },
      { tempId: 'C4', element: 'C', x: -30, y: 38, formalCharge: 0 },
      { tempId: 'C5', element: 'C', x: -48, y: -15, formalCharge: 0 },
      { tempId: 'C1', element: 'C', x: 92, y: -35, formalCharge: 0 },
      { tempId: 'C6', element: 'C', x: -92, y: -35, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'O', targetTempId: 'C2', order: 1 },
      { sourceTempId: 'C2', targetTempId: 'C3', order: 1 },
      { sourceTempId: 'C3', targetTempId: 'C4', order: 1 },
      { sourceTempId: 'C4', targetTempId: 'C5', order: 1 },
      { sourceTempId: 'C5', targetTempId: 'O', order: 1 },
      { sourceTempId: 'C2', targetTempId: 'C1', order: 1 },
      { sourceTempId: 'C5', targetTempId: 'C6', order: 1 },
    ],
  },
  {
    id: 'base_pyruvate',
    name: 'Piruvato (2-Oxopropanoato)',
    abbreviation: 'Piruvato',
    category: 'base_skeleton',
    description: 'Alfa-cetoácido producto terminal de la glucólisis aeróbica',
    biochemicalRole: 'Sustrato para el Complejo PDH, fermentación láctica y gluconeogénesis',
    attachmentAtomTempId: 'C2',
    atoms: [
      { tempId: 'C3', element: 'C', x: -60, y: 30, formalCharge: 0 },
      { tempId: 'C2', element: 'C', x: 0, y: 0, formalCharge: 0 },
      { tempId: 'O_keto', element: 'O', x: 0, y: -48, formalCharge: 0 },
      { tempId: 'C1', element: 'C', x: 55, y: 25, formalCharge: 0 },
      { tempId: 'O1_dbl', element: 'O', x: 95, y: -5, formalCharge: 0 },
      { tempId: 'O1_neg', element: 'O', x: 55, y: 70, formalCharge: -1 },
    ],
    bonds: [
      { sourceTempId: 'C3', targetTempId: 'C2', order: 1 },
      { sourceTempId: 'C2', targetTempId: 'O_keto', order: 2 },
      { sourceTempId: 'C2', targetTempId: 'C1', order: 1 },
      { sourceTempId: 'C1', targetTempId: 'O1_dbl', order: 2 },
      { sourceTempId: 'C1', targetTempId: 'O1_neg', order: 1 },
    ],
  },
  {
    id: 'base_g3p',
    name: 'Gliceraldehído-3-Fosfato (G3P)',
    abbreviation: 'G3P',
    category: 'base_skeleton',
    description: 'Triosa fosfato de alta energía producida por la aldolasa',
    biochemicalRole: 'Punto de entrada a la fase de rendimiento energético de la glucólisis',
    attachmentAtomTempId: 'C1',
    atoms: [
      // Aldehído C1
      { tempId: 'O_ald', element: 'O', x: -110, y: -40, formalCharge: 0 },
      { tempId: 'C1', element: 'C', x: -110, y: 10, formalCharge: 0 },
      // C2 con OH
      { tempId: 'C2', element: 'C', x: -60, y: 35, formalCharge: 0 },
      { tempId: 'O_oh', element: 'O', x: -60, y: 80, formalCharge: 0 },
      // C3 con O-Fosfato
      { tempId: 'C3', element: 'C', x: -10, y: 10, formalCharge: 0 },
      { tempId: 'O_bridge', element: 'O', x: 35, y: 35, formalCharge: 0 },
      { tempId: 'P', element: 'P', x: 80, y: 10, formalCharge: 0 },
      { tempId: 'O_pdbl', element: 'O', x: 80, y: -35, formalCharge: 0 },
      { tempId: 'O_pneg1', element: 'O', x: 122, y: 32, formalCharge: -1 },
      { tempId: 'O_pneg2', element: 'O', x: 80, y: 55, formalCharge: -1 },
    ],
    bonds: [
      { sourceTempId: 'C1', targetTempId: 'O_ald', order: 2 },
      { sourceTempId: 'C1', targetTempId: 'C2', order: 1 },
      { sourceTempId: 'C2', targetTempId: 'O_oh', order: 1 },
      { sourceTempId: 'C2', targetTempId: 'C3', order: 1 },
      { sourceTempId: 'C3', targetTempId: 'O_bridge', order: 1 },
      { sourceTempId: 'O_bridge', targetTempId: 'P', order: 1 },
      { sourceTempId: 'P', targetTempId: 'O_pdbl', order: 2 },
      { sourceTempId: 'P', targetTempId: 'O_pneg1', order: 1 },
      { sourceTempId: 'P', targetTempId: 'O_pneg2', order: 1 },
    ],
  },
  {
    id: 'base_benzene',
    name: 'Benceno',
    abbreviation: 'C₆H₆',
    category: 'base_skeleton',
    description: 'Anillo aromático plano hexagonal con enlaces pi deslocalizados',
    biochemicalRole: 'Núcleo estructural de aminoácidos aromáticos (Phe, Tyr, Trp) y cofactores',
    attachmentAtomTempId: 'C0',
    atoms: [
      { tempId: 'C0', element: 'C', x: 0, y: -50, formalCharge: 0 },
      { tempId: 'C1', element: 'C', x: 43, y: -25, formalCharge: 0 },
      { tempId: 'C2', element: 'C', x: 43, y: 25, formalCharge: 0 },
      { tempId: 'C3', element: 'C', x: 0, y: 50, formalCharge: 0 },
      { tempId: 'C4', element: 'C', x: -43, y: 25, formalCharge: 0 },
      { tempId: 'C5', element: 'C', x: -43, y: -25, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'C0', targetTempId: 'C1', order: 2 },
      { sourceTempId: 'C1', targetTempId: 'C2', order: 1 },
      { sourceTempId: 'C2', targetTempId: 'C3', order: 2 },
      { sourceTempId: 'C3', targetTempId: 'C4', order: 1 },
      { sourceTempId: 'C4', targetTempId: 'C5', order: 2 },
      { sourceTempId: 'C5', targetTempId: 'C0', order: 1 },
    ],
  },
  {
    id: 'base_naphthalene',
    name: 'Naftaleno',
    abbreviation: 'C₁₀H₈',
    category: 'base_skeleton',
    description: 'Sistema aromático condensado de dos anillos de benceno orto-fusionados',
    biochemicalRole: 'Precursor de derivados de naftoquinona como la Vitamina K (Menaquinona)',
    attachmentAtomTempId: 'C0',
    atoms: [
      // Primer anillo (izq)
      { tempId: 'C0', element: 'C', x: -43, y: -50, formalCharge: 0 },
      { tempId: 'C1', element: 'C', x: 0, y: -25, formalCharge: 0 }, // compartido
      { tempId: 'C2', element: 'C', x: 0, y: 25, formalCharge: 0 },  // compartido
      { tempId: 'C3', element: 'C', x: -43, y: 50, formalCharge: 0 },
      { tempId: 'C4', element: 'C', x: -86, y: 25, formalCharge: 0 },
      { tempId: 'C5', element: 'C', x: -86, y: -25, formalCharge: 0 },
      // Segundo anillo (der)
      { tempId: 'C6', element: 'C', x: 43, y: -50, formalCharge: 0 },
      { tempId: 'C7', element: 'C', x: 86, y: -25, formalCharge: 0 },
      { tempId: 'C8', element: 'C', x: 86, y: 25, formalCharge: 0 },
      { tempId: 'C9', element: 'C', x: 43, y: 50, formalCharge: 0 },
    ],
    bonds: [
      { sourceTempId: 'C0', targetTempId: 'C1', order: 2 },
      { sourceTempId: 'C1', targetTempId: 'C2', order: 1 }, // enlace fusionado
      { sourceTempId: 'C2', targetTempId: 'C3', order: 2 },
      { sourceTempId: 'C3', targetTempId: 'C4', order: 1 },
      { sourceTempId: 'C4', targetTempId: 'C5', order: 2 },
      { sourceTempId: 'C5', targetTempId: 'C0', order: 1 },
      // Segundo anillo
      { sourceTempId: 'C1', targetTempId: 'C6', order: 1 },
      { sourceTempId: 'C6', targetTempId: 'C7', order: 2 },
      { sourceTempId: 'C7', targetTempId: 'C8', order: 1 },
      { sourceTempId: 'C8', targetTempId: 'C9', order: 2 },
      { sourceTempId: 'C9', targetTempId: 'C2', order: 1 },
    ],
  },
];

export function getTemplate(id: string): MolecularTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/**
 * Prepara los nodos y enlaces de una plantilla para estampar en coordenadas (centerX, centerY).
 */
export function stampTemplate(
  template: MolecularTemplate,
  center: { x: number; y: number }
): {
  nodes: Array<{ tempId: string; element: ElementSymbol; x: number; y: number; formalCharge: number }>;
  edges: Array<{ sourceTempId: string; targetTempId: string; order: BondOrder }>;
} {
  const nodes = template.atoms.map((atom) => ({
    tempId: atom.tempId,
    element: atom.element,
    x: Math.round(center.x + atom.x),
    y: Math.round(center.y + atom.y),
    formalCharge: atom.formalCharge || 0,
  }));

  return { nodes, edges: template.bonds };
}

/**
 * Prepara el acoplamiento (Sprouting) de una plantilla sobre un átomo existente.
 * Orienta la plantilla en la dirección libre de enlaces del átomo receptor.
 */
export function sproutTemplate(
  graph: MolecularGraph,
  targetAtomId: string,
  template: MolecularTemplate,
  bondLength: number = 60
): {
  nodes: Array<{ tempId: string; element: ElementSymbol; x: number; y: number; formalCharge: number }>;
  edges: Array<{ sourceTempId: string; targetTempId: string; order: BondOrder }>;
  connectingEdge: { sourceId: string; targetTempId: string; order: BondOrder };
} | null {
  const targetAtom = graph.nodes[targetAtomId];
  if (!targetAtom) return null;

  // Verificar valencia del átomo receptor
  let currentValence = 0;
  for (const e of Object.values(graph.edges)) {
    if (e.sourceId === targetAtomId || e.targetId === targetAtomId) {
      currentValence += e.order;
    }
  }

  const maxValence = getMaxValence(targetAtom.element, targetAtom.formalCharge);
  if (currentValence >= maxValence) {
    // Si la valencia está completa, no se puede acoplar sin violar valencias
    return null;
  }

  // Calcular dirección de crecimiento opuesta a los enlaces existentes
  let avgDx = 0;
  let avgDy = 0;
  let connectedCount = 0;

  for (const e of Object.values(graph.edges)) {
    if (e.sourceId === targetAtomId) {
      const neighbor = graph.nodes[e.targetId];
      if (neighbor) {
        avgDx += neighbor.x - targetAtom.x;
        avgDy += neighbor.y - targetAtom.y;
        connectedCount++;
      }
    } else if (e.targetId === targetAtomId) {
      const neighbor = graph.nodes[e.sourceId];
      if (neighbor) {
        avgDx += neighbor.x - targetAtom.x;
        avgDy += neighbor.y - targetAtom.y;
        connectedCount++;
      }
    }
  }

  let growthAngle = 0;
  if (connectedCount > 0) {
    growthAngle = Math.atan2(-avgDy, -avgDx);
  }

  const attachmentAtom = template.atoms.find((a) => a.tempId === template.attachmentAtomTempId) || template.atoms[0];

  // Coordenada del átomo de acople en el lienzo
  const attachX = targetAtom.x + bondLength * Math.cos(growthAngle);
  const attachY = targetAtom.y + bondLength * Math.sin(growthAngle);

  // Desplazar y rotar los átomos de la plantilla alrededor del attachmentAtom
  const nodes = template.atoms.map((atom) => {
    // Vector relativo desde el attachment point en la plantilla original
    const relX = atom.x - attachmentAtom.x;
    const relY = atom.y - attachmentAtom.y;

    // Rotar por growthAngle
    const rotX = relX * Math.cos(growthAngle) - relY * Math.sin(growthAngle);
    const rotY = relX * Math.sin(growthAngle) + relY * Math.cos(growthAngle);

    return {
      tempId: atom.tempId,
      element: atom.element,
      x: Math.round(attachX + rotX),
      y: Math.round(attachY + rotY),
      formalCharge: atom.formalCharge || 0,
    };
  });

  return {
    nodes,
    edges: template.bonds,
    connectingEdge: {
      sourceId: targetAtomId,
      targetTempId: attachmentAtom.tempId,
      order: 1,
    },
  };
}
