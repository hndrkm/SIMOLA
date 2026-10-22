# 01 - Especificación de Producto y Mecánicas (SIMOLA)

## 1. Visión General e Identidad del Proyecto
- **Nombre de la Web App:** **SIMOLA** (*Interactive Molecular & Metabolic Sandbox*).
- **Concepto:** Videojuego de puzles bioquímicos y pizarra molecular 2D interactiva. Combina la precisión de un editor químico asistido estilo **KingDraw** con mecánicas de rutas metabólicas (Glucólisis y Complejo PDH), permitiendo dibujar estructuras, insertar flechas de reacción, etiquetar moléculas y utilizar cofactores ($\text{ATP}$, $\text{ADP}$, $\text{NAD}^+$).
## 1.1 Sistema de Diseño e Identidad Visual (SIMOLA Brand)
- **Logo Oficial:** Ubicado en `/logo.png` (servido desde `public/logo.png`). Debe mostrarse en el Hero de `HomeView`, en el extremo izquierdo de `TopBar` (permitiendo volver al menú principal al hacer clic) y como `favicon` en `index.html`.
- **Paleta de Colores Oficial:**
  - **Deep Navy Blue (`#1B2A4A`):** Color primario de marca, fondos de navegación (`TopBar`, paneles principales, fondo hero de `HomeView`) y bordes estructurales.
  - **Vibrant Catalytic Teal (`#00A896`):** Color de acción enzimática, botones principales de validación ("Verificar Reacción"), estados activos de herramientas en la barra lateral, indicadores de progreso e imán magnético en el lienzo.
  - **Energetic Phosphate Amber (`#F77F00`):** Color de alta energía (ATP/Fosfato), CTA principal en `HomeView`, insignias de cofactores, alertas de pistas pedagógicas y resaltado de selección/hover.

## 2. Arquitectura de Pantallas y Paneles (UI Views)
1. **Pantalla de Menú Principal (`HomeView`):**
   - Branding de **SIMOLA**, selector de mundos/rutas metabólicas (Sandbox Químico, Glucólisis, Complejo PDH) y botón "Iniciar / Continuar".
2. **Pizarra Principal de Juego (`GameWorkspace`):**
   - **Barra Superior (`TopBar`):** Nombre del nivel actual, indicador de intentos/puntaje, botón de "Pista" y botón principal **"Verificar Reacción"**.
   - **Caja de Herramientas Estructurales (`ElementToolbar` - Panel Izquierdo):**
     - Elementos químicos (`C`, `H`, `O`, `N`, `P`, `S`).
     - Tipos de enlace (`Simple`, `Doble`, `Triple`).
     - Plantillas de anillos (`Ciclopentano`, `Ciclohexano`, `Benceno`).
     - Cofactores / Moléculas Mediadoras del nivel ($\text{ATP}$, $\text{ADP}$, $\text{NAD}^+$, $\text{NADH}$, $\text{P}_i$).
   - **Herramientas de Control del Lienzo (`CanvasControls` - Panel Flotante):**
     - Selección/Movimiento (`select`), Borrador (`eraser`), Flechas de Reacción (`arrow`), Cuadros de Texto (`text`), Deshacer/Rehacer (`undo`/`redo`) y Zoom/Centrar.
3. **Modal de Evaluación (`FeedbackModal`):**
   - Muestra el diagnóstico de Capa 1 (valencias/conectividad) o Capa 2 (RDKit.js), animaciones de éxito y transición al siguiente nivel.
## 2.1 Pantalla de Menú Principal (`src/ui/views/HomeView.tsx`)
La aplicación inicia en `HomeView` antes de entrar al `GameWorkspace`:
1. **Hero Banner:**
   - Muestra el logo `/logo.png`, el título **SIMOLA** (*Interactive Molecular & Metabolic Sandbox*) y un subtítulo corto sobre resolución de rutas metabólicas y construcción molecular 2D.
   - Botón CTA principal en Ámbar Fosfato (`#F77F00`): **"Continuar Misión Actual"** y botón secundario en Teal Catalítico (`#00A896`): **"Modo Sandbox Libre"** (abre la pizarra limpia sin restricciones de misión).
