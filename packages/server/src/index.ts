import express from 'express';
import {trpcExpressMiddleware} from '@sigma-audiobooks/shared';

const app = express();
app.use('/api/trpc', trpcExpressMiddleware);
app.use('/api', (_, res) => res.status(200).send('service is running'));

app.listen(process.env.PORT ?? 3000, () =>
  console.log(`app listening on port ${process.env.PORT ?? 3000}`),
);
