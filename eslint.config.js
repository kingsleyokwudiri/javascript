import js from "@eslint/js";
import globals from "globals";

export default [
  {
    // Generated, vendored, and installed files are not ours to lint.
    ignores: [
      "node_modules/**",
      "coverage/**",
      "**/dayjs.min.js",
      "Mini_Projects/amazon/scripts/utils/dayjs.js",
      "Mini_Projects/amazon/tests-jasmine/lib/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Allow intentionally unused args/vars when prefixed with an underscore.
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Jasmine specs run with Jasmine's globals (describe, it, expect, ...).
    files: ["Mini_Projects/amazon/tests-jasmine/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jasmine,
      },
    },
  },
];
