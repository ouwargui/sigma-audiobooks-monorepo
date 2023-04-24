import {prisma} from '@sigma-audiobooks/db';
import {
  inferProcedureOutput,
  inferProcedureInput,
  inferAsyncReturnType,
  initTRPC,
} from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import {setupRouter} from './routes';

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return {prisma, req, res};
};
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const router = t.router;
export type Router = typeof router;

const publicProcedure = t.procedure;
export type PublicProcedure = typeof publicProcedure;

const appRouter = setupRouter(router, publicProcedure);

export const trpcExpressMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: (error) => {
    console.error(error.error);
  },
});

export type AppRouter = typeof appRouter;
export type {inferProcedureOutput, inferProcedureInput};
