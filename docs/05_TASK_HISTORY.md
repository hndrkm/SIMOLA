# 05 - Historial de Tareas y Bitácora de Desarrollo

> **INSTRUCCIÓN PARA EL AGENTE (ANTIGRAVITY):**
> Este documento es la fuente de verdad sobre el progreso del proyecto. Cada vez que completes una tarea o una etapa:
> 1. Actualiza el estado en el Tablero de Resumen y en las casillas de verificación (`[ ]` Pendiente, `[~]` En curso, `[x]` Completado).
> 2. Añade una entrada al final en la **Bitácora de Ejecución (Changelog)** detallando los archivos creados/modificados y el resultado de la auditoría (`06_ARCHITECTURE_AUDIT.md`).

## 1. Tablero de Resumen por Etapas

| Etapa | Nombre del Módulo | Estado | Compilación (`tsc`) | Auditoría (`06`) |
| :--- | :--- | :--- | :--- | :--- |
| **Etapa 1** | Modelo Interno y Store en Zustand | `[x] Completado` | `Exitoso (0 errores)` | `Aprobado (A1, A2)` |
| **Etapa 2** | Editor Molecular 2D (React-Konva) | `[x] Completado` | `Exitoso (0 errores)` | `Aprobado (A1, A2, A3)` |
| **Etapa 3** | Validador Local y Diagnóstico Capa 1 | `[x] Completado` | `Exitoso (0 errores)` | `Aprobado (A1, A2, A3)` |
| **Etapa 4** | Adaptador RDKit.js y Descriptores | `[x] Completado` | `Exitoso (0 errores)` | `Aprobado (A1, A2, A3, A4)` |
| **Etapa 5** | Sistema de Misiones Progresivas | `[x] Completado` | `Exitoso (0 errores)` | `Aprobado (A1, A2, A3, A4)` |
| **Etapa 6** | Rigor Bioquímico, Reactor Catalítico, Haworth y Rutas Metabólicas | `[x] Completado` | `Exitoso (0 errores)` | `Aprobado (A1, A2, A3, A4)` |

---

## 2. Desglose Granular de Tareas (Checklist)

### Etapa 1: Modelo Interno y Store en Zustand (Módulo 2)
- [x] **T1.1:** Crear `src/core/model/types.ts` con todas las interfaces de grafo, validación y misiones.
- [x] **T1.2:** Crear `src/core/model/constants.ts` (colores CPK, radios de átomos y tabla de valencias máximas).
- [x] **T1.3:** Implementar `src/store/useCanvasStore.ts` con operaciones CRUD sobre `nodes` y `edges` en tiempo $O(1)$.
- [x] **T1.4:** Implementar borrado en cascada (eliminar un átomo limpia sus enlaces conectados) y prevención de enlaces duplicados o bucles ($A \to A$).
- [x] **T1.5:** Implementar pila de historial `undo` / `redo` para mutaciones del grafo.

### Etapa 2: Editor Molecular 2D Unificado en React-Konva (SIMOLA)
- [x] **T2.1:** Implementar `BondShape.tsx` (vectores normales para enlaces 1, 2, 3 y `hitStrokeWidth={22}`).
- [x] **T2.2:** Implementar `AtomShape.tsx` (colores CPK, etiqueta, candado `isLocked`, halo `hasError` y resalte de `hover` / imán magnético).
- [x] **T2.3:** Crear `src/core/model/geometry.ts` (longitud estándar `60px`, cálculo de brote automático a 120° en zigzag, *angle snapping* cada 30°, generadores de anillos de 5/6 lados y prefab de grupo fosfato).
- [x] **T2.4:** Unificar la Máquina de Estados en `MolecularCanvas.tsx` y `useCanvasStore.ts`:
  - `select`: arrastrar átomos (`isLocked !== true`) a 60 FPS, mover anotaciones y paneo/zoom del lienzo.
  - `atom`: colocar en vacío, transmutar al hacer clic en átomo existente o iniciar arrastre.
  - `bond`: clic en vacío crea `C-C`, clic en átomo hace *Auto-Sprout* a 120°, arrastrar usa imán de 30° con *snap* magnético (`28px`) hacia átomos existentes, clic en enlace cicla `1 -> 2 -> 3 -> 1`.
  - `ring_5`, `ring_6`, `ring_benzene`: estampar en vacío, brotar desde átomo o fusionar sobre enlace existente.
  - `arrow`, `text`, `prefab_phosphate`: insertar flechas de reacción vectoriales, etiquetas de texto y grupo fosfato funcional.
  - `eraser`: borrado de enlaces, anotaciones y borrado en cascada de átomos.
