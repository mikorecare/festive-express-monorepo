import type { CriterionId } from './rubric'
export type Level = 0 | 1 | 2 | 3 | 4 | null
export interface Assessment {
    criterionId: CriterionId
    level: Level
    evidenceIds: string[]
    explanation: string
    improvement: string
}
export interface ScoreCriterion extends Assessment {
    label: string
    weight: number
    points: number | null
}
export interface SiteScore {
    overall: number | null
    coverage: number
    provisional: boolean
    criteria: ScoreCriterion[]
}
