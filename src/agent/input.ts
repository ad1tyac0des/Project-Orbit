export type InputSignal =
    | { kind: "input"; value: string }
    | { kind: "empty" }
    | { kind: "exit" }
    | { kind: "help" }
    | { kind: "profiles" }
    | { kind: "switchModel"; profile: string };

export function getInput(): InputSignal {
    const raw = prompt(">>");

    // Edge Case
    if (raw === null) return { kind: "empty" }; // user pressed ctrl + c for cancel

    const trimmed = raw.trim();
    // Edge Case
    if (!trimmed) return { kind: "empty" }; // user pressed enter without typing anything(only spaces)

    // Slash Commands
    if (trimmed === "/exit") return { kind: "exit" };
    if (trimmed === "/help") return { kind: "help" };
    if (trimmed === "/profiles") return { kind: "profiles" };
    if (trimmed.startsWith("/model ")) {
        const profile = trimmed.slice(7).trim();
        if (!profile) return { kind: "empty" }; // no profile given
        return { kind: "switchModel", profile };
    }

    return { kind: "input", value: trimmed };
}
