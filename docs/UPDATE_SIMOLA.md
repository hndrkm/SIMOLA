# SIMOLA v2.0 — Especificación de Actualización Mayor (Blueprint CAD Edition)
**Proyecto:** SIMOLA (*Interactive Molecular & Metabolic Sandbox*)  
**Autor y Desarrollador Principal:** Hendrik Michael Ramos Suarez (Ingeniería de Software y Ciencias de la Computación — Universidad Mayor de San Andrés, UMSA)  
**Estado:** Especificación de Refactorización Visual, Optimización de Rendimiento y Precisión Bioquímica.

---

## 1. Rediseño Visual: Estética "Molecular CAD / Blueprint Wireframe"
Se reemplaza la interfaz convencional de tarjetas redondeadas y sombras difuminadas por una estética de **Estación de Diseño Asistido por Computadora (CAD) e Ingeniería Bioquímica**:

1. **Paleta Técnica Oficial:**
   - **Fondo de Plano Técnico (Blueprint Canvas):** `#0B132B` / `#132038` con doble cuadrícula generada en CSS puro: rejilla secundaria cada `20px` (`rgba(0, 168, 150, 0.07)`) y líneas maestras cada `100px` (`rgba(0, 168, 150, 0.18)`).
   - **Acento Primario (Trazo Técnico / Enzimas / Estado Activo):** Verde Azulado Catalítico `#00A896`.
   - **Acento Secundario (Sitios Reactivos / Fosfatos / Alertas Termodinámicas):** Ámbar Fosfato `#F77F00`.
   - **Superficies de Paneles:** Azul Marino Profundo `#1B2A4A` con opacidad del 95%, bordes finos vectoriales (`1px solid rgba(0, 168, 150, 0.35)`) y **marcas de esquina estilo visor CAD** (corchetes técnicos en las 4 esquinas en lugar de `rounded-2xl`).
2. **Tipografía de Telemetría:**
   - Uso de tipografía monoespaciada (`JetBrains Mono`, `Fira Code`, `monospace`) para fórmulas moleculares, códigos `EC`, valores $\Delta G^{\circ\prime}$, ángulos de enlace (`SNAP: 90°`), coordenadas y cadenas `SMILES`.
3. **Representación de Nodos y Enlaces estilo Wireframe:**
   - **Átomos:** Nodos vectoriales con centro oscuro (`#0B132B`), anillo perimetral nítido (`strokeWidth: 2`) según código de color CPK, y **retícula segmentada giratoria/pulsante (`dash: [6, 3]`)** en color `#F77F00` cuando un átomo actúa como sitio reactivo post-catálisis o en `#00A896` al seleccionarse.
   - **Hidrógenos Satélite:** Pequeños nodos técnicos orbitales de trazo fino (`1px`) acoplados al átomo padre, sin sombras ni degradados.

---

## 2. Optimización Extrema de Rendimiento en `React-Konva` (Objetivo: 60 FPS)
Para evitar caídas de rendimiento al dibujar moléculas complejas (hexosas bisfosfato, complejos multienzimáticos):

1. **Eliminación Total de `shadowBlur`:** Queda prohibido el uso de `shadowBlur`, `shadowColor` y filtros de desenfoque en `AtomShape.tsx` y `BondShape.tsx`. Todo resalte visual se realiza mediante anillos vectoriales (`<Circle stroke="..." dash={[5, 3]} />`) y trazos paralelos.
2. **Desactivación de Eventos en Elementos Decorativos (`listening={false}`):**
   - Todos los hidrógenos satélite, etiquetas de texto (`<Text>`), indicadores de carga formal (`⊕`/`⊖`), números de isótopos y adornos de retícula deben tener explícitamente `listening={false}` y `perfectDrawEnabled={false}`.
   - Solo el círculo central del `AtomNode` y la línea de colisión del `BondEdge` escuchan eventos del ratón.
3. **Cálculo O(1) de Valencias y Memoización:**
   - Envolver `AtomShape` y `BondShape` en `React.memo`.
   - Pre-calcular el mapa de suma de órdenes de enlace por átomo en un selector memorizado o al actualizar el grafo, evitando filtrar todo el arreglo `edges` dentro del ciclo de renderizado de cada nodo durante `onDragMove`.

---

## 3. Nuevas Mecánicas de Pizarra y Asistencia Pedagógica

1. **Selección de Enlaces con la Herramienta `select` (Fase de Predicción del Sitio Activo):**
   - El estudiante ahora puede seleccionar tanto átomos (`selectedAtomId`) como enlaces (`selectedBondId`) usando la herramienta `select`.
   - En los pasos donde la enzima actúa sobre un enlace específico (ej. Pasos 2, 4, 5 y 9 de la Glucólisis), el usuario debe señalar dicho enlace o átomo reactivo antes de ejecutar el Reactor Catalítico. Si selecciona un sitio incorrecto, se muestra una pista mecanística inmediata.
