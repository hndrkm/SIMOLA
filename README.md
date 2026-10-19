<div align="center">

# ⚗️ SIMOLA
### *Interactive Molecular & Metabolic Sandbox*

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-00A896?style=for-the-badge&logo=github)](https://hndrkm.github.io/SIMOLA/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F77F00?style=for-the-badge)](LICENSE)

<br />

> **SIMOLA** es un sandbox molecular 2D y videojuego pedagógico de rutas metabólicas diseñado para transformar el aprendizaje de la bioquímica universitaria. Integra la ergonomía de dibujo químico profesional (estilo KingDraw / ChemDraw) con validación estricta de grafos moleculares y una estética científica de vanguardia.

👉 **[Probar la Demo en Vivo](https://hndrkm.github.io/SIMOLA/)**

---

</div>

## 🌟 Funcionalidades de esta Demo (Release v0.2.0)

### 1. 📐 Ergonomía de Dibujo Químico Profesional
- **Auto-Sprouting a 120°:** Haz clic en cualquier átomo con la herramienta de enlace para brotar automáticamente nuevos enlaces en patrón zigzag canónico.
- **Angle Snapping Magnético a 30°:** Arrastre de enlaces asistido con imán angular cada $\pi/6$ ($30^\circ$) y atracción magnética hacia átomos cercanos ($28\text{ px}$).
- **Longitud Canónica Fija:** Todos los enlaces y plantillas se generan exactamente a $60\text{ px}$ para preservar una geometría molecular limpia y proporcionada.
- **Ciclo Rápido de Enlaces:** Clic sobre un enlace existente para alternar dinámicamente entre enlace simple, doble y triple (`1 -> 2 -> 3 -> 1`).

### 2. ⚛️ Tabla Periódica Completa (118 Elementos) e Isótopos
- **Catálogo IUPAC Integral:** Acceso a los 118 elementos organizados por familias químicas (no metales, gases nobles, metales alcalinos, transición, actínidos, etc.).
- **Colores CPK Oficiales:** Renderizado atómico de alto contraste con códigos de color de la convención CPK.
- **Selector de Isótopos:** Soporte para isótopos de marcado metabólico clave ($^{13}\text{C}$, $^{14}\text{C}$, $^{2}\text{H}$, $^{32}\text{P}$, $^{15}\text{N}$, $^{18}\text{O}$).
- **Barra de Acceso Rápido:** Memoria de los 5 elementos más usados recientemente.

### 3. 🔄 Generador Paramétrico de Anillos (3 a 8 miembros)
- **Anillos Saturados:** Ciclopropano ($N=3$), Ciclobutano ($N=4$), Ciclopentano ($N=5$), Ciclohexano ($N=6$), Cicloheptano ($N=7$) y Ciclooctano ($N=8$).
- **Anillos Conjugados y Aromáticos:** Benceno / Anillo bencénico con dobles enlaces conjugados y cicloalquenos.
- **Heterociclos de Azúcar:** Piranosa (anillo oxano de 6 miembros) y Furanosa (anillo oxolano de 5 miembros).
- **Estampado Dual:** Estampa anillos en el vacío del lienzo, o haz clic en un átomo para acoplar el anillo directamente a una cadena existente.

### 4. 🧬 Biblioteca de Biomoléculas, Grupos Funcionales y Coenzimas
- **Grupos Funcionales Clave:** Fosfato ($-\text{PO}_3\text{H}_2$), Hidroxilo ($-\text{OH}$), Carboxilo ($-\text{COOH}$), Amino ($-\text{NH}_2$), Tiol / Sulfhidrilo ($-\text{SH}$) y Acetilo ($-\text{COCH}_3$).
- **Coenzimas Metabólicas:** Coenzima A ($-\text{S-CoA}$) y Lipoamida.
- **Esqueletos Base:** D-Glucopiranosa, D-Fructofuranosa, Piruvato y Gliceraldehído-3-Fosfato (G3P).

### 5. 🎨 Identidad Visual y Experiencia de Usuario
- **Paleta Oficial SIMOLA:**
  - 🔵 **Deep Navy Blue** (`#1B2A4A`): Fondos estructurales, TopBar y HomeView.
  - 🟢 **Vibrant Catalytic Teal** (`#00A896`): Herramientas activas, estados de éxito y botón *Verificar Reacción*.
  - 🟠 **Energetic Phosphate Amber** (`#F77F00`): Botones de acción CTA, cofactores ATP/NAD+ y pistas interactivas.
- **Pantalla de Inicio (HomeView):** Acceso inmediato al *Laboratorio Libre (Sandbox)* y previsualización de rutas metabólicas (*Entrenamiento Químico*, *Glucólisis* y *Complejo PDH*).
- **Herramientas de Pizarra:** Flechas de reacción orientables y etiquetas de texto explicativas.

---

## 🛠️ Pila Tecnológica

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework UI** | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) | Renderizado reactivo, modularidad y build ultrarrápido |
| **Lenguaje** | [TypeScript 5](https://www.typescriptlang.org/) | Tipado estricto, integridad matemática de grafos y cero `any` |
| **Motor Gráfico 2D** | [Konva](https://konvajs.org/) / [React-Konva](https://github.com/konvajs/react-konva) | Lienzo Canvas HTML5 a 60 FPS con arquitectura multicapa |
| **Gestor de Estado** | [Zustand](https://zustand-demo.pmnd.rs/) | Store desacoplado (`useCanvasStore` para el grafo, `useGameStore` para navegación) |
| **Estilos & UI** | [Tailwind CSS 3](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/) | Diseño responsive, modo oscuro y tokens de marca |
| **Quimioinformática** | [RDKit.js](https://github.com/rdkit/rdkit-js) *(Próxima etapa)* | Validación estricta con WebAssembly y cálculo de descriptores químicos |
| **CI / CD** | GitHub Actions | Despliegue continuo automatizado en GitHub Pages |

---

## 🚀 Instalación y Ejecución Local

Para clonar y ejecutar **SIMOLA** en tu entorno de desarrollo local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/hndrkm/SIMOLA.git
cd SIMOLA

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo Vite
npm run dev

# 4. Compilar para producción (validación de tipos y bundle optimizado)
npm run build

# 5. Vista previa del build de producción
npm run preview
```

El servidor local se iniciará automáticamente en `http://localhost:3000/`.

---

## 🗺️ Hoja de Ruta (Roadmap)

- [x] **Etapa 1:** Modelo interno desacoplado en TypeScript puro y Store en Zustand ($O(1)$, historial Undo/Redo, inmutabilidad).
- [x] **Etapa 2:** Editor Molecular 2D completo en React-Konva, ergonomía KingDraw (120° / 30° / 60px), Tabla Periódica, Anillos paramétricos, Biblioteca de Grupos/Coenzimas, HomeView y CI/CD en GitHub Pages.
- [ ] **Etapa 3:** Validador Local de Química (Capa 1) con detección de valencias imposibles y conectividad BFS.
- [ ] **Etapa 4:** Integración de RDKit.js WebAssembly (Capa 2) con exportación a formato CTAB MOL V2000 y descriptores SMARTS.
- [ ] **Etapa 5:** Modo Misiones y Puzles Metabólicos (Ruta de la Glucólisis y Complejo PDH con cofactores reactivos).

---

## 📄 Licencia

Este proyecto se encuentra bajo la Licencia [MIT](LICENSE).
