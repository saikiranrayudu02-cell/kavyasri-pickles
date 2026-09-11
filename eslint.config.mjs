import { createRequire } from "node:module";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Compatibility shim for ESLint 10 with plugins (e.g. eslint-plugin-react) expecting context.getFilename()
try {
  const require = createRequire(import.meta.url);
  const fileContextPath = require
    .resolve("eslint/package.json")
    .replace("package.json", "lib/linter/file-context.js");
  const { FileContext } = require(fileContextPath);
  if (FileContext && FileContext.prototype) {
    if (!FileContext.prototype.getFilename) {
      FileContext.prototype.getFilename = function () {
        return this.filename;
      };
    }
    if (!FileContext.prototype.getCwd) {
      FileContext.prototype.getCwd = function () {
        return this.cwd;
      };
    }
    if (!FileContext.prototype.getSourceCode) {
      FileContext.prototype.getSourceCode = function () {
        return this.sourceCode;
      };
    }
    if (!FileContext.prototype.getPhysicalFilename) {
      FileContext.prototype.getPhysicalFilename = function () {
        return this.physicalFilename;
      };
    }
  }
} catch {
  // Ignore if already patched or path changes in future versions
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
