<template>
  <div class="border border-gray-200 rounded-lg p-0 select-none">
    <!-- Month header -->
    <div
      class="flex items-center justify-between mb-2 bg-navy py-2 rounded-t-lg px-2"
    >
      <button
        type="button"
        class="w-6 h-6 text-white rounded-full hover:bg-brand-orange flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="!canGoPrev"
        @click="changeMonth(-1)"
        aria-label="Previous month"
      >
        <ChevronLeftIcon class="w-4 h-4" />
      </button>

      <div class="text-xs md:text-sm font-semibold text-white">
        {{ monthLabel }}
      </div>

      <button
        type="button"
        class="w-6 h-6 rounded-full text-white hover:bg-brand-orange flex items-center justify-center"
        @click="changeMonth(1)"
        aria-label="Next month"
      >
        <ChevronRightIcon class="w-4 h-4" />
      </button>
    </div>

    <div class="px-2 pb-2">
      <!-- Weekday labels -->
      <div class="grid grid-cols-7 gap-0.5 mb-0.5">
        <div
          v-for="(d, i) in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
          :key="i"
          class="text-[10px] text-center font-medium"
          :class="i === 0 || i === 6 ? 'text-red-300' : 'text-gray-400'"
        >
          {{ d }}
        </div>
      </div>

      <!-- Days grid -->
      <div class="grid grid-cols-7 gap-0.5 py-2">
        <button
          v-for="cell in cells"
          :key="cell.key"
          type="button"
          class="h-7 rounded text-[11px] flex items-center justify-center transition-colors relative"
          :class="cellClasses(cell)"
          :disabled="cell.disabled"
          @click="toggle(cell.iso)"
          :title="cell.holidayName || undefined"
        >
          {{ cell.day }}
          <!-- Holiday dot indicator -->
          <span
            v-if="cell.isHoliday && cell.isCurrentMonth"
            class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full"
            :class="cell.disabled ? 'bg-gray-300' : 'bg-brand-orange'"
          />
        </button>
      </div>

      <!-- Holiday legend -->
      <div
        v-if="visibleHolidays.length"
        class="mt-2 pt-1.5 border-t border-gray-100"
      >
        <div class="text-[10px] text-gray-400 mb-0.5">Holidays this month:</div>
        <div class="flex flex-wrap gap-0.5">
          <span
            v-for="h in visibleHolidays"
            :key="h.iso"
            class="text-[10px] px-1.5 py-0.5 rounded-full"
            :class="
              h.isBigSix
                ? 'bg-brand-orange/10 text-brand-orange font-medium line-through decoration-dotted'
                : 'bg-gray-100 text-gray-500'
            "
          >
            {{ h.name }} · {{ formatChip(h.iso) }}
            <span v-if="h.isBigSix" class="ml-1 no-underline">(closed)</span>
          </span>
        </div>
      </div>

      <!-- Selected chips -->
      <div v-if="selected.length" class="mt-2 flex flex-wrap gap-0.5">
        <span
          v-for="d in selected"
          :key="d"
          class="text-[10px] bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded-full flex items-center gap-1"
        >
          {{ formatChip(d) }}
          <button type="button" class="hover:text-red-500" @click="remove(d)">
            ×
          </button>
        </span>
      </div>

      <p
        v-if="selected.length >= maxSelect"
        class="text-[10px] text-gray-400 mt-1"
      >
        Max {{ maxSelect }} dates selected. Click a date to remove it.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const props = withDefaults(
  defineProps<{
    selected: string[];
    minDate?: string; // YYYY-MM-DD
    maxSelect?: number;
    /** Mark the "Big Six" US holidays as unbookable (default true) */
    blockHolidays?: boolean;
  }>(),
  { maxSelect: 3, blockHolidays: true },
);

const emit = defineEmits<{
  (e: "update:selected", value: string[]): void;
}>();

const today = new Date();
const initial = props.selected.length
  ? new Date(props.selected[0] + "T00:00:00")
  : today;

const viewYear = ref(initial.getFullYear());
const viewMonth = ref(initial.getMonth()); // 0-11

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (y: number, m: number, d: number) =>
  `${y}-${pad(m + 1)}-${pad(d)}`;

/* ------------------------------------------------------------------ */
/*  US "Big Six" holiday logic                                         */
/* ------------------------------------------------------------------ */

const nthWeekdayOfMonth = (
  year: number,
  month: number,
  weekday: number,
  n: number,
) => {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return new Date(year, month, day);
};

const lastWeekdayOfMonth = (year: number, month: number, weekday: number) => {
  const last = new Date(year, month + 1, 0);
  const offset = (last.getDay() - weekday + 7) % 7;
  last.setDate(last.getDate() - offset);
  return last;
};

/**
 * The "Big Six" holidays — private-sector closures.
 * No bookings allowed on these.
 */
