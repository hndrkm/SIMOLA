import { validateLocalGraph } from './src/core/chemistry/localValidator';
import { validateWithRDKit } from './src/core/chemistry/rdkitValidator';
import { MolecularGraph } from './src/core/model/types';

async function runUnitTests() {
  console.log('=== INICIANDO PRUEBAS UNITARIAS DE QUÍMICA (ETAPAS 3 Y 4) ===\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, name: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      process.exitCode = 1;
    }
  }

  // PRUEBA 1: Carbono Pentavalente (C con 5 enlaces)
  console.log('--- Test 1: Carbono Pentavalente (Capa 1 - LocalValidator) ---');
  const pentavalentCGraph: MolecularGraph = {
    nodes: {
      c1: { id: 'c1', element: 'C', formalCharge: 0, x: 0, y: 0 },
      h1: { id: 'h1', element: 'H', formalCharge: 0, x: 50, y: 0 },
      h2: { id: 'h2', element: 'H', formalCharge: 0, x: -50, y: 0 },
      h3: { id: 'h3', element: 'H', formalCharge: 0, x: 0, y: 50 },
      h4: { id: 'h4', element: 'H', formalCharge: 0, x: 0, y: -50 },
      h5: { id: 'h5', element: 'H', formalCharge: 0, x: 35, y: 35 },
    },
    edges: {
      b1: { id: 'b1', sourceId: 'c1', targetId: 'h1', order: 1 },
      b2: { id: 'b2', sourceId: 'c1', targetId: 'h2', order: 1 },
      b3: { id: 'b3', sourceId: 'c1', targetId: 'h3', order: 1 },
      b4: { id: 'b4', sourceId: 'c1', targetId: 'h4', order: 1 },
      b5: { id: 'b5', sourceId: 'c1', targetId: 'h5', order: 1 },
    },
  };

  const res1 = validateLocalGraph(pentavalentCGraph);
  assert(!res1.isValid, 'C pentavalente debe ser marcado como inválido');
  assert(!res1.passedLayer1, 'C pentavalente no pasa Capa 1');
  assert(res1.issues.length === 1, 'Debe haber exactamente 1 issue');
  assert(res1.issues[0]?.code === 'VALENCE_EXCEEDED', 'El código de error debe ser VALENCE_EXCEEDED');
  assert(res1.issues[0]?.affectedAtomIds.includes('c1'), 'El átomo infractor reportado debe ser c1');
  assert(res1.issues[0]?.message.includes('pentavalente'), 'El mensaje debe explicar que el carbono no puede ser pentavalente');

  // PRUEBA 1b: Conectividad BFS (fragmentos desconectados)
  console.log('\n--- Test 1b: Conectividad BFS (mustBeConnected: true) ---');
  const disconnectedGraph: MolecularGraph = {
    nodes: {
      c1: { id: 'c1', element: 'C', formalCharge: 0, x: 0, y: 0 },
      c2: { id: 'c2', element: 'C', formalCharge: 0, x: 50, y: 0 },
      o1: { id: 'o1', element: 'O', formalCharge: 0, x: 200, y: 200 },
    },
    edges: {
      b1: { id: 'b1', sourceId: 'c1', targetId: 'c2', order: 1 },
    },
  };
  const res1b = validateLocalGraph(disconnectedGraph, { mustBeConnected: true });
  assert(!res1b.isValid, 'Grafo desconectado debe fallar con mustBeConnected');
  assert(res1b.issues[0]?.code === 'DISCONNECTED_GRAPH', 'Código de error debe ser DISCONNECTED_GRAPH');
  assert(res1b.issues[0]?.affectedAtomIds.includes('o1'), 'Debe marcar o1 como átomo desconectado');

  // PRUEBA 2: Etanol vs Dimetil Éter
  console.log('\n--- Test 2: Etanol vs Dimetil Éter (Capa 1 y Capa 2) ---');
  const ethanolGraph: MolecularGraph = {
    nodes: {
      c1: { id: 'c1', element: 'C', formalCharge: 0, x: 0, y: 0 },
      c2: { id: 'c2', element: 'C', formalCharge: 0, x: 50, y: 0 },
      o1: { id: 'o1', element: 'O', formalCharge: 0, x: 100, y: 30 },
    },
    edges: {
      b1: { id: 'b1', sourceId: 'c1', targetId: 'c2', order: 1 },
      b2: { id: 'b2', sourceId: 'c2', targetId: 'o1', order: 1 },
    },
  };
  const ethLocal = validateLocalGraph(ethanolGraph);
  assert(ethLocal.isValid, 'Etanol es válido en Capa 1');

  const ethRdkit = await validateWithRDKit(ethanolGraph);
  assert(ethRdkit.isValid, 'Etanol es válido en RDKit');
  assert(ethRdkit.descriptors?.canonicalSmiles === 'CCO', `SMILES de Etanol esperado CCO, obtenido: ${ethRdkit.descriptors?.canonicalSmiles}`);
  assert(ethRdkit.descriptors?.formula === 'C2H6O', `Fórmula de Etanol esperada C2H6O, obtenida: ${ethRdkit.descriptors?.formula}`);
  const hasAlcohol = ethRdkit.detectedFunctionalGroups?.some(g => g.name.includes('Alcohol'));
  assert(hasAlcohol === true, 'Etanol debe detectar grupo Alcohol (-OH)');

  // Dimetil Éter (C - O - C)
  const etherGraph: MolecularGraph = {
    nodes: {
      c1: { id: 'c1', element: 'C', formalCharge: 0, x: 0, y: 0 },
      o1: { id: 'o1', element: 'O', formalCharge: 0, x: 50, y: 25 },
      c2: { id: 'c2', element: 'C', formalCharge: 0, x: 100, y: 0 },
    },
    edges: {
      b1: { id: 'b1', sourceId: 'c1', targetId: 'o1', order: 1 },
      b2: { id: 'b2', sourceId: 'o1', targetId: 'c2', order: 1 },
    },
  };
  const etherRdkit = await validateWithRDKit(etherGraph);
  assert(etherRdkit.descriptors?.canonicalSmiles === 'COC', `SMILES de Éter esperado COC, obtenido: ${etherRdkit.descriptors?.canonicalSmiles}`);
  assert(etherRdkit.descriptors?.formula === 'C2H6O', `Fórmula de Éter esperada C2H6O, obtenida: ${etherRdkit.descriptors?.formula}`);
  const hasEther = etherRdkit.detectedFunctionalGroups?.some(g => g.name.includes('Éter'));
  const hasEtherAlcohol = etherRdkit.detectedFunctionalGroups?.some(g => g.name.includes('Alcohol'));
  assert(hasEther === true, 'Dimetil éter debe detectar grupo Éter (R-O-R)');
  assert(!hasEtherAlcohol, 'Dimetil éter NO debe detectar grupo Alcohol');

  // PRUEBA 3: Benceno
  console.log('\n--- Test 3: Benceno (Anillo aromático de 6 miembros) ---');
  const benzeneGraph: MolecularGraph = {
    nodes: {
      c1: { id: 'c1', element: 'C', formalCharge: 0, x: 0, y: 60 },
      c2: { id: 'c2', element: 'C', formalCharge: 0, x: 52, y: 30 },
      c3: { id: 'c3', element: 'C', formalCharge: 0, x: 52, y: -30 },
      c4: { id: 'c4', element: 'C', formalCharge: 0, x: 0, y: -60 },
      c5: { id: 'c5', element: 'C', formalCharge: 0, x: -52, y: -30 },
      c6: { id: 'c6', element: 'C', formalCharge: 0, x: -52, y: 30 },
    },
    edges: {
      b1: { id: 'b1', sourceId: 'c1', targetId: 'c2', order: 2 },
      b2: { id: 'b2', sourceId: 'c2', targetId: 'c3', order: 1 },
      b3: { id: 'b3', sourceId: 'c3', targetId: 'c4', order: 2 },
      b4: { id: 'b4', sourceId: 'c4', targetId: 'c5', order: 1 },
      b5: { id: 'b5', sourceId: 'c5', targetId: 'c6', order: 2 },
      b6: { id: 'b6', sourceId: 'c6', targetId: 'c1', order: 1 },
    },
  };
  const benzLocal = validateLocalGraph(benzeneGraph);
  assert(benzLocal.isValid, 'Benceno pasa Capa 1');
  const benzRdkit = await validateWithRDKit(benzeneGraph);
  assert(benzRdkit.descriptors?.canonicalSmiles === 'c1ccccc1', `SMILES de Benceno esperado c1ccccc1, obtenido: ${benzRdkit.descriptors?.canonicalSmiles}`);
  assert(benzRdkit.descriptors?.formula === 'C6H6', `Fórmula de Benceno esperada C6H6, obtenida: ${benzRdkit.descriptors?.formula}`);
  assert(benzRdkit.descriptors?.ringCount === 1, `Conteo de anillos esperado 1, obtenido: ${benzRdkit.descriptors?.ringCount}`);
  const hasAromatic = benzRdkit.detectedFunctionalGroups?.some(g => g.name.includes('Aromático'));
  assert(hasAromatic === true, 'Benceno debe detectar Anillo Aromático');

  // PRUEBA 4: Grupo Fosfato con Cargas Negativas (PO4^3-)
  console.log('\n--- Test 4: Grupo Fosfato con Cargas Negativas (PO4^3-) ---');
  const phosphateGraph: MolecularGraph = {
    nodes: {
      p1: { id: 'p1', element: 'P', formalCharge: 0, x: 0, y: 0 },
      o1: { id: 'o1', element: 'O', formalCharge: 0, x: 0, y: -60 },       // P=O (neutro)
      o2: { id: 'o2', element: 'O', formalCharge: -1, x: 60, y: 0 },       // P-O(-)
      o3: { id: 'o3', element: 'O', formalCharge: -1, x: -60, y: 0 },      // P-O(-)
      o4: { id: 'o4', element: 'O', formalCharge: -1, x: 0, y: 60 },       // P-O(-)
    },
    edges: {
      b1: { id: 'b1', sourceId: 'p1', targetId: 'o1', order: 2 },
      b2: { id: 'b2', sourceId: 'p1', targetId: 'o2', order: 1 },
      b3: { id: 'b3', sourceId: 'p1', targetId: 'o3', order: 1 },
      b4: { id: 'b4', sourceId: 'p1', targetId: 'o4', order: 1 },
    },
  };
  const phosLocal = validateLocalGraph(phosphateGraph);
  assert(phosLocal.isValid, 'Fosfato con 3 O(-) y 1 O neutro pasa Capa 1');
  const phosRdkit = await validateWithRDKit(phosphateGraph);
  assert(phosRdkit.descriptors?.canonicalSmiles === 'O=P([O-])([O-])[O-]', `SMILES de Fosfato esperado O=P([O-])([O-])[O-], obtenido: ${phosRdkit.descriptors?.canonicalSmiles}`);
  assert(phosRdkit.descriptors?.formula === 'O4P', `Fórmula de Fosfato esperada O4P, obtenida: ${phosRdkit.descriptors?.formula}`);
  const hasPhosGroup = phosRdkit.detectedFunctionalGroups?.some(g => g.name.includes('Fosfato'));
  assert(hasPhosGroup === true, 'Fosfato debe detectar grupo funcional Fosfato');

  // PRUEBA 5: Etapa 5 - Evaluador de Misiones y Diagnóstico Diferencial
  console.log('\n--- Test 5: Etapa 5 - Evaluador de Misiones y Diagnóstico Diferencial ---');
  const { evaluateMission } = await import('./src/core/missions/missionEvaluator');
  const { PROGRESSION_MISSIONS, getMissionById } = await import('./src/data/missions/progressionMissions');

  assert(PROGRESSION_MISSIONS.length === 7, 'El catálogo debe contener exactamente 7 misiones');

  // Test 5a: Misión 1 (Eteno)
  const m1 = getMissionById('m1_ethene')!;
  assert(!!m1, 'Misión m1_ethene debe existir');
  const m1InitialRes = await evaluateMission(m1.initialGraph!, m1);
  assert(!m1InitialRes.passedMission, 'Grafo inicial de m1 (C-C) no debe pasar la misión');
  assert(m1InitialRes.passedLayer1, 'Grafo inicial de m1 pasa Capa 1');

  // Solución m1: C=C
  const m1SolvedGraph: MolecularGraph = {
    nodes: {
      c1: { id: 'c1', element: 'C', formalCharge: 0, x: 470, y: 350 },
      c2: { id: 'c2', element: 'C', formalCharge: 0, x: 530, y: 350 },
    },
    edges: {
      b1: { id: 'b1', sourceId: 'c1', targetId: 'c2', order: 2 },
    },
  };
  const m1SolvedRes = await evaluateMission(m1SolvedGraph, m1);
  assert(m1SolvedRes.passedMission, 'Eteno con C=C debe superar la misión m1');
  assert(m1SolvedRes.descriptors?.canonicalSmiles === 'C=C', 'SMILES canónico de m1 debe ser C=C');

  // Test 5b: Misión 2 (Isomería y Diagnóstico Diferencial de Isómeros)
  const m2 = getMissionById('m1_isomers')!;
  assert(!!m2, 'Misión m1_isomers debe existir');
  // Grafo inicial: Dimetil éter (COC) tiene fórmula C2H6O, igual que Etanol (CCO)
  const m2InitialRes = await evaluateMission(m2.initialGraph!, m2);
  assert(!m2InitialRes.passedMission, 'Dimetil éter no debe superar la misión de Etanol');
  assert(m2InitialRes.descriptors?.formula === 'C2H6O', 'Dimetil éter debe tener fórmula C2H6O');
  assert(
    m2InitialRes.issues.some((i) => i.message.includes('conectado en el carbono equivocado') || i.message.includes('isómero')),
    'Diagnóstico diferencial debe identificar error de isomería/regioquímica cuando la fórmula coincide pero el SMILES no'
  );

  // Solución m2: Etanol (CCO)
  const m2SolvedRes = await evaluateMission(ethanolGraph, m2);
  assert(m2SolvedRes.passedMission, 'Etanol (CCO) debe superar la misión m2');

  // Test 5c: Misión 6 (Piruvato Quinasa - Subestructura Prohibida Fósforo)
  const m6 = getMissionById('m2_pyruvate_kinase')!;
  assert(!!m6, 'Misión m2_pyruvate_kinase debe existir');
  const m6InitialRes = await evaluateMission(m6.initialGraph!, m6);
  assert(!m6InitialRes.passedMission, 'PEP inicial no debe superar la misión de Piruvato');
  assert(
    m6InitialRes.issues.some((i) => i.code === 'FORBIDDEN_SUBSTRUCTURE'),
    'Debe marcar FORBIDDEN_SUBSTRUCTURE debido al grupo fosfato residual en PEP'
  );

  // Solución m6: Piruvato neutro (CC(=O)C(=O)O)
  const pyruvateGraph: MolecularGraph = {
    nodes: {
      c3: { id: 'c3', element: 'C', formalCharge: 0, x: 0, y: 0 },
      c2: { id: 'c2', element: 'C', formalCharge: 0, x: 50, y: 0 },
      oketo: { id: 'oketo', element: 'O', formalCharge: 0, x: 50, y: -50 },
      c1: { id: 'c1', element: 'C', formalCharge: 0, x: 100, y: 0 },
      o1dbl: { id: 'o1dbl', element: 'O', formalCharge: 0, x: 100, y: 50 },
      o1oh: { id: 'o1oh', element: 'O', formalCharge: 0, x: 150, y: 0 },
    },
    edges: {
      b1: { id: 'b1', sourceId: 'c3', targetId: 'c2', order: 1 },
      b2: { id: 'b2', sourceId: 'c2', targetId: 'oketo', order: 2 },
      b3: { id: 'b3', sourceId: 'c2', targetId: 'c1', order: 1 },
      b4: { id: 'b4', sourceId: 'c1', targetId: 'o1dbl', order: 2 },
      b5: { id: 'b5', sourceId: 'c1', targetId: 'o1oh', order: 1 },
    },
  };
  const m6SolvedRes = await evaluateMission(pyruvateGraph, m6);
  assert(m6SolvedRes.passedMission, 'Piruvato debe superar la misión m2_pyruvate_kinase');

  // Test 5d: Misión 7 (Complejo PDH - Acetil-CoA y Enlace Tioéster)
  const m7 = getMissionById('m3_pdh_acetyl_coa')!;
  assert(!!m7, 'Misión m3_pdh_acetyl_coa debe existir');
  const m7InitialRes = await evaluateMission(m7.initialGraph!, m7);
  assert(!m7InitialRes.passedMission, 'Grafo inicial de PDH con dos fragmentos debe fallar');

  // Solución m7: Fragmento de Acetil-CoA (CH3-C(=O)-S-CH2-CH2-NH2)
  const acetylCoaGraph: MolecularGraph = {
    nodes: {
      c_me: { id: 'c_me', element: 'C', formalCharge: 0, x: 320, y: 360 },
      c_carb: { id: 'c_carb', element: 'C', formalCharge: 0, x: 370, y: 330 },
      o_carb: { id: 'o_carb', element: 'O', formalCharge: 0, x: 370, y: 270 },
      s_coa: { id: 's_coa', element: 'S', formalCharge: 0, x: 420, y: 360 },
      c_pant1: { id: 'c_pant1', element: 'C', formalCharge: 0, x: 470, y: 330 },
      c_pant2: { id: 'c_pant2', element: 'C', formalCharge: 0, x: 520, y: 360 },
      n_pant: { id: 'n_pant', element: 'N', formalCharge: 0, x: 570, y: 330 },
    },
    edges: {
      b1: { id: 'b1', sourceId: 'c_me', targetId: 'c_carb', order: 1 },
      b2: { id: 'b2', sourceId: 'c_carb', targetId: 'o_carb', order: 2 },
      b3: { id: 'b3', sourceId: 'c_carb', targetId: 's_coa', order: 1 }, // Enlace tioéster C(=O)-S
      b4: { id: 'b4', sourceId: 's_coa', targetId: 'c_pant1', order: 1 },
      b5: { id: 'b5', sourceId: 'c_pant1', targetId: 'c_pant2', order: 1 },
      b6: { id: 'b6', sourceId: 'c_pant2', targetId: 'n_pant', order: 1 },
    },
  };
  const m7SolvedRes = await evaluateMission(acetylCoaGraph, m7);
  assert(m7SolvedRes.passedMission, 'Acetil-CoA con enlace tioéster debe superar la misión m3_pdh_acetyl_coa');
  assert(m7SolvedRes.descriptors?.canonicalSmiles === 'CC(=O)SCCN', `SMILES de Acetil-CoA esperado CC(=O)SCCN, obtenido: ${m7SolvedRes.descriptors?.canonicalSmiles}`);

  console.log(`\n===========================================`);
  console.log(`RESUMEN: ${passed} de ${total} verificaciones pasadas con éxito!`);
  console.log(`===========================================\n`);
}

runUnitTests().catch((err) => {
  console.error('Error durante la ejecución de pruebas:', err);
  process.exit(1);
});

