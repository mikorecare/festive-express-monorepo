import { Type, type Schema } from '@google/genai'
import { TONES } from './config'
import { competitorResponseSchema } from '../types'
const base = competitorResponseSchema.properties!.results!.items!
export const extractSchema: Schema = {
    ...competitorResponseSchema,
    properties: { results: { type: Type.ARRAY, items: {
        ...base,
        properties: { ...base.properties, tone: {type: Type.STRING, enum: [...TONES]}, evidence: { type: Type.ARRAY, items: {
            type: Type.OBJECT, properties: { claim: {type: Type.STRING}, blockId: {type: Type.STRING}, quote: {type: Type.STRING} },
            required: ['claim','blockId','quote']
        } } }, required: [...(base.required ?? []), 'evidence']
    } } }
}
export const synthesisSchema: Schema = { type: Type.OBJECT, properties: {
    summary: {type: Type.STRING}, tone: {type: Type.STRING, enum: [...TONES]}, detectableWeaknesses: {type: Type.ARRAY, items: {type: Type.STRING}}
}, required: ['summary','tone','detectableWeaknesses'] }
