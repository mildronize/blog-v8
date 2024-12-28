import { createMiddleware } from 'hono/factory';
import { Document as FlexSearchDocument } from 'flexsearch';
import type { MiddlewareHandler } from 'hono/types';
import { z } from 'zod';
import 'dotenv/config';
import { index, postMetadata } from './bootstrap';
import { MarkdownMetadata } from '../../libs/content';


export const environmentSchema = z.object({});
// const env = environmentSchema.parse(process.env);

export type HonoEnv = {
  Variables: z.infer<typeof environmentSchema> & {
    index: FlexSearchDocument<unknown, string[]>;
    postMetadata: MarkdownMetadata[];
  }
};

export const initVariables = (): MiddlewareHandler => {
  return createMiddleware<HonoEnv>(async (c, next) => {
    c.set('index', index);
    c.set('postMetadata', postMetadata);
    await next();
  });
};
