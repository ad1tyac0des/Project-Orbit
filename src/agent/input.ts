import { text, isCancel, cancel } from "@clack/prompts";

export type InputSignal =
    | { kind: "input"; value: string }
    | { kind: "empty" }
    | { kind: "exit" }
    | { kind: "help" }
    | { kind: "switchModel"; profile: string }
    | { kind: "selectModel" }
    | { kind: "listProfiles" };

export async function getInput(): Promise<InputSignal> {
    const raw = await text({
        message: "orbit ❯",
        placeholder: "ask anything, or /help for commands",
        validate: (value) => {
            if (!value || value.trim() === "") return "Type something first!";
        },
    });

    if (isCancel(raw)) {
        return { kind: "exit" };
    }
    const trimmed = raw.trim();

    // Slash Commands
    if (trimmed === "/help") return { kind: "help" };
    if (trimmed === "/exit") return { kind: "exit" };
    if (trimmed === "/profiles") return { kind: "listProfiles" };
    if (trimmed === "/model") return { kind: "selectModel" };
    if (trimmed.startsWith("/model ")) {
        const profile = trimmed.slice(7).trim();
        if (!profile) return { kind: "selectModel" }; // no profile given, fallback to selectModel
        return { kind: "switchModel", profile };
    }

    return { kind: "input", value: trimmed };
}
