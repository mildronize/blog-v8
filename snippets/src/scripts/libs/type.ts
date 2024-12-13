
export interface IdMapperMetadata {
  path: string;
}
export type PostId = string;

export interface PostMetadata extends IdMapperMetadata {
  id: string;
}

export type MarkdownFileProcessorMode = 'read' | 'update';