2. **Selector de Rutas y Mundos (Grid de Tarjetas Interactivas):**
   - **Card 1: Fundamentos y Sandbox Químico** (Valencias, Enlaces Múltiples, Grupos Funcionales e Isómeros).
   - **Card 2: Ruta de la Glucólisis** (10 pasos enzimáticos desde D-Glucosa hasta 2 moléculas de Piruvato, mostrando barra de progreso e insignia de $\text{ATP}/\text{NADH}$).
   - **Card 3: Complejo Piruvato Deshidrogenasa (PDH)** (Descarboxilación oxidativa del Piruvato a Acetil-CoA con cofactores $\text{TPP}$, Lipoamida y $\text{CoA-SH}$).
## 2.2 Sistema de Paletas Escalables y Modales (UI Avanzada de SIMOLA)

1. **Selector de Elementos y Modal de Tabla Periódica (`PeriodicTableModal.tsx`):**
   - **Barra Rápida (Panel Izquierdo):** Muestra siempre los **5 elementos más utilizados/recientes** (`recentElements`, por defecto `['C', 'H', 'O', 'N', 'P']`) más un botón `[🌐 Tabla Periódica (+118)]`.
   - **Modal de Tabla Periódica:** Cuadrícula interactiva completa de los 118 elementos clasificados por bloques y familias químicas (No metales, Halógenos, Metales de transición/cofactores como $\text{Mg}^{2+}$, $\text{Fe}^{2+}$, $\text{Zn}^{2+}$, Alcalinos, etc.), con buscador en tiempo real y selector de **Isótopo** (ej. $^{12}\text{C}$, $^{13}\text{C}$, $^{14}\text{C}$, $^{32}\text{P}$). Al elegir un elemento, pasa al primer lugar de los 5 recientes.

2. **Modal de Grupos Funcionales, Coenzimas y Esqueletos Base (`FunctionalGroupsModal.tsx`):**
   - Acceso rápido en barra lateral a los 3 favoritos (ej. `-PO3²⁻`, `-OH`, `-COOH`) y botón `[🧪 Librería Química]`.
   - Organizado en 3 pestañas dentro del modal:
     - **Tab 1: Grupos Funcionales:** Fosfato (`-PO3H2`), Hidroxilo (`-OH`), Carbonilo (`C=O`), Carboxilo (`-COOH`), Amino (`-NH2`), Sulfhidrilo/Tiol (`-SH`), Acetilo (`-COCH3`), Metilo (`-CH3`).
     - **Tab 2: Coenzimas y Mediadores (PDH / Glucólisis):** Grupo Acetil-CoA (`-S-CoA`), Lipoamida oxidada/reducida, Pirofosfato (`PPi`), $\text{NAD}^+/\text{NADH}$ y $\text{ATP}/\text{ADP}$.
     - **Tab 3: Biomoléculas Base (Plantillas Completas):** Esqueleto de Glucosa lineal (6C), Anillo de $\alpha$-D-Glucopiranosa, Fructofuranosa, Piruvato (3C), Gliceraldehído-3-fosfato (G3P).

3. **Selector Paramétrico de Ciclos y Anillos ($n = 3 \dots 8$):**
   - Soporta polígonos regulares desde **3 hasta 8 vértices**:
     - **Saturados (Enlaces simples):** Ciclopropano ($n=3$), Ciclobutano ($n=4$), Ciclopentano ($n=5$), Ciclohexano ($n=6$), Cicloheptano ($n=7$), Ciclooctano ($n=8$).
     - **Insaturados / Conjugados (Con dobles enlaces):** Ciclos con 1 doble enlace (Cicloalquenos), sistemas conjugados/aromáticos como **Benceno** ($n=6$, alternado), **Ciclopentadieno** ($n=5$, 2 dobles enlaces) y **Ciclooctatetraeno** ($n=8$, 4 dobles enlaces alternados).
     - **Heterociclos Bioquímicos:** Anillo de **Piranosa** ($n=6$ con 1 átomo de `O`) y **Furanosa** ($n=5$ con 1 átomo de `O`).
   - Todos los anillos de 3 a 8 lados funcionan con las 3 mecánicas KingDraw: **Estampado en vacío**, **Brote desde un átomo** y **Fusión compartiendo un enlace existente**.

