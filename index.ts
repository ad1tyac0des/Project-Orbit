import { createProvider } from "./src/providers/index";
import { runLoop } from "./src/agent/loop";
import { connectDB, initSchema } from "./src/memory/db";

const llm = createProvider("openrouter-nemotron-free");
const db = connectDB();
initSchema(db);

await runLoop(llm, db);
