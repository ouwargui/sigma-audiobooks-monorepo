import {prisma} from '@sigma-audiobooks/db';
import {inferAsyncReturnType, initTRPC} from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import {appRouter} from './routes';
export type {AppRouter} from './routes';

const createContext = ({req, res}: trpcExpress.CreateExpressContextOptions) => {
  return {prisma, req, res};
};
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const trpcExpressMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});
