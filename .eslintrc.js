module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    'prettier',
    'react',
    'react-hooks',
    'filenames',
    'testing-library',
    'jest',
    'jsx-a11y',
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'react-app',
    'react-app/jest',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:testing-library/react',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['evme.types.ts'],
  rules: {
    'react/jsx-fragments': ['error', 'element'],
    'react/jsx-props-no-spreading': 'warn',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/boolean-prop-naming': [
      'error',
      {
        rule: '^(is|has|show|hide|should|can)[A-Z]([A-Za-z0-9]?)+',
      },
    ],
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'react/prefer-stateless-function': 'error',
    'react/button-has-type': 'error',
    'react/destructuring-assignment': ['off', 'always'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/default-props-match-prop-types': [
      'error',
      {
        allowRequiredDefaults: true,
      },
    ],
    'react/forbid-component-props': [
      'error',
      {
        forbid: ['style'],
      },
    ],
    'react/forbid-dom-props': [
      'error',
      {
        forbid: ['style'],
      },
    ],
    'react/jsx-child-element-spacing': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.tsx'],
      },
    ],
    'react/jsx-handler-names': 'error',
    'react/jsx-no-undef': [
      'error',
      {
        allowGlobals: true,
      },
    ],
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-pascal-case': 'error',
    'react/no-array-index-key': 0,
    'react/no-children-prop': 'error',
    'react/no-danger': 'error',
    'react/no-deprecated': 'error',
    'react/no-unescaped-entities': 'error',
    'react/no-unknown-property': 'error',
    'react/no-unsafe': 'error',
    'react/no-unused-prop-types': 'error',
    'react/no-is-mounted': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': [
      'error',
      {
        skipUndeclared: true,
      },
    ],
    'react/void-dom-elements-no-children': 'error',
    'react/display-name': 'off',
    // Import rules
    'no-duplicate-imports': 'off',
    'import/prefer-default-export': 0,
    'import/first': 'error',
    'import/no-unused-modules': ['error', { unusedExports: true }],
    'import/newline-after-import': [
      'error',
      {
        count: 1,
      },
    ],
    'import/no-cycle': 'error',
    'import/no-deprecated': 'error',
    'import/no-relative-parent-imports': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '{assets,components,pages,routes,services,typings,layout,tests,utilities}/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message: 'Are you sure you need lodash? If yes, please use lodash-es instead.',
          },
        ],
        // fix for no-relative-parent-imports not working https://github.com/benmosher/eslint-plugin-import/issues/1610
        patterns: ['../*'],
      },
    ],
    // Jest rules
    'jest/consistent-test-it': [
      'error',
      {
        fn: 'it',
      },
    ],
    'jest/lowercase-name': [
      'error',
      {
        ignore: ['describe'],
      },
    ],
    'jest/no-commented-out-tests': 'error',
    'jest/no-disabled-tests': 'error',
    'jest/no-duplicate-hooks': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-truthy-falsy': 'error',
    'jest/prefer-to-be-null': 'error',
    'jest/prefer-to-be-undefined': 'error',
    'jest/prefer-to-contain': 'error',
    'jest/valid-title': [
      'error',
      {
        mustMatch: { it: '^should' },
      },
    ],
    'jest/prefer-strict-equal': 'error',
    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: ['expect', 'cy.**.should', 'findAndAssertErrorText'],
      },
    ],
    'jest/prefer-to-have-length': 'error',
    'jest/require-top-level-describe': 'error',
    'jest/valid-expect': 'error',
    'testing-library/no-await-sync-events': 'error',
    'testing-library/no-debug': 'error',
    'testing-library/no-dom-import': 'error',
    'testing-library/no-wait-for-empty-callback': 'error',
    'testing-library/no-wait-for-snapshot': 'error',
    'testing-library/prefer-explicit-assert': 'error',
    'testing-library/prefer-presence-queries': 'error',
    'testing-library/prefer-screen-queries': 'error',
    'testing-library/prefer-wait-for': 'error',
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true, // The true value here is for backward compatibility
        allowLiteral: false,
        allowObject: true,
      },
    ],
    // Other rules
    curly: [2, 'all'],
    'no-console': [
      'warn',
      {
        allow: ['error'],
      },
    ],
    'no-nested-ternary': 'off',
    'no-var': 'error',
    'no-return-await': 'error',
    'require-await': 'error',
    'object-shorthand': [
      'error',
      'always',
      {
        avoidQuotes: true,
      },
    ],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    complexity: ['error', 30],
    eqeqeq: ['error', 'always'],
    'dot-notation': 'error',
    'no-alert': 'error',
    'no-else-return': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-useless-return': 'error',
    'no-return-assign': 'error',
    'no-useless-catch': 'error',
    'no-unsafe-optional-chaining': 'error',
    'func-style': ['off', 'declaration', { allowArrowFunctions: false }],
    // These rules are turned off as we have @typescript/eslint equivalents
    'no-unused-vars': 'off',
    'no-unused-expressions': 'off',
    'no-throw-literal': 'off',
    'no-magic-numbers': 'off',
    yoda: 'error',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/no-duplicate-imports': ['error'],
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/prefer-enum-initializers': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/method-signature-style': ['error', 'property'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
    ],
    // TODO: turn on once parserOptions are working
    // '@typescript-eslint/prefer-includes': 'error',
    // '@typescript-eslint/no-throw-literal': 'error',
    // '@typescript-eslint/no-unnecessary-condition': 'error',
    // '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    // '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array',
        readonly: 'array',
      },
    ],
  },
  overrides: [
    {
      files: ['cypress/**/*'],
      rules: {
        'func-style': 'off',
        'dot-notation': 'off',
        '@typescript-eslint/no-unused-expressions': ['off'],
        'default-case': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'jest/valid-expect-in-promise': 'off',
        'jest/no-standalone-expect': 'off',
        'testing-library/prefer-screen-queries': 'off',
      },
    },
    {
      files: ['src/**/*'],
      rules: {
        // Turn this on to show all TODO comments within the code base
        'no-warning-comments': ['off', { terms: ['todo', 'fixme'], location: 'anywhere' }],
      },
    },
  ],
}