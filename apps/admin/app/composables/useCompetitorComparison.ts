import type { Ref } from 'vue';
import type { Comparison } from '~/types/competitor-ui';

export function useCompetitorComparison(competitorId: string, selectedInternalId: Ref<string>) {
  const {showToast} = useToast();
  const comparisonData = ref<Comparison|null>(null);
  const loadingCompare = ref(false);
  const loadingSaved = ref(false);
  const savedLookupError = ref(false);
  let sequence = 0;
  let mounted = false;

  function invalidate() {
    sequence++;
    comparisonData.value = null;
    loadingSaved.value = false;
    loadingCompare.value = false;
    savedLookupError.value = false;
  }

  async function loadSaved() {
    invalidate();
    const internalId = selectedInternalId.value;
    if (!internalId) return;
    const current = sequence;
    loadingSaved.value = true;
    const isCurrent = () => current === sequence && internalId === selectedInternalId.value;
    try {
      const res = await $fetch<{comparison:Comparison;cached:boolean}>('/api/competitors/compare', {
        method: 'GET', query: {internalId,competitorId,cachedOnly:'1'}
      });
      if (isCurrent()) comparisonData.value = res.comparison;
    } catch (e:any) {
      if (isCurrent() && (e?.statusCode ?? e?.status ?? e?.response?.status) !== 404) {
        savedLookupError.value = true;
        showToast(e?.data?.statusMessage || 'Could not load saved comparison','error');
      }
    } finally { if (isCurrent()) loadingSaved.value = false; }
  }

  // Call only from explicit Compare / Regenerate button clicks, never from a watcher.
  async function runComparison(forceRefresh = false) {
    const internalId = selectedInternalId.value;
    if (!internalId || loadingCompare.value || loadingSaved.value || savedLookupError.value) return;
    if (comparisonData.value && !forceRefresh) return;
    const current = ++sequence;
    loadingCompare.value = true;
    const isCurrent = () => current === sequence && internalId === selectedInternalId.value;
    try {
      const res = await $fetch<{comparison:Comparison;cached:boolean}>('/api/competitors/compare', {
        method:'POST', body:{internalId,competitorId,refresh:forceRefresh}
      });
      if (!isCurrent()) return;
      comparisonData.value = res.comparison;
      showToast(res.cached ? 'Saved comparison loaded' : 'Comparison generated','success');
    } catch (e:any) {
      if (isCurrent()) showToast(e?.data?.statusMessage || 'Failed to generate comparison','error');
    } finally { if (isCurrent()) loadingCompare.value = false; }
  }

  onMounted(() => { mounted = true; void loadSaved(); });
  watch(selectedInternalId, () => { if (mounted) void loadSaved(); });
  onBeforeUnmount(() => { mounted = false; invalidate(); });
  return {comparisonData,loadingCompare,loadingSaved,savedLookupError,runComparison,loadSaved,invalidate};
}