2. **Ciclo de Enlaces Simplificado (`1 ↔ 2`):**
   - Al hacer clic directo sobre un enlace existente en el lienzo, su orden alterna exclusivamente entre **Simple (`1`) y Doble (`2`)**, evitando pasar accidentalmente por el enlace triple (`3`) durante tautomerizaciones o formación de carbonilos. El enlace triple queda reservado para selección explícita en la barra de herramientas lateral.
3. **Estandarización del Bloque Prefabricado de Fosfato (`-PO3²⁻`):**
   - En las reacciones de fosforilación o mutación (Pasos 1, 3, 6 y 8), el Reactor Catalítico ya no entrega el grupo fosfato pre-conectado. En su lugar, deja el **oxígeno puente receptor resaltado con retícula ámbar (`#F77F00`, `isHighlighted: true`)**.
   - El bloque de Fosfato en la librería se estandariza como grupo **Fosforilo (`-PO3²⁻`) de 4 átomos**: un átomo de Fósforo (`P`) unido a un oxígeno carbonílico (`=O`, orden 2) y dos oxígenos aniónicos (`-O⁻`, orden 1, `formalCharge: -1`), dejando libre la quinta valencia del `P` para que el estudiante lo enlace directamente al oxígeno puente resaltado.
4. **Interruptor de "Empuje Termodinámico (Principio de Le Chatelier)" en el Reactor:**
   - Para etapas con $\Delta G^{\circ\prime} > 0$ (reacciones endergónicas en condiciones estándar: Pasos 2, 4, 5, 6, 8 y 9), `CatalyticReactorModal.tsx` muestra un interruptor obligatorio: *"Acoplar consumo celular continuo de productos ($\Delta G_{\text{real}} < 0$ por Principio de Le Chatelier)"*, educando al alumno sobre cómo avanzan estas reacciones *in vivo*.
5. **Diagnóstico Diferencial de Errores Comunes (`commonMistakes` con Solución):**
   - `missionEvaluator.ts` incorpora un diccionario `commonMistakes` por nivel que evalúa patrones SMARTS/SMILES frecuentes (ej. dejar un alcohol en lugar de un aldehído, conectar el fósforo directo al carbono sin oxígeno puente, olvidar la tautomerización del enolpiruvato o dejar el ácido carboxílico sin desprotonar a $\text{pH } 7.4$) y devuelve un mensaje pedagógico indicando exactamente qué enlace o carga modificar.
6. **Interruptor Global de "Modo Asistencia Guiada (Guía / Solución Paso a Paso)":**
   - Activable desde `HomeView` o desde el encabezado de `MissionSidebar`. Cuando está activo:
     - Resalta en el lienzo el átomo o enlace exacto donde debe hacer clic el usuario antes de abrir el Reactor.
     - Habilita en el Reactor el botón **"Autocompletar Parámetros Catalíticos"**.
     - Habilita en `MissionSidebar` la guía exacta de clics y el botón **"⚡ Construir Producto Final en Pizarra"** para pruebas rápidas o desbloqueo pedagógico.

---

## 4. Corrección Estructural de los 10 Niveles del Módulo II (Glucólisis)
Se corrigen todos los grafos iniciales (`initialGraph`), grafos post-reactor (`postReactorGraph`) y condiciones de victoria (`winConditions`):

