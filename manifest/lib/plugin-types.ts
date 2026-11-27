/**
 * Types of the analyzer plugin hooks that the Vaadin plugins use. The analyzer
 * types its manifest with schema 1.0.0, but writes the fields of schema 2.1.0,
 * such as `readonly` and `deprecated`.
 */
import type { AnalyzePhaseParams as AnalyzerAnalyzePhaseParams } from '@custom-elements-manifest/analyzer';
import type { JavaScriptModule, Package } from 'custom-elements-manifest';

export interface AnalyzePhaseParams extends Pick<AnalyzerAnalyzePhaseParams, 'node' | 'ts'> {
  moduleDoc: Partial<JavaScriptModule>;
}

export interface ModuleLinkPhaseParams {
  moduleDoc: JavaScriptModule;
}

export interface PackageLinkPhaseParams {
  customElementsManifest: Package;
}

export interface Plugin {
  name: string;
  analyzePhase?(params: AnalyzePhaseParams): void;
  moduleLinkPhase?(params: ModuleLinkPhaseParams): void;
  packageLinkPhase?(params: PackageLinkPhaseParams): void;
}