- [x] **T2.5:** Implementar previsualización fantasma (*Ghost Preview*) y atajos de teclado en vivo al hacer `hover` (`C, H, O, N, P, S, 1, 2, 3, Delete, Ctrl+Z, Ctrl+Y`).
- [x] **T2.6:** Actualizar `TopBar.tsx`, `ElementToolbar.tsx` y `CanvasControls.tsx` con la identidad **SIMOLA** y todos los controles unificados.
- [x] **T2.7 (Tabla Periódica e Isótopos):** Crear `src/core/model/periodicTable.ts` (118 elementos con valencias, colores CPK e isótopos), `PeriodicTableModal.tsx` y la lista dinámica de `recentElements` (top 5 usados/recientes) en `useCanvasStore.ts`.
- [x] **T2.8 (Anillos Paramétricos 3 a 8):** Actualizar `geometry.ts` y `ElementToolbar.tsx` para soportar anillos de 3 a 8 lados ($R = L / (2 \sin(\pi/N))$), versiones con enlaces dobles (cicloalquenos y conjugados/aromáticos) y heterociclos (Piranosa y Furanosa).
- [x] **T2.9 (Modal de Grupos Funcionales, Coenzimas y Biomoléculas):** Crear `src/core/model/templates.ts` y `FunctionalGroupsModal.tsx` con soporte para acoplar Grupos Funcionales (`-PO3H2`, `-OH`, `-COOH`, `-NH2`, `-SH`, `-COCH3`), Coenzimas (`-S-CoA`, Lipoamida) y Esqueletos Base completos (Glucopiranosa, Fructofuranosa, Piruvato, G3P), además de renderizado de cargas formales e isótopos en `AtomShape.tsx`.
- [x] **T2.11 (Release Demo & CI/CD en GitHub Pages):** Configurar `base: '/SIMOLA/'` en `vite.config.ts`, ajustar rutas de assets públicos con `import.meta.env.BASE_URL`, crear workflow de despliegue automático en `.github/workflows/deploy.yml`, documentar `README.md` y subir el repositorio a `https://github.com/hndrkm/SIMOLA.git`.
### Etapa 3: Validador Local y Retroalimentación de Capa 1 (Módulo 4 - Parte A)
- [x] **T3.1:** Implementar `src/core/chemistry/localValidator.ts` (conteo de órdenes de enlace por átomo vs. valencia máxima permitida).
- [x] **T3.2:** Implementar algoritmo BFS en `localValidator.ts` para detectar islas desconectadas cuando `mustBeConnected === true`.
- [x] **T3.3:** Conectar el resultado de Capa 1 con `useCanvasStore` para encender `hasError: true` en los átomos infractores y mostrar el mensaje pedagógico.

### Etapa 4: Adaptador RDKit.js y Descriptores Químicos (Módulo 3 y Módulo 4 - Parte B)
- [x] **T4.1:** Implementar `src/core/chemistry/rdkitClient.ts` (carga asíncrona singleton del binario WebAssembly `.wasm`).
- [x] **T4.2:** Implementar `src/core/chemistry/graphToMol.ts` (traducción exacta del grafo a formato de columnas fijas CTAB MOL V2000 con inversión de eje Y).
- [x] **T4.3:** Implementar `src/core/chemistry/rdkitValidator.ts` (extracción de `canonicalSmiles`, fórmula molecular, conteo de anillos y evaluación de subestructuras SMARTS con liberación de memoria `mol.delete()`).

