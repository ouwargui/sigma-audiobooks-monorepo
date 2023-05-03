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
      });
    }),
    getAll: pProcedure.query(({ctx}) => {
      return ctx.prisma.book.findMany();
    }),
    getRecommendations: pProcedure.query(({ctx}) => {
      return ctx.prisma.book.findMany({take: 5});
    }),
    addListener: pProcedure.input(z.number()).mutation(({input, ctx}) => {
      return ctx.prisma.book.update({
        where: {id: input},
        data: {totalListeners: {increment: 1}},
      });
    }),
    getTrendingBook: pProcedure.query(({ctx}) => {
      return ctx.prisma.book.findFirst({
        orderBy: {totalListeners: 'desc'},
      });
    }),
    getByQuery: pProcedure.input(z.string()).query(({input, ctx}) => {
      return ctx.prisma.book.findMany({
        where: {
          title: {
            contains: input,
          },
        },
        orderBy: {title: 'asc'},
      });
    }),
  });
}
