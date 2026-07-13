import { createProvider } from "./src/providers/index";
import { runLoop } from "./src/agent/loop";
import { connectDB, initSchema } from "./src/memory/db";
import { printHeader } from "./src/agent/ui";

const DEFAULT_PROFILE = "openrouter-nemotron-free"

const llm = createProvider(DEFAULT_PROFILE);
const db = connectDB();
initSchema(db);

printHeader();
await runLoop(llm, db);
