// Providers Module

import type { LLMProvider, ProviderProfile } from "./types";
import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";

// Shape of config.json
type Config = {
    profiles: Record<string, ProviderProfile>;
};

// Read and parse config.json at startup
const config: Config = await Bun.file("config.json").json();

export function createProvider(name: string): LLMProvider {
    const profile = config.profiles[name];
    if (!profile) throw new Error(`No profile found with name: ${name}`);

    switch (profile.type) {
        case "gemini": {
            const apiKey = Bun.env[profile.apiKeyName || "GEMINI_API_KEY"];
            if (!apiKey) throw new Error("Gemini API key is not set in .env");

            return new GeminiProvider(apiKey, profile.model);
        }

        case "openai": {
            let apiKey: string | undefined = undefined;

            if (profile.requiresApiKey === false) {
                apiKey = "no-api-key"; // no actual key required, just needs non-empty string
            } else if (profile.apiKeyName) {
                apiKey = Bun.env[profile.apiKeyName];
                if (!apiKey) throw new Error(`${name} API key is not set in .env with ${profile.apiKeyName}`);
            } else {
                throw new Error(`Profile ${name} is missing apiKeyName in config.json`);
            }

            return new OpenAIProvider(profile.baseURL ?? "", apiKey, profile.model);
        }
    }
}

export function getProfiles(): string[] {
    return Object.keys(config.profiles);
}