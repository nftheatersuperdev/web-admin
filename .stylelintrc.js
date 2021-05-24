// Stylelint Documentation: https://stylelint.io
module.exports = {
  plugins: ['stylelint-use-nesting', 'stylelint-group-selectors', 'stylelint-a11y'],
  extends: [
    // Turns on the following rules: https://github.com/stylelint/stylelint-config-standard/blob/master/index.js
    'stylelint-config-standard',
    'stylelint-prettier/recommended',
    'stylelint-a11y/recommended',
  ],
  rules: {
    'csstools/use-nesting': 'always',
    'plugin/stylelint-group-selectors': true,
    // Disallow vendor prefixes
    'at-rule-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    // Other sensible rules
    'shorthand-property-no-redundant-values': true,
    'declaration-block-no-redundant-longhand-properties': true,
    // Turn off until this is fixed: https://github.com/stylelint/postcss-css-in-js/issues/3
    'value-keyword-case': null,
    'function-whitespace-after': null,
    'custom-property-empty-line-before': null,
    'no-descending-specificity': null,
  },
}
