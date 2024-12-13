import { test, expect } from 'bun:test';
import { extractMarkdownMetadata, processMarkdownDirectories } from './markdown-files';
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

test('extractMarkdownMetadata', () => {
  const dir = '/content/posts';
  const markdownFilePath = '/content/posts/2021-09-01-hello-world.md';
  const content = `+++
    [extra]
    id = "id1"
    +++`;
  const result = extractMarkdownMetadata(dir, markdownFilePath, content);
  expect(result).toEqual({ key: 'id1', value: { path: '/posts/hello-world' } });
});