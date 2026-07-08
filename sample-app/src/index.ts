import { runCommand } from "./commands";
import { parseArgs } from "./utils/args";

try {
  const options = parseArgs(process.argv.slice(2));
  await runCommand(options);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