## 2. Arquitectura Revisada del Espacio de Juego (`GameWorkspace`)

1. **Barra Superior (`TopBar.tsx`):**
   - Extremo izquierdo: Logo horizontal (`logo.png`) dentro de cápsula clara (`h-10 w-auto object-contain`) SIN texto redundante al lado, más botón `"← Menú Principal"`.
   - Centro: Selector de Imán Angular (`30°`, `45°`, `90°`, `120°`, `Libre`) para facilitar el dibujo de estructuras simples, cadenas a 120° o enlaces axiales verticales de Haworth a 90°.
   - Extremo derecho: Botón **"🔥 Horno Enzimático (Transformar)"** (en `#F77F00`) y botón **"✓ Verificar Estructura"** (en `#00A896`).

2. **Panel Lateral Derecho de Misión (`src/ui/hud/MissionSidebar.tsx`):**
   - Separado completamente de la barra superior. Se oculta automáticamente en el Modo Sandbox Libre (limpiando el lienzo al entrar al Sandbox).
   - Muestra: Título del Mundo y Misión, Indicador de Paso (ej. `Paso 2 de 5`), Descripción completa sin cortes con scroll propio, Acordeón desplegable de **Pista Enzimática**, Bandeja de **Productos/Derivados Acumulados** (para rutas multicapa como Glucólisis y PDH) y botón **"Reiniciar Misión"**.

3. **Átomos con Satélites de Hidrógeno y Menú Contextual (Clic Derecho):**
   - Cada átomo en el lienzo muestra visualmente sus **hidrógenos implícitos como esferas satélite acopladas (medio cuerpo)** que se reducen automáticamente a medida que el jugador le conecta nuevos enlaces (`H_visibles = max(0, Valencia - OrdenDeEnlaces + CargaAjustada)`).
   - **Clic Derecho sobre un Átomo:** Abre un Popover flotante para modificar **Carga Formal (`-2, -1, 0, +1, +2`)** e **Isótopo (`12C, 13C, 14C, 2H, 32P`)**.
   - **Doble Clic sobre una Enzima o Cofactor en el lienzo/inventario:** Abre un modal inspector con su fórmula química desglosada y rol catalítico.

4. **El "Horno Enzimático / Mesa de Crafteo" (`src/ui/modals/BiochemicalFurnaceModal.tsx`):**
   - Funciona como un horno/mesa de crafteo estilo Minecraft para pasos metabólicos:
     - **Slot Sustrato:** Toma la molécula actual dibujada en el lienzo.
     - **Slot Catalizador (Enzima):** El jugador selecciona la enzima correcta del nivel (ej. *Hexoquinasa*, *E1 Piruvato Deshidrogenasa*).
     - **Slots de Cofactores (Entrada):** El jugador coloca los mediadores necesarios (ej. `ATP`, `NAD+`, `CoA-SH`, `Lipoamida`, `TPP`).
   - **Resultado del Crafteo ("Pre-Producto Incompleto" + Derivados):**
     - Si la receta enzimática es válida, el Horno genera los **Derivados Secundarios** (ej. `ADP`, `NADH`, `HCO3-`) guardándolos en la bandeja de la misión, y coloca en el lienzo la **estructura pre-transformada pero incompleta** (por ejemplo, el anillo abierto o el grupo funcional recién liberado a medio conectar) para que el jugador remate los enlaces finales en la pizarra y presione "Verificar".

