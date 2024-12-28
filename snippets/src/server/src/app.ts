import { Hono } from 'hono';
import { initVariables, HonoEnv } from './env';
import { secureHeaders } from 'hono/secure-headers';
import { RawSearchResult, searchIndex, serializeSearchResult } from '../../libs/search';

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
  const results = await searchIndex(index, query);

  return c.json({
    status: 'ok',
    results: serializeSearchResult({
      rawResult: results as RawSearchResult[],
      postMetadata
    })
  });
});

export default app;
