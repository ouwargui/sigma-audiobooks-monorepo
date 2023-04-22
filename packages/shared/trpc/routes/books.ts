import type {Router, PublicProcedure} from '..';
import {z} from 'zod';

export function setupBookRouter(
  trpcRouter: Router,
  pProcedure: PublicProcedure,
) {
  return trpcRouter({
    getById: pProcedure.input(z.number()).query(({input, ctx}) => {
      return ctx.prisma.book.findUnique({where: {id: input}});
    }),
    getAll: pProcedure.query(({ctx}) => {
      return ctx.prisma.book.findMany();
    }),
  });
}
