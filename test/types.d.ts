/**
 * `bun:test` is provided by the Bun runtime, not by a package in
 * node_modules, so the TypeScript project has nothing to resolve. The test
 * files sit outside `tsconfig.json`'s include path and are never part of the
 * build; this declaration only keeps an editor from reporting a missing module.
 */
declare module "bun:test" {
  export const describe: (name: string, fn: () => void) => void;
  export const test: (name: string, fn: () => void | Promise<void>) => void;
  export const expect: (actual: unknown) => {
    toContain: (expected: string) => void;
    toBeGreaterThan: (expected: number) => void;
    not: { toContain: (expected: string) => void };
  };
}
