import { z } from "zod";
import type { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";
import type { YogaContext } from "@/lib/graphql.ts";
import { requireAuth, validate } from "./validation.ts";

const RESOLVER_FUNCTION_KEY = Symbol("resolver_function");

type ResolverFunction<TReturn> = (
  ...args: Parameters<
    GraphQLFieldResolver<unknown, YogaContext, Record<string, unknown>>
  >
) => Promise<TReturn>;

type Handler<TTransformedArgs, TReturn> = (
  transformedArgs: TTransformedArgs,
  context: YogaContext,
) => Promise<TReturn>;

type ResolverInterceptorGenerator = Generator<
  Record<string, unknown>,
  void,
  Record<string, unknown>
>;

type ResolverInterceptor<TReturn> = (
  ...args: Parameters<ResolverFunction<TReturn>>
) => ResolverInterceptorGenerator;

function markAsResolverFunction<TReturn>(
  fn: ResolverFunction<TReturn>,
): ResolverFunction<TReturn> {
  // deno-lint-ignore no-explicit-any
  (fn as any)[RESOLVER_FUNCTION_KEY] = true;
  return fn;
}

function isResolverFunction<TReturn>(
  fn: Handler<unknown, TReturn> | ResolverFunction<TReturn>,
): fn is ResolverFunction<TReturn> {
  return (
    typeof fn === "function" &&
    // deno-lint-ignore no-explicit-any
    (fn as any)[RESOLVER_FUNCTION_KEY] === true
  );
}

function runResolverInterceptorGenerator(
  generator: ResolverInterceptorGenerator,
  initialArgs: Record<string, unknown>,
): Record<string, unknown> {
  let currentArgs = initialArgs;
  let result = generator.next(currentArgs);

  while (!result.done) {
    const transformedArgs = result.value;
    result = generator.next(transformedArgs);
    currentArgs = transformedArgs;
  }

  return currentArgs;
}

function createDecorator<TTransformedArgs, TReturn>(
  handler: Handler<TTransformedArgs, TReturn> | ResolverFunction<TReturn>,
  interceptor: ResolverInterceptor<TReturn>,
): ResolverFunction<TReturn> {
  const wrapped: ResolverFunction<TReturn> = async (
    parent: unknown,
    graphqlArgs: Record<string, unknown>,
    context: YogaContext,
    info: GraphQLResolveInfo,
  ) => {
    const generator = interceptor(parent, graphqlArgs, context, info);
    const finalArgs = runResolverInterceptorGenerator(generator, graphqlArgs);

    const handlerToCheck = handler as
      | Handler<unknown, TReturn>
      | ResolverFunction<TReturn>;
    if (isResolverFunction(handlerToCheck)) {
      return await (handler as ResolverFunction<TReturn>)(
        parent,
        finalArgs,
        context,
        info,
      );
    } else {
      return await (handler as Handler<TTransformedArgs, TReturn>)(
        finalArgs as TTransformedArgs,
        context,
      );
    }
  };

  return markAsResolverFunction(wrapped);
}

type Decorator<TReturn> = (
  handler: Handler<unknown, TReturn> | ResolverFunction<TReturn>,
) => ResolverFunction<TReturn>;

export function compose<TReturn>(...decorators: Array<Decorator<TReturn>>) {
  return <TTransformedArgs>(
    handler: Handler<TTransformedArgs, TReturn> | ResolverFunction<TReturn>,
  ): ResolverFunction<TReturn> => {
    return decorators.reduceRight(
      (acc, decorator) =>
        decorator(acc as Handler<unknown, TReturn> | ResolverFunction<TReturn>),
      handler as Handler<unknown, TReturn> | ResolverFunction<TReturn>,
    ) as ResolverFunction<TReturn>;
  };
}

export function withValidation<TTransformedArgs>(
  schema: z.ZodSchema<TTransformedArgs>,
) {
  return <TReturn>(
    handler: Handler<TTransformedArgs, TReturn> | ResolverFunction<TReturn>,
  ): ResolverFunction<TReturn> => {
    return createDecorator(
      handler,
      function* (_parent, graphqlArgs, _context, _info) {
        const args: Record<string, unknown> = yield graphqlArgs;
        const transformedArgs = validate(schema, args);
        yield transformedArgs as Record<string, unknown>;
      },
    );
  };
}

export function withAuth() {
  return <TTransformedArgs, TReturn>(
    handler: Handler<TTransformedArgs, TReturn> | ResolverFunction<TReturn>,
  ): ResolverFunction<TReturn> => {
    return createDecorator<TTransformedArgs, TReturn>(
      handler,
      function* (_parent, graphqlArgs, context, _info) {
        requireAuth(context);
        const args: Record<string, unknown> = yield graphqlArgs;
        yield args;
      },
    );
  };
}
