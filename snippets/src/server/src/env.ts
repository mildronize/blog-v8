import { createMiddleware } from 'hono/factory';
import { Document as FlexSearchDocument } from 'flexsearch';
import type { MiddlewareHandler } from 'hono/types';
import { z } from 'zod';
import 'dotenv/config';
import { index } from './bootstrap';


export const environmentSchema = z.object({});
// const env = environmentSchema.parse(process.env);

export type HonoEnv = {
  Variables: z.infer<typeof environmentSchema> & {
    index: FlexSearchDocument<unknown, string[]>;
  }
};

export const initVariables = (): MiddlewareHandler => {
  return createMiddleware<HonoEnv>(async (c, next) => {
    c.set('index', index);
    await next();
  });
};
