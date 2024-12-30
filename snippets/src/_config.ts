import { LogLevel } from "./utils/logger";


const apiPath = "api";
const rootPublicDir = "../public";
const publicApiPath = `${rootPublicDir}/${apiPath}`;

export const config = {
  /**
   * Log level for the application
   * 
   * - Local development uses "debug" log level
   * - Production uses "info" log level
   */
  logLevel: "debug" as LogLevel,
  snippetsDir: ".",
  rootDir: '..',
  rootPublicDir,
  apiPath,
  postMetadata: {
    targetFile: `${publicApiPath}/post-metadata.json`,
  },
  searchIndex: {
    small: {
      dir: `${publicApiPath}/search-index-small`,
      metadataPath: `${publicApiPath}/search-index-metadata-small.json`,
    },
    large: {
      dir: `${publicApiPath}/search-index-large`,
      metadataPath: `${publicApiPath}/search-index-metadata-large.json`,
    },
  },
  /**
   * This module is responsible for generating the blog id mapper.
   */
  blogIdModule: {
    sourceDirectories: ["../content/posts"],
    targetFile: `${publicApiPath}/id-mapper.json`,
    ignoreMarkdownFiles: ["_index.md"],
  }
}

