import esbuild from "esbuild";
import { generateData } from "./src/scripts/data.js";

async function build({ watch = false } = {}) {
  try {
    // Generate data files first
    console.log("Generating graph data...");
    await generateData();
    console.log("Graph data generation complete.");

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

    if (watch) {
      console.log("Watching for changes...");
      await context.watch();
    } else {
      await context.rebuild();
      await context.dispose();
      console.log("Build complete.");
    }

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
