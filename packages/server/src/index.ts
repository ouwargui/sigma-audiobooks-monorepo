import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import {appRouter} from '@sigma-audiobooks/shared';

const app = express();
app.use('/api/trpc', trpcExpress.createExpressMiddleware({router: appRouter}));

app.listen(3000, () => console.log('app listening on port 3000'));
