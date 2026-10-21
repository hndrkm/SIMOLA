# 02 - Arquitectura de Carpetas y Contratos TypeScript

## 1. Estructura de Directorios
El código bajo `src/core/` debe ser TypeScript puro y no importar nunca nada de `react` ni de `konva`.

```text
src/
├── core/
│   ├── model/
│   │   ├── types.ts             # Contratos de datos centrales
│   │   └── constants.ts         # Colores CPK, radios atómicos, tabla de valencias
│   ├── chemistry/
│   │   ├── rdkitClient.ts       # Singleton de carga asíncrona para @rdkit/rdkit
│   │   ├── graphToMol.ts        # Traductor MolecularGraph -> bloque CTAB MOL V2000
│   │   ├── localValidator.ts    # Capa 1: Validación de valencias y conectividad (BFS)
│   │   └── rdkitValidator.ts    # Capa 2: Validación SMILES, fórmula y SMARTS
│   └── missions/
│       └── missionEvaluator.ts  # Orquestador que une Capa 1 + Capa 2 contra MissionConfig
├── data/
│   └── missions/
│       └── progressionMissions.ts # Catálogo de niveles (Mundos 1 al 4)
├── store/
│   ├── useCanvasStore.ts        # Estado del grafo, herramientas e historial Undo/Redo
│   └── useGameStore.ts          # Misión activa, estado del modal de feedback y progreso
└── ui/
    ├── canvas/
    │   ├── MolecularCanvas.tsx  # Stage y Layers de react-konva
    │   ├── AtomShape.tsx        # Renderizado de nodo circular, etiqueta y halo de error
    │   └── BondShape.tsx        # Renderizado vectorial de enlaces simples, dobles y triples
    ├── hud/
    │   ├── TopBar.tsx           # Información de misión y botón de Verificar
    │   ├── ElementToolbar.tsx   # Panel izquierdo de elementos y órdenes de enlace
    │   └── CanvasControls.tsx   # Controles flotantes (Selección, Borrador, Undo/Redo, Zoom)
    └── modals/
        └── FeedbackModal.tsx    # Diagnóstico educativo y transición de nivel
```

## 2. Contratos de Datos Estrictos (`src/core/model/types.ts`)

```typescript
export type ElementSymbol = 'C' | 'H' | 'O' | 'N' | 'P' | 'S';
export type BondOrder = 1 | 2 | 3;
export type ToolType = 'select' | 'atom' | 'bond' | 'eraser';

export interface AtomNode {
  id: string;
  element: ElementSymbol;
  formalCharge: number; // Default: 0
  x: number;            // Coordenada X en espacio de lienzo
  y: number;            // Coordenada Y en espacio de lienzo
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
  code: 'VALENCE_EXCEEDED' | 'DISCONNECTED_GRAPH' | 'INVALID_CHEMISTRY' | 'FORMULA_MISMATCH' | 'MISSING_FUNCTIONAL_GROUP' | 'STRUCTURE_MISMATCH';
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
}

export interface SubstructureRequirement {
  name: string;   // Ej: "Grupo Hidroxilo (-OH)"
  smarts: string; // Ej: "[OX2H]"
  minCount: number;
}

export interface MissionConfig {
  id: string;
  world: 1 | 2 | 3 | 4;
  title: string;
  objectiveDescription: string;
  pedagogicalHint: string;
  allowedElements: ElementSymbol[];
  initialGraph?: MolecularGraph;
  winConditions: {
    targetFormula?: string;
    targetCanonicalSmiles?: string;
    requiredSubstructures?: SubstructureRequirement[];
    expectedRingCount?: number;
    mustBeConnected: boolean;
  };
}
```

