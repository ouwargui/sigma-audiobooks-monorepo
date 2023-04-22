import type {Router, PublicProcedure} from '..';
import {z} from 'zod';

export function setupReviewRouter(
  trpcRouter: Router,
  pProcedure: PublicProcedure,
) {
  return trpcRouter({
    getById: pProcedure.input(z.number()).query(({input, ctx}) => {
      return ctx.prisma.review.findUnique({where: {id: input}});
    }),
    getAll: pProcedure.query(({ctx}) => {
      return ctx.prisma.review.findMany();
    }),
  });
}
