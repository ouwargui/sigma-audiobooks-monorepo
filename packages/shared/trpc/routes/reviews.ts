import {router, publicProcedure} from '..';
import {z} from 'zod';

export const reviewsRouter = router({
  getById: publicProcedure.input(z.number()).query(({input, ctx}) => {
    return ctx.prisma.review.findUnique({where: {id: input}});
  }),
  getAll: publicProcedure.query(({ctx}) => {
    return ctx.prisma.review.findMany();
  }),
});
