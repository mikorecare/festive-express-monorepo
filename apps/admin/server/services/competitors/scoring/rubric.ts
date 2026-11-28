// Scores measure observable marketing communication, not actual conversion or service quality.
export const RUBRIC_VERSION = 'marketing-text-v1'
export const MIN_SCORE_COVERAGE = 70
export const RUBRIC = [
    { id: 'positioning', label: 'Positioning and differentiation', weight: 20, levels: ['No proposition found', 'Generic service claim', 'Clear service and audience', 'Specific benefits and differentiation', 'Specific differentiated proposition supported by concrete proof'] },
    { id: 'services', label: 'Service and package clarity', weight: 15, levels: ['No service description found', 'Service names only', 'Clear descriptions', 'Clear scope and inclusions', 'Clear scope, inclusions, options and relevant limitations'] },
    { id: 'pricing', label: 'Pricing and offer communication', weight: 15, levels: ['No price or quote guidance found', 'Generic quote invitation', 'Pricing model or quote process explained', 'Specific prices or clear quote factors and offer terms', 'Transparent pricing/quote factors, inclusions, conditions and next steps'] },
    { id: 'trust', label: 'Trust and credibility', weight: 15, levels: ['No trust signals found', 'Generic quality claims', 'Specific credentials, guarantees or testimonials', 'Multiple specific proof points', 'Strong concrete proof with clear scope or attributable details'] },
    { id: 'messaging', label: 'Persuasive sales messaging', weight: 15, levels: ['No sales message found', 'Feature list or generic claims', 'Clear customer benefit', 'Specific benefits linked to customer needs', 'Specific customer-centered benefits backed by credible proof'] },
    { id: 'cta', label: 'Call-to-action messaging', weight: 10, levels: ['No CTA found', 'Vague CTA', 'Clear next action', 'Specific action and expected outcome', 'Clear action, outcome and reassuring next-step information'] },
    { id: 'objections', label: 'Customer objection handling', weight: 5, levels: ['No objections addressed', 'Generic reassurance', 'One concrete concern answered', 'Several relevant concerns answered', 'Specific answers about cost, process, maintenance or warranty as applicable'] },
    { id: 'local', label: 'Local market positioning', weight: 5, levels: ['No local information found', 'Broad region only', 'Specific service areas', 'Specific areas plus relevant local positioning', 'Specific local relevance supported by concrete local proof'] },
] as const
export type CriterionId = typeof RUBRIC[number]['id']
