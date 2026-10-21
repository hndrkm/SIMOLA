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


## 5. Diseño de Mundos y Misiones Progresivas (Etapa 5)

El catálogo de misiones (`src/data/missions/progressionMissions.ts`) se organiza en 3 Mundos seleccionables desde `HomeView`:

### Mundo 1: Entrenamiento Químico (Fundamentos)
1. **Misión 1.1 - El Octeto y Enlaces Múltiples (Eteno):**
   - *Tablero inicial:* Vacío.
   - *Objetivo:* Construir Eteno ($\text{C}_2\text{H}_4$, SMILES: `C=C`). Enseña cómo el doble enlace satisface la valencia 4 del carbono.
2. **Misión 1.2 - Isomería Constitucional (De Éter a Alcohol):**
   - *Tablero inicial:* Dimetil Éter (`C-O-C`) pre-cargado y desbloqueado.
   - *Objetivo:* Romper y reconectar enlaces para transformarlo en su isómero **Etanol** ($\text{C}_2\text{H}_6\text{O}$, SMILES: `CCO`).
3. **Misión 1.3 - Grupos Bioquímicos de Alta Energía (Fosforilación Básica):**
   - *Tablero inicial:* Cadena de 3 carbonos con un hidroxilo terminal (1-Propanol).
   - *Objetivo:* Acoplar un grupo fosfato para formar un éster fosfórico (`CCCO[P](=O)(O)O`).

### Mundo 2: Ruta de la Glucólisis (Fases Clave con Esqueleto Bloqueado)
1. **Misión 2.1 - Paso 1: Hexoquinasa (Inversión de Energía):**
   - *Contexto Enzimático:* La Hexoquinasa transfiere el grupo $\gamma$-fosfato del $\text{ATP}$ al Carbono 6 de la Glucosa para atraparla dentro de la célula.
   - *Tablero inicial:* Esqueleto de $\alpha$-D-Glucopiranosa con el anillo piranósico bloqueado (`isLocked: true`) y el grupo $-\text{CH}_2\text{OH}$ del Carbono 6 libre para reaccionar.
   - *Cofactor activo:* $\text{ATP} \to \text{ADP}$.
   - *Objetivo:* Acoplar el grupo fosfato al oxígeno del Carbono 6 para formar **Glucosa-6-fosfato**.
2. **Misión 2.2 - Paso 6: GAPDH (Oxidación y Enlace Acil-Fosfato):**
   - *Contexto Enzimático:* La Gliceraldehído-3-fosfato deshidrogenasa oxida el aldehído del G3P utilizando $\text{NAD}^+$ e incorpora un fosfato inorgánico ($\text{P}_i$) creando un enlace anhídrido mixto de alta energía.
   - *Tablero inicial:* Esqueleto de **Gliceraldehído-3-fosfato (G3P)** (`O=CC(O)COP(=O)(O)O`) con los carbonos 2 y 3 bloqueados.
   - *Objetivo:* Incorporar el grupo fosfato en el Carbono 1 carbonílico para obtener **1,3-Bisfosfoglicerato (1,3-BPG)**.
3. **Misión 2.3 - Paso 10: Piruvato Quinasa (Cosecha de ATP):**
   - *Contexto Enzimático:* Transferencia del grupo fosfato desde el Fosfoenolpiruvato (PEP) al $\text{ADP}$ y tautomerización ceto-enol hacia **Piruvato**.
   - *Tablero inicial:* Esqueleto de 3 carbonos del PEP.
   - *Objetivo:* Desfosforilar el oxígeno central y formar el grupo cetona ($\text{C=O}$) en C2 junto al carboxilato en C1 para obtener **Piruvato** (`CC(=O)C(=O)O` o `CC(=O)C(=O)[O-]`).

### Mundo 3: Complejo Piruvato Deshidrogenasa (El Puente Mitocondrial)
1. **Misión 3.1 - Descarboxilación y Tioéster de Alta Energía (Acetil-CoA):**
   - *Contexto Enzimático:* El complejo PDH (E1 + E2 + E3) libera el grupo carboxilo del Piruvato como $\text{CO}_2$ y acopla el fragmento acetilo restante (`CH3-C(=O)-`) al grupo tiol de la **Coenzima A (`-S-CoA`)**.
   - *Tablero inicial:* Esqueleto de Piruvato (con el carbono carboxílico desbloqueado para que el jugador lo escinda) + cofactor `-S-CoA`.
   - *Objetivo:* Eliminar el grupo carboxilo y formar el enlace tioéster del **Acetil-CoA** (`CC(=O)S...`).