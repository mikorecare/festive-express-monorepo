<template>
  <div class="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen max-w-7xl mx-auto">
    <p v-if="pending && !competitor" class="text-slate-500">Loading website intelligence…</p>
    <div v-else-if="error && !competitor" class="bg-rose-50 p-5 rounded-xl">Failed to load website. <NuxtLink to="/admin/competitors" class="underline">Back to list</NuxtLink></div>
    <template v-else-if="competitor">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <div class="flex items-center gap-3 mb-1">
            <NuxtLink
              to="/admin/competitors"
              class="text-sm text-slate-400 hover:text-brand-orange"
              >← Back to Competitors</NuxtLink
            >
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
              :class="statusBadgeClass(competitor.status)"
            >
              {{ competitor.status }}
            </span>
            <span
              v-if="competitor.is_internal"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-brand-orange text-white"
            >
              Internal Site
            </span>
          </div>
          <h1 class="text-2xl font-bold text-navy">{{ competitor.name }}</h1>
          <p class="text-slate-500 text-sm mt-1">
            {{ competitor.address || "No address on file" }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <a
            v-if="competitor.website"
            :href="competitor.website"
            target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-navy rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            <GlobeAltIcon class="h-4 w-4" />
            Visit Website
          </a>
          <button
            type="button"
            :disabled="analyzing || loadingCompare"
            class="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors"
            @click="analyzeNow"
          >
            <ArrowPathIcon
              class="h-4 w-4"
              :class="analyzing ? 'animate-spin' : ''"
            />
            {{ analyzing ? "Analyzing…" : "Update Website Analysis" }}
          </button>
        </div>
      </div>

      <div v-if="competitor.error || competitor.seo_raw?.analysisMeta?.status === 'partial' || competitor.seo_raw?.contentTruncated" class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">{{ competitor.error || 'Website capture or AI analysis may be incomplete. Missing information is not proof of absence.' }}</div>
      <section class="bg-white border rounded-xl p-4 space-y-3">
        <div class="flex flex-wrap items-end gap-3">
          <label class="flex-1 min-w-48 text-sm text-navy font-medium">Compare against our website
            <select v-model="selectedInternalId" :disabled="loadingCompare || analyzing" class="field w-full mt-1"><option value="">Select our website</option><option v-for="site in internalSites" :key="site.id" :value="site.id">{{ site.name }}</option></select>
          </label>
          <button v-if="savedLookupError" type="button" class="border rounded-lg px-4 py-2 text-sm" :disabled="loadingSaved || analyzing" @click="loadSaved()">Retry loading saved comparison</button>
          <button v-else-if="!comparisonData" type="button" class="bg-navy text-white rounded-lg px-4 py-2 text-sm disabled:opacity-50" :disabled="!selectedInternalId || loadingSaved || loadingCompare || analyzing" @click="runComparison()">{{ loadingSaved?'Checking saved comparison…':loadingCompare?'Generating…':'Generate Comparison' }}</button>
          <button v-else type="button" class="border rounded-lg px-4 py-2 text-sm disabled:opacity-50" :disabled="loadingSaved || loadingCompare || analyzing" @click="runComparison(true)">{{ loadingCompare?'Regenerating…':'Regenerate Comparison' }}</button>
        </div>
        <p class="text-xs text-slate-500">{{ loadingSaved?'Loading saved comparison (no AI usage)…':loadingCompare?'Generating comparison. Previous results remain visible.':savedLookupError?'Saved comparison could not be checked. Retry before generating.':comparisonData?'Showing the saved comparison. Regenerate only if you need updated results.':selectedInternalId?'No saved comparison found. Generate one when ready.':'Select a website to load saved results.' }}</p>
        <p v-if="comparisonData && !loadingCompare" class="text-xs text-slate-500">{{ comparisonData._meta?.generatedAt ? 'Saved on ' + new Date(comparisonData._meta.generatedAt).toLocaleString() + '. ' : '' }}Saved results may predate the latest website analysis.</p>
        <p v-if="!internalSites.length" class="text-sm text-amber-700">Analyze an internal website first to enable comparison.</p>
      </section>
      <nav aria-label="Website intelligence sections" class="flex flex-wrap gap-2">
        <button v-for="tab in tabs" :key="tab" :aria-pressed="activeTab===tab" :class="activeTab===tab?'bg-navy text-white':'bg-white text-navy border'" class="rounded-lg px-4 py-2 text-sm font-medium" @click="activeTab=tab">{{ tab }}</button>
      </nav>
      <section v-if="activeTab==='Overview'" class="space-y-4">
        <div v-if="comparisonData && !isLegacy" class="bg-white border rounded-xl p-5 space-y-4">
          <h2 class="font-bold text-navy">Executive summary</h2><p class="text-sm text-slate-700">{{ comparisonData.executiveSummary }}</p>
          <MarketingScore :score="comparisonData.marketingScore" :evidence="comparisonData.scoreEvidence" :our-name="ourName" :their-name="competitor.name" />
          <div v-if="comparisonData.prioritizedActions?.length" class="border-t pt-4">
            <h3 class="text-sm font-semibold text-navy">Recommended next steps</h3>
            <ul class="list-disc pl-5 text-sm text-slate-600 space-y-1 mt-2"><li v-for="(action,i) in comparisonData.prioritizedActions.slice(0,3)" :key="i">{{ action.action }}</li></ul>
            <button class="text-brand-orange text-sm mt-2" @click="activeTab='Action Plan'">View all actions</button>
          </div>
        </div>
        <p v-else-if="isLegacy" class="text-sm text-amber-700">Older comparison format. Regenerate to see current results.</p>
        <div v-else class="bg-white border rounded-xl p-5"><h2 class="font-bold text-navy">Website summary</h2><p class="text-sm text-slate-600 mt-2">{{ competitor.intelligence?.summary || 'No analysis yet. Update website analysis to begin.' }}</p></div>
        <details class="bg-white border rounded-xl p-4" :open="!comparisonData || undefined">
          <summary class="cursor-pointer font-semibold text-navy">Website intelligence & business information</summary>
          <div class="mt-4"><BusinessIntelligence :competitor="competitor" /></div>
        </details>
      </section>
      <section v-else-if="activeTab==='Evidence'" class="space-y-4">
        <div class="bg-white border rounded-xl p-5 space-y-3">
          <h2 class="font-bold text-navy">Analysis coverage</h2>
          <p class="text-sm">Pages captured: {{ competitor.seo_raw?.pagesScraped ?? 'Unknown' }} · Fully reviewed: {{ competitor.seo_raw?.analysisMeta?.coverage?.fullyReviewedPages ?? 'Unknown' }} · Cached parts: {{ competitor.seo_raw?.analysisMeta?.coverage?.cachedParts ?? 'Unknown' }}</p>
          <p class="text-sm">AI status: {{ competitor.seo_raw?.analysisMeta?.status ?? 'Unknown' }}</p>
          <h3 class="font-semibold text-navy">Source evidence</h3>
          <p v-if="!competitor.seo_raw?.evidence?.length" class="text-sm text-slate-500">No verified excerpts stored.</p>
          <div v-for="(item,i) in competitor.seo_raw?.evidence ?? []" :key="i" class="border rounded-lg p-3 text-sm"><p class="font-medium">{{ item.claim }}</p><p>{{ item.quote }}</p><p class="text-xs text-slate-500 break-all">{{ item.sourceUrl }} · {{ item.blockId }}</p></div>
          <div v-if="comparisonData?.dataGaps?.length"><h3 class="font-semibold text-navy">Missing information</h3><ul class="list-disc pl-5 text-sm"><li v-for="(gap,i) in comparisonData.dataGaps" :key="i">{{ gap }}</li></ul></div>
        </div>
        <SourceContent :competitor="competitor" />
      </section>
      <section v-else-if="comparisonData && !isLegacy" class="bg-white border rounded-xl p-5 space-y-5">
        <PricingComparison v-if="activeTab==='Pricing'" :comparison-data="comparisonData" />
        <template v-else-if="activeTab==='Marketing'"><MarketingScore :score="comparisonData.marketingScore" :evidence="comparisonData.scoreEvidence" :our-name="ourName" :their-name="competitor.name" /><MarketingComparison :comparison-data="comparisonData" /></template>
        <ActionPlan v-else-if="activeTab==='Action Plan'" :comparison-data="comparisonData" />
        <SalesBattlecard v-else-if="activeTab==='Battlecard'" :comparison-data="comparisonData" />
      </section>
      <p v-else class="rounded-xl bg-white border p-5 text-sm text-slate-500">Generate a current comparison to view this section.</p>
    </template>
  </div>
</template>
<script setup lang="ts">
import { GlobeAltIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import type { CompetitorRow, AnalyzeResult } from '~/types/competitor-ui';
import { statusBadgeClass } from '~/utils/competitor-ui';
import BusinessIntelligence from '~/components/competitors/BusinessIntelligence.vue';
import PricingComparison from '~/components/competitors/PricingComparison.vue';
import MarketingComparison from '~/components/competitors/MarketingComparison.vue';
import ActionPlan from '~/components/competitors/ActionPlan.vue';
import SalesBattlecard from '~/components/competitors/SalesBattlecard.vue';
import SourceContent from '~/components/competitors/SourceContent.vue';
import MarketingScore from '~/components/competitors/MarketingScore.vue';
const id=useRoute().params.id as string;
const {showToast}=useToast();
const {data,pending,error,refresh}=await useAsyncData(`competitor-${id}`,()=>$fetch<{competitor:CompetitorRow}>(`/api/competitors/${id}`));
const competitor=computed(()=>data.value?.competitor);
const {data:internalsData,refresh:refreshInternals}=await useAsyncData('internal-sites',()=>$fetch<{internals:{id:string;name:string}[]}>('/api/competitors/internals'));
const internalSites=computed(()=>(internalsData.value?.internals??[]).filter(s=>s.id!==id));
const selectedInternalId=ref('');
watch(internalSites,list=>{if(!list.some(s=>s.id===selectedInternalId.value)) selectedInternalId.value=list.length===1?list[0]!.id:'';},{immediate:true});
const ourName=computed(()=>internalSites.value.find(s=>s.id===selectedInternalId.value)?.name??'Our website');
const {comparisonData,loadingCompare,loadingSaved,savedLookupError,runComparison,loadSaved,invalidate}=useCompetitorComparison(id,selectedInternalId);
const isLegacy=computed(()=>typeof comparisonData.value?.packageGaps==='string');
const tabs=['Overview','Pricing','Marketing','Action Plan','Battlecard','Evidence'] as const;
const activeTab=ref<typeof tabs[number]>('Overview');
const analyzing=ref(false);
async function analyzeNow(){
 if(analyzing.value || loadingCompare.value) return;
 analyzing.value=true; invalidate();
 try {
  const res=await $fetch<{results:AnalyzeResult[]}>('/api/competitors/analyze',{method:'POST',body:{ids:[id],useAi:true}});
  await refresh(); await refreshInternals();
  const fail=res.results.find(r=>!r.ok);
  if(fail) showToast(`Failed: ${fail.reason}`,'error');
  else if(res.results.some(r=>r.reason==='partial')) showToast('Partial analysis saved. Review coverage.','info');
  else showToast('Website analysis updated','success');
 }catch(e:any){showToast(e?.data?.statusMessage||'Failed to analyze','error');}
 finally{analyzing.value=false; await loadSaved();}
}
</script>
