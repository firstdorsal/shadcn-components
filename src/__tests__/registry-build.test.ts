import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface RegistryFile {
    path: string;
    target: string | null;
    content: string;
    type: string;
}

interface RegistryItem {
    name: string;
    files: RegistryFile[];
}

interface RegistryIndex {
    items: { name: string }[];
}

const REGISTRY_OUTPUT_DIR = join(process.cwd(), `public/r`);

describe(`Registry Build`, () => {
    beforeAll(() => {
        // Build the registry before running tests
        execSync(`pnpm build:registry`, { stdio: `pipe` });
    });

    it(`generates registry output files`, () => {
        expect(existsSync(join(REGISTRY_OUTPUT_DIR, `registry.json`))).toBe(true);
        expect(existsSync(join(REGISTRY_OUTPUT_DIR, `date-time-picker.json`))).toBe(true);
        expect(existsSync(join(REGISTRY_OUTPUT_DIR, `hotkey-input.json`))).toBe(true);
        expect(existsSync(join(REGISTRY_OUTPUT_DIR, `calendar.json`))).toBe(true);
    });

    it(`registry index contains all items`, () => {
        const registryIndex: RegistryIndex = JSON.parse(
            readFileSync(join(REGISTRY_OUTPUT_DIR, `registry.json`), `utf-8`)
        );

        const itemNames = registryIndex.items.map((item) => item.name);
        expect(itemNames).toContain(`date-time-picker`);
        expect(itemNames).toContain(`hotkey-input`);
        expect(itemNames).toContain(`calendar`);
    });

    describe(`date-time-picker registry item`, () => {
        let item: RegistryItem;

        beforeAll(() => {
            item = JSON.parse(
                readFileSync(join(REGISTRY_OUTPUT_DIR, `date-time-picker.json`), `utf-8`)
            );
        });

        it(`has all required files`, () => {
            const filePaths = item.files.map((f) => f.path);

            // Main components
            expect(filePaths).toContain(`src/components/ui/date-time-picker.tsx`);
            expect(filePaths).toContain(`src/components/ui/date-time-range-picker.tsx`);
            expect(filePaths).toContain(`src/components/ui/date-time-input.tsx`);
            expect(filePaths).toContain(`src/components/ui/time-picker.tsx`);
            expect(filePaths).toContain(`src/components/ui/timezone-selector.tsx`);
            expect(filePaths).toContain(`src/components/ui/calendar.tsx`);

            // Lib files
            expect(filePaths).toContain(`src/lib/date-time-utils.ts`);
            expect(filePaths).toContain(`src/lib/timezone-utils.ts`);

            // Hooks
            expect(filePaths).toContain(`src/hooks/use-date-time-picker.ts`);
            expect(filePaths).toContain(`src/hooks/use-date-time-range-picker.ts`);
        });

        it(`all files have non-null target paths`, () => {
            for (const file of item.files) {
                expect(file.target).not.toBeNull();
                expect(file.target).toBeDefined();
                expect(file.target?.length).toBeGreaterThan(0);
            }
        });

        it(`all files have correct target paths`, () => {
            const expectedTargets: Record<string, string> = {
                "src/components/ui/date-time-picker.tsx": `components/ui/date-time-picker.tsx`,
                "src/components/ui/date-time-range-picker.tsx": `components/ui/date-time-range-picker.tsx`,
                "src/components/ui/date-time-input.tsx": `components/ui/date-time-input.tsx`,
                "src/components/ui/time-picker.tsx": `components/ui/time-picker.tsx`,
                "src/components/ui/timezone-selector.tsx": `components/ui/timezone-selector.tsx`,
                "src/components/ui/calendar.tsx": `components/ui/calendar.tsx`,
                "src/lib/date-time-utils.ts": `lib/date-time-utils.ts`,
                "src/lib/timezone-utils.ts": `lib/timezone-utils.ts`,
                "src/hooks/use-date-time-picker.ts": `hooks/use-date-time-picker.ts`,
                "src/hooks/use-date-time-range-picker.ts": `hooks/use-date-time-range-picker.ts`,
            };

            for (const file of item.files) {
                const expectedTarget = expectedTargets[file.path];
                expect(file.target).toBe(expectedTarget);
            }
        });

        it(`all files have content`, () => {
            for (const file of item.files) {
                expect(file.content).toBeDefined();
                expect(file.content.length).toBeGreaterThan(0);
            }
        });

        it(`file imports use correct paths (not registry paths)`, () => {
            for (const file of item.files) {
                // Ensure no imports reference the old registry structure
                expect(file.content).not.toContain(`@/registry/`);

                // Verify imports use standard paths
                if (file.content.includes(`from "@/`)) {
                    const importMatches = file.content.match(/from\s+["']@\/[^"']+["']/g) || [];
                    for (const importMatch of importMatches) {
                        // All imports should be to standard locations
                        const validPrefixes = [
                            `@/components/`,
                            `@/lib/`,
                            `@/hooks/`,
                        ];
                        const hasValidPrefix = validPrefixes.some((prefix) =>
                            importMatch.includes(prefix)
                        );
                        expect(hasValidPrefix).toBe(true);
                    }
                }
            }
        });
    });

    describe(`hotkey-input registry item`, () => {
        let item: RegistryItem;

        beforeAll(() => {
            item = JSON.parse(
                readFileSync(join(REGISTRY_OUTPUT_DIR, `hotkey-input.json`), `utf-8`)
            );
        });

        it(`has correct file with target`, () => {
            expect(item.files).toHaveLength(1);
            expect(item.files[0].path).toBe(`src/components/ui/hotkey-input.tsx`);
            expect(item.files[0].target).toBe(`components/ui/hotkey-input.tsx`);
        });

        it(`file has content`, () => {
            expect(item.files[0].content).toBeDefined();
            expect(item.files[0].content.length).toBeGreaterThan(0);
        });
    });

    describe(`calendar registry item`, () => {
        let item: RegistryItem;

        beforeAll(() => {
            item = JSON.parse(
                readFileSync(join(REGISTRY_OUTPUT_DIR, `calendar.json`), `utf-8`)
            );
        });

        it(`has correct file with target`, () => {
            expect(item.files).toHaveLength(1);
            expect(item.files[0].path).toBe(`src/components/ui/calendar.tsx`);
            expect(item.files[0].target).toBe(`components/ui/calendar.tsx`);
        });

        it(`file has content`, () => {
            expect(item.files[0].content).toBeDefined();
            expect(item.files[0].content.length).toBeGreaterThan(0);
        });
    });
});
