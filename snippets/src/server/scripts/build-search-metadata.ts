import { executeBuildSearchIndex } from "../../libs/search";
import { logTime } from "../../utils/utils";
import { config } from "../config";

async function buildSearchMetadata() {
  await executeBuildSearchIndex({
    cwd: config.rootDir,
    postMetadataFile: config.postMetadata.targetFile,
    searchIndexPath: config.searchIndex.dir,
    indexSize: 'large',
    searchIndexMetadataPath: config.searchIndex.siteMapPath,
    rootPublicDir: 'ADD YOUR ROOT PUBLIC DIR HERE',
  });
}

logTime(
  'build-search-metadata',
  buildSearchMetadata,
);