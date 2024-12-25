import { Logger } from "pino";
import { MarkdownMetadata } from "../content";

/**
 * Small Index: Suitable for browser search
 * Large Index: Suitable for server search, more memory usage, for better full-text search e.g. Thai language
 */
export type IndexSize = 'small' | 'large';

export interface ExecuteBuildSearchIndexOptions {
  cwd?: string;
  postMetadataFile: string;
  searchIndexPath: string;
  indexSize: IndexSize;
}

export interface BuildSearchIndexOptions {
  markdownData: MarkdownMetadata[];
  logger?: Logger;
  indexSize: IndexSize;
}

export interface ImportSearchIndexOptions {
  searchIndexPath: string;
  logger?: Logger;
  indexSize: IndexSize;
}