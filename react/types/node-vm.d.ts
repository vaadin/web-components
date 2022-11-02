// TODO: remove once @types/node supports --experimental-vm-modules types
declare module 'node:vm' {
  class Module {
    protected constructor();
    status: 'unlinked' | 'linking' | 'linked' | 'evaluating' | 'evaluated' | 'errored';
    dependencySpecifiers: string[];
    error: any;
    evaluate(
      options?: {timeout?: number, breakOnSigint?: boolean},
    ): Promise<void>;
    identifier: string;
    link(
      linker: (specifier: string, referencingModule: Module) => Module | Promise<Module>
    ): Promise<void>;
    namespace: object
  }

  class SourceTextModule extends Module {
    constructor(
      code: string,
      options?: {
        identifier?: string,
        cachedData?: Buffer | Uint8Array | DataView,
        context?: object,
        lineOffset?: number,
        columnOffset?: number,
        initializeImportMeta?: (meta: {url: string}, module: SourceTextModule) => void,
        importModuleDynamically?: (specifier: string, module: Module) => Module, 
      },
    );
    createCachedData(): Buffer;
  }

  class SyntheticModule extends Module {
    constructor(
      exportNames: string[],
      evaluateCallback: (this: SyntheticModule) => void,
      options?: {
        identifier?: string,
        context?: object,
      },
    );
    setExport(name: string, value: any): void;
  }
}