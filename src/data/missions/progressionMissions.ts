import { MissionConfig } from '../../core/model/types';

/**
 * Catálogo Oficial de Módulos Bioquímicos y Misiones de SIMOLA (Etapa 6).
 *
 * Módulo I: Estereoquímica y Proyecciones de Haworth (4 etapas)
 * Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas (10 etapas acopladas)
 * Módulo III: Complejo Multienzimático Piruvato Deshidrogenasa (5 etapas acopladas)
 */
export const PROGRESSION_MISSIONS: MissionConfig[] = [
  // =========================================================================
  // MÓDULO I: ESTEREOQUÍMICA Y PROYECCIONES DE HAWORTH
  // =========================================================================
  {
    id: 'm1_ethene',
    world: 1,
    moduleName: 'Módulo I: Estereoquímica y Proyecciones de Haworth',
    title: 'Hibridación sp² y Saturación de Valencias (Eteno)',
    enzymeName: 'Alquenos y Geometría Trigonal Plana',
    stepNumber: 1,
    totalSteps: 4,
    objectiveDescription:
      'Construye una molécula de Eteno (C₂H₄). Convierte el enlace simple C-C en un enlace doble (C=C) para completar la tetravalencia del carbono con hibridación sp².',
    pedagogicalHint:
      'Haz clic sobre el enlace central C-C para cambiar su orden a 2 (enlace doble). Cada carbono compartirá 2 pares de electrones y completará su octeto con 2 hidrógenos satélite implícitos.',
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
    id: 'm1_ionic_isotope',
    world: 1,
    moduleName: 'Módulo I: Estereoquímica y Proyecciones de Haworth',
    title: 'Ionización Fisiológica a pH 7.4 y Marcaje Isotópico (¹⁴C)',
    enzymeName: 'Química Ácido-Base Fisiológica y Trazadores',
    stepNumber: 2,
    totalSteps: 4,
    objectiveDescription:
      'Configura el estado de ionización del grupo carboxilo a pH fisiológico 7.4 (-COO⁻, carga -1) y aplica marcaje isotópico con Carbono-14 (¹⁴C) en el carbono metilo usando el menú de clic derecho.',
    pedagogicalHint:
      'Haz clic derecho sobre el oxígeno libre para asignar su carga formal a -1 (formando el anión carboxilato). Luego haz clic derecho sobre el carbono C2 para asignar su isótopo a 14C.',
    biochemicalContext:
      'A pH fisiológico (7.4), los ácidos carboxílicos se encuentran desprotonados como carboxilatos (-COO⁻). En bioenergética y vías metabólicas, el marcaje con el radioisótopo ¹⁴C es el estándar histórico para rastrear el destino del carbono en ciclos como Krebs y Calvin.',
    allowedElements: ['C', 'H', 'O'],
    initialGraph: {
      nodes: {
        c_met: { id: 'c_met', element: 'C', formalCharge: 0, x: 440, y: 360 },
        c_carb: { id: 'c_carb', element: 'C', formalCharge: 0, x: 500, y: 320 },
        o_dbl: { id: 'o_dbl', element: 'O', formalCharge: 0, x: 500, y: 260 },
        o_neg: { id: 'o_neg', element: 'O', formalCharge: 0, x: 550, y: 350 },
      },
      edges: {
        b_cc: { id: 'b_cc', sourceId: 'c_met', targetId: 'c_carb', order: 1 },
        b_cdbl: { id: 'b_cdbl', sourceId: 'c_carb', targetId: 'o_dbl', order: 2 },
        b_cneg: { id: 'b_cneg', sourceId: 'c_carb', targetId: 'o_neg', order: 1 },
      },
    },
    winConditions: {
      targetFormula: 'C2H3O2',
      acceptedSmiles: ['[14CH3]C(=O)[O-]', '[14C]C(=O)[O-]', '[14CH3]C(=O)O'],
      requiredSubstructures: [
        {
          name: 'Anión Carboxilato Ionizado (-COO⁻)',
          smarts: '[#6](=O)[OX1-]',
          minCount: 1,
          description:
            'El grupo carboxilo debe tener carga formal -1 en su oxígeno terminal para reflejar el estado desprotonado a pH 7.4.',
        },
      ],
      mustBeConnected: true,
      expectedRingCount: 0,
    },
  },
  {
    id: 'm1_cyclization',
    world: 1,
    moduleName: 'Módulo I: Estereoquímica y Proyecciones de Haworth',
    title: 'Ciclación Hemiacetálica: Heterociclos Piranósico y Furanósico',
    enzymeName: 'Heterociclos de Carbohidratos',
    stepNumber: 3,
    totalSteps: 4,
    objectiveDescription:
      'Cierra el heterociclo piranósico uniendo el oxígeno hemiacetálico con el Carbono 1 para formar el anillo de 6 miembros característico de las aldohexosas.',
    pedagogicalHint:
      'Arrastra un enlace desde el átomo de oxígeno libre en la parte superior hacia el carbono terminal C1 en el extremo derecho para cerrar el anillo de tetrahidropirano (5 carbonos y 1 oxígeno).',
    biochemicalContext:
      'Menos del 0.1% de la glucosa en disolución acuosa se encuentra en forma de cadena abierta. El ataque nucleófilo intramolecular del -OH sobre el aldehído carbonílico genera espontáneamente el enlace hemiacetal cíclico.',
    allowedElements: ['C', 'H', 'O'],
    initialGraph: {
      nodes: {
        o5: { id: 'o5', element: 'O', formalCharge: 0, x: 490, y: 310 },
        c5: { id: 'c5', element: 'C', formalCharge: 0, x: 430, y: 325 },
        c4: { id: 'c4', element: 'C', formalCharge: 0, x: 405, y: 375 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 450, y: 410 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 510, y: 395 },
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 535, y: 345 },
      },
      edges: {
        b_c5_o5: { id: 'b_c5_o5', sourceId: 'c5', targetId: 'o5', order: 1 },
        b_c4_c5: { id: 'b_c4_c5', sourceId: 'c4', targetId: 'c5', order: 1 },
        b_c3_c4: { id: 'b_c3_c4', sourceId: 'c3', targetId: 'c4', order: 1 },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
      },
    },
    winConditions: {
      targetFormula: 'C5H10O',
      acceptedSmiles: ['C1CCOCC1'],
      expectedRingCount: 1,
      mustBeConnected: true,
    },
  },
  {
    id: 'm1_haworth_alpha_glucose',
    world: 1,
    moduleName: 'Módulo I: Estereoquímica y Proyecciones de Haworth',
    title: 'Estereoquímica en Proyección de Haworth: α-D-Glucopiranosa',
    enzymeName: 'Estereoisomería y Anómeros',
    stepNumber: 4,
    totalSteps: 4,
    objectiveDescription:
      'Construye la proyección de Haworth de la α-D-Glucopiranosa. Coloca los grupos hidroxilo (-OH) y el grupo hidroximetilo (-CH₂OH) con la orientación axial/ecuatorial precisa.',
    pedagogicalHint:
      'Usa la guía angular de 90° para trazar enlaces verticales: C1: -OH hacia abajo (anómero α), C2: -OH hacia abajo, C3: -OH hacia arriba, C4: -OH hacia abajo, C5: -CH₂OH hacia arriba (serie D).',
    biochemicalContext:
      'En la proyección de Haworth de la D-glucosa, el anómero alfa posee su hidroxilo anomérico en C1 orientado hacia abajo (trans respecto al C6), mientras que la serie D ubica el C6 (-CH₂OH) proyectado hacia arriba sobre el plano del anillo.',
    allowedElements: ['C', 'H', 'O'],
    initialGraph: {
      nodes: {
        o5: { id: 'o5', element: 'O', formalCharge: 0, x: 500, y: 310, isLocked: true },
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 545, y: 345, isLocked: true },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 515, y: 395, isLocked: true },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 450, y: 410, isLocked: true },
        c4: { id: 'c4', element: 'C', formalCharge: 0, x: 405, y: 375, isLocked: true },
        c5: { id: 'c5', element: 'C', formalCharge: 0, x: 430, y: 325, isLocked: true },
      },
      edges: {
        b_o5_c1: { id: 'b_o5_c1', sourceId: 'o5', targetId: 'c1', order: 1, isLocked: true },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1, isLocked: true },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1, isLocked: true },
        b_c3_c4: { id: 'b_c3_c4', sourceId: 'c3', targetId: 'c4', order: 1, isLocked: true },
        b_c4_c5: { id: 'b_c4_c5', sourceId: 'c4', targetId: 'c5', order: 1, isLocked: true },
        b_c5_o5: { id: 'b_c5_o5', sourceId: 'c5', targetId: 'o5', order: 1, isLocked: true },
      },
    },
    winConditions: {
      targetFormula: 'C6H12O6',
      acceptedSmiles: [
        'OCC1OC(O)C(O)C(O)C1O',
        'C(C1C(C(C(C(O1)O)O)O)O)O',
        'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O',
      ],
      expectedRingCount: 1,
      mustBeConnected: true,
      spatialRules: {
        haworth: {
          ringType: 'pyranose',
          anomer: 'alpha',
          series: 'D',
          expectedOxygenSector: 'top-right',
          substituents: [
            { carbonIndex: 1, direction: 'down', name: 'OH-C1 (Anómero α hacia abajo)' },
            { carbonIndex: 2, direction: 'down', name: 'OH-C2 (hacia abajo)' },
            { carbonIndex: 3, direction: 'up', name: 'OH-C3 (hacia arriba)' },
            { carbonIndex: 4, direction: 'down', name: 'OH-C4 (hacia abajo)' },
            { carbonIndex: 5, direction: 'up', name: 'CH₂OH-C6 (Serie D hacia arriba)' },
          ],
        },
      },
    },
  },

  // =========================================================================
  // MÓDULO II: VÍA GLUCOLÍTICA DE EMBDEN-MEYERHOF-PARNAS (10 PASOS)
  // =========================================================================
  {
    id: 'm2_step1_hexokinase',
    world: 2,
    moduleName: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
    title: 'Paso 1: Hexoquinasa (Fosforilación Irreversible en C6)',
    enzymeName: 'Hexoquinasa (HK)',
    ecNumber: 'EC 2.7.1.1',
    deltaG: '-16.7 kJ/mol',
    stepNumber: 1,
    totalSteps: 10,
    objectiveDescription:
      'Configura la reacción en el Reactor Catalítico seleccionando la Hexoquinasa y el cofactor ATP. Luego, une el grupo fosfato transferido al oxígeno en C6 para sintetizar Glucosa-6-Fosfato (G6P).',
    pedagogicalHint:
      'Abre el "⚡ Reactor Catalítico", selecciona Hexoquinasa (EC 2.7.1.1) y cofactor ATP para liberar ADP al reservorio y preparar el centro activo.',
    biochemicalContext:
      'La Hexoquinasa cataliza el primer paso marcapasos irreversible de la glucólisis, consumiendo 1 molécula de ATP acoplada a un ion Mg²⁺. La adición de la carga negativa del fosfato atrapa al azúcar en el citosol celular.',
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
    catalyticReaction: {
      expectedEnzymeId: 'hexokinase',
      enzymeName: 'Hexoquinasa (EC 2.7.1.1)',
      ecNumber: 'EC 2.7.1.1',
      expectedCofactors: ['ATP'],
      substrateName: 'α-D-Glucosa',
      releasedByproducts: [
        { name: 'ADP', formula: 'C10H15N5O10P2', stoichiometry: '+1 ADP' },
      ],
      intermediateGraph: {
        nodes: {
          o5: { id: 'o5', element: 'O', formalCharge: 0, x: 490, y: 310, isLocked: true },
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 535, y: 345, isLocked: true },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 510, y: 395, isLocked: true },
          c3: { id: 'c3', element: 'C', formalCharge: 0, x: 450, y: 410, isLocked: true },
          c4: { id: 'c4', element: 'C', formalCharge: 0, x: 405, y: 375, isLocked: true },
          c5: { id: 'c5', element: 'C', formalCharge: 0, x: 430, y: 325, isLocked: true },
          c6: { id: 'c6', element: 'C', formalCharge: 0, x: 385, y: 290, isLocked: true },
          o6: { id: 'o6', element: 'O', formalCharge: 0, x: 340, y: 300, isLocked: false },
          p6: { id: 'p6', element: 'P', formalCharge: 0, x: 280, y: 300, isLocked: false },
          op_dbl: { id: 'op_dbl', element: 'O', formalCharge: 0, x: 280, y: 250, isLocked: false },
          op_neg1: { id: 'op_neg1', element: 'O', formalCharge: -1, x: 240, y: 330, isLocked: false },
          op_neg2: { id: 'op_neg2', element: 'O', formalCharge: -1, x: 310, y: 350, isLocked: false },
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
          b_p_dbl: { id: 'b_p_dbl', sourceId: 'p6', targetId: 'op_dbl', order: 2, isLocked: false },
          b_p_neg1: { id: 'b_p_neg1', sourceId: 'p6', targetId: 'op_neg1', order: 1, isLocked: false },
          b_p_neg2: { id: 'b_p_neg2', sourceId: 'p6', targetId: 'op_neg2', order: 1, isLocked: false },
        },
      },
      explanation:
        'La Hexoquinasa transfiere el grupo fosforilo del ATP al oxígeno C6-OH de la glucosa, liberando ADP en el reservorio estequiométrico.',
    },
    winConditions: {
      acceptedSmiles: [
        'O=P(O)(O)OCC1OC(O)C(O)C(O)C1O',
        'O=P([O-])([O-])OCC1OC(O)C(O)C(O)C1O',
        'O=P(O)([O-])OCC1OC(O)C(O)C(O)C1O',
      ],
      requiredSubstructures: [
        {
          name: 'Enlace Fosfoéster en C6 (C-O-P)',
          smarts: '[#6][OX2]P(=O)',
          minCount: 1,
          description:
            'Falta unir el grupo fosfato al oxígeno de C6 mediante un enlace fosfoéster covalente.',
        },
      ],
      expectedRingCount: 1,
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_step2_pgi',
    world: 2,
    moduleName: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
    title: 'Paso 2: Fosfoglucosa Isomerasa (Isomerización Aldosa-Cetosa)',
    enzymeName: 'Fosfoglucosa Isomerasa (PGI)',
    ecNumber: 'EC 5.3.1.9',
    deltaG: '+1.7 kJ/mol',
    stepNumber: 2,
    totalSteps: 10,
    objectiveDescription:
      'Isomeriza la Glucosa-6-Fosfato (aldohexosa) a Fructosa-6-Fosfato (cetohexosa). Emplea el reactor catalítico con Fosfoglucosa Isomerasa (EC 5.3.1.9).',
    pedagogicalHint:
      'La PGI abre el anillo piranósico, isomeriza el carbonilo de C1 a C2 vía intermediario cis-enediol y cataliza la formación del anillo furanósico de 5 miembros de la F6P.',
    biochemicalContext:
      'La isomerización de aldosa a cetosa traslada el grupo carbonilo al carbono 2, preparando la molécula para la posterior adición de un segundo fosfato en C1 y su posterior escisión simétrica en dos triosas.',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 380, y: 350 },
        o1: { id: 'o1', element: 'O', formalCharge: 0, x: 380, y: 290 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 440, y: 370 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 500, y: 350 },
        c6: { id: 'c6', element: 'C', formalCharge: 0, x: 560, y: 370 },
        p: { id: 'p', element: 'P', formalCharge: 0, x: 620, y: 350 },
      },
      edges: {
        b_c1_o1: { id: 'b_c1_o1', sourceId: 'c1', targetId: 'o1', order: 2 },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
        b_c3_c6: { id: 'b_c3_c6', sourceId: 'c3', targetId: 'c6', order: 1 },
        b_c6_p: { id: 'b_c6_p', sourceId: 'c6', targetId: 'p', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'phosphoglucose_isomerase',
      enzymeName: 'Fosfoglucosa Isomerasa (PGI)',
      ecNumber: 'EC 5.3.1.9',
      expectedCofactors: [],
      substrateName: 'Glucosa-6-Fosfato',
      releasedByproducts: [],
      intermediateGraph: {
        nodes: {
          o_fur: { id: 'o_fur', element: 'O', formalCharge: 0, x: 480, y: 310 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 530, y: 340 },
          c3: { id: 'c3', element: 'C', formalCharge: 0, x: 510, y: 395 },
          c4: { id: 'c4', element: 'C', formalCharge: 0, x: 450, y: 395 },
          c5: { id: 'c5', element: 'C', formalCharge: 0, x: 430, y: 340 },
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 580, y: 320 },
          o1: { id: 'o1', element: 'O', formalCharge: 0, x: 630, y: 340 },
          c6: { id: 'c6', element: 'C', formalCharge: 0, x: 380, y: 320 },
          o6: { id: 'o6', element: 'O', formalCharge: 0, x: 330, y: 340 },
          p: { id: 'p', element: 'P', formalCharge: 0, x: 280, y: 320 },
        },
        edges: {
          b_o_c2: { id: 'b_o_c2', sourceId: 'o_fur', targetId: 'c2', order: 1 },
          b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
          b_c3_c4: { id: 'b_c3_c4', sourceId: 'c3', targetId: 'c4', order: 1 },
          b_c4_c5: { id: 'b_c4_c5', sourceId: 'c4', targetId: 'c5', order: 1 },
          b_c5_o: { id: 'b_c5_o', sourceId: 'c5', targetId: 'o_fur', order: 1 },
          b_c2_c1: { id: 'b_c2_c1', sourceId: 'c2', targetId: 'c1', order: 1 },
          b_c1_o1: { id: 'b_c1_o1', sourceId: 'c1', targetId: 'o1', order: 1 },
          b_c5_c6: { id: 'b_c5_c6', sourceId: 'c5', targetId: 'c6', order: 1 },
          b_c6_o6: { id: 'b_c6_o6', sourceId: 'c6', targetId: 'o6', order: 1 },
          b_o6_p: { id: 'b_o6_p', sourceId: 'o6', targetId: 'p', order: 1 },
        },
      },
      explanation:
        'La Fosfoglucosa Isomerasa cataliza la interconversión aldosa-cetosa entre G6P y F6P mediante catálisis ácido-base en el centro activo.',
    },
    winConditions: {
      acceptedSmiles: [
        'OCC1(COP(=O)(O)O)OC(O)C(O)C1O',
        'O=P(O)(O)OCC1OC(CO)(O)C(O)C1O',
        'O=P(O)(O)OCC(=O)C(O)C(O)C(O)CO',
        'O=P([O-])([O-])OCC1OC(CO)(O)C(O)C1O',
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_step3_pfk1',
    world: 2,
    moduleName: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
    title: 'Paso 3: Fosfofructoquinasa-1 (Compromiso Glucolítico)',
    enzymeName: 'Fosfofructoquinasa-1 (PFK-1)',
    ecNumber: 'EC 2.7.1.11',
    deltaG: '-14.2 kJ/mol',
    stepNumber: 3,
    totalSteps: 10,
    objectiveDescription:
      'Fosforila la Fructosa-6-Fosfato en el carbono C1 para sintetizar Fructosa-1,6-Bisfosfato (F1,6BP). Requiere la selección de PFK-1 y ATP en el Reactor Catalítico.',
    pedagogicalHint:
      'La PFK-1 es el principal punto de regulación alostérica. Acopla el ATP para liberar ADP y fosforila el grupo -CH₂OH del C1.',
    biochemicalContext:
      'Reacción irreversible y paso limitante marcapasos por excelencia de la glucólisis. Consume el 2º ATP de la fase preparatoria y genera una molécula simétricamente bifosforilada lista para la lisis.',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 400, y: 350 },
        o1: { id: 'o1', element: 'O', formalCharge: 0, x: 350, y: 350 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 450, y: 380 },
        c6: { id: 'c6', element: 'C', formalCharge: 0, x: 530, y: 350 },
        p6: { id: 'p6', element: 'P', formalCharge: 0, x: 590, y: 350 },
      },
      edges: {
        b_c1_o1: { id: 'b_c1_o1', sourceId: 'c1', targetId: 'o1', order: 1 },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
        b_c2_c6: { id: 'b_c2_c6', sourceId: 'c2', targetId: 'c6', order: 1 },
        b_c6_p6: { id: 'b_c6_p6', sourceId: 'c6', targetId: 'p6', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'pfk1',
      enzymeName: 'Fosfofructoquinasa-1 (EC 2.7.1.11)',
      ecNumber: 'EC 2.7.1.11',
      expectedCofactors: ['ATP'],
      substrateName: 'Fructosa-6-Fosfato',
      releasedByproducts: [
        { name: 'ADP', formula: 'C10H15N5O10P2', stoichiometry: '+1 ADP' },
      ],
      intermediateGraph: {
        nodes: {
          p1: { id: 'p1', element: 'P', formalCharge: 0, x: 300, y: 350 },
          o1: { id: 'o1', element: 'O', formalCharge: 0, x: 350, y: 350 },
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 400, y: 350 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 450, y: 380 },
          c6: { id: 'c6', element: 'C', formalCharge: 0, x: 530, y: 350 },
          p6: { id: 'p6', element: 'P', formalCharge: 0, x: 590, y: 350 },
        },
        edges: {
          b_p1_o1: { id: 'b_p1_o1', sourceId: 'p1', targetId: 'o1', order: 1 },
          b_o1_c1: { id: 'b_o1_c1', sourceId: 'o1', targetId: 'c1', order: 1 },
          b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
          b_c2_c6: { id: 'b_c2_c6', sourceId: 'c2', targetId: 'c6', order: 1 },
          b_c6_p6: { id: 'b_c6_p6', sourceId: 'c6', targetId: 'p6', order: 1 },
        },
      },
      explanation:
        'La PFK-1 transfiere el grupo fosforilo del ATP al C1 de la F6P, formando Fructosa-1,6-Bisfosfato y liberando un segundo ADP.',
    },
    winConditions: {
      acceptedSmiles: [
        'O=P(O)(O)OCC1(COP(=O)(O)O)OC(O)C(O)C1O',
        'O=P(O)(O)OCC(=O)C(O)C(O)C(O)COP(=O)(O)O',
        'O=P([O-])([O-])OCC1(COP(=O)([O-])[O-])OC(O)C(O)C1O',
      ],
      requiredSubstructures: [
        {
          name: 'Dos Grupos Fosfato (C1 y C6)',
          smarts: '[#6][OX2]P(=O)',
          minCount: 2,
          description:
            'La Fructosa-1,6-bisfosfato requiere dos enlaces fosfoéster: uno en C1 y otro en C6.',
        },
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_step4_aldolase',
    world: 2,
    moduleName: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
    title: 'Paso 4: Aldolasa (Escisión Aldólica en Triosas)',
    enzymeName: 'Fructosa-Bisfosfato Aldolasa',
    ecNumber: 'EC 4.1.2.13',
    deltaG: '+23.8 kJ/mol',
    stepNumber: 4,
    totalSteps: 10,
    objectiveDescription:
      'Cataliza la escisión reversible del enlace C3-C4 de la F1,6BP para generar Gliceraldehído-3-Fosfato (G3P) y Dihidroxiacetona Fosfato (DHAP).',
    pedagogicalHint:
      'En el Reactor Catalítico, selecciona Aldolasa (EC 4.1.2.13). La enzima libera DHAP al reservorio y coloca G3P en la pizarra para continuar la ruta.',
    biochemicalContext:
      'Aunque termodinámicamente desfavorable en condiciones estándar (+23.8 kJ/mol), la rápida eliminación metabólica de los productos mantiene la reacción desplazada hacia adelante en la célula viva.',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 440, y: 350 },
        c4: { id: 'c4', element: 'C', formalCharge: 0, x: 500, y: 350 },
      },
      edges: {
        b_c3_c4: { id: 'b_c3_c4', sourceId: 'c3', targetId: 'c4', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'aldolase',
      enzymeName: 'Fructosa-bisfosfato Aldolasa (EC 4.1.2.13)',
      ecNumber: 'EC 4.1.2.13',
      expectedCofactors: [],
      substrateName: 'Fructosa-1,6-Bisfosfato',
      releasedByproducts: [
        { name: 'Dihidroxiacetona Fosfato (DHAP)', formula: 'C3H7O6P', stoichiometry: '+1 DHAP' },
      ],
      intermediateGraph: {
        nodes: {
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 380, y: 340 },
          o1: { id: 'o1', element: 'O', formalCharge: 0, x: 380, y: 280 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 440, y: 370 },
          o2: { id: 'o2', element: 'O', formalCharge: 0, x: 440, y: 420 },
          c3: { id: 'c3', element: 'C', formalCharge: 0, x: 500, y: 340 },
          o3: { id: 'o3', element: 'O', formalCharge: 0, x: 550, y: 370 },
          p3: { id: 'p3', element: 'P', formalCharge: 0, x: 600, y: 340 },
        },
        edges: {
          b_c1_o1: { id: 'b_c1_o1', sourceId: 'c1', targetId: 'o1', order: 2 },
          b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
          b_c2_o2: { id: 'b_c2_o2', sourceId: 'c2', targetId: 'o2', order: 1 },
          b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
          b_c3_o3: { id: 'b_c3_o3', sourceId: 'c3', targetId: 'o3', order: 1 },
          b_o3_p3: { id: 'b_o3_p3', sourceId: 'o3', targetId: 'p3', order: 1 },
        },
      },
      explanation:
        'La Aldolasa escinde la hexosa F1,6BP en dos triosas fosforiladas, liberando DHAP al reservorio y dejando G3P en el centro activo.',
    },
    winConditions: {
      acceptedSmiles: [
        'O=P(O)(O)OCC(O)C=O',
        'O=P([O-])([O-])OCC(O)C=O',
        'OCC(=O)COP(=O)(O)O',
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_step5_tim',
    world: 2,
    moduleName: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
    title: 'Paso 5: Triosa Fosfato Isomerasa (Convergencia de Triosas)',
    enzymeName: 'Triosa Fosfato Isomerasa (TIM)',
    ecNumber: 'EC 5.3.1.1',
    deltaG: '+7.5 kJ/mol',
    stepNumber: 5,
    totalSteps: 10,
    objectiveDescription:
      'Interconvierte la Dihidroxiacetona Fosfato (cetotriosa) en Gliceraldehído-3-Fosfato (aldotriosa) mediante la Triosa Fosfato Isomerasa.',
    pedagogicalHint:
      'TIM es considerada una enzima catalíticamente perfecta limitada únicamente por difusión. Transfiere protones mediante un residuo catalítico Glu165.',
    biochemicalContext:
      'Permite que los dos carbonos escindidos de la glucosa converjan en una sola vía química, duplicando la estequiometría de ATP generado en la fase de rendimiento.',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 400, y: 350 },
        o1: { id: 'o1', element: 'O', formalCharge: 0, x: 400, y: 290 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 460, y: 370 },
        o2_dbl: { id: 'o2_dbl', element: 'O', formalCharge: 0, x: 460, y: 430 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 520, y: 350 },
        p3: { id: 'p3', element: 'P', formalCharge: 0, x: 580, y: 350 },
      },
      edges: {
        b_c1_o1: { id: 'b_c1_o1', sourceId: 'c1', targetId: 'o1', order: 1 },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
        b_c2_o2: { id: 'b_c2_o2', sourceId: 'c2', targetId: 'o2_dbl', order: 2 },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
        b_c3_p3: { id: 'b_c3_p3', sourceId: 'c3', targetId: 'p3', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'tim',
      enzymeName: 'Triosa Fosfato Isomerasa (EC 5.3.1.1)',
      ecNumber: 'EC 5.3.1.1',
      expectedCofactors: [],
      substrateName: 'Dihidroxiacetona Fosfato (DHAP)',
      releasedByproducts: [],
      intermediateGraph: {
        nodes: {
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 380, y: 340 },
          o1: { id: 'o1', element: 'O', formalCharge: 0, x: 380, y: 280 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 440, y: 370 },
          o2: { id: 'o2', element: 'O', formalCharge: 0, x: 440, y: 420 },
          c3: { id: 'c3', element: 'C', formalCharge: 0, x: 500, y: 340 },
          o3: { id: 'o3', element: 'O', formalCharge: 0, x: 550, y: 370 },
          p3: { id: 'p3', element: 'P', formalCharge: 0, x: 600, y: 340 },
        },
        edges: {
          b_c1_o1: { id: 'b_c1_o1', sourceId: 'c1', targetId: 'o1', order: 2 },
          b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
          b_c2_o2: { id: 'b_c2_o2', sourceId: 'c2', targetId: 'o2', order: 1 },
          b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
          b_c3_o3: { id: 'b_c3_o3', sourceId: 'c3', targetId: 'o3', order: 1 },
          b_o3_p3: { id: 'b_o3_p3', sourceId: 'o3', targetId: 'p3', order: 1 },
        },
      },
      explanation:
        'La TIM cataliza la tautomerización ceto-enólica transformando la DHAP en Gliceraldehído-3-Fosfato.',
    },
    winConditions: {
      acceptedSmiles: [
        'O=P(O)(O)OCC(O)C=O',
        'O=P([O-])([O-])OCC(O)C=O',
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_step6_gapdh',
    world: 2,
    moduleName: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
    title: 'Paso 6: GAPDH (Oxidación y Conservación de Energía)',
    enzymeName: 'Gliceraldehído-3-Fosfato Deshidrogenasa (GAPDH)',
    ecNumber: 'EC 1.2.1.12',
    deltaG: '+6.3 kJ/mol',
    stepNumber: 6,
    totalSteps: 10,
    objectiveDescription:
      'Oxida el aldehído de G3P incorporando fosfato inorgánico (Pi) para sintetizar 1,3-Bisfosfoglicerato (1,3-BPG). Selecciona GAPDH y los cofactores NAD⁺ y Pi en el Reactor Catalítico.',
    pedagogicalHint:
      'La reacción reduce NAD⁺ a NADH (que se deposita en el reservorio) y forma un enlace anhídrido mixto acil-fosfato de altísima energía de transferencia (-49.3 kJ/mol).',
    biochemicalContext:
      'Primera reacción redox de la glucólisis donde se conserva la energía química de la oxidación en un enlace acil-fosfato y en poder reductor (NADH).',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 380, y: 340 },
        o_ald: { id: 'o_ald', element: 'O', formalCharge: 0, x: 380, y: 280 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 440, y: 370 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 500, y: 340 },
        p3: { id: 'p3', element: 'P', formalCharge: 0, x: 580, y: 340 },
      },
      edges: {
        b_c1_o: { id: 'b_c1_o', sourceId: 'c1', targetId: 'o_ald', order: 2 },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
        b_c3_p: { id: 'b_c3_p', sourceId: 'c3', targetId: 'p3', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'gapdh',
      enzymeName: 'GAPDH (EC 1.2.1.12)',
      ecNumber: 'EC 1.2.1.12',
      expectedCofactors: ['NAD+', 'Pi'],
      substrateName: 'Gliceraldehído-3-Fosfato',
      releasedByproducts: [
        { name: 'NADH + H⁺', formula: 'C21H29N7O14P2', stoichiometry: '+1 NADH' },
      ],
      intermediateGraph: {
        nodes: {
          p1: { id: 'p1', element: 'P', formalCharge: 0, x: 300, y: 340 },
          o_brg1: { id: 'o_brg1', element: 'O', formalCharge: 0, x: 340, y: 340 },
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 390, y: 340 },
          o1_dbl: { id: 'o1_dbl', element: 'O', formalCharge: 0, x: 390, y: 280 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 450, y: 370 },
          o2: { id: 'o2', element: 'O', formalCharge: 0, x: 450, y: 420 },
          c3: { id: 'c3', element: 'C', formalCharge: 0, x: 510, y: 340 },
          o3: { id: 'o3', element: 'O', formalCharge: 0, x: 560, y: 370 },
          p3: { id: 'p3', element: 'P', formalCharge: 0, x: 610, y: 340 },
        },
        edges: {
          b_p1_obrg: { id: 'b_p1_obrg', sourceId: 'p1', targetId: 'o_brg1', order: 1 },
          b_obrg_c1: { id: 'b_obrg_c1', sourceId: 'o_brg1', targetId: 'c1', order: 1 },
          b_c1_o1: { id: 'b_c1_o1', sourceId: 'c1', targetId: 'o1_dbl', order: 2 },
          b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
          b_c2_o2: { id: 'b_c2_o2', sourceId: 'c2', targetId: 'o2', order: 1 },
          b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
          b_c3_o3: { id: 'b_c3_o3', sourceId: 'c3', targetId: 'o3', order: 1 },
          b_o3_p3: { id: 'b_o3_p3', sourceId: 'o3', targetId: 'p3', order: 1 },
        },
      },
      explanation:
        'La GAPDH oxida el C1 del G3P mediante una cisteína catalítica y fosforila el intermediario acil-enzima con Pi libre, generando 1,3-BPG y reduciendo NAD⁺ a NADH.',
    },
    winConditions: {
      acceptedSmiles: [
        'O=C(OP(=O)(O)O)C(O)COP(=O)(O)O',
        'O=C(OP(=O)([O-])[O-])C(O)COP(=O)([O-])[O-]',
        '[O-]P(=O)([O-])OCC(O)C(=O)OP(=O)([O-])[O-]',
      ],
      requiredSubstructures: [
        {
          name: 'Enlace Acil-Fosfato (C(=O)-O-P)',
          smarts: '[#6](=O)OP(=O)',
          minCount: 1,
          description:
            'Falta el enlace acil-fosfato de alta energía en C1 característico del 1,3-Bisfosfoglicerato.',
        },
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_step7_pgk',
    world: 2,
    moduleName: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
    title: 'Paso 7: Fosfoglicerato Quinasa (1ª Fosforilación a Nivel de Sustrato)',
    enzymeName: 'Fosfoglicerato Quinasa (PGK)',
    ecNumber: 'EC 2.7.2.3',
    deltaG: '-18.5 kJ/mol',
    stepNumber: 7,
    totalSteps: 10,
    objectiveDescription:
      'Transfiere el fosfato acilo en C1 del 1,3-BPG al ADP para generar la 1ª molécula de ATP y 3-Fosfoglicerato (3-PG). Configura PGK y ADP en el Reactor Catalítico.',
    pedagogicalHint:
      'El enlace acil-fosfato de 1,3-BPG dona su grupo fosfato al ADP, sintetizando ATP y dejando el carboxilato libre en C1 del 3-Fosfoglicerato.',
    biochemicalContext:
      'Esta reacción acoplada compensa termodinámicamente el paso endergónico previo de la GAPDH, logrando un balance neto de regeneración de ATP en la vía.',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        p1: { id: 'p1', element: 'P', formalCharge: 0, x: 300, y: 340 },
        o1: { id: 'o1', element: 'O', formalCharge: 0, x: 350, y: 340 },
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 400, y: 340 },
        o1_dbl: { id: 'o1_dbl', element: 'O', formalCharge: 0, x: 400, y: 280 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 460, y: 370 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 520, y: 340 },
        p3: { id: 'p3', element: 'P', formalCharge: 0, x: 580, y: 340 },
      },
      edges: {
        b_p1_o1: { id: 'b_p1_o1', sourceId: 'p1', targetId: 'o1', order: 1 },
        b_o1_c1: { id: 'b_o1_c1', sourceId: 'o1', targetId: 'c1', order: 1 },
        b_c1_o1: { id: 'b_c1_o1', sourceId: 'c1', targetId: 'o1_dbl', order: 2 },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
        b_c3_p3: { id: 'b_c3_p3', sourceId: 'c3', targetId: 'p3', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'pgk',
      enzymeName: 'Fosfoglicerato Quinasa (EC 2.7.2.3)',
      ecNumber: 'EC 2.7.2.3',
      expectedCofactors: ['ADP'],
      substrateName: '1,3-Bisfosfoglicerato',
      releasedByproducts: [
        { name: 'ATP', formula: 'C10H16N5O13P3', stoichiometry: '+1 ATP' },
      ],
      intermediateGraph: {
        nodes: {
          o1_neg: { id: 'o1_neg', element: 'O', formalCharge: -1, x: 350, y: 340 },
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 400, y: 340 },
          o1_dbl: { id: 'o1_dbl', element: 'O', formalCharge: 0, x: 400, y: 280 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 460, y: 370 },
          o2: { id: 'o2', element: 'O', formalCharge: 0, x: 460, y: 430 },
          c3: { id: 'c3', element: 'C', formalCharge: 0, x: 520, y: 340 },
          o3: { id: 'o3', element: 'O', formalCharge: 0, x: 570, y: 370 },
          p3: { id: 'p3', element: 'P', formalCharge: 0, x: 620, y: 340 },
        },
        edges: {
          b_o1neg_c1: { id: 'b_o1neg_c1', sourceId: 'o1_neg', targetId: 'c1', order: 1 },
          b_c1_o1: { id: 'b_c1_o1', sourceId: 'c1', targetId: 'o1_dbl', order: 2 },
          b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
          b_c2_o2: { id: 'b_c2_o2', sourceId: 'c2', targetId: 'o2', order: 1 },
          b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
          b_c3_o3: { id: 'b_c3_o3', sourceId: 'c3', targetId: 'o3', order: 1 },
          b_o3_p3: { id: 'b_o3_p3', sourceId: 'o3', targetId: 'p3', order: 1 },
        },
      },
      explanation:
        'La Fosfoglicerato Quinasa transfiere el fosforilo en C1 al ADP, sintetizando el primer ATP a nivel de sustrato y dejando 3-Fosfoglicerato.',
    },
    winConditions: {
      acceptedSmiles: [
        'O=P(O)(O)OCC(O)C(=O)O',
        'O=P([O-])([O-])OCC(O)C(=O)[O-]',
        'O=P(O)([O-])OCC(O)C(=O)[O-]',
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_step8_pgm',
    world: 2,
    moduleName: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
    title: 'Paso 8: Fosfoglicerato Mutasa (Translocación del Fosfato)',
    enzymeName: 'Fosfoglicerato Mutasa (PGM)',
    ecNumber: 'EC 5.4.2.11',
    deltaG: '+4.4 kJ/mol',
    stepNumber: 8,
    totalSteps: 10,
    objectiveDescription:
      'Transfiere el grupo fosfato desde la posición C3 al átomo de oxígeno del C2 para sintetizar 2-Fosfoglicerato (2-PG).',
    pedagogicalHint:
      'Selecciona Fosfoglicerato Mutasa (EC 5.4.2.11) en el reactor. La enzima utiliza un intermediario fosfohistidina para donar y retirar el fosfato en C2/C3.',
    biochemicalContext:
      'La recolocación del éster fosfórico en C2 posiciona al sustrato en la proximidad del carboxilo vecino, desestabilizando la molécula y habilitando la posterior deshidratación por la Enolasa.',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 400, y: 350 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 460, y: 380 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 520, y: 350 },
        p3: { id: 'p3', element: 'P', formalCharge: 0, x: 580, y: 350 },
      },
      edges: {
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
        b_c3_p3: { id: 'b_c3_p3', sourceId: 'c3', targetId: 'p3', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'pgm',
      enzymeName: 'Fosfoglicerato Mutasa (EC 5.4.2.11)',
      ecNumber: 'EC 5.4.2.11',
      expectedCofactors: [],
      substrateName: '3-Fosfoglicerato',
      releasedByproducts: [],
      intermediateGraph: {
        nodes: {
          o1_dbl: { id: 'o1_dbl', element: 'O', formalCharge: 0, x: 380, y: 290 },
          o1_neg: { id: 'o1_neg', element: 'O', formalCharge: -1, x: 330, y: 350 },
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 380, y: 350 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 440, y: 380 },
          o2: { id: 'o2', element: 'O', formalCharge: 0, x: 440, y: 440 },
          p2: { id: 'p2', element: 'P', formalCharge: 0, x: 440, y: 500 },
          c3: { id: 'c3', element: 'C', formalCharge: 0, x: 500, y: 350 },
          o3: { id: 'o3', element: 'O', formalCharge: 0, x: 550, y: 380 },
        },
        edges: {
          b_c1_o1dbl: { id: 'b_c1_o1dbl', sourceId: 'c1', targetId: 'o1_dbl', order: 2 },
          b_c1_o1neg: { id: 'b_c1_o1neg', sourceId: 'c1', targetId: 'o1_neg', order: 1 },
          b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
          b_c2_o2: { id: 'b_c2_o2', sourceId: 'c2', targetId: 'o2', order: 1 },
          b_o2_p2: { id: 'b_o2_p2', sourceId: 'o2', targetId: 'p2', order: 1 },
          b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
          b_c3_o3: { id: 'b_c3_o3', sourceId: 'c3', targetId: 'o3', order: 1 },
        },
      },
      explanation:
        'La Fosfoglicerato Mutasa transfiere reversiblemente el fosforilo desde el C3 al C2 mediante el intermediario transitorio 2,3-bisfosfoglicerato.',
    },
    winConditions: {
      acceptedSmiles: [
        'OCC(OP(=O)(O)O)C(=O)O',
        'OCC(OP(=O)([O-])[O-])C(=O)[O-]',
        'OCC(OP(=O)(O)[O-])C(=O)[O-]',
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_step9_enolase',
    world: 2,
    moduleName: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
    title: 'Paso 9: Enolasa (Deshidratación y Formación de Enol)',
    enzymeName: 'Enolasa',
    ecNumber: 'EC 4.2.1.11',
    deltaG: '+7.5 kJ/mol',
    stepNumber: 9,
    totalSteps: 10,
    objectiveDescription:
      'Elimina una molécula de agua del 2-Fosfoglicerato para formar el enlace doble C=C del Fosfoenolpiruvato (PEP), de altísimo potencial de transferencia de fosfato.',
    pedagogicalHint:
      'Selecciona Enolasa en el reactor para liberar H₂O al reservorio y convertir el enlace C2-C3 en enlace doble (C=C).',
    biochemicalContext:
      'La Enolasa convierte un éster de fosfato con bajo potencial de hidrólisis (-16 kJ/mol) en un compuesto enólico con el mayor potencial de transferencia de fosfato del metabolismo celular (-61.9 kJ/mol).',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 380, y: 350 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 440, y: 380 },
        p2: { id: 'p2', element: 'P', formalCharge: 0, x: 440, y: 440 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 500, y: 350 },
        o3: { id: 'o3', element: 'O', formalCharge: 0, x: 550, y: 380 },
      },
      edges: {
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
        b_c2_p2: { id: 'b_c2_p2', sourceId: 'c2', targetId: 'p2', order: 1 },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
        b_c3_o3: { id: 'b_c3_o3', sourceId: 'c3', targetId: 'o3', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'enolase',
      enzymeName: 'Enolasa (EC 4.2.1.11)',
      ecNumber: 'EC 4.2.1.11',
      expectedCofactors: [],
      substrateName: '2-Fosfoglicerato',
      releasedByproducts: [
        { name: 'H₂O', formula: 'H2O', stoichiometry: '+1 H₂O' },
      ],
      intermediateGraph: {
        nodes: {
          o1_dbl: { id: 'o1_dbl', element: 'O', formalCharge: 0, x: 380, y: 290 },
          o1_neg: { id: 'o1_neg', element: 'O', formalCharge: -1, x: 330, y: 350 },
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 380, y: 350 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 440, y: 380 },
          o_brg: { id: 'o_brg', element: 'O', formalCharge: 0, x: 440, y: 320 },
          p: { id: 'p', element: 'P', formalCharge: 0, x: 490, y: 290 },
          c3: { id: 'c3', element: 'C', formalCharge: 0, x: 500, y: 410 },
        },
        edges: {
          b_c1_o1dbl: { id: 'b_c1_o1dbl', sourceId: 'c1', targetId: 'o1_dbl', order: 2 },
          b_c1_o1neg: { id: 'b_c1_o1neg', sourceId: 'c1', targetId: 'o1_neg', order: 1 },
          b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
          b_c2_obrg: { id: 'b_c2_obrg', sourceId: 'c2', targetId: 'o_brg', order: 1 },
          b_obrg_p: { id: 'b_obrg_p', sourceId: 'o_brg', targetId: 'p', order: 1 },
          b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 2 },
        },
      },
      explanation:
        'La Enolasa deshidrata el 2-PG coordinado con dos iones Mg²⁺, generando el enlace enol fosforilado de alta energía de PEP.',
    },
    winConditions: {
      acceptedSmiles: [
        'C=C(OP(=O)(O)O)C(=O)O',
        'C=C(OP(=O)([O-])[O-])C(=O)[O-]',
        'C=C(OP(=O)(O)[O-])C(=O)[O-]',
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm2_step10_pyruvate_kinase',
    world: 2,
    moduleName: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
    title: 'Paso 10: Piruvato Quinasa (2ª Fosforilación a Nivel de Sustrato)',
    enzymeName: 'Piruvato Quinasa (PK)',
    ecNumber: 'EC 2.7.1.40',
    deltaG: '-31.4 kJ/mol',
    stepNumber: 10,
    totalSteps: 10,
    objectiveDescription:
      'Transfiere el fosfato del Fosfoenolpiruvato al ADP mediante la Piruvato Quinasa para liberar ATP y formar la molécula final de Piruvato.',
    pedagogicalHint:
      'Selecciona Piruvato Quinasa y ADP en el reactor catalítico. El enlace enol pierde el fosfato y tautomeriza espontáneamente a la forma ceto estable de Piruvato.',
    biochemicalContext:
      'Paso terminal altamente exergónico e irreversible que concluye la glucólisis, rindiendo un balance neto de +2 ATP y +2 NADH por cada molécula de glucosa consumida.',
    allowedElements: ['C', 'H', 'O', 'P'],
    initialGraph: {
      nodes: {
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 400, y: 360 },
        o1_dbl: { id: 'o1_dbl', element: 'O', formalCharge: 0, x: 400, y: 300 },
        o1_neg: { id: 'o1_neg', element: 'O', formalCharge: -1, x: 350, y: 390 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 450, y: 390 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 490, y: 430 },
        o_bridge: { id: 'o_bridge', element: 'O', formalCharge: 0, x: 450, y: 330 },
        p: { id: 'p', element: 'P', formalCharge: 0, x: 500, y: 300 },
      },
      edges: {
        b_c1_o1dbl: { id: 'b_c1_o1dbl', sourceId: 'c1', targetId: 'o1_dbl', order: 2 },
        b_c1_o1neg: { id: 'b_c1_o1neg', sourceId: 'c1', targetId: 'o1_neg', order: 1 },
        b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
        b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 2 },
        b_c2_obridge: { id: 'b_c2_obridge', sourceId: 'c2', targetId: 'o_bridge', order: 1 },
        b_obridge_p: { id: 'b_obridge_p', sourceId: 'o_bridge', targetId: 'p', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'pyruvate_kinase',
      enzymeName: 'Piruvato Quinasa (EC 2.7.1.40)',
      ecNumber: 'EC 2.7.1.40',
      expectedCofactors: ['ADP'],
      substrateName: 'Fosfoenolpiruvato',
      releasedByproducts: [
        { name: 'ATP', formula: 'C10H16N5O13P3', stoichiometry: '+1 ATP' },
      ],
      intermediateGraph: {
        nodes: {
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 400, y: 360 },
          o1_dbl: { id: 'o1_dbl', element: 'O', formalCharge: 0, x: 400, y: 300 },
          o1_neg: { id: 'o1_neg', element: 'O', formalCharge: -1, x: 350, y: 390 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 450, y: 390 },
          o2_keto: { id: 'o2_keto', element: 'O', formalCharge: 0, x: 450, y: 450 },
          c3: { id: 'c3', element: 'C', formalCharge: 0, x: 510, y: 390 },
        },
        edges: {
          b_c1_o1dbl: { id: 'b_c1_o1dbl', sourceId: 'c1', targetId: 'o1_dbl', order: 2 },
          b_c1_o1neg: { id: 'b_c1_o1neg', sourceId: 'c1', targetId: 'o1_neg', order: 1 },
          b_c1_c2: { id: 'b_c1_c2', sourceId: 'c1', targetId: 'c2', order: 1 },
          b_c2_o2: { id: 'b_c2_o2', sourceId: 'c2', targetId: 'o2_keto', order: 2 },
          b_c2_c3: { id: 'b_c2_c3', sourceId: 'c2', targetId: 'c3', order: 1 },
        },
      },
      explanation:
        'La Piruvato Quinasa transfiere el fosfato de PEP al ADP para rendir la 2ª molécula de ATP y liberar el producto terminal: Piruvato.',
    },
    winConditions: {
      targetFormula: 'C3H4O3',
      acceptedSmiles: ['CC(=O)C(=O)O', 'CC(=O)C(=O)[O-]'],
      requiredSubstructures: [
        {
          name: 'Alfa-Cetoácido (CH₃-C(=O)-COO⁻)',
          smarts: '[#6](=O)[#6](=O)',
          minCount: 1,
          description:
            'Falta el grupo alfa-ceto característico del piruvato en el carbono 2.',
        },
      ],
      mustBeConnected: true,
    },
  },

  // =========================================================================
  // MÓDULO III: COMPLEJO MULTIENZIMÁTICO PIRUVATO DESHIDROGENASA (5 ETAPAS)
  // =========================================================================
  {
    id: 'm3_pdh_step1_e1',
    world: 3,
    moduleName: 'Módulo III: Complejo Multienzimático Piruvato Deshidrogenasa',
    title: 'Etapa 1: E1 Descarboxilación Oxidativa y Adición a TPP',
    enzymeName: 'E1 Piruvato Deshidrogenasa',
    ecNumber: 'EC 1.2.4.1',
    deltaG: '-13.8 kJ/mol',
    stepNumber: 1,
    totalSteps: 5,
    objectiveDescription:
      'Configura E1 Piruvato Deshidrogenasa y el cofactor TPP en el Reactor Catalítico para escindir el grupo carboxilo del Piruvato y liberar el 1º producto clave del complejo: HCO₃⁻ (CO₂).',
    pedagogicalHint:
      'El carbanión del anillo tiazolio del TPP ataca al carbonilo del piruvato. Se libera CO₂ (HCO₃⁻ a pH fisiológico) acumulándose en el Reservorio de Metabolitos.',
    biochemicalContext:
      'El Complejo PDH mitocondrial es el puente crucial entre la glucólisis citoplásmica y el Ciclo de Krebs. La descarboxilación en E1 es el paso irreversible del complejo.',
    allowedElements: ['C', 'H', 'O', 'N', 'S'],
    initialGraph: {
      nodes: {
        pyr_c3: { id: 'pyr_c3', element: 'C', formalCharge: 0, x: 380, y: 360 },
        pyr_c2: { id: 'pyr_c2', element: 'C', formalCharge: 0, x: 430, y: 330 },
        pyr_oketo: { id: 'pyr_oketo', element: 'O', formalCharge: 0, x: 430, y: 270 },
        pyr_c1: { id: 'pyr_c1', element: 'C', formalCharge: 0, x: 480, y: 360 },
        pyr_o1dbl: { id: 'pyr_o1dbl', element: 'O', formalCharge: 0, x: 480, y: 420 },
        pyr_o1neg: { id: 'pyr_o1neg', element: 'O', formalCharge: -1, x: 530, y: 340 },
      },
      edges: {
        b1: { id: 'b1', sourceId: 'pyr_c3', targetId: 'pyr_c2', order: 1 },
        b2: { id: 'b2', sourceId: 'pyr_c2', targetId: 'pyr_oketo', order: 2 },
        b3: { id: 'b3', sourceId: 'pyr_c2', targetId: 'pyr_c1', order: 1 },
        b4: { id: 'b4', sourceId: 'pyr_c1', targetId: 'pyr_o1dbl', order: 2 },
        b5: { id: 'b5', sourceId: 'pyr_c1', targetId: 'pyr_o1neg', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'pdh_e1',
      enzymeName: 'E1 Piruvato Deshidrogenasa (EC 1.2.4.1)',
      ecNumber: 'EC 1.2.4.1',
      expectedCofactors: ['TPP'],
      substrateName: 'Piruvato',
      releasedByproducts: [
        { name: 'HCO₃⁻ / CO₂', formula: 'HCO3-', stoichiometry: '+1 HCO₃⁻ (CO₂)' },
      ],
      intermediateGraph: {
        nodes: {
          hetpp_c1: { id: 'hetpp_c1', element: 'C', formalCharge: 0, x: 430, y: 330 },
          hetpp_oh: { id: 'hetpp_oh', element: 'O', formalCharge: 0, x: 430, y: 270 },
          hetpp_c2: { id: 'hetpp_c2', element: 'C', formalCharge: 0, x: 380, y: 360 },
          tpp_c: { id: 'tpp_c', element: 'C', formalCharge: 0, x: 480, y: 330 },
          tpp_n: { id: 'tpp_n', element: 'N', formalCharge: 1, x: 520, y: 300 },
          tpp_s: { id: 'tpp_s', element: 'S', formalCharge: 0, x: 520, y: 360 },
        },
        edges: {
          b_c1_oh: { id: 'b_c1_oh', sourceId: 'hetpp_c1', targetId: 'hetpp_oh', order: 1 },
          b_c1_c2: { id: 'b_c1_c2', sourceId: 'hetpp_c1', targetId: 'hetpp_c2', order: 1 },
          b_c1_tpp: { id: 'b_c1_tpp', sourceId: 'hetpp_c1', targetId: 'tpp_c', order: 1 },
          b_tpp_n: { id: 'b_tpp_n', sourceId: 'tpp_c', targetId: 'tpp_n', order: 1 },
          b_tpp_s: { id: 'b_tpp_s', sourceId: 'tpp_c', targetId: 'tpp_s', order: 1 },
        },
      },
      explanation:
        'E1 descarboxila el piruvato liberando el 1º producto clave del complejo: CO₂ (HCO₃⁻), reteniendo el grupo hidroxietilo sobre el TPP (HETPP).',
    },
    winConditions: {
      acceptedSmiles: ['CC(O)C1=NC=CS1', 'CC(O)C', 'CC(=O)O'],
      forbiddenSubstructures: [
        {
          name: 'Carboxilato Original del Piruvato',
          smarts: '[#6](=O)[OX1-]',
          minCount: 1,
          description:
            'El piruvato debe descarboxilarse liberando CO₂ (HCO₃⁻).',
        },
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm3_pdh_step2_e1',
    world: 3,
    moduleName: 'Módulo III: Complejo Multienzimático Piruvato Deshidrogenasa',
    title: 'Etapa 2: E1 Oxidación y Transferencia a Lipoamida',
    enzymeName: 'E1 Piruvato Deshidrogenasa',
    ecNumber: 'EC 1.2.4.1',
    deltaG: '-17.2 kJ/mol',
    stepNumber: 2,
    totalSteps: 5,
    objectiveDescription:
      'Oxida el grupo hidroxietilo a grupo acetilo y transfiérelo al puente disulfuro del brazo oscilante de Lipoamida acoplado a E2. Selecciona E1 y cofactor Lipoamida.',
    pedagogicalHint:
      'El puente disulfuro de la lipoamida se reduce, recibiendo el grupo acetilo para formar acetildihidrolipoamida y regenerando el cofactor TPP.',
    biochemicalContext:
      'El brazo largo de lipoamida (1.4 nm) acoplado covalentemente a una lisina de E2 oscila físicamente entre los centros activos de E1, E2 y E3.',
    allowedElements: ['C', 'H', 'O', 'N', 'S'],
    initialGraph: {
      nodes: {
        hetpp_c: { id: 'hetpp_c', element: 'C', formalCharge: 0, x: 420, y: 340 },
        hetpp_me: { id: 'hetpp_me', element: 'C', formalCharge: 0, x: 370, y: 360 },
        lip_s1: { id: 'lip_s1', element: 'S', formalCharge: 0, x: 480, y: 340 },
        lip_s2: { id: 'lip_s2', element: 'S', formalCharge: 0, x: 530, y: 360 },
      },
      edges: {
        b1: { id: 'b1', sourceId: 'hetpp_c', targetId: 'hetpp_me', order: 1 },
        b2: { id: 'b2', sourceId: 'lip_s1', targetId: 'lip_s2', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'pdh_e1',
      enzymeName: 'E1 Piruvato Deshidrogenasa (EC 1.2.4.1)',
      ecNumber: 'EC 1.2.4.1',
      expectedCofactors: ['Lipoamida'],
      substrateName: 'Hidroxietil-TPP',
      releasedByproducts: [
        { name: 'TPP (Regenerado)', formula: 'C12H19N4O7P2S', stoichiometry: 'TPP reciclado en E1' },
      ],
      intermediateGraph: {
        nodes: {
          act_me: { id: 'act_me', element: 'C', formalCharge: 0, x: 370, y: 340 },
          act_carb: { id: 'act_carb', element: 'C', formalCharge: 0, x: 420, y: 340 },
          act_o: { id: 'act_o', element: 'O', formalCharge: 0, x: 420, y: 280 },
          lip_s: { id: 'lip_s', element: 'S', formalCharge: 0, x: 480, y: 340 },
          lip_c1: { id: 'lip_c1', element: 'C', formalCharge: 0, x: 530, y: 340 },
          lip_sh: { id: 'lip_sh', element: 'S', formalCharge: 0, x: 530, y: 400 },
        },
        edges: {
          b_me_carb: { id: 'b_me_carb', sourceId: 'act_me', targetId: 'act_carb', order: 1 },
          b_carb_o: { id: 'b_carb_o', sourceId: 'act_carb', targetId: 'act_o', order: 2 },
          b_carb_s: { id: 'b_carb_s', sourceId: 'act_carb', targetId: 'lip_s', order: 1 },
          b_s_c1: { id: 'b_s_c1', sourceId: 'lip_s', targetId: 'lip_c1', order: 1 },
          b_c1_sh: { id: 'b_c1_sh', sourceId: 'lip_c1', targetId: 'lip_sh', order: 1 },
        },
      },
      explanation:
        'E1 oxida el hidroxietilo a grupo acetilo y lo transfiere al azufre de la lipoamida formando acetildihidrolipoamida y liberando el TPP regenerado.',
    },
    winConditions: {
      acceptedSmiles: ['CC(=O)SCCS', 'CC(=O)S', 'CC(=O)SCC'],
      requiredSubstructures: [
        {
          name: 'Enlace Tioéster (C(=O)-S)',
          smarts: '[#6](=O)[SX2]',
          minCount: 1,
          description:
            'Falta el enlace tioéster que ancla el grupo acetilo a la lipoamida.',
        },
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm3_pdh_step3_e2',
    world: 3,
    moduleName: 'Módulo III: Complejo Multienzimático Piruvato Deshidrogenasa',
    title: 'Etapa 3: E2 Transacetilación a Coenzima A (Síntesis de Acetil-CoA)',
    enzymeName: 'E2 Dihidrolipoil Transacetilasa',
    ecNumber: 'EC 2.3.1.12',
    deltaG: '-3.8 kJ/mol',
    stepNumber: 3,
    totalSteps: 5,
    objectiveDescription:
      'Transfiere el grupo acetilo desde la acetildihidrolipoamida al grupo tiol libre de la Coenzima A (CoA-SH) para sintetizar el 2º producto clave: Acetil-CoA.',
    pedagogicalHint:
      'En el Reactor Catalítico, selecciona E2 Dihidrolipoil Transacetilasa y CoA-SH. El enlace tioéster se transfiere a la Coenzima A liberando Acetil-CoA al reservorio.',
    biochemicalContext:
      'La energía libre de la oxidación previa se conserva intacta en el enlace tioéster del Acetil-CoA (ΔG°\' hidrólisis = -31.5 kJ/mol), listo para ingresar al Ciclo del Ácido Cítrico.',
    allowedElements: ['C', 'H', 'O', 'N', 'S'],
    initialGraph: {
      nodes: {
        act_c: { id: 'act_c', element: 'C', formalCharge: 0, x: 380, y: 350 },
        act_o: { id: 'act_o', element: 'O', formalCharge: 0, x: 380, y: 290 },
        act_me: { id: 'act_me', element: 'C', formalCharge: 0, x: 330, y: 370 },
        coa_s: { id: 'coa_s', element: 'S', formalCharge: 0, x: 460, y: 350 },
      },
      edges: {
        b1: { id: 'b1', sourceId: 'act_c', targetId: 'act_o', order: 2 },
        b2: { id: 'b2', sourceId: 'act_c', targetId: 'act_me', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'pdh_e2',
      enzymeName: 'E2 Dihidrolipoil Transacetilasa (EC 2.3.1.12)',
      ecNumber: 'EC 2.3.1.12',
      expectedCofactors: ['CoA-SH'],
      substrateName: 'Acetildihidrolipoamida',
      releasedByproducts: [
        { name: 'Acetil-CoA', formula: 'C23H38N7O17P3S', stoichiometry: '+1 Acetil-CoA' },
      ],
      intermediateGraph: {
        nodes: {
          lip_sh1: { id: 'lip_sh1', element: 'S', formalCharge: 0, x: 420, y: 340 },
          lip_c1: { id: 'lip_c1', element: 'C', formalCharge: 0, x: 470, y: 340 },
          lip_c2: { id: 'lip_c2', element: 'C', formalCharge: 0, x: 520, y: 340 },
          lip_sh2: { id: 'lip_sh2', element: 'S', formalCharge: 0, x: 570, y: 340 },
        },
        edges: {
          b1: { id: 'b1', sourceId: 'lip_sh1', targetId: 'lip_c1', order: 1 },
          b2: { id: 'b2', sourceId: 'lip_c1', targetId: 'lip_c2', order: 1 },
          b3: { id: 'b3', sourceId: 'lip_c2', targetId: 'lip_sh2', order: 1 },
        },
      },
      explanation:
        'E2 transfiere el grupo acetilo a la Coenzima A formando el enlace tioéster de Acetil-CoA (depositado en el reservorio) y dejando la dihidrolipoamida en estado completamente reducido.',
    },
    winConditions: {
      acceptedSmiles: [
        'CC(=O)SCCN',
        'CC(=O)SCC[NH3+]',
        'CC(=O)S',
        'SCCS',
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm3_pdh_step4_e3',
    world: 3,
    moduleName: 'Módulo III: Complejo Multienzimático Piruvato Deshidrogenasa',
    title: 'Etapa 4: E3 Oxidación de Dihidrolipoamida por FAD',
    enzymeName: 'E3 Dihidrolipoil Deshidrogenasa',
    ecNumber: 'EC 1.8.1.4',
    deltaG: '-4.2 kJ/mol',
    stepNumber: 4,
    totalSteps: 5,
    objectiveDescription:
      'Reoxida los dos grupos tiol (-SH) de la dihidrolipoamida cerrando el puente disulfuro (S-S) mediante el cofactor FAD unido a E3.',
    pedagogicalHint:
      'Selecciona E3 Dihidrolipoil Deshidrogenasa y el cofactor FAD. La lipoamida recupera su puente disulfuro para el siguiente ciclo catalítico y el FAD se reduce a FADH₂.',
    biochemicalContext:
      'Para que el complejo funcione catalíticamente de manera continua, el brazo de lipoamida debe regresar a su estado oxidado activo (enlace disulfuro cerrado).',
    allowedElements: ['C', 'H', 'S'],
    initialGraph: {
      nodes: {
        s1: { id: 's1', element: 'S', formalCharge: 0, x: 420, y: 340 },
        c1: { id: 'c1', element: 'C', formalCharge: 0, x: 470, y: 310 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 520, y: 340 },
        s2: { id: 's2', element: 'S', formalCharge: 0, x: 470, y: 380 },
      },
      edges: {
        b1: { id: 'b1', sourceId: 's1', targetId: 'c1', order: 1 },
        b2: { id: 'b2', sourceId: 'c1', targetId: 'c2', order: 1 },
        b3: { id: 'b3', sourceId: 'c2', targetId: 's2', order: 1 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'pdh_e3',
      enzymeName: 'E3 Dihidrolipoil Deshidrogenasa (EC 1.8.1.4)',
      ecNumber: 'EC 1.8.1.4',
      expectedCofactors: ['FAD'],
      substrateName: 'Dihidrolipoamida reducida',
      releasedByproducts: [
        { name: 'FADH₂ (E3)', formula: 'C27H35N9O15P2', stoichiometry: '+1 FADH₂ unido a E3' },
      ],
      intermediateGraph: {
        nodes: {
          s1: { id: 's1', element: 'S', formalCharge: 0, x: 440, y: 340 },
          c1: { id: 'c1', element: 'C', formalCharge: 0, x: 480, y: 300 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 520, y: 340 },
          s2: { id: 's2', element: 'S', formalCharge: 0, x: 480, y: 380 },
        },
        edges: {
          b1: { id: 'b1', sourceId: 's1', targetId: 'c1', order: 1 },
          b2: { id: 'b2', sourceId: 'c1', targetId: 'c2', order: 1 },
          b3: { id: 'b3', sourceId: 'c2', targetId: 's2', order: 1 },
          b_ss: { id: 'b_ss', sourceId: 's1', targetId: 's2', order: 1 },
        },
      },
      explanation:
        'E3 transfiere dos protones y dos electrones de la dihidrolipoamida a su grupo prostético FAD, regenerando el puente disulfuro activo de la lipoamida.',
    },
    winConditions: {
      acceptedSmiles: ['C1CCSS1', 'SCCSC', 'S1CCCS1'],
      requiredSubstructures: [
        {
          name: 'Puente Disulfuro (S-S)',
          smarts: '[SX2][SX2]',
          minCount: 1,
          description:
            'Los dos átomos de azufre deben estar unidos covalentemente formando el puente disulfuro activo de la lipoamida oxidada.',
        },
      ],
      mustBeConnected: true,
    },
  },
  {
    id: 'm3_pdh_step5_e3',
    world: 3,
    moduleName: 'Módulo III: Complejo Multienzimático Piruvato Deshidrogenasa',
    title: 'Etapa 5: E3 Transferencia Electrónica y Síntesis de NADH',
    enzymeName: 'E3 Dihidrolipoil Deshidrogenasa',
    ecNumber: 'EC 1.8.1.4',
    deltaG: '+2.8 kJ/mol',
    stepNumber: 5,
    totalSteps: 5,
    objectiveDescription:
      'Transfiere los electrones desde el FADH₂ en E3 hacia el aceptor soluble NAD⁺ para regenerar el FAD oxidado y liberar el 3º producto clave: NADH + H⁺.',
    pedagogicalHint:
      'Configura E3 Dihidrolipoil Deshidrogenasa con NAD⁺ en el Reactor Catalítico. Se libera NADH al reservorio estequiométrico, completando los 3 productos clave del complejo.',
    biochemicalContext:
      'El FADH₂ dona un ion hidruro (:H⁻) al NAD⁺ soluble. El NADH generado alimentará el Complejo I de la cadena de transporte de electrones mitocondrial generando aproximadamente 2.5 ATP por fosforilación oxidativa.',
    allowedElements: ['C', 'H', 'O', 'N'],
    initialGraph: {
      nodes: {
        n_pyr: { id: 'n_pyr', element: 'N', formalCharge: 1, x: 440, y: 310 },
        c2: { id: 'c2', element: 'C', formalCharge: 0, x: 480, y: 330 },
        c3: { id: 'c3', element: 'C', formalCharge: 0, x: 480, y: 380 },
        c4: { id: 'c4', element: 'C', formalCharge: 0, x: 440, y: 400 },
        c5: { id: 'c5', element: 'C', formalCharge: 0, x: 400, y: 380 },
        c6: { id: 'c6', element: 'C', formalCharge: 0, x: 400, y: 330 },
      },
      edges: {
        b1: { id: 'b1', sourceId: 'n_pyr', targetId: 'c2', order: 1 },
        b2: { id: 'b2', sourceId: 'c2', targetId: 'c3', order: 2 },
        b3: { id: 'b3', sourceId: 'c3', targetId: 'c4', order: 1 },
        b4: { id: 'b4', sourceId: 'c4', targetId: 'c5', order: 2 },
        b5: { id: 'b5', sourceId: 'c5', targetId: 'c6', order: 1 },
        b6: { id: 'b6', sourceId: 'c6', targetId: 'n_pyr', order: 2 },
      },
    },
    catalyticReaction: {
      expectedEnzymeId: 'pdh_e3',
      enzymeName: 'E3 Dihidrolipoil Deshidrogenasa (EC 1.8.1.4)',
      ecNumber: 'EC 1.8.1.4',
      expectedCofactors: ['NAD+'],
      substrateName: 'E3-FADH₂',
      releasedByproducts: [
        { name: 'NADH + H⁺', formula: 'C21H29N7O14P2', stoichiometry: '+1 NADH + H⁺' },
      ],
      intermediateGraph: {
        nodes: {
          n_pyr: { id: 'n_pyr', element: 'N', formalCharge: 0, x: 440, y: 310 },
          c2: { id: 'c2', element: 'C', formalCharge: 0, x: 480, y: 330 },
          c3: { id: 'c3', element: 'C', formalCharge: 0, x: 480, y: 380 },
          c4: { id: 'c4', element: 'C', formalCharge: 0, x: 440, y: 400 },
          c5: { id: 'c5', element: 'C', formalCharge: 0, x: 400, y: 380 },
          c6: { id: 'c6', element: 'C', formalCharge: 0, x: 400, y: 330 },
        },
        edges: {
          b1: { id: 'b1', sourceId: 'n_pyr', targetId: 'c2', order: 1 },
          b2: { id: 'b2', sourceId: 'c2', targetId: 'c3', order: 2 },
          b3: { id: 'b3', sourceId: 'c3', targetId: 'c4', order: 1 },
          b4: { id: 'b4', sourceId: 'c4', targetId: 'c5', order: 1 },
          b5: { id: 'b5', sourceId: 'c5', targetId: 'c6', order: 2 },
          b6: { id: 'b6', sourceId: 'c6', targetId: 'n_pyr', order: 1 },
        },
      },
      explanation:
        'E3 transfiere el hidruro desde el FADH₂ hacia el anillo de nicotinamida de NAD⁺, rindiendo NADH + H⁺ en el reservorio y dejando las 3 enzimas listas para el próximo piruvato.',
    },
    winConditions: {
      acceptedSmiles: ['C1=CNC=CC1', 'NC(=O)C1=CN(C=CC1)C', 'NC(=O)C1=CC=CNC1', 'N1C=CC=CC1'],
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
 * Retorna las misiones correspondientes a un módulo / mundo específico (1, 2 o 3).
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
