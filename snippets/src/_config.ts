

export const publicApiPath = "../public/api";
export const config = {
  snippetsDir: ".",
  rootDir: '..',
  publicApiPath: publicApiPath,
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

