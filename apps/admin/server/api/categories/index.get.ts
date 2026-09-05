import { serverSupabaseClient } from '#supabase/server'

type Category = {
    id: string
    name: string
}

type CategoriesResponse = {
    categories: Category[]
}

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event);

    const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

    if (error) {
        console.error("categories list", error);
        throw createError({
            statusCode: 500,
            message: "Failed to load categories",
        });
    }

    const response: CategoriesResponse = {
        categories: data || []
    };

    return response;
});