import { executeBuildSearchIndex } from "./search-libs";
import { pinoLogBuilder } from "./utils/pino-log";
import { logTime } from "./utils/utils";

logTime('build-search-index', executeBuildSearchIndex, pinoLogBuilder('main', 'info'));
