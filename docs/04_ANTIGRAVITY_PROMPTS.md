# 04 - Plan de Ejecución Incremental para el Agente (Antigravity)

## Protocolo Obligatorio de Trabajo por Etapa (Ciclo de Ingeniería)
Para cada una de las 5 etapas, debes cumplir estrictamente este ciclo antes de pasar a la siguiente:
1. **Marcar Inicio:** Cambia el estado de la etapa a `[~] En curso` en `docs/05_TASK_HISTORY.md`.
2. **Implementar:** Escribe el código siguiendo las especificaciones de `01_PRODUCT_SPEC.md`, `02_ARCHITECTURE_AND_TYPES.md` y `03_KONVA_AND_RDKIT_SPECS.md`.
3. **Verificación de Tipos:** Ejecuta `tsc --noEmit` (o el verificador del proyecto) y corrige cualquier error de TypeScript.
4. **Ejecutar Auditoría:** Revisa cada punto aplicable en `docs/06_ARCHITECTURE_AUDIT.md` y actualiza la tabla de la Sección 5 de dicho documento.
5. **Actualizar Historial:** Marca las casillas `[x]` completadas y añade una entrada detallada en la **Bitácora de Ejecución (Changelog)** dentro de `docs/05_TASK_HISTORY.md`.

---

### Etapa 1: Modelo Interno y Store en Zustand (Módulo 2)
**Objetivo:** Implementar la estructura base del proyecto, tipos y gestión del grafo en memoria.
**Tareas:** Ver `T1.1` a `T1.5` en `05_TASK_HISTORY.md`.
**Criterio de Cierre:** Pasar las auditorías `A1` y `A2` en `06_ARCHITECTURE_AUDIT.md` y registrar en el Changelog.

### Etapa 2: Editor Molecular 2D en React-Konva (Módulo 1)
**Objetivo:** Construir la pizarra interactiva conectada a `useCanvasStore`.
**Tareas:** Ver `T2.1` a `T2.4` en `05_TASK_HISTORY.md`.
**Criterio de Cierre:** Pasar las auditorías `A1`, `A2` y `A3` en `06_ARCHITECTURE_AUDIT.md` y registrar en el Changelog.

### Etapa 3: Validador Local y Retroalimentación de Capa 1 (Módulo 4 - Parte A)
**Objetivo:** Detectar errores de valencia e islas desconectadas e iluminar átomos erróneos en pantalla sin depender aún de WebAssembly.
**Tareas:** Ver `T3.1` a `T3.3` en `05_TASK_HISTORY.md`.
**Criterio de Cierre:** Verificar que un átomo con exceso de enlaces se ilumina en rojo en el lienzo y actualizar `05` y `06`.

### Etapa 4: Adaptador RDKit.js y Descriptores Químicos (Módulo 3 y Módulo 4 - Parte B)
**Objetivo:** Integrar `@rdkit/rdkit` vía WebAssembly y traducir el grafo a moléculas reales.
**Tareas:** Ver `T4.1` a `T4.3` en `05_TASK_HISTORY.md`.
**Criterio de Cierre:** Pasar la auditoría `A4` (especialmente liberación de memoria `.delete()` y formato V2000) en `06_ARCHITECTURE_AUDIT.md` y actualizar `05`.

### Etapa 5: Sistema de Misiones Progresivas (Módulo 5)
**Objetivo:** Implementar el bucle completo de juego con las 5 misiones iniciales.
**Tareas:** Ver `T5.1` a `T5.3` en `05_TASK_HISTORY.md`.
**Criterio de Cierre:** Auditoría completa (`A1` a `A4`) aprobada en `06_ARCHITECTURE_AUDIT.md` y cierre de bitácora en `05_TASK_HISTORY.md`.