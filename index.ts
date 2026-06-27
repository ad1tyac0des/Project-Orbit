import { createProvider } from "./src/providers/index";
import { runLoop } from "./src/agent/loop";

const llm = createProvider("openrouter-nemotron-free");
await runLoop(llm);