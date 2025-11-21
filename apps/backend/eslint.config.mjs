import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const noCommentsRule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    messages: {
      noComments: 'Los comentarios no están permitidos. Ejecuta "npm run remove-comments" para eliminarlos.',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    return {
      Program(node) {
        const comments = sourceCode.getAllComments();
        comments.forEach((comment) => {
          context.report({
            node: comment,
            messageId: 'noComments',
            fix(fixer) {
              return fixer.remove(comment);
            },
          });
        });
      },
    };
  },
};

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'custom-rules': {
        rules: {
          'no-comments': noCommentsRule,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      'custom-rules/no-comments': 'error',
    },
  },
);