### Etapa 5: Sistema de Misiones Progresivas (Módulo 5)
- [x] **T5.1:** Implementar `src/core/missions/missionEvaluator.ts` unificando Capa 1 y Capa 2 con Diagnóstico Diferencial Educativo, soporte de `acceptedSmiles` y subestructuras requeridas/prohibidas vía SMARTS.
- [x] **T5.2:** Crear `src/data/missions/progressionMissions.ts` con el catálogo de 7 misiones estructuradas en los 3 mundos:
  - Mundo 1 (Entrenamiento Químico): `m1_ethene` (doble enlace), `m1_isomers` (éter a alcohol), `m1_phosphate` (éster de fosfato).
  - Mundo 2 (Ruta de la Glucólisis): `m2_hexokinase` (Paso 1 - HK / G6P), `m2_gapdh` (Paso 6 - GAPDH / 1,3-BPG), `m2_pyruvate_kinase` (Paso 10 - PK / Piruvato).
  - Mundo 3 (Complejo PDH): `m3_pdh_acetyl_coa` (Descarboxilación oxidativa y enlace tioéster C(=O)-S de Acetil-CoA).
- [x] **T5.3:** Implementar `src/store/useGameStore.ts`, `src/ui/views/HomeView.tsx`, `src/ui/hud/TopBar.tsx` y `src/ui/modals/FeedbackModal.tsx` con carga sincronizada de `initialGraph`, persistencia en `localStorage`, HUD de misión con pista y reinicio de esqueleto, animación de victoria y transición "Siguiente Misión".

---

## 3. Bitácora de Ejecución (Changelog)

#### [2026-10-18 / Etapa 1] - Modelo Interno y Store en Zustand
- **Tareas completadas:** T1.1, T1.2, T1.3, T1.4, T1.5.
- **Archivos creados/modificados:**
  - `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/index.css`.
  - `src/core/model/types.ts`
  - `src/core/model/constants.ts`
  - `src/store/useCanvasStore.ts`
  - `docs/05_TASK_HISTORY.md`
  - `docs/06_ARCHITECTURE_AUDIT.md`
- **Decisiones técnicas tomadas:**
  - `src/core/` desacoplado de React y Konva al 100% (cero dependencias de UI).
  - Almacenamiento del grafo en diccionarios `Record<string, AtomNode>` y `Record<string, BondEdge>` para mutaciones y búsquedas $O(1)$.
  - Inmutabilidad estricta ante nodos o enlaces con `isLocked: true`.
  - Prevención de aristas huérfanas con borrado en cascada automático y prevención de enlaces duplicados y bucles $A \to A$.
  - Historial `undo/redo` con límite de 50 pasos profundos.
- **Resultado de Auditoría (Doc 06):** APROBADO (A1.1, A1.2, A2.1, A2.2, A2.3 validados y `tsc --noEmit` con 0 errores).

#### [2026-10-18 / Etapa 2] - Editor Molecular 2D en React-Konva y HUD
- **Tareas completadas:** T2.1, T2.2, T2.3, T2.4.
- **Archivos creados/modificados:**
  - `src/ui/canvas/BondShape.tsx`
  - `src/ui/canvas/AtomShape.tsx`
  - `src/ui/canvas/MolecularCanvas.tsx`
  - `src/ui/hud/ElementToolbar.tsx`
  - `src/ui/hud/CanvasControls.tsx`
  - `src/ui/hud/TopBar.tsx`
  - `src/App.tsx`
  - `src/main.tsx`
  - `docs/05_TASK_HISTORY.md`
  - `docs/06_ARCHITECTURE_AUDIT.md`
- **Decisiones técnicas tomadas:**
  - Jerarquía de dos capas en Konva: capa base pasiva con cuadrícula de puntos (`listening={false}`) y capa molecular interactiva con orden de renderizado (enlaces por debajo, línea guía intermedia, átomos por encima).
  - Geometría de enlaces múltiples en `BondShape`: vector perpendicular unitario $\vec{n} = (-dy/L, dx/L)$ con desplazamiento paralelo simétrico (4px para dobles, 6px para triples) y línea de captura transparente con `hitStrokeWidth=22` ergonómico.
  - Átomos con círculos coloreados según la convención CPK, etiqueta centrada, indicador de bloqueo, halo de error reactivo y drag nativo a 60 FPS en modo selección.
  - Creación interactiva de enlaces mediante drag con línea guía discontinua y cancelación limpia en `onMouseUp` fuera de objetivo (sin fugas ni excepciones).
  - Controles HUD completos con panel lateral de elementos y tipos de enlace, barra inferior con herramientas, zoom, centrado, deshacer/rehacer y modal de atajos de teclado.
