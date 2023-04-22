import {setupBookRouter} from './books';
import {setupReviewRouter} from './reviews';
import type {Router, PublicProcedure} from '..';

export function setupRouter(trpcRouter: Router, pProcedure: PublicProcedure) {
  return trpcRouter({
    books: setupBookRouter(trpcRouter, pProcedure),
    reviews: setupReviewRouter(trpcRouter, pProcedure),
  });
}
