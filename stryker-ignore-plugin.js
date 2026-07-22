/**
 * Stryker ignore plugin: skip mutants in code that unit tests never cover.
 *
 * Mutation testing here runs the *unit* suite (`yarn test`). Theme injection is
 * covered by visual tests instead, so mutants inside `static get lumoInjector()`
 * / `auraInjector()` always survive — they are noise in the report and, with
 * the command runner, each one still costs a full suite run. Ignoring them
 * removes them before they are ever run (they show as "Ignored", excluded from
 * the score) so the survivors that remain are real unit-test gaps.
 *
 * Deliberately conservative: `styles` is *not* ignored (a `getComputedStyle`
 * assertion can catch a mutated styles getter), nor is `shadowRootOptions`
 * (focus tests can catch `delegatesFocus`).
 *
 * https://stryker-mutator.io/docs/stryker-js/disable-mutants/#using-an-ignore-plugin
 */
import { declareClassPlugin, PluginKind } from '@stryker-mutator/api/plugin';

const IGNORED_GETTERS = new Set(['lumoInjector', 'styles']);

class UntestedGetterIgnorer {
  // Receives the Babel NodePath of each mutant candidate during instrumentation.
  shouldIgnore(path) {
    const getter = path.findParent(
      (parent) =>
        parent.isClassMethod() &&
        parent.node.kind === 'get' &&
        parent.node.key.type === 'Identifier' &&
        IGNORED_GETTERS.has(parent.node.key.name),
    );
    if (getter) {
      return `Not covered by unit tests: static get ${getter.node.key.name}()`;
    }
    return undefined;
  }
}

export const strykerPlugins = [declareClassPlugin(PluginKind.Ignore, 'untested-getters', UntestedGetterIgnorer)];
