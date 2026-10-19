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
| **Etapa 3** | Validador Local y Diagnóstico Capa 1 | `[ ] Pendiente` | `-` | `-` |
| **Etapa 4** | Adaptador RDKit.js y Descriptores | `[ ] Pendiente` | `-` | `-` |
| **Etapa 5** | Sistema de Misiones Progresivas | `[ ] Pendiente` | `-` | `-` |

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
- [ ] **T3.1:** Implementar `src/core/chemistry/localValidator.ts` (conteo de órdenes de enlace por átomo vs. valencia máxima permitida).
- [ ] **T3.2:** Implementar algoritmo BFS en `localValidator.ts` para detectar islas desconectadas cuando `mustBeConnected === true`.
- [ ] **T3.3:** Conectar el resultado de Capa 1 con `useCanvasStore` para encender `hasError: true` en los átomos infractores y mostrar el mensaje pedagógico.

### Etapa 4: Adaptador RDKit.js y Descriptores Químicos (Módulo 3 y Módulo 4 - Parte B)
- [ ] **T4.1:** Implementar `src/core/chemistry/rdkitClient.ts` (carga asíncrona singleton del binario WebAssembly `.wasm`).
- [ ] **T4.2:** Implementar `src/core/chemistry/graphToMol.ts` (traducción exacta del grafo a formato de columnas fijas CTAB MOL V2000 con inversión de eje Y).
- [ ] **T4.3:** Implementar `src/core/chemistry/rdkitValidator.ts` (extracción de `canonicalSmiles`, fórmula molecular, conteo de anillos y evaluación de subestructuras SMARTS con liberación de memoria `mol.delete()`).

### Etapa 5: Sistema de Misiones Progresivas (Módulo 5)
- [ ] **T5.1:** Implementar `src/core/missions/missionEvaluator.ts` unificando Capa 1 y Capa 2.
- [ ] **T5.2:** Crear `src/data/missions/progressionMissions.ts` con las 5 misiones progresivas (Valencias, Enlaces Múltiples, Grupos Funcionales, Isómeros y Paso 1 de Glucólisis con esqueleto bloqueado).
- [ ] **T5.3:** Implementar `src/store/useGameStore.ts` y `src/ui/modals/FeedbackModal.tsx` para gestionar la progresión entre niveles.

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