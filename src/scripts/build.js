import esbuild from "esbuild";
import { promises as fs, watch as watchFs } from "node:fs";
import path from "node:path";
import { generateData } from "./data.js";
import { generateSearchIndex } from "./index-search.js";

const READY_FILE = path.join("assets", ".esbuild-ready");
const DATA_WATCH_TARGETS = [
  { path: "_qualities", recursive: true },
  { path: "_requirements", recursive: true },
  { path: "_standards", recursive: true },
  { path: "_approaches", recursive: true },
  { path: "_data", recursive: true },
];
const DATA_REBUILD_DEBOUNCE_MS = 150;

async function clearReadyMarker() {
  await fs.rm(READY_FILE, { force: true });
}

async function markReady() {
  await fs.mkdir(path.dirname(READY_FILE), { recursive: true });
  await fs.writeFile(READY_FILE, `${new Date().toISOString()}\n`, "utf8");
}

async function rebuildGraphData() {
  console.log("Generating graph data...");
  await generateData();
  await generateSearchIndex();
  console.log("Graph data and search index generation complete.");
}

function installDataWatchers(onChange) {
  const watchers = [];

  for (const target of DATA_WATCH_TARGETS) {
    const watchPath = path.join(process.cwd(), target.path);

    try {
      const watcher = watchFs(
        watchPath,
        { recursive: target.recursive },
        (_eventType, filename) => {
          const changedFile = filename ? path.join(target.path, filename) : target.path;
          onChange(changedFile);
        },
      );

      watchers.push(watcher);
    } catch (error) {
      console.warn(`Data watch disabled for ${target.path}: ${error.message}`);
    }
  }

  return () => {
    for (const watcher of watchers) {
      watcher.close();
    }
  };
}

function createDataRebuildScheduler() {
  let debounceTimer;
  let rebuildInFlight = null;
  let rerunRequested = false;

  const runRebuild = async () => {
    if (rebuildInFlight) {
      rerunRequested = true;
      return rebuildInFlight;
    }

    rebuildInFlight = (async () => {
      do {
        rerunRequested = false;

        try {
          await rebuildGraphData();
          await markReady();
        } catch (error) {
          console.error("Graph data rebuild failed.", error);
        }
      } while (rerunRequested);
    })().finally(() => {
      rebuildInFlight = null;
    });

    return rebuildInFlight;
  };

  return (changedFile) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`Detected content change in ${changedFile}. Regenerating graph data...`);
      void runRebuild();
    }, DATA_REBUILD_DEBOUNCE_MS);
  };
}

async function build({ watch = false } = {}) {
  try {
    await clearReadyMarker();
    await rebuildGraphData();

    const context = await esbuild.context({
      entryPoints: [
        "src/graphs/homepage/main.js",
        "src/graphs/fullpage/main.js",
      ],
      outdir: "assets/js",
      bundle: true,
      minify: !watch,
      sourcemap: !watch,
    });

    await context.rebuild();
    await markReady();

    if (watch) {
      const closeDataWatchers = installDataWatchers(createDataRebuildScheduler());
      const shutdown = async () => {
        closeDataWatchers();
        await context.dispose();
        process.exit(0);
      };

      process.once("SIGINT", () => void shutdown());
      process.once("SIGTERM", () => void shutdown());

      console.log("Watching for JavaScript and content changes...");
      await context.watch();
      return context;
    }

    await context.dispose();
    console.log("Build complete.");
    return context;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const watch = args.includes("--watch");
build({ watch });

export { build };
