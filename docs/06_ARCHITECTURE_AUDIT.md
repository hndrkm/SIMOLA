# 06 - Protocolo de Auditoría Arquitectónica y QA

> **INSTRUCCIÓN PARA EL AGENTE (ANTIGRAVITY):**
> Antes de marcar cualquier etapa como `[x] Completado` en `05_TASK_HISTORY.md`, debes auditar el código generado contra las 5 reglas inquebrantables de este documento. Si algún punto falla, corrígelo antes de reportar al usuario.

## 0. Regla de Oro de Evaluación y QA (Cero Navegador Automatizado)
> **RESTRICCIÓN ESTRICTA PARA EL AGENTE (ANTIGRAVITY):**
> 1. **PROHIBIDO usar el navegador interno / Browser Subagent** para probar interacciones del lienzo (`react-konva`) o la interfaz gráfica. Automatizar pruebas de UI en Canvas ralentiza el flujo innecesariamente.
> 2. **Validación Técnica Automatizada (Solo Terminal):** Verifica el código ejecutando únicamente comandos rápidos de consola: `npx tsc --noEmit` (chequeo de tipos) y `npx vitest run` (pruebas unitarias rápidas en Node.js para `src/core/`).
> 3. **Validación de Interfaz (Human-in-the-Loop):** Cuando una etapa requiera probar la interfaz en el navegador, detente y entrégale al usuario un **Checklist de Prueba Manual** conciso indicando exactamente qué dibujar/clicar y qué resultado visual esperar. Espera la confirmación del usuario antes de marcar la prueba visual como superada.

## 1. Auditoría de Desacoplamiento de Capas (Clean Architecture)
- [x] **A1.1 Pureza de Dominio:** Ningún archivo dentro de `src/core/` importa `react`, `react-dom`, `konva` ni `react-konva`. Toda la carpeta `src/core/` debe poder ejecutarse en un entorno Node.js sin DOM.
- [x] **A1.2 Separación de Stores:** `useCanvasStore` desconoce conceptos del juego (puntaje, nivel actual, modales); únicamente gestiona el `MolecularGraph`, la herramienta activa y el historial `undo/redo`.

## 2. Auditoría de Integridad Matemática del Grafo
- [x] **A2.1 Cero Aristas Huérfanas:** Al ejecutar `removeAtom(atomId)`, el store garantiza que no quede ningún `BondEdge` en `graph.edges` cuyo `sourceId` o `targetId` sea igual a `atomId`.
- [x] **A2.2 Cero Bucles y Duplicados:** Es imposible crear un enlace donde `sourceId === targetId`, ni crear dos enlaces distintos entre el mismo par de átomos `(A, B)` o `(B, A)`.
- [x] **A2.3 Inmutabilidad de Nodos Bloqueados:** Si un `AtomNode` o `BondEdge` tiene `isLocked: true`, las acciones `removeAtom`, `transmuteAtom`, `removeBond` y `addOrCycleBond` deben ignorar la mutación destructiva (permitiendo únicamente mover la posición `(x, y)` del átomo si el usuario reorganiza el lienzo, o conectarle nuevos átomos libres).

## 3. Auditoría de Rendimiento Gráfico (React-Konva)
- [x] **A3.1 Capas Decorativas Pasivas:** La cuadrícula de fondo y las líneas visuales internas de enlaces dobles/triples tienen `listening={false}` para no sobrecargar el motor de detección de colisiones de Konva.
- [x] **A3.2 Hitbox Ergonómico:** Cada `BondShape` cuenta con una línea invisible de captura con `hitStrokeWidth >= 20` para facilitar el clic sin requerir puntería milimétrica.
- [x] **A3.3 Limpieza de Eventos Temporales:** Al soltar el clic (`onMouseUp`) fuera de un átomo mientras se arrastra un enlace temporal, la línea guía desaparece limpiamente sin generar errores en consola.
- [x] **A3.4 Ergonomía KingDraw y Geometría:** Toda la trigonometría de ángulos de brote (120°), imán de 30° y generación de polígonos reside exclusivamente en `src/core/model/geometry.ts` (puro TypeScript) y todos los enlaces generados por clic o plantilla miden exactamente `BOND_LENGTH (60px)`.

## 4. Auditoría de Memoria WebAssembly y Formato Químico (RDKit.js)
- [x] **A4.1 Prevención de Memory Leaks en C++/WASM:** Toda instancia creada mediante `RDKit.get_mol(...)` o `RDKit.get_qmol(...)` se destruye obligatoriamente llamando a `.delete()` dentro de un bloque `try / finally`.
- [x] **A4.2 Alineación de Columnas CTAB V2000:** El generador `graphToMol.ts` respeta estrictamente el ancho de columnas del estándar MOL V2000 (3 caracteres para conteo de átomos/enlaces en la línea 4, 10 caracteres por coordenada `X, Y, Z`) para evitar fallos silenciosos de parseo en moléculas con más de 9 átomos.
- [x] **A4.3 Cortocircuito de Validación:** Si `localValidator.ts` (Capa 1) detecta una valencia imposible (ej. Carbono con 5 enlaces), el flujo se detiene y muestra el error pedagógico sin enviar el grafo corrupto a `RDKit.js` (Capa 2).

## 5. Registro de Auditorías Ejecutadas
*(El agente debe actualizar esta tabla tras auditar cada etapa)*

| Etapa Auditada | A1 (Capas) | A2 (Grafo) | A3 (Konva) | A4 (RDKit/WASM) | `tsc --noEmit` | Estado Final |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Etapa 1** | APROBADO | APROBADO | N/A | N/A | Exitoso (0 errores) | APROBADO |
| **Etapa 2** | APROBADO | APROBADO | APROBADO | N/A | Exitoso (0 errores) | APROBADO |
| **Etapa 3** | APROBADO | APROBADO | APROBADO | N/A | Exitoso (0 errores) | APROBADO |
| **Etapa 4** | APROBADO | APROBADO | APROBADO | APROBADO | Exitoso (0 errores) | APROBADO |
| **Etapa 5** | APROBADO | APROBADO | APROBADO | APROBADO | Exitoso (0 errores) | APROBADO |
| **Etapa 6** | APROBADO | APROBADO | APROBADO | APROBADO | Exitoso (0 errores) | APROBADO |