export interface IdMapperMetadata {
  path: string;
}
export interface MarkdownMetadata extends IdMapperMetadata {
  id: string;
}

export type PostId = string;

export interface PostMetadata extends IdMapperMetadata {
  id: string;
}

export type MarkdownFileProcessorMode = 'read' | 'update';

export interface MarkdownFileProcessorOutput {
  markdownData: MarkdownMetadata[],
  addedIds: string[],
}