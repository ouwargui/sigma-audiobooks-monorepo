import express from 'express';
import {trpcExpressMiddleware} from '@sigma-audiobooks/shared';

const app = express();
app.use('/api/trpc', trpcExpressMiddleware);

app.listen(3000, () => console.log('app listening on port 3000'));
