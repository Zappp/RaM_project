import type { CodegenConfig } from '@graphql-codegen/cli';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:54321/functions/v1/graphql';
const schemaUrl = `${apiUrl}`;

const config: CodegenConfig = {
  schema: schemaUrl,
  documents: ['src/**/*.{ts,tsx,graphql}', '!**/node_modules/**', '!**/generated.ts'],
  generates: {
    'src/lib/types/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
    },
  },
  ignoreNoDocuments: true,
};

export default config;

