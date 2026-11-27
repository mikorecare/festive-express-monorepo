<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen max-w-7xl mx-auto">
    <!-- Loading -->
    <div v-if="pending" class="animate-pulse space-y-6">
      <div class="h-8 bg-slate-200 rounded w-1/4" />
      <div class="h-4 bg-slate-200 rounded w-1/2" />
      <div class="h-64 bg-slate-200 rounded-xl" />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="bg-rose-50 border border-rose-100 rounded-xl p-6 text-center text-rose-700"
    >
      <p>Failed to load competitor details.</p>
      <NuxtLink
        to="/admin/competitors"
        class="text-sm font-medium underline mt-2 inline-block"
        >Return to list</NuxtLink
      >
    </div>

    <!-- Content -->
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
            target="_blank"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-navy rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            <GlobeAltIcon class="h-4 w-4" />
            Visit Website
          </a>
          <button
            type="button"
            :disabled="analyzing"
            class="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors"
            @click="analyzeNow"
          >
            <ArrowPathIcon
              class="h-4 w-4"
              :class="analyzing ? 'animate-spin' : ''"
            />
            {{ analyzing ? "Analyzing…" : "Re-Analyze" }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Facts & Intelligence -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Basic Info -->
          <div
            class="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4"
          >
            <h2 class="text-sm font-bold text-navy uppercase tracking-wide">
              Business Info
            </h2>
            <div class="space-y-3">
              <div>
                <div class="text-[11px] text-slate-400 font-semibold uppercase">
                  Rating
                </div>
                <div class="text-sm font-medium text-navy">
                  {{
                    competitor.rating != null ? `${competitor.rating} ★` : "—"
                  }}
                  <span class="text-slate-400 font-normal"
                    >({{ competitor.review_count || 0 }} reviews)</span
                  >
                </div>
              </div>
              <div>
                <div class="text-[11px] text-slate-400 font-semibold uppercase">
                  Phone
                </div>
                <div class="text-sm font-medium text-navy">
                  {{ competitor.phone || "—" }}
                </div>
              </div>
              <div>
                <div class="text-[11px] text-slate-400 font-semibold uppercase">
                  Price Level
                </div>
                <div class="text-sm font-medium text-navy">
                  {{ formatPriceLevel(competitor.price_level) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Intelligence (Gemini) -->
          <div
            v-if="competitor.intelligence"
            class="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-5"
          >
            <div class="flex items-center justify-between gap-2">
              <h2
                class="text-sm font-bold text-navy uppercase tracking-wide flex items-center gap-2"
              >
                <SparklesIcon class="w-4 h-4 text-brand-orange" /> Gemini
                Intelligence
              </h2>
              <span
                v-if="competitor.intelligence.tone"
                class="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
              >
                {{ competitor.intelligence.tone }}
              </span>
            </div>

            <div
              v-if="!competitor.intelligence.packages"
              class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5"
            >
              This analysis predates packages, trust signals and CTAs. Click
              Re-Analyze to update it.
            </div>

            <div v-if="competitor.intelligence.claimedAdvantages?.length">
              <div
                class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide mb-1.5"
              >
                Claimed Advantages
              </div>
              <ul
                class="text-sm text-slate-600 space-y-1 list-disc list-inside"
              >
                <li
                  v-for="(a, i) in competitor.intelligence.claimedAdvantages"
                  :key="i"
                >
                  {{ a }}
                </li>
              </ul>
            </div>

            <div v-if="competitor.intelligence.packages?.length">
              <div
                class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Packages & Prices
              </div>
              <div class="space-y-2">
                <div
                  v-for="(p, i) in competitor.intelligence.packages"
                  :key="i"
                  class="rounded-lg border border-slate-100 bg-slate-50 p-2.5"
                >
                  <div class="flex items-start justify-between gap-2">
                    <span class="text-sm font-semibold text-navy">{{
                      p.name
                    }}</span>
                    <span
                      class="text-xs font-semibold shrink-0"
                      :class="p.price ? 'text-emerald-600' : 'text-slate-400'"
                      >{{ p.price || "No price shown" }}</span
                    >
                  </div>
                  <ul
                    v-if="p.includes?.length"
                    class="mt-1 text-xs text-slate-500 list-disc list-inside space-y-0.5"
                  >
                    <li v-for="(inc, j) in p.includes" :key="j">{{ inc }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-if="competitor.intelligence.serviceHighlights?.length">
              <div
                class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Services
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(s, i) in competitor.intelligence.serviceHighlights"
                  :key="i"
                  class="px-2 py-1 rounded bg-slate-100 text-[11px] font-medium text-slate-700"
                  >{{ s }}</span
                >
              </div>
            </div>

            <div class="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div
                class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Pricing Signals
              </div>
              <div class="text-sm text-slate-600 space-y-1">
                <div class="flex justify-between">
                  <span>Public Pricing:</span>
                  <span
                    :class="
                      competitor.intelligence.pricingSignals?.hasPricing
                        ? 'text-emerald-600 font-semibold'
                        : 'text-rose-600 font-semibold'
                    "
                  >
                    {{
                      competitor.intelligence.pricingSignals?.hasPricing
                        ? "Yes"
                        : "No"
                    }}
                  </span>
                </div>
                <div
                  v-if="competitor.intelligence.pricingSignals?.model"
                  class="flex justify-between gap-3"
                >
                  <span>Model:</span>
                  <span class="font-medium text-right">{{
                    competitor.intelligence.pricingSignals.model
                  }}</span>
                </div>
                <div
                  v-if="competitor.intelligence.pricingSignals?.priceRangeHint"
                  class="flex justify-between gap-3"
                >
                  <span>Hint:</span>
                  <span class="font-medium text-right">{{
                    competitor.intelligence.pricingSignals.priceRangeHint
                  }}</span>
                </div>
                <div
                  v-if="
                    competitor.intelligence.pricingSignals?.financingMentioned
                  "
                  class="text-emerald-600 font-medium mt-1"
                >
                  Financing available
                </div>
              </div>
            </div>

            <div v-if="competitor.intelligence.promotions?.length">
              <div
                class="text-[11px] font-semibold text-amber-600 uppercase tracking-wide mb-1.5"
              >
                Promotions & Discounts
              </div>
              <ul
                class="text-sm text-slate-600 space-y-1 list-disc list-inside"
              >
                <li
                  v-for="(p, i) in competitor.intelligence.promotions"
                  :key="i"
                >
                  {{ p }}
                </li>
              </ul>
            </div>

            <div v-if="competitor.intelligence.trustSignals?.length">
              <div
                class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Trust Signals
              </div>
              <ul
                class="text-sm text-slate-600 space-y-1 list-disc list-inside"
              >
                <li
                  v-for="(t, i) in competitor.intelligence.trustSignals"
                  :key="i"
                >
                  {{ t }}
                </li>
              </ul>
            </div>

            <div v-if="competitor.intelligence.callsToAction?.length">
              <div
                class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Calls to Action
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(c, i) in competitor.intelligence.callsToAction"
                  :key="i"
                  class="px-2 py-1 rounded bg-blue-50 text-[11px] font-medium text-blue-700"
                  >{{ c }}</span
                >
              </div>
            </div>

            <div v-if="competitor.intelligence.serviceAreas?.length">
              <div
                class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Service Areas
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(a, i) in competitor.intelligence.serviceAreas"
                  :key="i"
                  class="px-2 py-1 rounded bg-slate-100 text-[11px] font-medium text-slate-700"
                  >{{ a }}</span
                >
              </div>
            </div>

            <div v-if="competitor.intelligence.detectableWeaknesses?.length">
              <div
                class="text-[11px] font-semibold text-rose-600 uppercase tracking-wide mb-1.5"
              >
                Weaknesses to Exploit
              </div>
              <ul
                class="text-sm text-slate-600 space-y-1 list-disc list-inside"
              >
                <li
                  v-for="(w, i) in competitor.intelligence.detectableWeaknesses"
                  :key="i"
                >
                  {{ w }}
                </li>
              </ul>
            </div>

            <div
              v-if="competitor.intelligence.summary"
              class="pt-3 border-t border-slate-100"
            >
              <p class="text-xs text-slate-500 italic">
                "{{ competitor.intelligence.summary }}"
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column: Compare & Scraped Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Compare Section -->
          <div
            class="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <h2
                class="text-sm font-bold text-navy uppercase tracking-wide flex items-center gap-2"
              >
                <ScaleIcon class="w-4 h-4 text-brand-orange" /> Competitive
                Comparison
              </h2>

              <div class="flex items-center gap-2">
                <!-- Dropdown for internal site -->
                <select
                  v-model="selectedInternalId"
                  class="field text-sm py-1.5 px-3 rounded-lg border-slate-200"
                >
                  <option value="" disabled>
                    Select your site to compare...
                  </option>
                  <option
                    v-for="site in internalSites"
                    :key="site.id"
                    :value="site.id"
                  >
                    {{ site.name }}
                  </option>
                </select>

                <button
                  @click="runComparison()"
                  :disabled="loadingCompare || !selectedInternalId"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors shadow-sm shrink-0"
                >
                  <SparklesIcon class="h-4 w-4" />
                  {{ loadingCompare ? "Generating..." : "Battle!" }}
                </button>
              </div>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loadingCompare" class="animate-pulse space-y-4 pt-4">
              <div class="h-4 bg-slate-200 rounded w-3/4"></div>
              <div class="h-20 bg-slate-100 rounded"></div>
            </div>

            <!-- Battlecard Results -->
            <div
              v-else-if="comparisonData"
              class="space-y-6 pt-4 border-t border-slate-100"
            >
              <!-- Old cached format -->
              <div
                v-if="isLegacy"
                class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex items-center justify-between gap-3"
              >
                <span
                  >This battlecard was generated in an older format. Regenerate
                  it to see the full comparison.</span
                >
                <button
                  class="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium shrink-0"
                  @click="runComparison(true)"
                >
                  Regenerate
                </button>
              </div>

              <template v-else>
                <!-- Exec Summary -->
                <div
                  class="bg-brand-orange/5 border border-brand-orange/20 rounded-lg p-4 text-sm text-slate-700"
                >
                  <strong
                    class="text-brand-orange block mb-1 uppercase tracking-wide text-xs"
                    >Executive Summary</strong
                  >
                  {{ comparisonData.executiveSummary }}
                </div>

                <!-- Prioritized Actions -->
                <div v-if="sortedActions.length">
                  <strong
                    class="text-navy block mb-2 text-sm uppercase tracking-wide"
                    >Prioritized Actions</strong
                  >
                  <div class="space-y-2">
                    <div
                      v-for="(a, i) in sortedActions"
                      :key="i"
                      class="border border-slate-200 rounded-lg p-3 bg-white"
                    >
                      <div class="flex flex-wrap items-center gap-1.5 mb-1">
                        <span
                          class="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold uppercase text-slate-600"
                          >{{ a.area }}</span
                        >
                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase"
                          :class="levelClass(a.impact, true)"
                          >Impact: {{ a.impact }}</span
                        >
                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase"
                          :class="levelClass(a.effort, false)"
                          >Effort: {{ a.effort }}</span
                        >
                      </div>
                      <p class="text-sm font-medium text-navy">
                        {{ a.action }}
                      </p>
                      <p class="text-xs text-slate-500 mt-1">
                        {{ a.evidence }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Pricing Comparison -->
                <div v-if="comparisonData.pricingComparison?.length">
                  <strong
                    class="text-navy block mb-2 text-sm uppercase tracking-wide"
                    >Pricing Comparison</strong
                  >
                  <div
                    class="overflow-x-auto border border-slate-200 rounded-lg"
                  >
                    <table class="min-w-full text-sm">
                      <thead
                        class="bg-slate-50 text-[11px] uppercase text-slate-500"
                      >
                        <tr>
                          <th class="text-left px-3 py-2">Item</th>
                          <th class="text-left px-3 py-2">Ours</th>
                          <th class="text-left px-3 py-2">Theirs</th>
                          <th class="text-left px-3 py-2">Verdict</th>
                          <th class="text-left px-3 py-2">Insight</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        <tr
                          v-for="(row, i) in comparisonData.pricingComparison"
                          :key="i"
                          class="align-top"
                        >
                          <td class="px-3 py-2 font-medium text-navy">
                            {{ row.item }}
                          </td>
                          <td class="px-3 py-2 text-slate-600">
                            {{ row.ours }}
                          </td>
                          <td class="px-3 py-2 text-slate-600">
                            {{ row.theirs }}
                          </td>
                          <td class="px-3 py-2">
                            <span
                              class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase whitespace-nowrap"
                              :class="verdictClass(row.verdict)"
                            >
                              {{ verdictLabel(row.verdict) }}
                            </span>
                          </td>
                          <td class="px-3 py-2 text-slate-600 text-xs">
                            {{ row.insight }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Package Gaps -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    class="border border-slate-200 rounded-lg p-4 bg-slate-50"
                  >
                    <strong
                      class="text-rose-600 block mb-2 text-sm uppercase tracking-wide"
                      >They Offer, We Lack</strong
                    >
                    <ul
                      v-if="comparisonData.packageGaps?.theyOfferWeLack?.length"
                      class="list-disc list-inside text-sm text-slate-600 space-y-1"
                    >
                      <li
                        v-for="(x, i) in comparisonData.packageGaps
                          .theyOfferWeLack"
                        :key="i"
                      >
                        {{ x }}
                      </li>
                    </ul>
                    <p v-else class="text-sm text-slate-400">None found</p>
                  </div>
                  <div
                    class="border border-slate-200 rounded-lg p-4 bg-slate-50"
                  >
                    <strong
                      class="text-emerald-600 block mb-2 text-sm uppercase tracking-wide"
                      >We Offer, They Lack</strong
                    >
                    <ul
                      v-if="comparisonData.packageGaps?.weOfferTheyLack?.length"
                      class="list-disc list-inside text-sm text-slate-600 space-y-1"
                    >
                      <li
                        v-for="(x, i) in comparisonData.packageGaps
                          .weOfferTheyLack"
                        :key="i"
                      >
                        {{ x }}
                      </li>
                    </ul>
                    <p v-else class="text-sm text-slate-400">None found</p>
                  </div>
                </div>

                <div
                  v-if="
                    comparisonData.packageGaps?.packageRecommendations?.length
                  "
                >
                  <strong
                    class="text-navy block mb-2 text-sm uppercase tracking-wide"
                    >Package Recommendations</strong
                  >
                  <ul
                    class="list-disc list-inside text-sm text-slate-600 space-y-1"
                  >
                    <li
                      v-for="(x, i) in comparisonData.packageGaps
                        .packageRecommendations"
                      :key="i"
                    >
                      {{ x }}
                    </li>
                  </ul>
                </div>

                <!-- Website Comparison -->
                <div v-if="comparisonData.websiteComparison">
                  <strong
                    class="text-navy block mb-2 text-sm uppercase tracking-wide"
                    >Website Comparison</strong
                  >
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      v-for="[label, key] in websiteSections"
                      :key="key"
                      class="border border-slate-200 rounded-lg p-4 bg-slate-50"
                    >
                      <div
                        class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1"
                      >
                        {{ label }}
                      </div>
                      <p class="text-sm text-slate-600">
                        {{ comparisonData.websiteComparison[key] }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="
                      comparisonData.websiteComparison.whereTheyBeatUs?.length
                    "
                    class="mt-4"
                  >
                    <strong
                      class="text-rose-600 block mb-2 text-sm uppercase tracking-wide"
                      >Where They Beat Us</strong
                    >
                    <ul
                      class="list-disc list-inside text-sm text-slate-600 space-y-1"
                    >
                      <li
                        v-for="(x, i) in comparisonData.websiteComparison
                          .whereTheyBeatUs"
                        :key="i"
                      >
                        {{ x }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Weaknesses to Exploit -->
                <div>
                  <strong
                    class="text-rose-600 block mb-2 text-sm uppercase tracking-wide"
                    >Marketing Weaknesses We Can Exploit</strong
                  >
                  <ul
                    class="list-disc list-inside text-sm text-slate-600 space-y-1"
                  >
                    <li
                      v-for="(
                        w, i
                      ) in comparisonData.marketingWeaknessesToExploit"
                      :key="i"
                    >
                      {{ w }}
                    </li>
                  </ul>
                </div>

                <!-- Sales Scenarios -->
                <div>
                  <strong
                    class="text-navy block mb-3 text-sm uppercase tracking-wide"
                    >Sales Battlecard (Scenarios)</strong
                  >
                  <div class="grid grid-cols-1 gap-4">
                    <div
                      v-for="(scenario, i) in comparisonData.salesBattlecard"
                      :key="i"
                      class="border border-slate-200 rounded-lg overflow-hidden flex flex-col sm:flex-row shadow-sm"
                    >
                      <div
                        class="bg-navy text-white p-4 sm:w-1/4 flex flex-col justify-center"
                      >
                        <span
                          class="text-[10px] uppercase font-bold text-slate-400 mb-1"
                          >Scenario</span
                        >
                        <span class="text-sm font-semibold">{{
                          scenario.scenario
                        }}</span>
                      </div>
                      <div
                        class="p-4 sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-200"
                      >
                        <span
                          class="text-[10px] uppercase font-bold text-rose-500 mb-1 block"
                          >Their Pitch</span
                        >
                        <p class="text-xs text-slate-600">
                          {{ scenario.theirPitch }}
                        </p>
                      </div>
                      <div class="p-4 bg-emerald-50 flex-1">
                        <span
                          class="text-[10px] uppercase font-bold text-emerald-600 mb-1 block"
                          >Our Winning Pitch</span
                        >
                        <p class="text-xs text-slate-700 font-medium">
                          {{ scenario.ourWinningPitch }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Data Gaps -->
                <div
                  v-if="comparisonData.dataGaps?.length"
                  class="border border-dashed border-slate-300 rounded-lg p-4 bg-white"
                >
                  <strong
                    class="text-slate-500 block mb-2 text-xs uppercase tracking-wide"
                    >Data Gaps (not found in scraped content)</strong
                  >
                  <ul
                    class="list-disc list-inside text-xs text-slate-500 space-y-1"
                  >
                    <li v-for="(g, i) in comparisonData.dataGaps" :key="i">
                      {{ g }}
                    </li>
                  </ul>
                </div>

                <div class="text-right">
                  <button
                    class="text-xs text-slate-400 hover:text-brand-orange underline"
                    @click="runComparison(true)"
                  >
                    Regenerate battlecard
                  </button>
                </div>
              </template>
            </div>
          </div>

          <!-- Scraped Content -->
          <div
            v-if="competitor.seo_raw"
            class="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-6"
          >
            <h2
              class="text-sm font-bold text-navy uppercase tracking-wide flex items-center gap-2"
            >
              <DocumentTextIcon class="w-4 h-4 text-slate-400" /> Scraped
              Content
            </h2>

            <div
              class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 mb-2"
            >
              <div v-if="competitor.seo_raw.pagesScraped">
                <strong>Pages scraped:</strong>
                {{ competitor.seo_raw.pagesScraped }}
              </div>
              <div>
                <strong>Total text blocks found:</strong>
                {{ competitor.seo_raw.blocks?.length || 0 }}
              </div>
              <span class="text-xs text-slate-400 block mt-1"
                >(This is the raw text Gemini read to generate the intelligence
                above.)</span
              >
            </div>

            <!-- Content Blocks (Pure Text) -->
            <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <p
                v-for="(block, i) in competitor.seo_raw.blocks"
                :key="i"
                class="leading-relaxed"
                :class="
                  block.text?.startsWith('PAGE: ')
                    ? 'text-xs font-bold uppercase tracking-wide text-brand-orange pt-3 border-t border-slate-100'
                    : block.text?.startsWith('PRICE: ')
                      ? 'text-sm font-semibold text-emerald-700'
                      : block.text?.startsWith('PROMO: ')
                        ? 'text-sm font-semibold text-amber-600'
                        : 'text-sm text-slate-700'
                "
              >
                {{ block.text }}
              </p>
            </div>
          </div>

          <div
            v-else
            class="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center"
          >
            <DocumentTextIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 class="text-lg font-semibold text-navy mb-1">
              No content data yet
            </h3>
            <p class="text-sm text-slate-500">
              Click "Re-Analyze" to scrape the website.
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  SparklesIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ScaleIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const id = route.params.id as string;
const { showToast } = useToast();

// --- 1. Fetch Competitor Details ---
const { data, pending, error, refresh } = await useAsyncData(
  `competitor-${id}`,
  () => $fetch<{ competitor: any }>(`/api/competitors/${id}`),
);

const competitor = computed(() => data.value?.competitor);

// --- 2. Fetch Internal Sites for Dropdown ---
const { data: internalsData } = await useAsyncData("internal-sites", () =>
  $fetch<{ internals: { id: string; name: string }[] }>(
    "/api/competitors/internals",
  ),
);

// A site can't be compared against itself
const internalSites = computed(() =>
  (internalsData.value?.internals ?? []).filter((s) => s.id !== id),
);
const selectedInternalId = ref("");

// Auto-select when there is only one choice
watch(
  internalSites,
  (list) => {
    if (!selectedInternalId.value && list.length === 1) {
      selectedInternalId.value = list[0]!.id;
    }
  },
  { immediate: true },
);

// --- 3. Analyze Logic ---
const analyzing = ref(false);

const analyzeNow = async () => {
  if (!competitor.value || analyzing.value) return;

  analyzing.value = true;
  showToast("Re-analyzing all pages (this may take 30-60s)...", "info");

  try {
    const res = await $fetch<{ results: any[] }>("/api/competitors/analyze", {
      method: "POST",
      body: { ids: [competitor.value.id], useAi: true },
    });

    // Wait for DB commit
    await new Promise((r) => setTimeout(r, 1000));
    await refresh();

    const fail = res.results.find((r: any) => !r.ok);
    if (fail) showToast(`Failed: ${fail.reason}`, "error");
    else showToast("Analysis complete", "success");
  } catch (e: any) {
    showToast(e?.data?.statusMessage || "Failed to analyze", "error");
  } finally {
    analyzing.value = false;
  }
};

// --- 4. Compare Logic ---
const loadingCompare = ref(false);
const comparisonData = ref<any>(null);

const runComparison = async (forceRefresh = false) => {
  if (!competitor.value || !selectedInternalId.value) return;

  loadingCompare.value = true;
  comparisonData.value = null;

  try {
    const res = await $fetch<{ comparison: any }>(`/api/competitors/compare`, {
      query: {
        competitorId: competitor.value.id,
        internalId: selectedInternalId.value,
        ...(forceRefresh === true ? { refresh: "1" } : {}),
      },
    });
    comparisonData.value = res.comparison;
  } catch (e: any) {
    showToast(
      e?.data?.statusMessage || "Failed to generate battlecard",
      "error",
    );
  } finally {
    loadingCompare.value = false;
  }
};

// Old cached battlecards had packageGaps as a plain string
const isLegacy = computed(
  () =>
    !!comparisonData.value &&
    typeof comparisonData.value.packageGaps === "string",
);

const levelRank: Record<string, number> = { high: 0, medium: 1, low: 2 };
const sortedActions = computed(() =>
  [...(comparisonData.value?.prioritizedActions ?? [])].sort(
    (a, b) =>
      (levelRank[a.impact] ?? 3) - (levelRank[b.impact] ?? 3) ||
      (levelRank[b.effort] ?? 3) - (levelRank[a.effort] ?? 3),
  ),
);

const websiteSections: [string, string][] = [
  ["Messaging & Claims", "messagingAndClaims"],
  ["Trust Signals", "trustSignals"],
  ["Conversion Flow", "conversionFlow"],
  ["SEO & Content", "seoAndContent"],
];

// --- 5. Helpers ---
const formatPriceLevel = (level: string | null) => {
  if (!level) return "—";
  const map: Record<string, string> = {
    PRICE_LEVEL_FREE: "Free",
    PRICE_LEVEL_INEXPENSIVE: "$",
    PRICE_LEVEL_MODERATE: "$$",
    PRICE_LEVEL_EXPENSIVE: "$$$",
    PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
  };
  return map[level] ?? level.replace("PRICE_LEVEL_", "").toLowerCase();
};

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "analyzed":
      return "bg-emerald-500 text-white";
    case "scraped":
      return "bg-blue-500 text-white";
    case "failed":
      return "bg-rose-500 text-white";
    default:
      return "bg-slate-200 text-slate-700";
  }
};

const verdictLabel = (v: string) =>
  ({
    we_cheaper: "We're cheaper",
    they_cheaper: "They're cheaper",
    similar: "Similar",
    not_comparable: "Not comparable",
  })[v] ?? v;

const verdictClass = (v: string) =>
  ({
    we_cheaper: "bg-emerald-100 text-emerald-700",
    they_cheaper: "bg-rose-100 text-rose-700",
    similar: "bg-slate-100 text-slate-600",
    not_comparable: "bg-amber-100 text-amber-700",
  })[v] ?? "bg-slate-100 text-slate-600";

// impact: high is good (green). effort: high is bad (rose).
const levelClass = (level: string, goodWhenHigh: boolean) => {
  if (level === "medium") return "bg-amber-100 text-amber-700";
  const isHigh = level === "high";
  return isHigh === goodWhenHigh
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";
};
</script>
