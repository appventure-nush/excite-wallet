import tsEslint from "typescript-eslint"
import eslint from "@eslint/js"

export default tsEslint.config(
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    {
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-namespace": [
                "error",
                {
                    allowDeclarations: true,
                    allowDefinitionFiles: true,
                },
            ],
        },
        files: ["**/*.ts", "**/*.tsx"],
    },
    {
        ignores: ["node_modules/*", "dist/*", "*.config.ts"],
    },
)
