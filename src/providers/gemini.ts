import type { LLMProvider, Message } from "./types";
import { GoogleGenAI } from "@google/genai";

export class GeminiProvider implements LLMProvider {
    private ai: GoogleGenAI;

    constructor(
        private readonly apiKey: string,
        private readonly model: string,
    ) {
        this.ai = new GoogleGenAI({
            apiKey: this.apiKey,
        });
    }

    async chat(messages: Message[]): Promise<string> {
        try {
            const formattedMessages = messages.map((message) => ({
                type: message.role === "user" ? "user_input" : "model_output",
                content: [{ type: "text" as const, text: message.content }],
            }));

            const interaction = await this.ai.interactions.create({
                model: this.model,
                store: false,
                input: formattedMessages,
            });

            const text = interaction.output_text;
            if (!text) throw new Error("Provider returned no text output");
            return text;
        } catch (err) {
            throw new Error(`Gemini request failed: ${(err as Error).message}`)
        }
    }
}
