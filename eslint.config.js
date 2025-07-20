import * as tseslint from "typescript-eslint";
import * as eslint from "typescript-eslint";

export default tseslint.config(
    {ignores: ['dist']},
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        rules: {
            '@/semi': ['error', 'always']
        }
    }
);