- **Resultado de Auditoría (Doc 06):** APROBADO (A1.1, A1.2, A2.1, A2.2, A2.3, A3.1, A3.2, A3.3 validados, `tsc --noEmit` con 0 errores, y validación visual interactiva en navegador exitosa).

#### [2026-10-18 / Etapa 2 - T2.7 a T2.10] - Expansión Química, Identidad Visual SIMOLA y HomeView
- **Tareas completadas:** T2.7, T2.8, T2.9, T2.10.
- **Archivos creados/modificados:**
  - `src/core/model/periodicTable.ts`
  - `src/core/model/templates.ts`
  - `src/core/model/geometry.ts`
  - `src/store/useCanvasStore.ts`
  - `src/store/useGameStore.ts`
  - `src/ui/modals/PeriodicTableModal.tsx`
  - `src/ui/modals/FunctionalGroupsModal.tsx`
  - `src/ui/views/HomeView.tsx`
  - `src/ui/hud/TopBar.tsx`
  - `src/ui/hud/ElementToolbar.tsx`
  - `src/ui/hud/CanvasControls.tsx`
  - `src/ui/canvas/AtomShape.tsx`
  - `src/App.tsx`
  - `index.html`
  - `tailwind.config.js`
  - `src/index.css`
  - `docs/05_TASK_HISTORY.md`
  - `docs/06_ARCHITECTURE_AUDIT.md`
- **Decisiones técnicas tomadas:**
  - **Identidad y Paleta Oficial SIMOLA:** Tokens integrados en Tailwind y CSS con Deep Navy Blue (`#1B2A4A`), Vibrant Catalytic Teal (`#00A896`) y Energetic Phosphate Amber (`#F77F00`). Favicon y branding con `/logo.png`.
  - **Pantalla de Inicio (`HomeView.tsx`):** Hero section interactivo con acceso a *Laboratorio Libre (Sandbox)* y *Continuar Ruta*, más tarjetas interactivas de selección de rutas (*Entrenamiento Químico*, *Ruta de la Glucólisis* con badges ATP/NAD+, y *Complejo PDH* con badges CoA-SH/Lipoamida/NAD+).
  - **Separación Limpia de Stores (Regla A1.2):** `useCanvasStore.ts` gestiona exclusivamente el grafo molecular y herramientas de dibujo, mientras que `src/store/useGameStore.ts` orquesta el enrutamiento de vistas (`'home' | 'workspace'`) y la ruta activa.
  - **Regla A3.4 de Ergonomía y Geometría:** Longitud canónica de enlace fijada en `60px`, imán magnético de 30° (`\pi/6`) y brote en zigzag a 120° (`2\pi/3`) en `src/core/model/geometry.ts`.
  - **Química Completa:** Tabla periódica con los 118 elementos y selector de isótopos clave, anillos paramétricos de 3 a 8 lados con dobles enlaces y heterociclos, y modal de grupos funcionales/coenzimas/biomoléculas con estamping directo.
- **Resultado de Auditoría (Doc 06):** APROBADO (A1.1, A1.2, A2.1, A2.2, A2.3, A3.1, A3.2, A3.3, A3.4 validados, `tsc --noEmit` con 0 errores y sesión de verificación en navegador superada al 100%).

#### [2026-10-18 / Etapa 2 - T2.11] - Demo Release & Despliegue en GitHub Pages (CI/CD)
- **Tareas completadas:** T2.11.
- **Archivos creados/modificados:**
  - `vite.config.ts` (`base: '/SIMOLA/'`)
  - `index.html` (ruta relativa `./logo.png`)
  - `src/ui/views/HomeView.tsx` (`import.meta.env.BASE_URL`)
  - `src/ui/hud/TopBar.tsx` (`import.meta.env.BASE_URL`)
  - `src/vite-env.d.ts` (referencia de tipos para Vite client y variables de entorno)
  - `.github/workflows/deploy.yml` (pipeline automático de GitHub Pages con `actions/deploy-pages@v4`)
  - `README.md` (documentación pública completa con enlace a la Live Demo, características y guía de desarrollo)
  - `.gitignore` (exclusión limpia de dependencias, logs y binarios compilados)
  - `docs/05_TASK_HISTORY.md`
