<template>
  <section v-if="score" class="space-y-4">
    <h2 class="text-lg font-bold text-navy">Marketing effectiveness</h2>
    <p class="text-sm text-slate-500">Text-based marketing assessment, not technical SEO or actual conversion performance.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div v-for="side in sides" :key="side.label" class="rounded-xl border border-slate-200 p-4">
        <p class="text-sm text-slate-500">{{ side.label }}</p>
        <p class="text-3xl font-bold text-navy">{{ side.data.overall ?? '—' }}<span v-if="side.data.overall !== null" class="text-sm"> / 100</span></p>
        <p class="text-xs text-slate-500">{{ side.data.coverage }}% rubric coverage · {{ side.data.provisional ? 'Provisional' : 'Complete assessment' }}</p>
      </div>
    </div>
    <p class="text-sm bg-slate-50 rounded-lg p-3">{{ score.headToHead.provisional || score.headToHead.delta === null ? 'No definitive winner: incomplete or insufficient comparable evidence.' : score.headToHead.delta === 0 ? 'Scores are tied.' : `${score.headToHead.delta > 0 ? 'Our site' : 'Competitor'} leads by ${Math.abs(score.headToHead.delta)} points on shared criteria.` }} Shared coverage: {{ score.headToHead.coverage }}%.</p>
    <details v-for="criterion in score.ours.criteria" :key="criterion.criterionId" class="border rounded-lg p-3">
      <summary class="cursor-pointer font-medium text-navy">{{ criterion.label }} · {{ criterion.weight }}% weight</summary>
      <div class="grid sm:grid-cols-2 gap-4 mt-3">
        <div v-for="side in sides" :key="side.label" class="space-y-2">
          <p class="text-xs font-semibold text-slate-500">{{ side.label }}</p>
          <template v-if="find(side.data, criterion.criterionId)">
            <p class="text-sm font-bold">{{ find(side.data, criterion.criterionId)?.level ?? 'Unknown' }} / 4</p>
            <div v-if="find(side.data, criterion.criterionId)?.level != null" class="h-2 rounded bg-slate-100"><div class="h-2 rounded bg-brand-orange" :style="{width: `${(find(side.data, criterion.criterionId)?.level ?? 0)*25}%`}" /></div>
            <p class="text-sm text-slate-600">{{ find(side.data, criterion.criterionId)?.explanation }}</p>
            <p class="text-sm text-navy">{{ find(side.data, criterion.criterionId)?.improvement }}</p>
            <div v-for="ref in find(side.data, criterion.criterionId)?.evidenceIds ?? []" :key="ref" class="text-xs text-slate-500 border-l-2 pl-2">
              {{ evidence?.[side.key]?.find(e=>e.id===ref)?.quote || evidence?.[side.key]?.find(e=>e.id===ref)?.text || ref }}
              <p>{{ evidence?.[side.key]?.find(e=>e.id===ref)?.sourceUrl }}</p>
            </div>
          </template>
        </div>
      </div>
    </details>
  </section>
  <p v-else class="text-sm text-slate-500">No marketing score yet. Generate or refresh the comparison to obtain scores.</p>
</template>
<script setup lang="ts">
import type { MarketingScore, SiteScore, SourceEvidence } from '~/types/competitor-ui';
const props = defineProps<{score?:MarketingScore; evidence?:{ours:SourceEvidence[];theirs:SourceEvidence[]}; ourName:string; theirName:string}>();
const sides = computed(() => props.score ? [{key:'ours' as const,label:props.ourName,data:props.score.ours},{key:'theirs' as const,label:props.theirName,data:props.score.theirs}] : []);
const find = (site:SiteScore,id:string) => site.criteria.find(c=>c.criterionId===id);
</script>
