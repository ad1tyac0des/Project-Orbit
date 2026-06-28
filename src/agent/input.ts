// 0. lets create a fn
// 1. Takes the input and returns it
// 2. Handle all edge cases
// 3. add some commands -> /exit, /help

export type InputSignal =
    | { kind: "input"; value: string }
    | { kind: "empty" }
    | { kind: "exit" }
    | { kind: "help" };

export function getInput(): InputSignal {
    const raw = prompt(">>");

    // Edge Case
    if (raw === null) return { kind: "empty" };

    const trimmed = raw.trim();
    // Edge Case
    if (!trimmed) return { kind: "empty" };

    // Slash Commands
    if (trimmed === "/exit") return { kind: "exit" };
    if (trimmed === "/help") return { kind: "help" };

    return { kind: "input", value: trimmed };
}