- **Decisiones técnicas tomadas:**
  - Configuración de `base: '/SIMOLA/'` para resolver de forma transparente assets estáticos en el subdirectorio de GitHub Pages sin romper la ejecución local.
  - Generación de `src/vite-env.d.ts` para tipar con rigor TypeScript `import.meta.env.BASE_URL` sin necesidad de casts manuales ni desactivación de reglas de linter.
  - Workflow de CI/CD seguro con permisos mínimos (`contents: read`, `pages: write`, `id-token: write`) y concurrencia `pages` con cancelación de ejecuciones obsoletas.
- **Resultado de Auditoría (Doc 06):** APROBADO (`npm run build` genera `dist/` en 8.6s con 0 errores de tipado o compilación).

#### [2026-10-20 / Etapas 3 y 4] - Validador Local (Capa 1) y Adaptador RDKit.js WASM (Capa 2)
- **Tareas completadas:** T3.1, T3.2, T3.3, T4.1, T4.2, T4.3.
- **Archivos creados/modificados:**
  - `src/core/chemistry/localValidator.ts` (Validador local de valencias con ajuste de carga formal y conectividad BFS).
  - `src/core/chemistry/graphToMol.ts` (Generador estricto de CTAB MOL V2000 con coordenadas escaladas, `M  CHG`, `M  ISO` y `M  END`).
  - `src/core/chemistry/rdkitClient.ts` (Cargador singleton asíncrono de `@rdkit/rdkit` con soporte para Vite dev, Vite prod y Node).
  - `src/core/chemistry/functionalGroups.ts` (Diccionario de patrones SMARTS para alcoholes, aldehídos, cetonas, ácidos carboxílicos, ésteres, éteres, aminas, amidas, tioles, fosfatos, anillos aromáticos, alquenos y alquinos).
  - `src/core/chemistry/rdkitValidator.ts` (Extracción de SMILES canónico, fórmula Hill con hidrógenos implícitos, conteo de anillos y subestructuras con protección de memoria `mol.delete()`).
  - `src/core/chemistry/index.ts` (Barrel export del módulo químico).
  - `src/core/model/types.ts` (Soporte para `detectedFunctionalGroups` en `ValidationResult`).
  - `src/ui/modals/FeedbackModal.tsx` (Modal de diagnóstico con subíndices químicos, badges de grupos funcionales, copiado de SMILES/fórmula y alertas pedagógicas).
  - `src/ui/hud/TopBar.tsx` (Conexión de botón "Verificar Reacción" con cortocircuito de Capa 1 y apertura de `FeedbackModal`).
  - `public/RDKit_minimal.wasm` (Binario WebAssembly servido para frontend local y producción).
  - `test_chemistry_suite.ts` (Suite de 27 pruebas unitarias de consola cubriendo C pentavalente, BFS, Etanol vs Dimetil Éter, Benceno y Grupo Fosfato).
  - `package.json` (Script de test `"test": "tsx test_chemistry_suite.ts"`).
  - `docs/05_TASK_HISTORY.md` y `docs/06_ARCHITECTURE_AUDIT.md`.
- **Decisiones técnicas tomadas:**
  - **Regla A4.1 (Cero Fugas de Memoria en WASM):** Uso estricto de bloques `try / finally` para destruir tanto instancias de `mol` como de `qmol` (`mol.delete()`, `qmol.delete()`).
  - **Regla A4.2 (Formato Fijo CTAB):** Generación de bloques de conteos de 39 caracteres y bloques de átomos con coordenadas $F10.4$ y símbolos justificados, asegurando compatibilidad con el parser C++ de RDKit.
  - **Regla A4.3 (Cortocircuito Pedagógico):** Si Capa 1 falla, los átomos infractores se marcan con `hasError: true` en `useCanvasStore` (brillando en rojo en el lienzo) y la evaluación se detiene sin sobrecargar RDKit.
- **Resultado de Auditoría (Doc 06):** APROBADO (A1, A2, A3, A4 superados al 100%, `tsc --noEmit` con 0 errores, 27/27 pruebas unitarias pasadas, `npm run build` exitoso sin uso de navegador automatizado).

