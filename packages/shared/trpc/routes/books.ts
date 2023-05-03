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
            mode: 'insensitive',
          },
        },
        orderBy: {title: 'asc'},
      });
    }),
    getRecentlyAdded: pProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(50).nullish(),
          cursor: z.number().nullish(),
        }),
      )
      .query(async ({input, ctx}) => {
        const limit = input.limit ?? 50;
        const cursor = input.cursor;

        const books = await ctx.prisma.book.findMany({
          take: limit + 1,
          cursor: cursor ? {id: cursor} : undefined,
          orderBy: {id: 'desc'},
        });

        let nextCursor: typeof cursor = undefined;
        if (books.length > limit) {
          const nextBook = books.pop();
          nextCursor = nextBook?.id;
        }

        return {
          books,
          nextCursor,
        };
      }),
  });
}
