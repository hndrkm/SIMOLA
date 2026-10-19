import { ElementSymbol } from './types';
import { PERIODIC_TABLE, getElement } from './periodicTable';

/**
 * Colores CPK para todos los elementos químicos.
 */
export const CPK_COLORS: Record<ElementSymbol, string> = PERIODIC_TABLE.reduce(
  (acc, elem) => {
    acc[elem.symbol] = elem.cpkColor;
    return acc;
  },
  {} as Record<ElementSymbol, string>
);

/**
 * Color de texto adecuado para contraste sobre el fondo CPK de cada elemento.
 */
export const CPK_TEXT_COLORS: Record<ElementSymbol, string> = PERIODIC_TABLE.reduce(
  (acc, elem) => {
    acc[elem.symbol] = elem.textColor;
    return acc;
  },
  {} as Record<ElementSymbol, string>
);

/**
 * Nombres en español de los elementos químicos.
 */
export const ELEMENT_NAMES: Record<ElementSymbol, string> = PERIODIC_TABLE.reduce(
  (acc, elem) => {
    acc[elem.symbol] = elem.name;
    return acc;
  },
  {} as Record<ElementSymbol, string>
);

/**
 * Radio visual de renderizado en píxeles según el tamaño covalente del elemento.
 */
export const ATOM_RADII: Record<ElementSymbol, number> = PERIODIC_TABLE.reduce(
  (acc, elem) => {
    acc[elem.symbol] = elem.radius;
    return acc;
  },
  {} as Record<ElementSymbol, number>
);

/**
 * Calcula la valencia máxima permitida para un elemento considerando su carga formal.
 */
export function getMaxValence(element: ElementSymbol, formalCharge: number = 0): number {
  switch (element) {
    case 'H':
      return 1;
    case 'O':
      if (formalCharge === 1) return 3;
      if (formalCharge === -1) return 1;
      return 2;
    case 'N':
      if (formalCharge === 1) return 4;
      return 3;
    case 'C':
      return 4;
    case 'P':
      return 5;
    case 'S':
      return 6;
    default: {
      const data = getElement(element);
      if (data && data.allowedValences.length > 0) {
        return Math.max(...data.allowedValences);
      }
      return 4;
    }
  }
}