#### [2026-10-20 / Etapa 5] - Sistema de Misiones Progresivas, Evaluador Educativo y Progresión de Juego
- **Tareas completadas:** T5.1, T5.2, T5.3.
- **Archivos creados/modificados:**
  - `src/core/model/types.ts`: Ampliación de `WinConditions` (`acceptedSmiles`, `forbiddenSubstructures`), `ValidationIssue` (`FORBIDDEN_SUBSTRUCTURE`), `ValidationResult` (`differentialDiagnosis`) y `MissionConfig` (`enzymeName`, `biochemicalContext`).
  - `src/core/missions/missionEvaluator.ts`: Orquestador de validación de misiones integrando Capa 1 y Capa 2 con Diagnóstico Diferencial de Isomería/Regioquímica y subestructuras requeridas/prohibidas.
  - `src/core/missions/index.ts`: Export barrel de misiones.
  - `src/data/missions/progressionMissions.ts`: Catálogo de 7 misiones en 3 Mundos (Entrenamiento, Glucólisis y Complejo PDH) con funciones de búsqueda y progresión secuencial.
  - `src/data/missions/index.ts`: Export barrel de datos de misiones.
  - `src/store/useGameStore.ts`: Gestión de rutas, `currentMissionId`, `completedMissionIds` con persistencia en `localStorage`, recarga atómica de `initialGraph` en `useCanvasStore`, control de pistas y transiciones.
  - `src/ui/views/HomeView.tsx`: Tablero de los 3 mundos interactivo con estado de completitud (`✓`), medidor de progreso general (X/7) y lanzamiento directo de misiones o modo sandbox libre.
  - `src/ui/hud/TopBar.tsx`: HUD contextual de misión con nombre de enzima, objetivo, botón de "Pista Enzimática" (`#F77F00`), botón de "Reiniciar Esqueleto", verificación reactiva y banner de ayuda.
  - `src/ui/modals/FeedbackModal.tsx`: Modal con celebración visual animada, rol biológico de la enzima en la célula, descriptores RDKit, diagnóstico diferencial pedagógico y botón "Siguiente Misión →".
  - `src/App.tsx`: Refinamiento en la carga condicional de moléculas de demostración para evitar sobrescritura de esquletos de misiones.
  - `test_chemistry_suite.ts`: 19 nuevas pruebas unitarias (46 en total) verificando las 7 misiones, diagnóstico diferencial de isómeros, fosforilación y descarboxilación de Acetil-CoA.
  - `docs/05_TASK_HISTORY.md` y `docs/06_ARCHITECTURE_AUDIT.md`.
- **Decisiones técnicas tomadas:**
  - **Diagnóstico Diferencial Pedagógico:** Si el jugador construye una molécula con la misma fórmula Hill que el objetivo pero con diferente conectividad o función química (ej. Dimetil éter en lugar de Etanol), el evaluador genera un mensaje específico de isomería constitucional sin confundir al estudiante con errores de valencia inexistentes.
  - **Validación Bioquímica Flexible:** Soporte explícito de `acceptedSmiles` que permite verificar tanto formas neutras como ionizadas fisiológicas (ej. Piruvato neutro `CC(=O)C(=O)O` vs Piruvato aniónico `CC(=O)C(=O)[O-]`).
  - **Esqueletos Protectores:** Bloqueo inmutable (`isLocked: true`) de los anillos y enlaces que no deben ser destruidos por el jugador (ej. Anillo piranósico en Hexoquinasa o fragmento de Coenzima A en PDH), canalizando la atención didáctica exclusivamente hacia el enlace de la reacción enzimática.
- **Resultado de Auditoría (Doc 06):** APROBADO (A1, A2, A3, A4 superados al 100%, `tsc --noEmit` con 0 errores, 46/46 pruebas unitarias pasadas, `npm run build` exitoso con 0 advertencias críticas).

