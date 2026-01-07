import type { CodegenConfig } from '@graphql-codegen/cli';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const schemaUrl = `${apiUrl}/graphql`;

const config: CodegenConfig = {
  schema: process.env.NODE_ENV === 'production' 
    ? '../../api/schema.graphql'
    : schemaUrl,
  documents: ['src/**/*.{ts,tsx,graphql}', '!**/node_modules/**', '!**/generated.ts'],
  generates: {
    './src/lib/types/generated.ts': {
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