## Actualización de Archivos en `src/core/model/` y `src/ui/modals/`
Añadir a la estructura:
- `src/core/model/periodicTable.ts`: Base de datos de los 118 elementos (número atómico, símbolo, nombre en español, categoría, color CPK, valencias permitidas e isótopos comunes).
- `src/core/model/templates.ts`: Generadores paramétricos de anillos ($n=3..8$, saturados, conjugados y heterociclos) y catálogo de prefabs de grupos funcionales, coenzimas y biomoléculas base.
- `src/ui/modals/PeriodicTableModal.tsx`: Modal interactivo de los 118 elementos + selector de isótopos.
- `src/ui/modals/FunctionalGroupsModal.tsx`: Modal con pestañas para Grupos Funcionales, Coenzimas y Esqueletos Base.

## Contratos Actualizados (`src/core/model/types.ts`)

```typescript
// Símbolo químico abierto a los 118 elementos de la tabla periódica
export type ElementSymbol = string; 
export type BondOrder = 1 | 2 | 3;

export type RingTemplateConfig = {
  sides: 3 | 4 | 5 | 6 | 7 | 8;
  unsaturation: 'saturated' | 'one_double' | 'conjugated'; // Simple, 1 doble enlace, o alternado (ej. Benceno/COT)
  heteroAtom?: ElementSymbol; // Ej: 'O' para Piranosa/Furanosa, 'N' para Piridina/Pirrol
};

export type ToolType = 
  | 'select' 
  | 'atom' 
  | 'bond' 
  | 'charge_plus'   // Incrementar carga formal (+1)
  | 'charge_minus'  // Decrementar carga formal (-1)
  | 'eraser' 
  | 'ring'          // Usa activeRingConfig (3 a 8 lados, saturado/conjugado/heterociclo)
  | 'prefab'        // Usa activePrefabId del catálogo de Grupos Funcionales / Coenzimas
  | 'arrow'
  | 'text';

export interface AtomNode {
  id: string;
  element: ElementSymbol;
  formalCharge: number; // Ej: -2, -1, 0, +1, +2
  isotope?: number;     // Ej: 13 para 13C, 14 para 14C, 32 para 32P
  aliasLabel?: string;  // Para súper-nodos contraídos como "CoA" o "Lipoamida"
  x: number;
  y: number;
  isLocked?: boolean;
  hasError?: boolean;
}
```

## 3. Orquestador de Evaluación de Misiones (`src/core/missions/missionEvaluator.ts`)

La interfaz `MissionConfig.winConditions` soporta validación flexible bioquímica:
```typescript
export interface MissionWinConditions {
  targetFormula?: string;
  acceptedSmiles?: string[]; // Lista de SMILES canónicos válidos (ej. forma neutra y desprotonada)
  requiredSubstructures?: SubstructureRequirement[]; // Patrones SMARTS obligatorios
  forbiddenSubstructures?: SubstructureRequirement[]; // Ej: en PDH, no debe quedar el grupo carboxilo original
  expectedRingCount?: number;
  mustBeConnected: boolean;
}
```

### Flujo de Diagnóstico Diferencial Educativo:
1. Ejecuta `localValidator(graph)` (Capa 1). Si falla, corta y retorna los átomos con `hasError: true`.
2. Ejecuta `rdkitValidator(graph)` (Capa 2).
3. Evalúa `winConditions` en orden progresivo para dar pistas exactas si el jugador falla:
   - **Check 1 (Subestructuras prohibidas):** ¿Olvidó quitar un grupo saliente (como el $\text{CO}_2$ en PDH o el fosfato en Piruvato Quinasa)?
   - **Check 2 (Subestructuras requeridas SMARTS):** ¿Falta algún grupo funcional clave (ej. el enlace fosfoéster `[#6]-[OX2]-[PX4](=O)` o el tioéster `[#6](=O)-[SX2]`)?
   - **Check 3 (Fórmula / Conteo de Anillos):** ¿Coincide el esqueleto general?
   - **Check 4 (SMILES Exacto):** Si tiene la fórmula y los grupos funcionales correctos pero el SMILES no está en `acceptedSmiles`, el diagnóstico informa: *"¡Casi lo logras! Tienes los grupos funcionales correctos, pero están conectados en la posición equivocada (regioisómero incorrecto). Revisa el número del carbono donde actúa la enzima."*