## 3. Máquina de Estados de Interacción Unificada (Base + KingDraw + Pizarra)
El lienzo (`MolecularCanvas`) opera bajo una herramienta activa (`activeTool`) combinando manipulación directa y dibujo asistido:

1. **Herramienta `select` (Selección, Movimiento y Cámara):**
   - **Arrastrar un `AtomNode` (`isLocked !== true`):** Actualiza sus coordenadas `(x, y)` a 60 FPS; todos sus enlaces conectados se estiran/rotan dinámicamente.
   - **Arrastrar Anotaciones:** Permite mover flechas de reacción o cuadros de texto colocados en la pizarra.
   - **Navegación de Cámara:** Arrastrar el fondo vacío desplaza la vista (*pan*). La rueda del mouse aplica *zoom* centrado en el puntero (o manteniendo `Espacio` + arrastrar desde cualquier otra herramienta).

2. **Herramienta `atom` (Colocación Directa, Transmutación y Brote Rápido):**
   - **Clic en espacio vacío:** Instancia un `AtomNode` aislado con el `activeElement` (`C`, `H`, `O`, `N`, `P`, `S`) en las coordenadas del mundo del lienzo.
   - **Clic simple sobre un `AtomNode` existente (`isLocked !== true`):** Si el átomo tiene un elemento distinto al `activeElement`, lo **transmuta** conservando sus enlaces. Si ya es del mismo elemento, ejecuta un **Auto-Sprout** (brota un nuevo átomo conectado a `60px` en ángulo óptimo de 120°).
   - **Arrastrar desde un `AtomNode` existente:** Inicia la creación de un enlace asistido igual que la herramienta `bond`.

3. **Herramienta `bond` (Creación Clásica + Asistencia KingDraw + Ciclos):**
   - **Clic en espacio vacío:** Crea un segmento inicial de 2 átomos (`activeElement`, por defecto `C-C`) unidos por un enlace de `60px` con el `activeBondOrder`.
   - **Clic simple sobre un `AtomNode` A (Auto-Sprouting KingDraw):** Brota automáticamente un enlace de `60px` con un nuevo átomo en el ángulo químico ideal (120° en zigzag o bisectriz libre).
   - **`onMouseDown` y arrastrar desde un `AtomNode` A:** Muestra una línea guía y átomo fantasma:
     - *Angle Snapping:* Se imanta cada `30°` a longitud fija de `60px` (mantener `Shift` permite ángulo y longitud libres).
     - *Magnetic Snap (`onMouseUp` sobre átomo B):* Si el cursor entra en el radio magnético (`28px`) de un átomo existente B (`A.id !== B.id`), el enlace se engancha al centro de B y al soltar crea el `BondEdge` entre A y B (o actualiza su orden si ya existía). Si se suelta en el vacío, instancia el nuevo átomo B y su enlace.
   - **Clic directo sobre un `BondEdge` existente (`isLocked !== true`):** Si el enlace ya tiene el `activeBondOrder`, cicla su orden (`1 -> 2 -> 3 -> 1`); si no, le aplica el `activeBondOrder` seleccionado.

4. **Herramientas de Plantillas de Anillos (`ring_5`, `ring_6`, `ring_benzene`):**
   - **Clic en espacio vacío:** Estampa el polígono regular de 5 o 6 carbonos con enlaces de `60px`.
   - **Clic sobre un `AtomNode`:** Brota el anillo conectado mediante un enlace simple a ese átomo.
   - **Clic sobre un `BondEdge` (Fusión KingDraw):** Fusiona el nuevo anillo compartiendo los dos átomos de esa arista hacia el lado despejado de la molécula.

