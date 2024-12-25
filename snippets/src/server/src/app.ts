import { Hono } from 'hono';
import { initVariables, HonoEnv } from './env';
import { secureHeaders } from 'hono/secure-headers';
import { RawSearchResult, serializeSearchResult } from './lib';

const app = new Hono<HonoEnv>().basePath('/api');

app.use(initVariables());
app.use('*', secureHeaders());
app.get('/health', async c => {

  return c.json({
    status: 'ok'
  });
});

app.get('/search', async c => {
  const query = c.req.query('q');
  if (!query) {
    return c.json({
      status: 'error',
      results: [],
      message: 'Query parameter "q" is required'
    });
  }

  const index = c.get('index');
  const postMetadata = c.get('postMetadata');
  const results = await index.searchAsync(query, {
    limit: 10
  });

  return c.json({
    status: 'ok',
    results: serializeSearchResult(results as RawSearchResult[], postMetadata)
  });
});



export default app;
