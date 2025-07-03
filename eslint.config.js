const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const _import = require("eslint-plugin-import");
const jest = require("eslint-plugin-jest");

const {
    fixupPluginRules,
    fixupConfigRules,
} = require("@eslint/compat");

const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.eslint.json",
        },
    },

    plugins: {
        import: fixupPluginRules(_import),
    },

    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:jest/recommended",
        "plugin:prettier/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    )),

    rules: {
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-shadow": "error",

        "@typescript-eslint/no-unused-vars": ["error", {
            ignoreRestSiblings: true,
        }],

        "@typescript-eslint/no-var-requires": "off",
        curly: "error",
        eqeqeq: "error",
        "import/no-duplicates": "error",
        "import/no-named-as-default": 0,
        "import/no-named-as-default-member": 0,

        "import/order": ["error", {
            alphabetize: {
                caseInsensitive: false,
                order: "asc",
            },

            "newlines-between": "always",
        }],

        "jest/prefer-to-have-length": "error",
        "jest/valid-expect": "off",
        "linebreak-style": ["error", "unix"],
        "no-console": "warn",
        "no-prototype-builtins": "off",
        "no-return-await": "error",

        "no-unneeded-ternary": ["error", {
            defaultAssignment: false,
        }],

        "object-curly-spacing": ["error", "always"],
        "object-shorthand": ["error", "properties"],

        quotes: ["error", "single", {
            allowTemplateLiterals: false,
            avoidEscape: true,
        }],

        semi: ["error", "always"],

        "sort-imports": ["error", {
            allowSeparatedGroups: false,
            ignoreCase: false,
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
        }],
    },
}, globalIgnores([
    "dist/*",
    "coverage/*",
    "**/*.d.ts",
    "src/main/public/",
    "src/main/types/",
    "**/jest.*config.js",
    "**/.eslintrc.js",
    "src/test/*/codecept.conf.js",
    "src/test/config.ts",
    "**/*.js",
      ".yarn/",

])]);