5. **Herramientas de Pizarra Bioquímica (`arrow`, `text`, `cofactor`):**
   - **Herramienta `arrow` (Flechas de Reacción):** `onMouseDown` y arrastrar en el lienzo traza una flecha vectorial de reacción química (con imán horizontal/vertical cada `15°`) para separar reactivos de productos o indicar el paso enzimático.
   - **Herramienta `text` (Etiquetas):** Clic en el lienzo inserta o edita un cuadro de texto (ej. para nombrar `"Glucosa-6-fosfato"` o `"Hexoquinasa"`).
   - **Inserción de Cofactores / Grupos Prefab (`PO4`, `ATP`, `NAD+`):** Estampa el bloque funcional preconstruido (ej. un grupo fosfato `-PO3H2` completo) o el marcador del cofactor en la pizarra listo para conectarse al esqueleto carbonado.

6. **Herramienta `eraser` (Borrado en Cascada):**
   - **Clic sobre un `BondEdge` (`isLocked !== true`):** Elimina únicamente esa arista.
   - **Clic sobre un `AtomNode` (`isLocked !== true`):** Elimina el nodo y **todas** las aristas donde `sourceId === atom.id` o `targetId === atom.id`.
   - **Clic sobre una Flecha o Texto:** Elimina dicha anotación del lienzo.

7. **Atajos de Teclado en Vivo (Hover Hotkeys):**
   - Con el cursor sobre un átomo (`hoveredAtomId`): teclas `C, H, O, N, P, S` lo transmutan al instante; `Delete`/`Backspace` lo borra en cascada.
   - Con el cursor sobre un enlace (`hoveredBondId`): teclas `1, 2, 3` cambian su orden al instante; `Delete`/`Backspace` lo borra.
## 4. El "Centro Activo / Reactor Catalítico" (`src/ui/modals/CatalyticReactorModal.tsx`)
Sustituye cualquier referencia informal a "horno" o "crafteo" por terminología enzimológica formal:
- **Concepto:** Simula el acoplamiento en el **bolsillo catalítico de una enzima (Complejo $\text{E}\cdot\text{S}$)**.
- **Parámetros de Reacción:**
  1. **Sustrato ($S$):** Estructura molecular actual presente en el lienzo.
  2. **Holoenzima / Subunidad Catalítica ($E$):** Selección de la enzima específica con su clasificación internacional **EC** (ej. *Hexoquinasa — EC 2.7.1.1*).
  3. **Cofactores, Coenzimas y Cosustratos:** Selección de especies donadoras/aceptoras de grupos o electrones ($\text{Mg}^{2+}$, $\text{ATP}^{4-}$, $\text{NAD}^+$, $\text{FAD}$, $\text{TPP}$, $\text{Lipoamida}$, $\text{CoA-SH}$, $\text{P}_i$).
- **Resolución del Estado de Transición ($\text{E}\cdot\text{I} \to P$):**
  - Al ejecutar la catálisis, el reactor transfiere los **subproductos metabólicos liberados** ($\text{ADP}$, $\text{NADH} + \text{H}^+$, $\text{HCO}_3^-$, $\text{H}_2\text{O}$) al **Reservorio de Metabolitos** en el panel derecho, y despliega en el lienzo el **Intermediario Catalítico incompleto** para que el estudiante complete el ataque nucleofílico, el cierre de enlaces o el reordenamiento electrónico final antes de evaluar la estructura.

---

## 5. Catálogo de Misiones con Rigor Bioquímico (`progressionMissions.ts`)

### Módulo I: Estereoquímica, Estados Iónicos y Proyecciones de Haworth
1. **Práctica 1.1 — Hibridación $sp^2$ y Saturación de Valencias (Eteno):**
   - *Rigor Científico:* Estudio de la tetravalencia del carbono ($\text{Z}=6$), formación de enlaces $\sigma$ y $\pi$, y reducción estequiométrica de hidrógenos implícitos al incrementar la insaturación.
2. **Práctica 1.2 — Ionización Fisiológica ($\text{pH } 7.4$) y Marcaje Isotópico ($^{14}\text{C}$):**
   - *Rigor Científico:* A pH fisiológico, los ácidos carboxílicos ($\text{p}K_a \approx 2-4$) existen predominantemente como aniones **carboxilato ($-\text{COO}^-$)** desprotonados, mientras que las aminas primarias ($\text{p}K_a \approx 9-10$) se encuentran protonadas como cationes **alquilamonio ($-\text{NH}_3^+$)**. Incluye marcaje con radioisótopo $^{14}\text{C}$ para trazado metabólico.