- **Paso 1 (Hexoquinasa — EC 2.7.1.1):** Anillo completo de $\alpha$-D-Glucopiranosa incluyendo los 4 grupos $-\text{OH}$ en `C1, C2, C3, C4` y el grupo $-\text{CH}_2\text{OH}$ en `C5-C6`. El reactor resalta `O6` en ámbar para que el usuario estampe y conecte el bloque Fosforilo (`-PO3²⁻`).
- **Paso 2 (Fosfoglucosa Isomerasa — EC 5.3.1.9):** Inicia con Glucosa-6-fosfato completa. Selección del enlace hemiacetálico `C1-O_ring`. El reactor entrega el intermediario furanósico listo para cerrar el anillo de 5 miembros sin exceder la valencia 4 de `C2`. `acceptedSmiles` ampliado: `'O=P([O-])([O-])OCC1OC(O)(CO)C(O)C1O'`, `'O=P(O)(O)OCC1OC(O)(CO)C(O)C1O'`, `'O=P([O-])([O-])OCC1OC(CO)C(O)C1O'`, `'O=P(O)(O)OCC1OC(CO)C(O)C1O'`.
- **Paso 3 (PFK-1 — EC 2.7.1.11):** Inicia con Fructosa-6-fosfato completa (anillo furanósico de 5 miembros + brazos exocíclicos `C1` y `C6`). Selección de `O1`. El reactor resalta `O1` para acoplar manualmente el segundo bloque Fosforilo (`-PO3²⁻`). `acceptedSmiles` corregidos con fosfatos en extremos opuestos (`C1` y `C6`): `'O=P([O-])([O-])OCC1OC(O)(COP(=O)([O-])[O-])C(O)C1O'`, `'O=P(O)(O)OCC1OC(O)(COP(=O)(O)O)C(O)C1O'`, `'O=P([O-])([O-])OCC1OC(COP(=O)([O-])[O-])C(O)C1O'`, `'O=P(O)(O)OCC1OC(COP(=O)(O)O)C(O)C1O'`.
- **Paso 4 (Aldolasa — EC 4.1.2.13):** Inicia con Fructosa-1,6-bisfosfato completa. Selección del enlace `C3-C4`. El reactor envía la DHAP al Reservorio de Metabolitos y deja en el lienzo el Gliceraldehído-3-fosfato (con su fosfato completo en `C3-O3-P3`) pero con el enlace `C1-O1` como enlace simple (`order: 1`, `isHighlighted: true`) para que el estudiante lo convierta en doble enlace (`C=O`, orden 2).
- **Paso 5 (Triosa Fosfato Isomerasa — EC 5.3.1.1):** Inicia con DHAP completa (con oxígeno puente `C3-O3-P3` y 3 oxígenos periféricos en `P3`). Selección del carbonilo `C2=O`. El reactor reduce `C2-O2` a simple y deja `C1-O1` simple resaltado para que el alumno lo eleve a doble enlace (`1 -> 2`) formando G3P.
- **Paso 6 (GAPDH — EC 1.2.1.12):** Inicia con G3P completo (con `-OH` en `C2` y fosfato completo en `C3`). Selección de `C1` + entrada de $\text{NAD}^+$ y $\text{P}_i$. El reactor forma el carbonilo `C1=O` e incorpora el oxígeno puente `O_brg1` resaltado en `C1` para que el alumno estampe y conecte el bloque Fosforilo (`-PO3²⁻`), obteniendo 1,3-BPG.
- **Paso 7 (Fosfoglicerato Quinasa — EC 2.7.2.3):** Inicia con 1,3-Bisfosfoglicerato completo. Selección del acil-fosfato en `C1` + entrada de $\text{ADP}$. El reactor transfiere el fosfato para generar $\text{ATP}$ y deja el oxígeno `O1_neg` en `C1` con carga `0` (`-OH`) resaltado para que el alumno use Clic Derecho y asigne **Carga Formal `-1`** (`-COO⁻` a $\text{pH } 7.4$).
- **Paso 8 (Fosfoglicerato Mutasa — EC 5.4.2.11):** Inicia con 3-Fosfoglicerato completo. Selección del oxígeno hidroxílico en `C2`. El reactor hidroliza el fosfato de `C3` (dejando `-OH` en `C3`) y resalta el oxígeno de `C2` para que el alumno estampe y conecte el bloque Fosforilo (`-PO3²⁻`), formando 2-Fosfoglicerato.
- **Paso 9 (Enolasa — EC 4.2.1.11):** Inicia con 2-Fosfoglicerato completo (con oxígeno puente `C2-O2-P2`). Selección del enlace `C2-C3` (o el `-OH` en `C3`). El reactor elimina $\text{H}_2\text{O}$ y deja el enlace `C2-C3` como simple (`order: 1`, resaltado) para que el estudiante haga clic sobre él y lo eleve a doble enlace (`C=C`, orden 2), formando Fosfoenolpiruvato (PEP).
- **Paso 10 (Piruvato Quinasa — EC 2.7.1.40):** Inicia con PEP completo (incluyendo los 3 oxígenos periféricos del fósforo). Selección del fosfato en `C2` + entrada de $\text{ADP}$. El reactor retira el fosfato hacia el $\text{ATP}$ y deja el intermediario **Enolpiruvato** (`C2=C3` doble y `C2-O2` simple, ambos resaltados) para que el estudiante ejecute la tautomerización ceto-enol manual: bajar `C2=C3` a simple (`2 -> 1`) y subir `C2-O2` a doble (`1 -> 2`). Se elimina la restricción conflictiva `targetFormula: 'C3H4O3'` para aceptar tanto `'CC(=O)C(=O)[O-]'` como `'CC(=O)C(=O)O'`.

---

## 5. Nueva Vista de Bibliografía, Herramientas y Créditos (`BibliographyView.tsx`)
Se incorpora una sección accesible desde la navegación principal (`HomeView` y `TopBar`) titulada **"📚 Bibliografía, Arquitectura y Créditos"** que documenta:
1. **Autoría y Créditos del Proyecto:**
   - **Desarrollador y Arquitecto de Software:** Hendrik Michael Ramos Suarez.
   - **Institución Académica:** Carrera de Bioquimica — Universidad Mayor de San Andrés (UMSA), La Paz, Bolivia.
   - **Propósito:** Plataforma interactiva de simulación quimioinformática y enseñanza de rutas metabólicas.
2. **Referencias Bibliográficas Formales (APA 7.ª Ed. / IEEE):**
   - Lenguajes y estándares (TypeScript, ECMAScript, WebAssembly, HTML5 Canvas).
   - Frameworks y gestión de estado (React 18, Vite, Zustand, Tailwind CSS, Konva.js / React-Konva, Lucide).
   - Quimioinformática y bioquímica (RDKit / `@rdkit/rdkit`, formato MDL Molfile V2000 de Dalby et al., notación SMILES de Weininger, *Lehninger Principles of Biochemistry* de Nelson & Cox).