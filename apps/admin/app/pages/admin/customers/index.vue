<template>
  <div class="flex-1 p-8 bg-slate-50 dark:bg-[#0b1220]">
    <div class="page-header flex items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-navy dark:text-white">Customers</h1>
        <p class="text-slate-500 mt-1">{{ customers.length }} total</p>
      </div>
    </div>

    <div class="bg-white dark:bg-[#152033] rounded-2xl shadow-md p-6">
      <div class="mb-5">
        <input
          v-model="search"
          type="text"
          class="form-control max-w-md"
          placeholder="Search name, email, phone..."
        />
      </div>

      <div v-if="loading" class="py-16 text-center text-slate-500">
        Loading customers...
      </div>

      <div
        v-else-if="!filtered.length"
        class="py-16 text-center text-slate-500"
      >
        No customers found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-navy text-white">
              <th class="text-left py-3 px-4 rounded-l-lg">Customer</th>
              <th class="text-left py-3 px-4">Email</th>
              <th class="text-left py-3 px-4">Phone</th>
              <th class="text-left py-3 px-4">ZIP</th>
              <th class="text-left py-3 px-4">Orders</th>
              <th class="text-left py-3 px-4 rounded-r-lg">Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in filtered"
              :key="c.id"
              class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <td class="py-3 px-4 font-semibold text-navy dark:text-white">
                {{ displayName(c) }}
              </td>
              <td class="py-3 px-4 text-slate-700 dark:text-slate-300">
                {{ c.email }}
              </td>
              <td class="py-3 px-4 text-slate-600">{{ c.phone || "—" }}</td>
              <td class="py-3 px-4 text-slate-600">{{ c.postcode || "—" }}</td>
              <td class="py-3 px-4 font-semibold text-navy dark:text-white">
                {{ orderCount(c) }}
              </td>
              <td class="py-3 px-4 text-slate-600">
                {{ formatDate(c.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

type CustomerRow = {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  phone?: string | null;
  postcode?: string | null;
  created_at?: string | null;
  orders?: Array<{ count: number }>;
};

const loading = ref(true);
const search = ref("");
const customers = ref<CustomerRow[]>([]);
const orderCounts = ref<Record<string, number>>({});

const displayName = (c: CustomerRow) =>
  c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "—";

const orderCount = (c: CustomerRow) =>
  Number(c.orders?.[0]?.count ?? orderCounts.value[c.email] ?? 0);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return customers.value;
  return customers.value.filter((c) => {
    const name = displayName(c).toLowerCase();
    return (
      name.includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").includes(q) ||
      (c.postcode || "").includes(q)
    );
  });
});

const formatDate = (date?: string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const loadOrderCountsByEmail = async () => {
  const { data, error } = await supabase.from("orders").select("billing_email");

  if (error || !data) return;

  const map: Record<string, number> = {};
  data.forEach((row: any) => {
    const email = String(row.billing_email || "")
      .trim()
      .toLowerCase();
    if (!email) return;
    map[email] = (map[email] || 0) + 1;
  });
  orderCounts.value = map;
};

const loadCustomers = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("customers")
      .select(
        "id, email, first_name, last_name, full_name, phone, postcode, created_at, orders(count)",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.warn(
        "customers embed failed, loading without orders(count)",
        error,
      );
      const fallback = await supabase
        .from("customers")
        .select(
          "id, email, first_name, last_name, full_name, phone, postcode, created_at",
        )
        .order("created_at", { ascending: false });

      if (fallback.error) throw fallback.error;
      customers.value = (fallback.data || []) as CustomerRow[];
    } else {
      customers.value = (data || []) as CustomerRow[];
    }

    await loadOrderCountsByEmail();
  } catch (e) {
    console.error("Failed to load customers:", e);
    customers.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadCustomers);
</script>