3. **Práctica 1.3 — Ciclación Hemiacetálica: Heterociclos de Piranosa y Furanosa:**
   - *Rigor Científico:* Formación de anillos heterocíclicos de 6 miembros (oxano / **piranosa**, derivado del pirano) y 5 miembros (oxolano / **furanosa**, derivado del furano) mediante el ataque nucleofílico intramolecular de un grupo hidroxilo sobre un carbonilo aldehídico o cetónico.
4. **Práctica 1.4 — Conformación Espacial: Proyección de Haworth de la $\alpha$-D-Glucopiranosa:**
   - *Rigor Científico:* Representación estereoquímica en perspectiva plana. En la serie **D**, el grupo exocíclico $-\text{CH}_2\text{OH}$ ($\text{C6}$) se proyecta por encima del plano del anillo ($\Delta y < 0$). En el anómero **$\alpha$**, el hidroxilo hemiacetálico del carbono anomérico ($\text{C1}$) se sitúa en posición *trans* respecto a $\text{C6}$ (hacia abajo, $\Delta y > 0$), mientras que $\text{C2-OH}$ apunta abajo, $\text{C3-OH}$ arriba y $\text{C4-OH}$ abajo.

### Módulo II: Vía de Embden-Meyerhof-Parnas (Los 10 Pasos de la Glucólisis)
Cada etapa incluye su número **EC**, variación de energía libre estándar ($\Delta G^{\circ\prime}$) y mecanismo químico:
1. **Paso 1 — Hexoquinasa (EC 2.7.1.1):** Transferencia de grupo fosforilo desde $\text{ATP-Mg}^{2+}$ al hidroxilo primario en $\text{C6}$ de la $\alpha$-D-glucopiranosa para formar **glucosa-6-fosfato (G6P)** ($\Delta G^{\circ\prime} = -16.7\text{ kJ/mol}$).
2. **Paso 2 — Fosfoglucosa Isomerasa (EC 5.3.1.9):** Isomerización aldosa-cetosa vía intermediario *cis*-enediolato, abriendo el anillo piranósico de G6P y ciclando hacia el anillo furanósico de **fructosa-6-fosfato (F6P)**.
3. **Paso 3 — Fosfofructoquinasa-1 / PFK-1 (EC 2.7.1.11):** Segunda fosforilación dependiente de $\text{ATP}$ sobre el $\text{C1-OH}$ de F6P para sintetizar **fructosa-1,6-bisfosfato (F1,6BP)** (principal punto de control alostérico de la vía).
4. **Paso 4 — Fructosa-bisfosfato Aldolasa (EC 4.1.2.13):** Condensación aldólica inversa (ruptura de enlace $\text{C3}-\text{C4}$) que escinde la hexosa F1,6BP en dos triosas fosfato: **dihidroxiacetona fosfato (DHAP, cetosa)** y **gliceraldehído-3-fosfato (G3P, aldosa)**.
5. **Paso 5 — Triosa Fosfato Isomerasa / TIM (EC 5.3.1.1):** Interconversión rápida entre la cetosa DHAP y la aldosa **G3P**, convergiendo ambas moléculas de 3 carbonos en la fase de beneficio energético.
6. **Paso 6 — Gliceraldehído-3-fosfato Deshidrogenasa / GAPDH (EC 1.2.1.12):** Oxidación del grupo aldehído en $\text{C1}$ mediante un residuo de cisteína catalítica (intermediario tiohemiacetal y tioéster), acoplada a la reducción de $\text{NAD}^+ \to \text{NADH} + \text{H}^+$ y ataque de ortofosfato inorgánico ($\text{P}_i$) para formar el anhídrido mixto de alta energía **1,3-bisfosfoglicerato (1,3-BPG)**.
7. **Paso 7 — Fosfoglicerato Quinasa (EC 2.7.2.3):** Primera **fosforilación a nivel de sustrato**: transferencia del grupo acil-fosfato desde $\text{C1}$ del 1,3-BPG hacia el $\text{ADP}$ para sintetizar $\text{ATP}$ y **3-fosfoglicerato (3-PG)**.
8. **Paso 8 — Fosfoglicerato Mutasa (EC 5.4.2.11):** Reordenamiento intramolecular del grupo funcional fosfato desde la posición $\text{C3}$ hacia $\text{C2}$ (vía intermediario 2,3-BPG) formando **2-fosfoglicerato (2-PG)**.
9. **Paso 9 — Enolasa (EC 4.2.1.11):** Deshidratación catalítica ($\beta$-eliminación de una molécula de $\text{H}_2\text{O}$) del 2-PG para generar el doble enlace enólico y elevar el potencial de transferencia de grupo en el **fosfoenolpiruvato (PEP)**.
10. **Paso 10 — Piruvato Quinasa (EC 2.7.1.40):** Segunda **fosforilación a nivel de sustrato**: transferencia del grupo fosforilo desde el PEP al $\text{ADP}$ generando $\text{ATP}$ y enolpiruvato, el cual tautomeriza espontáneamente hacia la forma ceto más estable: **piruvato** ($\Delta G^{\circ\prime} = -31.4\text{ kJ/mol}$).

