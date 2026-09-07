import { getSupabase } from '~~/server/utils/supabase'

type DashboardOrder = {
    id: number | string;
    order_number: string;
    billing_first_name?: string | null;
    billing_last_name?: string | null;
    billing_email?: string | null;
    total: number | string | null;
    status: string | null;
    created_at: string | null;
}

type OrderItemRow = {
    product_name: string | null;
    quantity: number | null;
}

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        // Fetch orders
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select(
                "id, order_number, billing_first_name, billing_last_name, billing_email, total, status, created_at",
            )
            .order("created_at", { ascending: false })

        if (ordersError) throw ordersError

        const list: DashboardOrder[] = (orders || []) as DashboardOrder[]

        // Calculate stats
        const stats = {
            totalOrders: list.length,
            pendingOrders: list.filter((o) => o.status === "pending").length,
            monthlyRevenue: 0,
            activeProducts: 0,
        }

        // Calculate monthly revenue
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        stats.monthlyRevenue = list
            .filter((o) => {
                if (!o.created_at) return false
                if (["cancelled", "refunded"].includes(String(o.status))) return false
                const d = new Date(o.created_at)
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear
            })
            .reduce((sum, o) => sum + (Number(o.total) || 0), 0)

        // Get recent orders (first 5)
        const recentOrders = list.slice(0, 5)

        // Calculate analytics
        const paid = list.filter(
            (o) => !["cancelled", "refunded"].includes(String(o.status)),
        )

        const avgOrderValue = paid.length
            ? paid.reduce((s, o) => s + (Number(o.total) || 0), 0) / paid.length
            : 0

        const completed = list.filter((o) => o.status === "completed").length
        const conversionRate = list.length
            ? Math.round((completed / list.length) * 100)
            : 0

        // Build sales trend
        const days = 30
        const map = new Map<string, number>()
        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(todayDate)
            d.setDate(d.getDate() - i)
            map.set(d.toISOString().slice(0, 10), 0)
        }

        list.forEach((o) => {
            if (!o.created_at) return
            if (["cancelled", "refunded"].includes(String(o.status))) return
            const key = new Date(o.created_at).toISOString().slice(0, 10)
            if (map.has(key)) {
                map.set(key, (map.get(key) || 0) + (Number(o.total) || 0))
            }
        })

        const salesTrend = [...map.entries()].map(([key, total]) => ({
            label: new Date(key + "T00:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            total,
        }))

        // Get top product
        let topProduct = "—"
        const { data: items } = await supabase
            .from("order_items")
            .select("product_name, quantity")

        const rows = (items || []) as OrderItemRow[]
        if (rows.length) {
            const counts: Record<string, number> = {}
            rows.forEach((row) => {
                const name = row.product_name || "Unknown"
                counts[name] = (counts[name] || 0) + (Number(row.quantity) || 1)
            })
            topProduct = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
        }

        // Get active products count
        const { count: productCount, error: productsError } = await supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true)

        if (!productsError) {
            stats.activeProducts = productCount || 0
        }

        return {
            success: true,
            stats,
            analytics: {
                topProduct,
                conversionRate,
                avgOrderValue,
            },
            recentOrders,
            salesTrend,
        }
    } catch (error) {
        console.error("Dashboard error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to load dashboard data",
            stats: {
                totalOrders: 0,
                monthlyRevenue: 0,
                activeProducts: 0,
                pendingOrders: 0,
            },
            analytics: {
                topProduct: "—",
                conversionRate: 0,
                avgOrderValue: 0,
            },
            recentOrders: [],
            salesTrend: [],
        }
    }
})