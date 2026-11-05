# SIMOLA v2.0 — Plan de Implementación y Control de Avance (`PROGRESS_UPDATE.md`)

Este documento rastrea paso a paso la implementación de la actualización **v2.0 (Blueprint CAD, Optimización 60 FPS, Corrección de Glucólisis y Página de Bibliografía)**. Cada fase debe verificarse antes de pasar a la siguiente.

---

## FASE 1: Optimización de Rendimiento en Konva y Tema Visual "Blueprint CAD"
- [x] **P1.1 — Tema Blueprint & Cuadrícula Técnica CSS:**
  - Actualizar `index.css`, `HomeView.tsx`, `TopBar.tsx`, `Toolbar.tsx` y `MissionSidebar.tsx` al estilo **Blueprint / Wireframe CAD** (`#0B132B`, bordes técnicos finos `#00A896/40`, esquineros tipo visor CAD y tipografía monoespaciada para datos químicos).
  - Reemplazar cualquier cuadrícula pesada en Canvas por una doble cuadrícula técnica en CSS puro sobre el contenedor del lienzo.
- [x] **P1.2 — Eliminación de `shadowBlur` y Optimización de Eventos en `React-Konva`:**
  - En `AtomShape.tsx` y `BondShape.tsx`, eliminar el 100% de las propiedades `shadowBlur`, `shadowColor` y `shadowOpacity`.
  - Sustituir el resalte de selección, error (`hasError`) y sitio reactivo (`isHighlighted`) por **anillos vectoriales concéntricos con trazo punteado (`dash: [6, 3]`)**.
  - Añadir `listening={false}` y `perfectDrawEnabled={false}` a todos los hidrógenos satélite, etiquetas `<Text>`, símbolos de carga formal e indicadores de isótopos.
  - Envolver `AtomShape` y `BondShape` en `React.memo`.
- **Cómo revisarlo en el navegador:** Dibujar más de 30 átomos o cargar la Fructosa-1,6-bisfosfato y arrastrar nodos; el movimiento debe sentirse instantáneo a 60 FPS sin retraso y con estética de plano técnico.

---

## FASE 2: Mecánicas de Pizarra, Selección de Enlaces y Modo Asistencia Guiada
- [x] **P2.1 — Ciclo de Enlace `1 ↔ 2` y Selección de Aristas (`selectedBondId`):**
  - En `useCanvasStore.ts`, agregar `selectedBondId: string | null` y hacer que `cycleBondOrder` alterne únicamente entre `1` y `2` al hacer clic directo en un enlace.
  - En `BondShape.tsx`, permitir seleccionar un enlace cuando `activeTool === 'select'` (resaltándolo con líneas paralelas técnicas en `#00A896`).
- [x] **P2.2 — Bloque Prefabricado de Grupo Fosforilo (`-PO3²⁻` de 4 átomos):**
  - En `templates.ts` / `FunctionalGroupsModal.tsx`, asegurar que el bloque de Fosfato para acoplar sea un grupo **Fosforilo (`-PO3²⁻`)** compuesto por `P`, un `=O` doble y dos `-O⁻` con carga `-1`, listo para enlazarse con un solo enlace al oxígeno puente que parpadea en el sustrato.
- [x] **P2.3 — Switch Termodinámico de Le Chatelier en `CatalyticReactorModal.tsx`:**
  - En misiones con $\Delta G^{\circ\prime} > 0$ (Pasos 2, 4, 5, 6, 8 y 9), mostrar el interruptor obligatorio *"Acoplar consumo celular de productos (Principio de Le Chatelier)"* antes de habilitar la transformación.
- [x] **P2.4 — Interruptor de "Modo Asistencia Guiada (Trampa Pedagógica)":**
  - Añadir el switch `assistedMode` en `useGameStore.ts` (visible en `HomeView` y `MissionSidebar`).
  - Cuando está activo: 
    1) Resalta en pizarra el sitio exacto a seleccionar antes del reactor, 
    2) Muestra un botón para autocompletar la receta en el Reactor Catalítico, y 
    3) Muestra en `MissionSidebar` los pasos exactos de solución y el botón **"⚡ Auto-Construir Producto Final"**.
- **Cómo revisarlo en el navegador:** Activar el Modo Asistencia Guiada, probar el clic en un enlace simple para ver que pasa de `1 -> 2 -> 1` (sin pasar por `3`) y verificar que `select` permite señalar enlaces.

---

