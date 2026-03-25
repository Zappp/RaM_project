import { ContentfulStatusCode } from "@hono/hono/utils/http-status";

type CamelCase<S extends string> = S extends
  `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Capitalize<CamelCase<`${P2}${P3}`>>}`
  : S;

export type CamelizeKeys<T> = T extends (infer U)[] ? CamelizeKeys<U>[]
  : T extends object
    ? { [K in keyof T as CamelCase<string & K>]: CamelizeKeys<T[K]> }
  : T;

type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U> ? `${Lowercase<T>}${SnakeCase<U>}`
  : `${Lowercase<T>}_${SnakeCase<U>}`
  : S;

export type SnakeifyKeys<T> = T extends Array<infer U> ? SnakeifyKeys<U>[]
  : T extends object ? {
      [K in keyof T as K extends string ? SnakeCase<K> : K]: SnakeifyKeys<T[K]>;
    }
  : T;

export type PgError = {
  status: ContentfulStatusCode;
  message: string;
};

export type Milliseconds = number & { readonly __brand: unique symbol };
