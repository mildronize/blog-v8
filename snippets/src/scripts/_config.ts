

export const config = {
  /**
   * This module is responsible for generating the blog id mapper.
   */
  blogIdModule: {
    sourceDirectories: ["../content/posts"],
    targetFile: "../public/api/id-mapper.json",
    ignoreMarkdownFiles: ["_index.md"],
  }
}