### Hotfix UI v0.5.1 (Pre-entrega de Avance)
- [x] **H1.1 (Scroll y Jerarquía en HomeView):** Habilitar scroll vertical (`overflow-y-auto` en `HomeView` y remoción de `overflow-hidden` en `body`), reordenando el layout para mostrar primero el Selector de Mundos/Misiones en la parte superior y la descripción del programa en la parte inferior.
- [x] **H1.2 (Contraste del Logo Oficial):** Añadir un contenedor de fondo claro (`bg-slate-100/95` con padding, `rounded-xl` y `shadow-md`) detrás de `logo.png` en `HomeView` y `TopBar` para garantizar legibilidad de las letras oscuras del logo, además de ajustar las tarjetas a `bg-slate-800/90`.
- [x] **H1.3 (Deploy Avance GH Pages):** Compilar (`npm run build`), hacer commit y subir a `main` para actualizar la demo en vivo.

### Etapa 6: Rigor Bioquímico, Reactor Catalítico, Haworth y Rutas Metabólicas
- [x] **T6.1 (Nomenclatura Bioquímica Formal):** Reemplazo integral de términos informales ("Mundos" → "Módulos Bioquímicos", "Modo Sandbox" → "Laboratorio de Síntesis y Modelado Estructural", "Horno / Mesa de Crafteo" → "⚡ Centro Activo / Reactor Catalítico", "Bandeja de Productos" → "Reservorio de Metabolitos y Balance Estequiométrico", "Pista" → "Fundamento Mecanístico (IUPAC / EC)", "Verificar" → "Evaluar Estructura y Estereoquímica").
- [x] **T6.2 (Logo Horizontal y Panel Lateral Derecho de Misión):**
  - Renderizado del logo horizontal (`h-10 w-auto` en `TopBar.tsx`, `h-20 w-auto` en `HomeView.tsx`) en placa clara (`bg-slate-100 px-4 py-1.5 rounded-xl`) eliminando textos redundantes.
  - Implementación de `MissionSidebar.tsx` lateral derecho fijo (`w-88 bg-[#1B2A4A]/95 border-l border-slate-700`) con EC, $\Delta G^{\circ\prime}$, fundamento mecanístico desplegable, reservorio de metabolitos y reinicio de etapa.
  - Limpieza obligatoria de estado (`clearCanvas()`, `currentMissionId = null`) al pasar al Laboratorio Libre y botón de reinicio de progreso académico en `HomeView.tsx`.
- [x] **T6.3 (Hidrógenos Satélite "Medio Cuerpo" y Menú Contextual de Clic Derecho):**
  - Cálculo dinámico de valencias en `AtomShape.tsx` mostrando hidrógenos implícitos como esferas satélite acopladas al borde ("medio cuerpo").
  - Menú contextual flotante `AtomContextMenu.tsx` activado por `onContextMenu` para ajustar carga formal ($-2, -1, 0, +1, +2$ con etiquetas de ionización fisiológica $-\text{COO}^-$, $-\text{PO}_3^{2-}$, $-\text{NH}_3^+$) e isótopos ($^{12}\text{C}, ^{13}\text{C}, ^{14}\text{C}, ^{2}\text{H}, ^{32}\text{P}$, etc.).
- [x] **T6.4 (Selector de Guías Angulares y Validador Espacial de Haworth):**
  - Selector en `TopBar.tsx` de restricción angular ($30^\circ, 45^\circ, 90^\circ, 120^\circ$, Libre).
  - Creación de `src/core/chemistry/spatialValidator.ts` que valida orientación espacial en proyecciones de Haworth (sector del oxígeno anular y orientación axial hacia arriba/abajo de sustituyentes según anómero $\alpha/\beta$ y serie $\text{D}/\text{L}$).
- [x] **T6.5 (Bloques Catalíticos Dinámicos e Inspector Molecular):**
  - Pestañas en `FunctionalGroupsModal.tsx` para Grupos Funcionales, Holoenzimas (con código EC), Coenzimas/Cofactores y Esqueletos Base.
  - Modal `CatalystInspectorModal.tsx` activado por doble clic o botón de inspección con estructura, fórmula y mecanismo de acción catalítico.
- [x] **T6.6 (Centro Activo / Reactor Catalítico):**
  - Implementación de `CatalyticReactorModal.tsx` acoplando sustrato del lienzo, selección de holoenzima catalizadora con código EC y cofactores entrantes ($\text{ATP}$, $\text{NAD}^+ + \text{P}_i$, $\text{TPP}$, $\text{CoA-SH}$, etc.).
  - Depósito de subproductos en el Reservorio de Metabolitos y carga del intermediario catalítico incompleto en el lienzo para su resolución por el usuario.
