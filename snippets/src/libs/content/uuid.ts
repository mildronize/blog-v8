// Ported from https://github.com/mildronize/mildronize.github.io/blob/9f071e49d779e2db1c17482040ce8c4696db5a20/scripts/utils.ts

export function retryNewId(uuidStore: Map<string, unknown>, limit = 10): string {
  const uuid = generateId(7);
  if (limit <= 0) throw Error('Retry Generate Id limit exceeded');
  if (uuidStore.has(uuid)) {
    console.log('Retry... new id.');
    return retryNewId(uuidStore, limit - 1);
  }
  return uuid;
}

export function generateId(length: number) {
  // https://gist.github.com/6174/6062387
  if (length > 10) throw Error('No more than 10 chars');
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
