import { test, expect } from 'bun:test';
import { extractFrontMatter, extractZolaSlug, generateZolaPostPath } from './zola';

test('extractFrontMatter', () => {
  // Test with default options
  const content = `
    +++
    title = "Hello, World!"
    +++`;
  const result = extractFrontMatter(content);
  expect(result).toEqual({
    data: {
      title: 'Hello, World!',
    },
    content: '',
  });
});

test('extractZolaSlug', () => {
  const dir = '/content/posts';
  const markdownFilePath = '/content/posts/2021-09-01-hello-world.md';
  const result = extractZolaSlug(dir, markdownFilePath);
  expect(result).toEqual('hello-world');
});

test('generateZolaPostPath with frontmatter slug', () => {
  const dir = '/content/posts';
  const markdownFilePath = '/content/posts/2021-09-01-hello-world.md';
  const frontmatterSlug = 'hello-world';
  const result = generateZolaPostPath(dir, markdownFilePath, frontmatterSlug);
  expect(result).toEqual('/posts/hello-world');
});

test('generateZolaPostPath without frontmatter slug', () => {
  const dir = '/content/posts';
  const markdownFilePath = '/content/posts/2021-09-01-hello-world.md';
  const result = generateZolaPostPath(dir, markdownFilePath, undefined);
  expect(result).toEqual('/posts/hello-world');
});