import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const { data: customers, error: customersError } = await supabase
            .from("customers")
            .select("id, email, first_name, last_name, full_name, phone, postcode, created_at")
            .order("created_at", { ascending: false })

        if (customersError) throw customersError

        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("billing_email")

        if (ordersError) throw ordersError

        const orderCountMap: Record<string, number> = {}
        orders?.forEach((row: any) => {
            const email = String(row.billing_email || "")
                .trim()
                .toLowerCase()
            if (!email) return
            orderCountMap[email] = (orderCountMap[email] || 0) + 1
        })

        const customersWithOrders = (customers || []).map((customer) => ({
            ...customer,
            order_count: orderCountMap[customer.email?.toLowerCase() || ''] || 0
        }))

        return {
            success: true,
            data: customersWithOrders || []
        }
    } catch (error) {
        console.error("Error fetching customers:", error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : "Failed to fetch customers"
        }
    }
})