### Módulo III: Complejo Multienzimático Piruvato Deshidrogenasa (PDH)
Un único escenario acoplado de **5 etapas catalíticas secuenciales** con conservación de productos en el Reservorio de Metabolitos:
- **Etapa 1 — Descarboxilación en E1 (Piruvato Deshidrogenasa, EC 1.2.4.1):** El carbanión del anillo tiazolio del **pirofosfato de tiamina ($\text{TPP}$)** realiza un ataque nucleofílico sobre el carbono carbonílico ($\text{C2}$) del piruvato, liberando el grupo carboxilo ($\text{C1}$) como **$\text{CO}_2 / \text{HCO}_3^-$** (primer producto final reservado) y formando el intermediario covalente **hidroxietil-TPP**.
- **Etapa 2 — Oxidación y Transferencia al Brazo de Lipoamida (E1 $\to$ E2):** El grupo hidroxietilo se oxida a grupo acetilo mientras reduce el puente disulfuro ($-\text{S}-\text{S}-$) del grupo prostético **lipoamida** unido a la lisina de E2, generando el tioéster **acetil-dihidrolipoamida** y regenerando el $\text{TPP}$ libre.
- **Etapa 3 — Transesterificación en E2 (Dihidrolipoil Transacetilasa, EC 2.3.1.12):** El grupo tiol libre ($-\text{SH}$) de la **Coenzima A ($\text{CoA-SH}$)** ataca el carbono carbonílico de la acetil-dihidrolipoamida, liberando **$\text{Acetil-CoA}$** (segundo gran producto final reservado, con enlace tioéster de alta energía) y dejando el brazo prostético como **dihidrolipoamida reducida ($-\text{SH} / -\text{SH}$)**.
- **Etapa 4 — Reoxidación del Puente Disulfuro en E3 (Dihidrolipoil Deshidrogenasa, EC 1.8.1.4):** La enzima E3 oxida los dos grupos tiol de la dihidrolipoamida de vuelta a su forma activa oxidada (disulfuro cíclico), transfiriendo los dos átomos de hidrógeno a su cofactor prostético flavínico para formar **$\text{FADH}_2$**.
- **Etapa 5 — Transferencia Electrónica Final a $\text{NAD}^+$ (E3):** El $\text{FADH}_2$ unido a E3 transfiere un ion hidruro ($:\text{H}^-$) al cofactor móvil **$\text{NAD}^+$** y libera un protón al medio, generando **$\text{NADH} + \text{H}^+$** (tercer producto final reservado) y dejando al complejo multienzimático regenerado para un nuevo ciclo catalítico.