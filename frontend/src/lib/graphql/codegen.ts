import type { CodegenConfig } from '@graphql-codegen/cli';
import { env } from '../env';


const config: CodegenConfig = {
  schema: env.API_URL,
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

