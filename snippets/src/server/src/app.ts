import { Hono } from 'hono';
// import { cors } from "hono/cors";
import { parseEnvToVariables, HonoEnv } from './env';
import { secureHeaders } from 'hono/secure-headers';

const app = new Hono<HonoEnv>().basePath('/api');

app.use(parseEnvToVariables());
// app.use("*", (c, next) => {
//   const corsMiddlewareHandler = cors({ origin: c.var.ORIGINS });
//   return corsMiddlewareHandler(c, next);
// });

app.use('*', secureHeaders());
app.get('/', async c => {

  return c.json({
    message: 'Hello, World!',
  });
});


export default app;
