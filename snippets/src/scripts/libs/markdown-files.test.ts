import { test, expect } from 'bun:test';
import { processMarkdownDirectories } from './markdown-files';
import { PostId, PostMetadata } from './type';


test('processMarkdownFiles', async () => {
  const sourceDirs = ['test'];
  const processor = {
    process: async (dir: string): Promise<Map<PostId, PostMetadata>> => {
      return new Map([['id1', { path: 'path1' }]]);
    },
  };

  const idMapper = await processMarkdownDirectories(sourceDirs, processor);

  expect(idMapper).toEqual(new Map([['id1', { path: 'path1' }]]));
});