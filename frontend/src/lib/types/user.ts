import type { MeQuery } from './generated';

export type User = NonNullable<MeQuery['me']>;