const BIG_SIX = [
  {
    name: "New Year's Day",
    isBigSix: true,
    dateFor: (y: number) => new Date(y, 0, 1),
  },
  {
    name: "Memorial Day",
    isBigSix: true,
    dateFor: (y: number) => lastWeekdayOfMonth(y, 4, 1), // last Mon May
  },
  {
    name: "Independence Day",
    isBigSix: true,
    dateFor: (y: number) => new Date(y, 6, 4),
  },
  {
    name: "Labor Day",
    isBigSix: true,
    dateFor: (y: number) => nthWeekdayOfMonth(y, 8, 1, 1), // 1st Mon Sep
  },
  {
    name: "Thanksgiving Day",
    isBigSix: true,
    dateFor: (y: number) => nthWeekdayOfMonth(y, 10, 4, 4), // 4th Thu Nov
  },
  {
    name: "Christmas Day",
    isBigSix: true,
    dateFor: (y: number) => new Date(y, 11, 25),
  },
] as const;

const observedDate = (d: Date): Date => {
  const day = d.getDay();
  if (day === 6) {
    const f = new Date(d);
    f.setDate(f.getDate() - 1);
    return f;
  }
  if (day === 0) {
    const m = new Date(d);
    m.setDate(m.getDate() + 1);
    return m;
  }
  return d;
};

/** Map of ISO -> holiday info for the current view year. */
const holidayMap = computed(() => {
  const map = new Map<string, { name: string; isBigSix: boolean }>();
  if (!props.blockHolidays) return map;

  for (const h of BIG_SIX) {
    const actual = h.dateFor(viewYear.value);
    const observed = observedDate(actual);

    // Only add if the *observed* date lands in the current view year.
    if (observed.getFullYear() !== viewYear.value) continue;

    const iso = toIso(
      observed.getFullYear(),
      observed.getMonth(),
      observed.getDate(),
    );
    map.set(iso, { name: h.name, isBigSix: true });
  }
  return map;
});

/** Holidays visible in the currently displayed month. */
const visibleHolidays = computed(() => {
  const out: { iso: string; name: string; isBigSix: boolean }[] = [];
  for (const [iso, info] of holidayMap.value) {
    const d = new Date(iso + "T00:00:00");
    if (
      d.getFullYear() === viewYear.value &&
      d.getMonth() === viewMonth.value
    ) {
      out.push({ iso, name: info.name, isBigSix: info.isBigSix });
    }
  }
  return out.sort((a, b) => a.iso.localeCompare(b.iso));
});

/* ------------------------------------------------------------------ */
/*  Existing calendar logic                                            */
/* ------------------------------------------------------------------ */

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
);

const minIso = computed(() => {
  if (props.minDate) return props.minDate;
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return toIso(d.getFullYear(), d.getMonth(), d.getDate());
});

const canGoPrev = computed(() => {
  const firstOfView = new Date(viewYear.value, viewMonth.value, 1);
  const minD = new Date(minIso.value + "T00:00:00");
  return firstOfView > new Date(minD.getFullYear(), minD.getMonth(), 1);
});

interface Cell {
  key: string;
  day: number | "";
  iso: string;
  disabled: boolean;
  isCurrentMonth: boolean;
  isHoliday: boolean;
  holidayName: string;
}

const cells = computed<Cell[]>(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(
    viewYear.value,
    viewMonth.value + 1,
    0,
  ).getDate();

  const out: Cell[] = [];

  for (let i = 0; i < startWeekday; i++) {
    out.push({
      key: `blank-${i}`,
      day: "",
      iso: "",
      disabled: true,
      isCurrentMonth: false,
      isHoliday: false,
      holidayName: "",
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toIso(viewYear.value, viewMonth.value, d);
    const weekday = new Date(viewYear.value, viewMonth.value, d).getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const holidayInfo = holidayMap.value.get(iso);

    out.push({
      key: iso,
      day: d,
      iso,
      // Past dates, weekends, AND Big Six holidays are unbookable.
      disabled:
        iso < minIso.value || isWeekend || (holidayInfo?.isBigSix ?? false),
      isCurrentMonth: true,
      isHoliday: !!holidayInfo,
      holidayName: holidayInfo?.name ?? "",
    });
  }

  return out;
});

const selectedSet = computed(() => new Set(props.selected));

const toggle = (iso: string) => {
  if (!iso) return;
  if (holidayMap.value.get(iso)?.isBigSix) return; // safety: no holiday booking
  const current = [...props.selected];
  const idx = current.indexOf(iso);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    if (current.length >= props.maxSelect) return;
    current.push(iso);
    current.sort();
  }
  emit("update:selected", current);
};

const remove = (iso: string) => {
  emit(
    "update:selected",
    props.selected.filter((d) => d !== iso),
  );
};

const changeMonth = (delta: number) => {
  const d = new Date(viewYear.value, viewMonth.value + delta, 1);
  viewYear.value = d.getFullYear();
  viewMonth.value = d.getMonth();
};

const cellClasses = (cell: Cell) => {
  if (!cell.isCurrentMonth) return "invisible";
  const isSelected = selectedSet.value.has(cell.iso);

  if (cell.isHoliday) {
    return "bg-gray-50 text-gray-300 line-through decoration-dotted cursor-not-allowed";
  }

  if (cell.disabled) return "text-gray-300 cursor-not-allowed";

  if (isSelected) return "bg-brand-orange text-white font-semibold";

  return "hover:bg-orange-50 text-gray-700";
};

const formatChip = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
</script>
