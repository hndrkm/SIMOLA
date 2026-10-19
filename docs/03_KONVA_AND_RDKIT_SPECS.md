# 03 - Especificación Técnica: Motor Gráfico (React-Konva) y Adaptador RDKit.js

## 1. Reglas de Renderizado y Geometría en `react-konva`

### 1.1 Jerarquía de Capas
Dentro de `<Stage>`, mantener exactamente 2 `<Layer>`:
1. **Capa Base (Fondo):** Dibuja la cuadrícula de referencia (no interactiva, `listening={false}`).
2. **Capa Molecular (Interactiva):**
   - Primero renderiza todos los `<BondShape />` (para que queden por debajo de los átomos).
   - Luego renderiza la línea guía temporal (si el usuario está arrastrando para crear un enlace).
   - Finalmente renderiza todos los `<AtomShape />` (encima de los extremos de las líneas).

### 1.2 Geometría de Enlaces Múltiples y Hitbox (`BondShape.tsx`)
Dado un enlace entre `AtomA (x1, y1)` y `AtomB (x2, y2)`:
- Calcular el vector dirección `dx = x2 - x1`, `dy = y2 - y1` y su longitud `L = Math.hypot(dx, dy)`.
- Calcular el vector normal unitario perpendicular: `nx = -dy / L`, `ny = dx / L`.
- **Área de clic invisible:** Renderizar siempre una `<Line>` transparente con `strokeWidth={4}` y `hitStrokeWidth={22}` entre `(x1, y1)` y `(x2, y2)` que capture los eventos `onClick` y `onMouseEnter`.
- **Renderizado visual (`listening={false}`):**
  - `order === 1`: Una línea central de `(x1, y1)` a `(x2, y2)`.
  - `order === 2`: Dos líneas paralelas desplazadas por `offset = 4px` usando `(nx * offset, ny * offset)` y `(-nx * offset, -ny * offset)`.
  - `order === 3`: Una línea central más dos líneas paralelas desplazadas por `offset = 6px`.

### 1.3 Matemática de Ángulos de Brote (Algoritmo KingDraw en `geometry.ts`)
Cuando el usuario hace clic simple en un `AtomNode` con la herramienta `bond` (`sproutFromAtom`):
1. Obtener todos los átomos vecinos ya conectados a `sourceAtom` y calcular sus ángulos en radianes `theta_i = Math.atan2(n.y - source.y, n.x - source.x)`.
2. **Caso 0 vecinos (átomo aislado):** Brotar a `-30°` (`-Math.PI / 6`).
3. **Caso 1 vecino (`theta_1`):** Para formar el zigzag característico de química orgánica (ángulos de 120°), comparar hacia dónde va la cadena y elegir `theta_new = theta_1 + (2 * Math.PI / 3)` o `theta_1 - (2 * Math.PI / 3)` alternando según la orientación horizontal/vertical para que la cadena avance en lugar de cerrarse sobre sí misma.
4. **Caso 2 vecinos (`theta_1`, `theta_2`):** Calcular el vector bisectriz opuesto a los dos enlaces existentes para que el tercer enlace salga por el espacio más abierto (geometría trigonal plana de 120°).
5. **Caso >= 3 vecinos:** Encontrar la brecha angular más grande entre vecinos consecutivos ordenados por ángulo y colocar el nuevo enlace exactamente en la mitad de esa brecha (`bisector`).

### 1.4 Generador Paramétrico de Polígonos ($n = 3 \dots 8$) en `geometry.ts`
Para generar cualquier anillo de `N` lados (`3 <= N <= 8`) donde cada lado mida exactamente `BOND_LENGTH = 60`:
1. **En espacio vacío:** El circunradio $R$ desde el centro del polígono hasta cada vértice se calcula mediante la fórmula exacta:
   $$R = \frac{\text{BOND\_LENGTH}}{2 \cdot \sin(\pi / N)}$$
   Los vértices se ubican en $\theta_k = -\frac{\pi}{2} + \frac{2\pi k}{N}$ para $k = 0 \dots N-1$.
2. **En Fusión sobre Enlace Existente (`fuseRingOnBond` para $N=3..8$):**
   Dados dos átomos existentes $A(x_1, y_1)$ y $B(x_2, y_2)$, el ángulo interior de un polígono regular de $N$ lados es $\alpha = \frac{(N - 2)\pi}{N}$. A partir del segmento $AB$, se rotan los siguientes $N-2$ segmentos en pasos de $\pi - \alpha = \frac{2\pi}{N}$ hacia el semiplano con menor densidad de átomos existentes.
