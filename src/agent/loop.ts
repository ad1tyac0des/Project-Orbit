import type { LLMProvider, Message } from "../providers/types";
import { getInput } from "./input";
import type { Database } from "bun:sqlite";
import { loadHistory, saveMessage } from "../memory/db";
import { createProvider, getProfiles } from "../providers/index";
import {
    outro,
    log,
    spinner,
    note,
    autocomplete,
    isCancel,
    cancel,
} from "@clack/prompts";

export async function runLoop(llm: LLMProvider, db: Database) {
    let currentLLM = llm;
    const history: Message[] = loadHistory(db);

    while (true) {
        const signal = await getInput();

        if (signal.kind === "empty") continue;
        if (signal.kind === "exit") exit();
        if (signal.kind === "help") {
            showHelp();
            continue;
        }
        if (signal.kind === "listProfiles") {
            const availableProfiles = getProfiles();
            note(`${availableProfiles.join("\n")}`, "Available Models", {
                format: (profile: string) => `→ ${profile}`,
            });
            continue;
        }
        if (signal.kind === "selectModel") {
            try {
                const availableProfiles = getProfiles();
                const options = availableProfiles.map((p) => ({
                    value: p,
                    label: p,
                }));
                const profile = await autocomplete({
                    message: "Search for a model",
                    options: options,
                    placeholder: "Type to search...",
                    maxItems: 5,
                });
                if (isCancel(profile)) {
                    cancel("Model selection cancelled!");
                    continue;
                }
                currentLLM = createProvider(profile);
                log.success(`Switched to ${profile}`);
            } catch (err) {
                log.error(`Error Selecting Model: ${(err as Error).message}`);
            }
            continue;
        }
        if (signal.kind === "switchModel") {
            try {
                currentLLM = createProvider(signal.profile);
                log.success(`Switched to ${signal.profile}`);
            } catch (err) {
                log.error(`Error Switching Model: ${(err as Error).message}`);
            }
            continue;
        }

        if (signal.kind === "input") {
            const userInput = signal.value;
            const s = spinner();

            try {
                const tempHistory: Message[] = [
                    ...history,
                    { role: "user", content: userInput },
                ];
                s.start("Orbit is thinking");
                const reply = await currentLLM.chat(tempHistory);
                s.stop(reply);
                history.push(
                    { role: "user", content: userInput },
                    { role: "assistant", content: reply },
                );

                // persist to db
                saveMessage(db, { role: "user", content: userInput });
                saveMessage(db, { role: "assistant", content: reply });
            } catch (err) {
                s.error(`Something went wrong: ${(err as Error).message}`);
                log.info("If error persists, try switching to different model.");
            }
        }
    }
}

function exit() {
    outro("Goodbye😉");
    process.exit(0);
}

function showHelp() {
    note(
        "/help - Show this help\n/exit - Exit the program\n/profiles - List all available models\n/model <profile> - Switch to a different model\n/model - Select/switch to a model",
        "Available Commands",
    );
}
