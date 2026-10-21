import initRDKitModule, { MainModule, Mol } from '@rdkit/rdkit';

export type RDKitInstance = MainModule;
export type { Mol };

let rdkitPromise: Promise<MainModule> | null = null;
let rdkitInstance: MainModule | null = null;

/**
 * Cargador asíncrono singleton para el módulo WebAssembly de RDKit.js.
 * Configura la localización del archivo RDKit_minimal.wasm para funcionar
 * transparentemente tanto en Vite local, GitHub Pages (con BASE_URL) y Node.js.
 */
export async function getRDKit(): Promise<MainModule> {
  if (rdkitInstance) {
    return rdkitInstance;
  }

  if (!rdkitPromise) {
    rdkitPromise = (async () => {
      const isBrowser = typeof window !== 'undefined';
      let locateFile: ((path: string) => string) | undefined;

      if (isBrowser) {
        const baseUrl =
          typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL
            ? import.meta.env.BASE_URL
            : '/';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const wasmUrl = `${cleanBase}RDKit_minimal.wasm`;

        locateFile = (path: string) => {
          if (path.endsWith('.wasm')) {
            return wasmUrl;
          }
          return path;
        };
      }

      const instance = await initRDKitModule(locateFile ? { locateFile } : undefined);
      rdkitInstance = instance;
      return instance;
    })();
  }

  return rdkitPromise;
}
