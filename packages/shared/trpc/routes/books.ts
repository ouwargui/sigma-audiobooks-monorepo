import {router, publicProcedure} from '..';
import {z} from 'zod';

export const booksRouter = router({
  getById: publicProcedure.input(z.number()).query(({input, ctx}) => {
    return ctx.prisma.book.findUnique({where: {id: input}});
  }),
  getAll: publicProcedure.query(({ctx}) => {
    return ctx.prisma.book.findMany();
  }),
});
