module.exports = {
  root: true,
  env: {
    node: true, // Entorno de ejecución Node.js
    es2021: true, // Habilita características modernas de ES
  },
  parser: '@typescript-eslint/parser', // Analizador de TypeScript
  parserOptions: {
    ecmaVersion: 'latest', // Soporte para las últimas versiones de ECMAScript
    sourceType: 'module', // Permite import/export
    project: './tsconfig.json', // Usa la configuración de TypeScript
  },
  extends: [
    'airbnb-base', // Reglas de Airbnb para JS
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Integración con Prettier
  ],
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'prettier/prettier': 'error', // Errores si el código no sigue Prettier
    'import/prefer-default-export': 'off', // No obliga a usar export default
    'no-console': 'off', // Permite console.log (útil en desarrollo)
    'no-underscore-dangle': 'off', // Permite variables con guión bajo (ej. _id)
    'class-methods-use-this': 'off', // No obliga a usar this en métodos de clase
    '@typescript-eslint/ban-ts-comment': 'off',
    'consistent-return': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ], // No es necesario especificar la extensión de los archivos de TypeScript
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {}, // Resuelve los imports
    },
  },
};
