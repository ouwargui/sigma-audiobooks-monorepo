import type {Router, PublicProcedure} from '..';
import {z} from 'zod';

export function setupBookRouter(
  trpcRouter: Router,
  pProcedure: PublicProcedure,
) {
  return trpcRouter({
    getById: pProcedure.input(z.number()).query(({input, ctx}) => {
      return ctx.prisma.book.findUnique({
        where: {id: input},
        include: {reviews: true},
      });
    }),
    getAll: pProcedure.query(({ctx}) => {
      return ctx.prisma.book.findMany({include: {reviews: true}});
    }),
    getRecommendations: pProcedure
      .input(z.array(z.number()))
      .query(({input, ctx}) => {
        return ctx.prisma.book.findMany({
          where: {
            id: {
              notIn: input,
            },
          },
          include: {reviews: true},
        });
      }),
  });
}
