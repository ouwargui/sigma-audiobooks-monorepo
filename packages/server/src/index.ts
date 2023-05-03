import express from 'express';
import {trpcExpressMiddleware} from '@sigma-audiobooks/shared';

const app = express();
app.use('/api/trpc', trpcExpressMiddleware);
app.get('/api', (_, res) => res.status(200).send('service is running'));
app.get('/.well-known/apple-app-site-association', (_, res) => {
  return res.status(200).sendFile('apple-app-site-association', {
    root: './public',
  });
});

app.listen(process.env.PORT ?? 3000, () =>
  console.log(`app listening on port ${process.env.PORT ?? 3000}`),
);