## FASE 3: Reconstrucción de los 10 Pasos de la Glucólisis y Diagnóstico `commonMistakes`
- [x] **P3.1 — Motor de Errores Comunes (`commonMistakes` en `missionEvaluator.ts`):**
  - Implementar la evaluación de estructuras erróneas frecuentes mediante SMILES/SMARTS para devolver pistas accionables (ej. enlace `C-P` directo sin oxígeno puente, alcohol no oxidado a aldehído, carboxilo sin carga `-1`, o enolpiruvato sin tautomerizar).
- [x] **P3.2 — Corrección de Grafos y Validaciones de los Pasos 1 al 5 (Fase de Inversión):**
  - [x] **Paso 1 (Hexoquinasa):** Glucosa inicial con sus 4 `-OH` en `C1..C4`; reactor resalta `O6` sin poner el fosfato; el alumno estampa y une `-PO3²⁻`.
  - [x] **Paso 2 (Fosfoglucosa Isomerasa):** Inicia con G6P completa; selección de `C1-O_ring`; reactor entrega intermediario furanósico; `acceptedSmiles` actualizados.
  - [x] **Paso 3 (PFK-1):** Inicia con F6P completa (anillo de 5 lados + brazos `C1` y `C6`); reactor resalta `O1`; el alumno une el segundo `-PO3²⁻`; `acceptedSmiles` corregidos con fosfatos en `C1` y `C6`.
  - [x] **Paso 4 (Aldolasa):** Inicia con F1,6BP completa; selección de enlace `C3-C4`; reactor guarda DHAP en reservorio y deja G3P con enlace `C1-O1` simple resaltado para subir a doble (`1 -> 2`).
  - [x] **Paso 5 (TIM):** Inicia con DHAP completa (con oxígeno puente `C3-O3-P3`); selección de `C2=O`; reactor deja `C1-O1` simple resaltado para subir a doble (`1 -> 2`).
- [x] **P3.3 — Corrección de Grafos y Validaciones de los Pasos 6 al 10 (Fase de Beneficio):**
  - [x] **Paso 6 (GAPDH):** Inicia con G3P completo; reactor deja `C1=O` y oxígeno puente `O_brg1` resaltado para acoplar `-PO3²⁻`.
  - [x] **Paso 7 (Fosfoglicerato Quinasa):** Inicia con 1,3-BPG completo; reactor quita fosfato de `C1` y deja `O1_neg` neutro resaltado para poner Carga Formal `-1` con Clic Derecho.
  - [x] **Paso 8 (Fosfoglicerato Mutasa):** Inicia con 3-PG completo; reactor deja `-OH` en `C3` y resalta el oxígeno de `C2` para acoplar `-PO3²⁻`.
  - [x] **Paso 9 (Enolasa):** Inicia con 2-PG completo; selección de `C2-C3`; reactor elimina agua y deja `C2-C3` simple resaltado para subir a doble enlace (`C=C`).
  - [x] **Paso 10 (Piruvato Quinasa):** Inicia con PEP completo; reactor deja Enolpiruvato resaltado para bajar `C2=C3` (`2 -> 1`) y subir `C2-O2` (`1 -> 2`); eliminar `targetFormula: 'C3H4O3'` para aceptar `'CC(=O)C(=O)[O-]'`.
- **Cómo revisarlo en el navegador:** Recorrer del Paso 1 al Paso 10 de la Glucólisis comprobando tanto la resolución manual como el botón de asistencia guiada.

---

## FASE 4: Vista de Bibliografía, Herramientas y Créditos de Autoría
- [x] **P4.1 — Creación de `src/ui/views/BibliographyView.tsx` y Enrutamiento:**
  - Añadir la vista `'bibliography'` en `useGameStore.ts` y `App.tsx`, con un botón de acceso directo **"📚 Bibliografía y Créditos"** en `HomeView.tsx` y `TopBar.tsx`.
  - Incluir la tarjeta destacada de **Autoría e Ingeniería del Proyecto**:
    - **Autor:** Hendrik Michael Ramos Suarez
    - **Afiliación:** Ingeniería de Software y Ciencias de la Computación — Universidad Mayor de San Andrés (UMSA)
  - Incluir el listado bibliográfico categorizado (Lenguajes y Estándares, Frameworks UI/Estado, Motor Gráfico 2D, Motor Quimioinformático RDKit/V2000/SMILES y Referencias Bioquímicas) con formato académico APA 7.ª edición e IEEE.
- [x] **P4.2 — Compilación Final y Despliegue a GitHub Pages:**
  - Ejecutar `npx tsc --noEmit` y `npm run build` con cero errores.
  - Hacer commit y `git push origin main` para actualizar `https://hndrkm.github.io/SIMOLA/`.