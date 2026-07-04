import type { LLMProvider, Message } from "../providers/types";
import { getInput } from "./input";
import type { Database } from "bun:sqlite";
import { loadHistory, saveMessage } from "../memory/db";

export async function runLoop(llm: LLMProvider, db: Database) {
    const history: Message[] = loadHistory(db);

    while (true) {
        const signal = getInput();

        if (signal.kind === "empty") continue;
        if (signal.kind === "exit") exit();
        if (signal.kind === "help") {
            showHelp();
            continue;
        }

        if (signal.kind === "input") {
            const userInput = signal.value;

            try {
                const tempHistory: Message[] = [
                    ...history,
                    { role: "user", content: userInput },
                ];
                console.log("AI is thinking...");
                const reply = await llm.chat(tempHistory);
                console.log(`AI: ${reply}`);
                history.push(
                    { role: "user", content: userInput },
                    { role: "assistant", content: reply },
                );

                // persist to db
                saveMessage(db, { role: "user", content: userInput });
                saveMessage(db, { role: "assistant", content: reply });
            } catch (err) {
                console.log("Something went wrong: ", (err as Error).message);
            }
        }
    }
}

function exit() {
    console.log("Goodbye👋🏼");
    process.exit(0);
}

function showHelp() {
    console.log(
        "Available Commands:\n/exit - Exit the program\n/help - Show this help",
    );
}
