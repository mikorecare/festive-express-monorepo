import { Type, type Schema } from '@google/genai'
import { RUBRIC } from '../scoring/rubric'
import type { GeneratedComparison } from './types'
const str = (): Schema => ({type:Type.STRING})
const enumeration = (values: readonly string[]): Schema => ({type:Type.STRING,enum:[...values]})
const list = (items: Schema): Schema => ({type:Type.ARRAY,items})
const obj = (properties: Record<string,Schema>): Schema => ({type:Type.OBJECT,properties,required:Object.keys(properties)})
const strings = () => list(str())
const assessment = obj({criterionId:enumeration(RUBRIC.map(r=>r.id)),level:{type:Type.INTEGER,nullable:true},evidenceIds:strings(),explanation:str(),improvement:str()})
export const comparisonSchema = obj({
    executiveSummary:str(),
    pricingComparison:list(obj({item:str(),ours:str(),theirs:str(),verdict:enumeration(['we_cheaper','they_cheaper','similar','not_comparable']),insight:str()})),
    packageGaps:obj({theyOfferWeLack:strings(),weOfferTheyLack:strings(),packageRecommendations:strings()}),
    websiteComparison:obj({messagingAndClaims:str(),trustSignals:str(),conversionFlow:str(),seoAndContent:str(),whereTheyBeatUs:strings()}),
    marketingWeaknessesToExploit:strings(),
    prioritizedActions:list(obj({action:str(),area:enumeration(['pricing','packages','website','messaging','seo']),impact:enumeration(['high','medium','low']),effort:enumeration(['high','medium','low']),evidence:str()})),
    salesBattlecard:list(obj({scenario:str(),theirPitch:str(),ourWinningPitch:str()})),
    dataGaps:strings(),
    assessments:obj({ours:list(assessment),theirs:list(assessment)})
})
// Validate the same schema at runtime; Gemini structured output is not a trust boundary.
function check(value: unknown, schema: Schema, path: string): void {
    if (value === null && schema.nullable) return
    const fail = () => {throw new Error(`Invalid comparison response at ${path}`)}
    switch(schema.type) {
        case Type.STRING: if (typeof value !== 'string' || (schema.enum && !schema.enum.includes(value))) fail(); break
        case Type.INTEGER: if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 4) fail(); break
        case Type.ARRAY:
            if (!Array.isArray(value) || !schema.items) return fail()
            value.forEach((v,i)=>check(v,schema.items!,`${path}[${i}]`)); break
        case Type.OBJECT:
            if (!value || typeof value !== 'object' || Array.isArray(value)) return fail()
            for (const [key,prop] of Object.entries(schema.properties ?? {})) check((value as Record<string,unknown>)[key],prop,`${path}.${key}`)
            break
        default: fail()
    }
}
export function parseComparison(text: string): GeneratedComparison {
    const data: unknown = JSON.parse(text)
    check(data,comparisonSchema,'comparison')
    return data as GeneratedComparison
}
