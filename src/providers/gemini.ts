import type { LLMProvider, Message } from "./types";
import { GoogleGenAI } from "@google/genai";

export class GeminiProvider implements LLMProvider {
    constructor(
        private readonly apiKey: string,
        private readonly model: string,
    ) { }

    async chat(messages: Message[]): Promise<string> {
        const ai = new GoogleGenAI({
            apiKey: this.apiKey,
        });

        const formattedMessages = messages.map(message => ({
            type: (message.role === "user" ? "user_input" : "model_output"),
            content: [{type: "text" as const, text: message.content}]
        }));

        const interaction = await ai.interactions.create({
            model: this.model,
            store: false,
            input: formattedMessages,
        });

        const text = interaction.output_text;
        if (!text) throw new Error("Provider returned no text output");
        return text;
    }
}
