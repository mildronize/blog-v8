import { executeBuildSearchIndex } from "../../libs/search-libs";
import { logTime } from "../../utils/utils";

logTime(
  'build-search-index',
  () => executeBuildSearchIndex('../..', './dist/search-index'),
);