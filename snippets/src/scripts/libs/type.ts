export interface IdMapperMetadata {
  path: string;
}
export interface MarkdownMetadata extends IdMapperMetadata {
  id: string | undefined;
  content?: string;
  frontmatter: {
    title: string;
    taxonomies?: {
      tags?: string[];
      categories?: string[];
    }
    extra?: {
      id?: string;
    }
  } & Record<string, unknown>;
}

export type PostId = string;


export type MarkdownFileProcessorMode = 'read' | 'update';

export interface MarkdownFileProcessorOutput {
  markdownData: MarkdownMetadata[],
  addedIds: string[],
}