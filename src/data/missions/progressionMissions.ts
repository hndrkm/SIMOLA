import { MissionConfig } from '../../core/model/types';

/**
 * Catálogo de los 3 Mundos y 7 Misiones Progresivas (SIMOLA - Etapa 5 - T5.2).
 *
 * Mundo 1: Entrenamiento Químico (3 misiones)
 * Mundo 2: Ruta de la Glucólisis (3 misiones)
 * Mundo 3: Complejo Piruvato Deshidrogenasa (1 misión)
 */
export const PROGRESSION_MISSIONS: MissionConfig[] = [
  // ==========================================
  // MUNDO 1: ENTRENAMIENTO QUÍMICO
  // ==========================================
  {
    id: 'm1_ethene',
    world: 1,
    title: 'Fundamentos: Enlaces Múltiples (Eteno)',
    enzymeName: 'Nivel 1: Alquenos y Geometría',
    objectiveDescription:
      'Construye una molécula de Eteno (C₂H₄). Convierte el enlace simple C-C en un enlace doble (C=C) para completar la tetravalencia del carbono.',
    pedagogicalHint:
      'Haz clic sobre el enlace C-C para cambiar su orden a 2 (enlace doble). Cada carbono compartirá 2 pares de electrones y completará su octeto con 2 hidrógenos implícitos.',
    biochemicalContext:
      'El eteno o etileno (C₂H₄) es el alqueno más simple y actúa como una fitohormona gaseosa clave que estimula la maduración de los frutos y la abscisión foliar en las plantas.',
    allowedElements: ['C', 'H'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 470, y: 350 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 530, y: 350 },
      },
      edges: {
        b1: { id: 'b1', sourceId: 'c1', targetId: 'c2', order: 1 },
      },
    },
    winConditions: {
      targetFormula: 'C2H4',
      targetCanonicalSmiles: 'C=C',
      acceptedSmiles: ['C=C'],
      expectedRingCount: 0,
      mustBeConnected: true,
    },
  },
  {
    id: 'm1_isomers',
    world: 1,
    title: 'Isomería Constitucional: De Éter a Alcohol',
    enzymeName: 'Nivel 2: Isómeros de Función',
    objectiveDescription:
      'El tablero contiene Dimetil Éter (C-O-C). Reorganiza los enlaces y átomos para transformarlo en su isómero de función: Etanol (C-C-O).',
    pedagogicalHint:
      'Ambas moléculas comparten la fórmula C₂H₆O. En el éter el oxígeno divide la cadena (C-O-C), mientras que en el etanol los carbonos están conectados directamente y el oxígeno forma un alcohol terminal (-OH).',
    biochemicalContext:
      'El etanol y el dimetil éter son isómeros constitucionales con propiedades físicas y químicas radicalmente diferentes. El etanol es el producto terminal de la fermentación alcohólica por levaduras.',
    allowedElements: ['C', 'H', 'O'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 440, y: 360 },
        o1: { id: 'o1', element: 'O', formalCharge: 0, x: 500, y: 320 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 560, y: 360 },
      },
      edges: {
        b1: { id: 'b1', sourceId: 'c1', targetId: 'o1', order: 1 },
        b2: { id: 'b2', sourceId: 'o1', targetId: 'c2', order: 1 },
      },
    },
    winConditions: {
      targetFormula: 'C2H6O',
      targetCanonicalSmiles: 'CCO',
      acceptedSmiles: ['CCO', 'OCC'],
      requiredSubstructures: [
        {
          name: 'Grupo Hidroxilo / Alcohol (-OH)',
          smarts: '[OX2H]',
          minCount: 1,
          description:
            'El etanol requiere un grupo alcohol terminal (-OH) con un átomo de hidrógeno unido al oxígeno.',
        },
      ],
      forbiddenSubstructures: [
        {
          name: 'Función Éter (C-O-C)',
          smarts: '[#6][OX2][#6]',
          minCount: 1,
          description:
            'La molécula aún conserva la función éter (C-O-C). Debes conectar los dos átomos de carbono entre sí (C-C-O).',
        },
      ],
      mustBeConnected: true,
      expectedRingCount: 0,
    },
  },
  {
    id: 'm1_phosphate',
    world: 1,
    title: 'Activación Química: Formación de Enlace Fosfoéster',
    enzymeName: 'Nivel 3: Fosforilación de Alcoholes',
    objectiveDescription:
      'Acopla un grupo Fosfato (-PO₃²⁻) al oxígeno terminal del 1-Propanol para sintetizar 1-Propil Fosfato.',
    pedagogicalHint:
      'Conecta el oxígeno libre del alcohol primario al átomo de fósforo central del grupo fosfato para formar el enlace fosfoéster covalente (C-O-P).',
    biochemicalContext:
      'La fosforilación mediante enlace fosfoéster es la estrategia universal que utilizan las quinasas celulares para activar metabolitos y atraparlos en el citoplasma impidiendo su difusión a través de la membrana lipídica.',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 380, y: 350 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 430, y: 320 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 480, y: 350 },
        o1: { id: 'o1', element: 'O', formalCharge: 0, x: 530, y: 320 },
      },
      edges: {
        b1: { id: 'b1', sourceId: 'c1', targetId: 'c2', order: 1 },
        b2: { id: 'b2', sourceId: 'c2', targetId: 'c3', order: 1 },
        b3: { id: 'b3', sourceId: 'c3', targetId: 'o1', order: 1 },
      },
    },
    winConditions: {
      targetFormula: 'C3H9O4P',
      acceptedSmiles: [
        'CCCOP(=O)(O)O',
        'CCCOP(=O)([O-])[O-]',
        'CCCOP(=O)(O)[O-]',
      ],
      requiredSubstructures: [
        {
          name: 'Enlace Fosfoéster (C-O-P)',
          smarts: '[#6][OX2]P(=O)',
          minCount: 1,
          description:
            'Falta el enlace fosfoéster que conecta el carbono de la cadena con el átomo de fósforo a través del oxígeno (C-O-P).',
        },
      ],
      mustBeConnected: true,
    },
  },

  // ==========================================
  // MUNDO 2: RUTA DE LA GLUCÓLISIS
  // ==========================================
  {
    id: 'm2_hexokinase',
    world: 2,
    title: 'Paso 1: Hexoquinasa (Fosforilación en C6)',
    enzymeName: 'Hexoquinasa (EC 2.7.1.1)',
    objectiveDescription:
      'Fosforila la D-Glucosa en el Carbono 6 para sintetizar Glucosa-6-fosfato (G6P) utilizando un grupo fosfato mediado por ATP.',
    pedagogicalHint:
      'El anillo piranósico está protegido (bloqueado). Observa el Carbono 6 (-CH₂-OH) fuera del anillo: su átomo de oxígeno está desbloqueado. Conecta allí el átomo de fósforo del grupo fosfato para formar el éster fosfórico en C6.',
    biochemicalContext:
      'La Hexoquinasa cataliza el primer paso marcapasos irreversible de la glucólisis consumiendo 1 ATP. La adición del fosfato en C6 atrapa a la glucosa en el citosol y desestabiliza la molécula para las siguientes etapas catabólicas.',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        o5: { id: 'o5', element: 'O', formalCharge: 0, x: 490, y: 310, isLocked: true },
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 535, y: 345, isLocked: true },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 510, y: 395, isLocked: true },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 450, y: 410, isLocked: true },
        c4: { id: 'c4', element: 'C', formalCharge: 0, x: 405, y: 375, isLocked: true },
        c5: { id: 'c5', element: 'C', formalCharge: 0, x: 430, y: 325, isLocked: true },
        c6: { id: 'c6', element: 'C', formalCharge: 0, x: 385, y: 290, isLocked: true },
        o6: { id: 'o6', element: 'O', formalCharge: 0, x: 340, y: 300, isLocked: false },
      },
      edges: {
        b_o5_c1: { id: 'b_o5_c1', sourceId: 'o5', targetId: 'c1', order: 1, isLocked: true },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1, isLocked: true },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1, isLocked: true },
        b_c3_c4: { id: 'b_c3_c4', sourceId: 'c3', targetId: 'c4', order: 1, isLocked: true },
        b_c4_c5: { id: 'b_c4_c5', sourceId: 'c4', targetId: 'c5', order: 1, isLocked: true },
        b_c5_o5: { id: 'b_c5_o5', sourceId: 'c5', targetId: 'o5', order: 1, isLocked: true },
        b_c5_c6: { id: 'b_c5_c6', sourceId: 'c5', targetId: 'c6', order: 1, isLocked: true },
        b_c6_o6: { id: 'b_c6_o6', sourceId: 'c6', targetId: 'o6', order: 1, isLocked: true },
      },
    },
    winConditions: {
      acceptedSmiles: [
        'O=P(O)(O)OCC1OC(O)C(O)C(O)C1O',
        'O=P([O-])([O-])OCC1OC(O)C(O)C(O)C1O',
        'O=P(O)([O-])OCC1OC(O)C(O)C(O)C1O',
      ],
      requiredSubstructures: [
        {
          name: 'Éster de Fosfato en C6 (C-O-P)',
          smarts: '[#6][OX2]P(=O)',
          minCount: 1,
          description:
            'Falta conectar el grupo fosfato al oxígeno del carbono 6 para formar el enlace fosfoéster característico de la Glucosa-6-P.',
        },
      ],
      expectedRingCount: 1,
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_gapdh',
    world: 2,
    title: 'Paso 6: GAPDH (Oxidación y Fosforilación)',
    enzymeName: 'Gliceraldehído-3-Fosfato Deshidrogenasa (GAPDH - EC 1.2.1.12)',
    objectiveDescription:
      'Oxida el grupo aldehído del C1 en el Gliceraldehído-3-fosfato (G3P) y acopla un fosfato inorgánico (Pi) para sintetizar 1,3-Bisfosfoglicerato (1,3-BPG).',
    pedagogicalHint:
      'El esqueleto C2-C3 con su fosfato en C3 está protegido. El carbono C1 está libre: oxida el aldehído incorporando un grupo fosfato a través de un átomo de oxígeno para crear el enlace de anhídrido mixto acil-fosfato (C(=O)-O-P).',
    biochemicalContext:
      'La GAPDH cataliza la primera reacción de conservación de energía de la glucólisis acoplando la reducción de NAD⁺ a NADH con la incorporación de Pi sin gasto de ATP, produciendo 1,3-BPG con un enlace acil-fosfato de altísima energía.',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 380, y: 340, isLocked: false },
        o_ald: { id: 'o_ald', element: 'O', formalCharge: 0, x: 380, y: 280, isLocked: false },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 440, y: 370, isLocked: true },
        o_c2: { id: 'o_c2', element: 'O', formalCharge: 0, x: 440, y: 420, isLocked: true },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 500, y: 340, isLocked: true },
        o_bridge: { id: 'o_bridge', element: 'O', formalCharge: 0, x: 550, y: 370, isLocked: true },
        p3: { id: 'p3', element: 'P', formalCharge: 0, x: 600, y: 340, isLocked: true },
        o3_dbl: { id: 'o3_dbl', element: 'O', formalCharge: 0, x: 600, y: 285, isLocked: true },
        o3_neg1: { id: 'o3_neg1', element: 'O', formalCharge: -1, x: 645, y: 370, isLocked: true },
        o3_neg2: { id: 'o3_neg2', element: 'O', formalCharge: -1, x: 600, y: 395, isLocked: true },
      },
      edges: {
        b_c1_oald: { id: 'b_c1_oald', sourceId: 'c1', targetId: 'o_ald', order: 2, isLocked: false },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1, isLocked: true },
        b_c2_oc2: { id: 'b_c2_oc2', sourceId: 'c2', targetId: 'o_c2', order: 1, isLocked: true },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1, isLocked: true },
        b_c3_obridge: { id: 'b_c3_obridge', sourceId: 'c3', targetId: 'o_bridge', order: 1, isLocked: true },
        b_obridge_p3: { id: 'b_obridge_p3', sourceId: 'o_bridge', targetId: 'p3', order: 1, isLocked: true },
        b_p3_o3dbl: { id: 'b_p3_o3dbl', sourceId: 'p3', targetId: 'o3_dbl', order: 2, isLocked: true },
        b_p3_o3neg1: { id: 'b_p3_o3neg1', sourceId: 'p3', targetId: 'o3_neg1', order: 1, isLocked: true },
        b_p3_o3neg2: { id: 'b_p3_o3neg2', sourceId: 'p3', targetId: 'o3_neg2', order: 1, isLocked: true },
      },
    },
    winConditions: {
      acceptedSmiles: [
        'O=C(OP(=O)(O)O)C(O)COP(=O)(O)O',
        'O=C(OP(=O)([O-])[O-])C(O)COP(=O)([O-])[O-]',
        'O=C(OP(=O)(O)[O-])C(O)COP(=O)(O)[O-]',
        '[O-]P(=O)([O-])OCC(O)C(=O)OP(=O)([O-])[O-]',
      ],
      requiredSubstructures: [
        {
          name: 'Enlace Acil-Fosfato (C(=O)-O-P)',
          smarts: '[#6](=O)OP(=O)',
          minCount: 1,
          description:
            'Falta el enlace acil-fosfato de alta energía en el carbono 1 característico del 1,3-Bisfosfoglicerato.',
        },
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_pyruvate_kinase',
    world: 2,
    title: 'Paso 10: Piruvato Quinasa (Desfosforilación de PEP)',
    enzymeName: 'Piruvato Quinasa (EC 2.7.1.40)',
    objectiveDescription:
      'Retira el grupo fosfato del Fosfoenolpiruvato (PEP) y genera la tautomería ceto en el Carbono 2 para producir Piruvato.',
    pedagogicalHint:
      'Elimina el átomo de fósforo y sus oxígenos fosfóricos. Convierte el C2 en un grupo carbonilo (C=O) y satura el C3 a enlace simple para formar el metilo (CH₃-C(=O)-COOH).',
    biochemicalContext:
      'La Piruvato Quinasa cataliza la segunda fosforilación a nivel de sustrato de la glucólisis, transfiriendo irreversiblemente el grupo fosfato de alta energía de PEP al ADP para generar ATP y Piruvato.',
    allowedElements: ['C', 'H', 'O'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 400, y: 360 },
        o1_dbl: { id: 'o1_dbl', element: 'O', formalCharge: 0, x: 400, y: 300 },
        o1_neg: { id: 'o1_neg', element: 'O', formalCharge: -1, x: 350, y: 390 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 450, y: 390 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 490, y: 430 },
        o_bridge: { id: 'o_bridge', element: 'O', formalCharge: 0, x: 450, y: 330 },
        p: { id: 'p', element: 'P', formalCharge: 0, x: 500, y: 300 },
        o_pdbl: { id: 'o_pdbl', element: 'O', formalCharge: 0, x: 500, y: 240 },
        o_pneg1: { id: 'o_pneg1', element: 'O', formalCharge: -1, x: 550, y: 320 },
        o_pneg2: { id: 'o_pneg2', element: 'O', formalCharge: -1, x: 470, y: 250 },
      },
      edges: {
        b_c1_o1dbl: { id: 'b_c1_o1dbl', sourceId: 'c1', targetId: 'o1_dbl', order: 2 },
        b_c1_o1neg: { id: 'b_c1_o1neg', sourceId: 'c1', targetId: 'o1_neg', order: 1 },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 2 },
        b_c2_obridge: { id: 'b_c2_obridge', sourceId: 'c2', targetId: 'o_bridge', order: 1 },
        b_obridge_p: { id: 'b_obridge_p', sourceId: 'o_bridge', targetId: 'p', order: 1 },
        b_p_opdbl: { id: 'b_p_opdbl', sourceId: 'p', targetId: 'o_pdbl', order: 2 },
        b_p_opneg1: { id: 'b_p_opneg1', sourceId: 'p', targetId: 'o_pneg1', order: 1 },
        b_p_opneg2: { id: 'b_p_opneg2', sourceId: 'p', targetId: 'o_pneg2', order: 1 },
      },
    },
    winConditions: {
      targetFormula: 'C3H4O3',
      acceptedSmiles: ['CC(=O)C(=O)O', 'CC(=O)C(=O)[O-]'],
      requiredSubstructures: [
        {
          name: 'Grupo Alfa-Cetoácido (CH₃-C(=O)-C(=O))',
          smarts: '[#6](=O)[#6](=O)',
          minCount: 1,
          description:
            'Falta el grupo alfa-ceto característico del piruvato (carbonilo en C2 adyacente al carboxilato en C1).',
        },
      ],
      forbiddenSubstructures: [
        {
          name: 'Átomo de Fósforo (Fosfato)',
          smarts: '[#15]',
          minCount: 1,
          description:
            'La molécula aún contiene fósforo; la piruvato quinasa debe desfosforilar el PEP para liberar piruvato libre de fosfato.',
        },
      ],
      mustBeConnected: true,
    },
  },

  // ==========================================
  // MUNDO 3: COMPLEJO PIRUVATO DESHIDROGENASA
  // ==========================================
  {
    id: 'm3_pdh_acetyl_coa',
    world: 3,
    title: 'Complejo PDH: Descarboxilación y Síntesis de Acetil-CoA',
    enzymeName: 'Complejo Piruvato Deshidrogenasa (E1 + E2 + E3)',
    objectiveDescription:
      'Escinde el grupo carboxilo (-COO⁻) del Piruvato (descarboxilación oxidativa como CO₂) y acopla el grupo acetilo restante al azufre de la Coenzima A para formar el enlace tioéster del Acetil-CoA.',
    pedagogicalHint:
      'Elimina el carbono carboxílico (-COO⁻) del piruvato que se libera como CO₂ en E1. Une el carbono carbonilo del grupo acetilo (CH₃-C=O) al átomo de azufre del cofactor Coenzima A (S-CoA) para formar el enlace tioéster de alta energía.',
    biochemicalContext:
      'El Complejo PDH mitocondrial es el puente crucial entre la glucólisis citoplásmica y el Ciclo de Krebs. Su subunidad E2 transfiere el grupo acetilo desde la lipoamida reducida a la Coenzima A, conservando la energía libre en un enlace tioéster (ΔG°\' = -31.5 kJ/mol).',
    allowedElements: ['C', 'H', 'O', 'N', 'S'],
    initialGraph: {
      nodes: {
        // Fragmento 1: Piruvato
        pyr_c3: { id: 'pyr_c3', element: 'C', formalCharge: 0, x: 320, y: 360 },
        pyr_c2: { id: 'pyr_c2', element: 'C', formalCharge: 0, x: 370, y: 330 },
        pyr_oketo: { id: 'pyr_oketo', element: 'O', formalCharge: 0, x: 370, y: 270 },
        pyr_c1: { id: 'pyr_c1', element: 'C', formalCharge: 0, x: 420, y: 360 },
        pyr_o1dbl: { id: 'pyr_o1dbl', element: 'O', formalCharge: 0, x: 420, y: 420 },
        pyr_o1neg: { id: 'pyr_o1neg', element: 'O', formalCharge: -1, x: 470, y: 340 },
        // Fragmento 2: Cola tiol de Coenzima A (S-C-C-N)
        coa_s: { id: 'coa_s', element: 'S', formalCharge: 0, x: 550, y: 330 },
        coa_c1: { id: 'coa_c1', element: 'C', formalCharge: 0, x: 600, y: 310, isLocked: true },
        coa_c2: { id: 'coa_c2', element: 'C', formalCharge: 0, x: 650, y: 340, isLocked: true },
        coa_n: { id: 'coa_n', element: 'N', formalCharge: 0, x: 700, y: 310, isLocked: true },
      },
      edges: {
        b_pyr_c3_c2: { id: 'b_pyr_c3_c2', sourceId: 'pyr_c3', targetId: 'pyr_c2', order: 1 },
        b_pyr_c2_oketo: { id: 'b_pyr_c2_oketo', sourceId: 'pyr_c2', targetId: 'pyr_oketo', order: 2 },
        b_pyr_c2_c1: { id: 'b_pyr_c2_c1', sourceId: 'pyr_c2', targetId: 'pyr_c1', order: 1 },
        b_pyr_c1_o1dbl: { id: 'b_pyr_c1_o1dbl', sourceId: 'pyr_c1', targetId: 'pyr_o1dbl', order: 2 },
        b_pyr_c1_o1neg: { id: 'b_pyr_c1_o1neg', sourceId: 'pyr_c1', targetId: 'pyr_o1neg', order: 1 },
        b_coa_s_c1: { id: 'b_coa_s_c1', sourceId: 'coa_s', targetId: 'coa_c1', order: 1, isLocked: true },
        b_coa_c1_c2: { id: 'b_coa_c1_c2', sourceId: 'coa_c1', targetId: 'coa_c2', order: 1, isLocked: true },
        b_coa_c2_n: { id: 'b_coa_c2_n', sourceId: 'coa_c2', targetId: 'coa_n', order: 1, isLocked: true },
      },
    },
    winConditions: {
      acceptedSmiles: [
        'CC(=O)SCCN',
        'CC(=O)SCC[NH3+]',
        'CC(=O)S',
      ],
      requiredSubstructures: [
        {
          name: 'Enlace Tioéster (C(=O)-S)',
          smarts: '[#6](=O)[SX2]',
          minCount: 1,
          description:
            'Falta el enlace tioéster C(=O)-S característico del Acetil-CoA.',
        },
      ],
      forbiddenSubstructures: [
        {
          name: 'Grupo Carboxilo / Carboxilato original',
          smarts: '[#6](=O)[OX2H,OX1-]',
          minCount: 1,
          description:
            'La molécula aún conserva el grupo carboxilo original del piruvato. El complejo PDH debe descarboxilarlo (liberar CO₂) antes de formar el tioéster.',
        },
      ],
      mustBeConnected: true,
    },
  },
];

/**
 * Retorna todas las misiones configuradas.
 */
export function getAllMissions(): MissionConfig[] {
  return PROGRESSION_MISSIONS;
}

/**
 * Busca una misión por su ID único.
 */
export function getMissionById(id: string): MissionConfig | undefined {
  return PROGRESSION_MISSIONS.find((m) => m.id === id);
}

/**
 * Retorna las misiones correspondientes a un mundo específico (1, 2 o 3).
 */
export function getMissionsByWorld(world: 1 | 2 | 3 | 4): MissionConfig[] {
  return PROGRESSION_MISSIONS.filter((m) => m.world === world);
}

/**
 * Obtiene el ID de la siguiente misión en la progresión natural, o null si es la última.
 */
export function getNextMissionId(currentMissionId: string): string | null {
  const index = PROGRESSION_MISSIONS.findIndex((m) => m.id === currentMissionId);
  if (index === -1 || index >= PROGRESSION_MISSIONS.length - 1) {
    return null;
  }
  return PROGRESSION_MISSIONS[index + 1].id;
}
