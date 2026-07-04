import type { LLMProvider, Message } from "../providers/types";
import { getInput } from "./input";
import type { Database } from "bun:sqlite";
import { loadHistory, saveMessage } from "../memory/db";
import { createProvider, getProfiles } from "../providers/index";

export async function runLoop(llm: LLMProvider, db: Database) {
    let currentLLM = llm;
    const history: Message[] = loadHistory(db);

    while (true) {
        const signal = getInput();

        if (signal.kind === "empty") continue;
        if (signal.kind === "exit") exit();
        if (signal.kind === "help") {
            showHelp();
            continue;
        }
        if (signal.kind === "profiles") {
            listProfiles();
            continue;
        }
        if (signal.kind === "switchModel") {
            try {
                currentLLM = createProvider(signal.profile);
                console.log(`✅ Switched to: ${signal.profile}`);
            } catch (err) {
                console.log(`❌ Error Switching Model: ${(err as Error).message}`);
            }
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
                const reply = await currentLLM.chat(tempHistory);
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
        "Available Commands:\n/help - Show this help\n/exit - Exit the program\n/profiles - List all available LLMs\n/model <profile> - Switch to a different LLM profile",
    );
}

function listProfiles() {
    const profiles = getProfiles();
    console.log("Available Models:");
    for (const [idx, profile] of profiles.entries()) {
        console.log(`  ${idx + 1}. ${profile}`);
    }
}
