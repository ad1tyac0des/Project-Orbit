export type Message = {
    role: "user" | "assistant";
    content: string;
};

export interface LLMProvider {
    chat(messages: Message[]): Promise<string>;
}