- [x] **T6.7 (Módulos de Misiones de Alto Rigor Bioquímico):**
  - **Módulo I (Estereoquímica y Haworth - 4 etapas):** Eteno ($sp^2$), ionización a pH 7.4 y marcaje $^{14}\text{C}$, ciclación hemiacetálica (piranosa y furanosa), $\alpha$-D-glucopiranosa con validación espacial.
  - **Módulo II (Vía Glucolítica - 10 etapas completas):** Hexoquinasa, PGI, PFK-1, Aldolasa, TIM, GAPDH, PGK, PGM, Enolasa y Piruvato Quinasa con balance de ATP y NADH.
  - **Módulo III (Complejo Multienzimático PDH - 5 etapas acopladas):** Secuencia completa de E1, E2 y E3 con acumulación secuencial de los tres productos clave del complejo: $\text{HCO}_3^-$ (Etapa 1), $\text{Acetil-CoA}$ (Etapa 3) y $\text{NADH} + \text{H}^+$ (Etapa 5).

#### [2026-10-21 / Etapa 6] - Refactor Visual, Rigor Bioquímico, Reactor Catalítico y Validación Espacial de Haworth
- **Tareas completadas:** T6.1, T6.2, T6.3, T6.4, T6.5, T6.6, T6.7.
- **Archivos creados/modificados:**
  - `src/core/model/types.ts`: Tipos `HaworthSubstituentRule`, `HaworthRingCheck`, `SpatialRules`, `CatalyticReactionConfig`, `MetaboliteItem`, ampliación de `MissionConfig` y `WinConditions`.
  - `src/core/chemistry/spatialValidator.ts`: Validador de estereoespecificidad geométrica para proyecciones de Haworth.
  - `src/core/missions/missionEvaluator.ts`: Integración de Diagnóstico 4 (Validación Espacial de Haworth).
  - `src/core/model/templates.ts`: Definición de holoenzimas y cofactores con EC y mecanismos.
  - `src/store/useCanvasStore.ts`: Restricciones angulares (`snapAngleDeg`), `contextMenuAtom`, `clearCanvas()`.
  - `src/store/useGameStore.ts`: `metaboliteReservoir`, `addMetabolitesToReservoir`, `clearProgress()`, `startSandbox()` purificado.
  - `src/ui/hud/MissionSidebar.tsx`: Panel lateral derecho fijo para misiones con balances y fundamentos.
  - `src/ui/hud/TopBar.tsx`: Logo horizontal, selector angular, accesos al reactor catalítico y evaluación.
  - `src/ui/views/HomeView.tsx`: Logo horizontal, los 3 módulos bioquímicos formales, reinicio total de sandbox y reset de progreso académico.
  - `src/ui/canvas/AtomShape.tsx`: Hidrógenos satélites de "medio cuerpo" reactivos y menú contextual de clic derecho.
  - `src/ui/canvas/AtomContextMenu.tsx`: Popover flotante para cargas formales e isótopos.
  - `src/ui/canvas/MolecularCanvas.tsx`: Montaje de `AtomContextMenu`.
  - `src/ui/modals/CatalyticReactorModal.tsx`: Modal del Centro Activo / Reactor Catalítico.
  - `src/ui/modals/CatalystInspectorModal.tsx`: Modal inspector de enzimas y coenzimas.
  - `src/ui/modals/FunctionalGroupsModal.tsx`: Pestañas enriquecidas con enzimas y cofactores.
  - `src/data/missions/progressionMissions.ts`: Catálogo completo con las 19 misiones (4 en Módulo I, 10 en Módulo II y 5 en Módulo III).
  - `src/App.tsx`: Integración del panel lateral derecho y limpieza de imports.
  - `docs/05_TASK_HISTORY.md` y `docs/06_ARCHITECTURE_AUDIT.md`.
- **Resultado de Verificación:** APROBADO (`tsc --noEmit` con 0 errores, `npm run build` exitoso generando bundle de producción en 14.8s).