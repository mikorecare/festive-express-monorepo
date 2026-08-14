<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-[#0c2340]">Package Programs</h1>
        <p class="text-slate-500 text-sm mt-1">Joy, Jolly, Merry — base price, images, inclusions</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-16 text-slate-500">Loading packages...</div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-[#0c2340] text-white text-left">
            <th class="px-4 py-3 font-semibold">Order</th>
            <th class="px-4 py-3 font-semibold">Name</th>
            <th class="px-4 py-3 font-semibold">Slug</th>
            <th class="px-4 py-3 font-semibold">Base price</th>
            <th class="px-4 py-3 font-semibold">Popular</th>
            <th class="px-4 py-3 font-semibold">Active</th>
            <th class="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(pkg, index) in packages"
            :key="pkg.id"
            class="border-b border-slate-100"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50'"
          >
            <td class="px-4 py-3">{{ pkg.sort_order ?? '—' }}</td>
            <td class="px-4 py-3 font-semibold text-[#0c2340]">{{ pkg.name }}</td>
            <td class="px-4 py-3 text-slate-500">{{ pkg.slug }}</td>
            <td class="px-4 py-3">${{ formatPrice(pkg.price) }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                :class="pkg.is_popular ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'"
              >
                {{ pkg.is_popular ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                :class="pkg.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'"
              >
                {{ pkg.is_active ? 'Active' : 'Off' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <NuxtLink
                :to="`/admin/products/packages/${pkg.id}`"
                class="inline-block px-3 py-1.5 rounded-lg bg-[#0c2340] text-white text-xs font-semibold hover:bg-[#F49322] no-underline"
              >
                Edit
              </NuxtLink>
              <NuxtLink
                :to="`/admin/products/package-skus?package_id=${pkg.id}`"
                class="inline-block px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#F49322] no-underline"
              >
                View SKUs
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="!packages.length" class="text-center py-12 text-slate-500">No packages found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

type PackageRow = {
  id: string | number
  name: string
  slug: string
  price?: number | string | null
  sort_order?: number | null
  is_popular?: boolean
  is_active?: boolean
}

const supabase = useSupabaseClient()
const db = supabase as any

const loading = ref(true)
const packages = ref<PackageRow[]>([])

const formatPrice = (v: number | string | null | undefined) => {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v)
  return Number.isFinite(n) ? n.toFixed(2) : '0.00'
}

const loadPackages = async () => {
  loading.value = true
  try {
    const { data, error } = await db
      .from('packages')
      .select('id, name, slug, price, sort_order, is_popular, is_active')
      .order('sort_order', { ascending: true })

    if (error) throw error
    packages.value = data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadPackages)
</script>