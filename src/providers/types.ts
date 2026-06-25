export type Message = {
    role: "user" | "assistant";
    content: string;
};

export interface LLMProvider {
    chat(messages: Message[]): Promise<string>;
}

export type ProviderProfile = {
    type: "openai" | "gemini";
    model: string;
    baseURL?: string; // optional - gemini doesn't need it
    apiKeyName: string;
    requiresApiKey?: boolean;
}