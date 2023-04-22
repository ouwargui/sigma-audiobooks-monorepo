import {router} from '..';
import {booksRouter} from './books';
import {reviewsRouter} from './reviews';

export const appRouter = router({
  books: booksRouter,
  reviews: reviewsRouter,
});
export type AppRouter = typeof appRouter;
