export interface IdMapperMetadata {
  path: string;
}
export interface MarkdownMetadata extends IdMapperMetadata {
  id: string | undefined;
  content?: string;
  frontmatter: Record<string, unknown>;
}

export type PostId = string;


export type MarkdownFileProcessorMode = 'read' | 'update';

export interface MarkdownFileProcessorOutput {
  markdownData: MarkdownMetadata[],
  addedIds: string[],
}