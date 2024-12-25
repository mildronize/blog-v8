

export const config = {
  rootDir: ".",
  postMetadata: {
    targetFile: "../public/api/post-metadata.json",
  },
  searchIndex: {
    small: {
      dir: "../public/api/search-index-small",
    },
    large: {
      dir: "../public/api/search-index-large",
    },
  },
  /**
   * This module is responsible for generating the blog id mapper.
   */
  blogIdModule: {
    sourceDirectories: ["../content/posts"],
    targetFile: "../public/api/id-mapper.json",
    ignoreMarkdownFiles: ["_index.md"],
  }
}

