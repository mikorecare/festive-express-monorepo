import type { Schema } from '@google/genai'
import { Type } from '@google/genai'

export const aiResponseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        results: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.INTEGER },
                    summary: { type: Type.STRING },
                    suggestedTitle: { type: Type.STRING },
                    suggestedDescription: { type: Type.STRING },
                    contentFeedback: { type: Type.STRING },
                    aiIssues: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                severity: { type: Type.STRING, enum: ['critical', 'warning', 'info'] },
                                category: { type: Type.STRING, enum: ['content', 'metadata', 'technical'] },
                                message: { type: Type.STRING },
                                recommendation: { type: Type.STRING },
                                blockId: {
                                    type: Type.STRING,
                                    description:
                                        'id of one block from this part (for example "b12"). Empty string for page-level issues.',
                                },
                                evidence: {
                                    type: Type.STRING,
                                    description:
                                        'A verbatim quote (max 120 chars) from that block showing the problem. Empty string for page-level issues.',
                                },
                            },
                            required: [
                                'severity',
                                'category',
                                'message',
                                'recommendation',
                                'blockId',
                                'evidence',
                            ],
                        },
                    },
                },
                required: [
                    'id',
                    'summary',
                    'suggestedTitle',
                    'suggestedDescription',
                    'contentFeedback',
                    'aiIssues',
                ],
            },
        },
    },
    required: ['results'],
}
