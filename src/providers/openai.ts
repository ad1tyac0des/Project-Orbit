import type { LLMProvider, Message } from "./types";
import OpenAI from "openai";

export class OpenAIProvider implements LLMProvider {
    private client: OpenAI; 

    constructor(
        private baseURL: string,
        private readonly apiKey: string,
        private readonly model: string,
    ) {
        this.client = new OpenAI({
            baseURL: this.baseURL,
            apiKey: this.apiKey,
        });
    }

    async chat(messages: Message[]): Promise<string> {
        const completion = await this.client.chat.completions.create({
            model: this.model,
            messages: messages,
        });

        const choice = completion.choices[0];
        if (!choice) throw new Error("Provider returned no choices");
        const text = choice.message?.content;
        if (!text) throw new Error("Provider returned no text output");
        return text;
    }
}
