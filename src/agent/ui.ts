import { intro } from "@clack/prompts";
import pico from "picocolors";

export function printHeader() {
    console.log();
    intro(pico.inverse(" ORBIT / AGENT "));
    console.log();
}
