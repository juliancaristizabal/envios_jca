import { createServer } from './infrastructure/http/server';
import { env } from './infrastructure/config/env';

const app = createServer();

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});
