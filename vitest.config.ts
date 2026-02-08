/// <reference types="@testing-library/jest-dom" />
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: `jsdom`,
            setupFiles: `./vitest.setup.ts`,
            globals: true,
            pool: `threads`,
            coverage: {
                provider: `v8`,
                reporter: [`text`, `json`, `html`],
                exclude: [
                    `node_modules/`,
                    `dist/`,
                    `**/*.test.{ts,tsx}`,
                    `**/*.config.{ts,js}`,
                    `vitest.setup.ts`
                ]
            }
        }
    })
);
