import {initTRPC} from '@trpc/server';
import {z} from 'zod';

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

export const appRouter = router({
  userList: publicProcedure.query(() => {
    const users = [{id: '1', name: 'bob'}];

    return users;
  }),
  userById: publicProcedure.input(z.string()).query((opts) => {
    const {input} = opts;
    const user = {id: input, name: 'bob'};

    return user;
  }),
  userCreate: publicProcedure
    .input(z.object({name: z.string()}))
    .mutation((opts) => {
      const {input} = opts;
      const user = {id: '1', name: input.name};
      return user;
    }),
});

export type AppRouter = typeof appRouter;
