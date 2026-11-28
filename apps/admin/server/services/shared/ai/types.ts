/** Common usage counters consumed by the Gemini generator. */
export interface AiUsage {
    modelsUsed: Record<string, number>
    tokens: { input: number; output: number; thoughts: number; cached: number }
}
