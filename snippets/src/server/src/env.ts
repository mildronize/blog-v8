import { createMiddleware } from 'hono/factory';
import type { MiddlewareHandler } from 'hono/types';
import { z } from 'zod';
import 'dotenv/config';

function validateStringArray(name: string, value: unknown): string[] {
  if (typeof value !== 'string') throw new Error(`${name} is required`);
  const result = z.array(z.string()).parse(JSON.parse(value as string));
  return result;
}

export const environmentSchema = z.object({
  // ORIGINS: z.preprocess((value: unknown) => validateStringArray('ORIGINS', value), z.array(z.string())),
  // EMOJIS: z.preprocess((value: unknown) => validateStringArray('EMOJIS', value), z.array(z.string())),
  // AZURE_TABLE_CONNECTION_STRING: z.string(),
  // /**
  //  * Use for share multiple app in one Azure Storage Account
  //  */
  // AZURE_TABLE_PREFIX: z.string().default('Reaction'),
});

const env = environmentSchema.parse(process.env);


export type HonoEnv = {
  Variables: z.infer<typeof environmentSchema>;
};

export const parseEnvToVariables = (): MiddlewareHandler => {
  return createMiddleware<HonoEnv>(async (c, next) => {

    await next();
  });
};
