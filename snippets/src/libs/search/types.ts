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
  /**
   * Search index SiteMap path, for loading search index in browser
   */
  searchIndexMetadataPath: string;
  /**
   * Root public directory
   */
  rootPublicDir: string;
  /**
   * Index Size
   */
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

export interface ImportSearchIndexFromRemoteOptions {
  /**
   * A list of index files to import e.g. ['/api/index.json', '/api/index2.json']
   */
  indexFiles: string[];
  /**
   * Index Size
   */
  indexSize: IndexSize;
  /**
   * Hostname of the server, empty string for relative path
   */
  hostname?: string;
  logger?: Logger;
  /**
   * Concurrency of the import process
   * 
   * @default 6
   */
  concurrency? : number;
}

export interface SearchIndexMetadataResponse {
  /**
   * Location of search index files
   */
  sitemap: string[];
  /**
   * Totoal File size in megabytes
   */
  totalFileSizeInMegabytes: number;
}