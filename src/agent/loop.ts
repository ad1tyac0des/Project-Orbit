// 0. lets create fn instead class cuz i didnt need to manage state on any object, only history which can be created as a simple array of messages(for now)
// 1. store the history of messages
// 2. create a loop that runs until the user exits(while true)
// 3. prompt the user for input
// 4. send the input + history to the llm and get the response
// 5. now save the input and reply to the history
// 6. print the reply
// 7. repeat
import type { LLMProvider, Message } from "../providers/types";
import { getInput } from "./input";

export async function runLoop(llm: LLMProvider) {
    const history: Message[] = [];

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
            const tempHistory: Message[] = [
                ...history,
                { role: "user", content: userInput },
            ];
            console.log("AI is thinking...");
            const reply = await llm.chat(tempHistory);
            history.push(
                {
                    role: "user",
                    content: userInput,
                },
                {
                    role: "assistant",
                    content: reply,
                },
            );

            console.log(`AI: ${reply}`);
        }
    }
}

function exit() {
    console.log("Goodbye👋🏼");
    process.exit(0);
}

function showHelp() {
    console.log("Available Commands:\n/exit - Exit the program\n/help - Show this help");
}