3. **Asignación de Dobles Enlaces:**
   - `saturated`: todas las aristas con `order = 1`.
   - `one_double`: la primera arista libre recibe `order = 2`, el resto `order = 1`.
   - `conjugated`: alterna `order = 2` y `order = 1` en las aristas del anillo (`k % 2 === 0 ? 2 : 1`), cuidando de no exceder la valencia máxima de los átomos compartidos durante una fusión.

### 3.1 Soporte de Cargas Formales (`M  CHG`) e Isótopos (`M  ISO`) en `graphToMol.ts`
Antes de la línea `M  END` del archivo MOL V2000:
- Si existen átomos con `formalCharge !== 0`, emitir líneas `M  CHG` siguiendo el estándar CTAB V2000 (permitiendo que RDKit valide correctamente grupos fosfato $-\text{PO}_3^{2-}$, carboxilatos $-\text{COO}^-$ y cofactores como $\text{NAD}^+$).
- Si existen átomos con `isotope !== undefined`, emitir líneas `M  ISO` con el índice base-1 del átomo y su número másico (ej. `14` para $^{14}\text{C}$).
---

## 2. Especificación del Validador Local (Capa 1 - `localValidator.ts`)

### 2.1 Tabla de Valencias Estándar
Para cada `AtomNode`, la suma de `edge.order` de todas las aristas conectadas a él representa sus enlaces explícitos (`bondOrderSum`).
- Valencias máximas permitidas en el sandbox base:
  - `H`: 1
  - `O`: 2 (o 3 si `formalCharge === 1`, 1 si `formalCharge === -1`)
  - `N`: 3 (o 4 si `formalCharge === 1`)
  - `C`: 4
  - `P`: 5
  - `S`: 6
- Si `bondOrderSum > maxValence`, generar un `ValidationIssue` con código `VALENCE_EXCEEDED`, incluyendo el `atom.id` en `affectedAtomIds` y el mensaje: `"El átomo de [Elemento] tiene [bondOrderSum] enlaces, pero su valencia máxima permitida es [maxValence]."`.

### 2.2 Verificación de Grafo Conexo
Si `mission.winConditions.mustBeConnected === true` y hay más de 1 nodo:
- Ejecutar una búsqueda en anchura (BFS) empezando desde el primer nodo del diccionario.
- Si el conjunto de nodos visitados es menor al total de nodos en `graph.nodes`, devolver `DISCONNECTED_GRAPH` indicando que todas las partes deben formar una única molécula conectada.

---

## 3. Especificación del Adaptador `graphToMol.ts` (MOL V2000)

RDKit requiere formato CTAB V2000 con columnas de ancho fijo.
1. Crear un arreglo ordenado `atomList = Object.values(graph.nodes)` y un mapa `idToIndex` donde cada `atom.id` se asocia a su índice base 1 (`1` hasta `N`).
2. Escalar coordenadas de píxeles a Ångströms aproximados para evitar desbordamientos en el bloque MOL:
   - `molX = (atom.x - centerX) / 50`
   - `molY = -(atom.y - centerY) / 50` (invertir eje Y porque en Canvas crece hacia abajo y en química crece hacia arriba).
3. Formatear la línea de conteo (Línea 4 del archivo MOL):
   - `padStart(3, ' ')` para número de átomos y número de enlaces: `${numAtoms}${numBonds}  0  0  0  0  0  0  0  0999 V2000`
4. Por cada átomo en `atomList`, generar una línea de átomo:
   - Coordenadas `X`, `Y`, `Z` con `toFixed(4).padStart(10, ' ')`, seguidas de `' ' + atom.element.padEnd(3, ' ') + ' 0  0  0  0  0  0  0  0  0  0  0  0'`.
5. Por cada arista en `Object.values(graph.edges)`, generar una línea de enlace:
   - `${idxA.padStart(3, ' ')}${idxB.padStart(3, ' ')}${order.padStart(3, ' ')}  0  0  0  0`.
6. Cerrar el bloque con `M  END`.
7. Importante en memoria de WebAssembly: todo objeto `mol` o `qmol` instanciado con `RDKit.get_mol()` o `RDKit.get_qmol()` **debe liberarse** llamando a `mol.delete()` dentro de un bloque `finally` tras extraer los descriptores.