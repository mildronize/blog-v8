import { test, expect } from 'bun:test';
import { extractMarkdownMetadata, processMarkdownDirectories } from './markdown-files';
import { PostId, IdMapperMetadata, MarkdownMetadata, MarkdownFileProcessorOutput } from './type';


test('processMarkdownFiles', async () => {
  const sourceDirs = ['test'];
  const processor = {
    process: async (_dir: string): Promise<MarkdownFileProcessorOutput> => 
      ({ markdownData: [{ id: 'id1', path: 'path1' }], addedIds: [] }),
    }

  const idMapper = await processMarkdownDirectories(sourceDirs, processor, console);

  expect(idMapper).toEqual({
    markdownData: [{ id: 'id1', path: 'path1' }],
    addedIds: [],
  });
});

test('extractMarkdownMetadata', () => {
  const dir = '/content/posts';
  const markdownFilePath = '/content/posts/2021-09-01-hello-world.md';
  const content = `+++
    [extra]
    id = "id1"
    +++`;
  const result = extractMarkdownMetadata(dir, markdownFilePath, content);
  expect(result).toEqual({
    id: 'id1',
    path: '/posts/hello-world',
  });
});