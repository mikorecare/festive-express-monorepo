export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const page = parseInt(query.page as string) || 1;
    const pageSize = parseInt(query.pageSize as string) || 20;
    const status = query.status as string || undefined;
    const demo = config.elavonDemo;

    const merchantId = config.elavonAccountId;
    const applicationKey = config.elavonPartnerAppId;
    const consumerKey = config.elavonConsumerKey;
    const consumerSecret = config.elavonConsumerSecret;

    if (!merchantId || !applicationKey || !consumerKey || !consumerSecret) {
        throw createError({
            statusCode: 500,
            message: 'Missing Elavon API credentials',
        });
    }

    try {
        const result = await fetchConvergeInvoices({
            page,
            pageSize,
            merchantId,
            applicationKey,
            consumerKey,
            consumerSecret,
            demo,
            status,
        });

        if (!result.success) {
            throw createError({
                statusCode: 500,
                message: result.error || 'Failed to fetch invoices',
            });
        }

        return {
            success: true,
            data: result.data,
            page: result.page,
            pageSize: result.pageSize,
            totalCount: result.totalCount || 0,
        };

    } catch (error: any) {
        console.error('Invoice fetch error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch invoices',
        });
    }
});

async function fetchConvergeInvoices(params: {
    page: number;
    pageSize: number;
    merchantId: string;
    applicationKey: string;
    consumerKey: string;
    consumerSecret: string;
    demo: boolean;
    status?: string;
}) {
    const {
        page,
        pageSize,
        merchantId,
        applicationKey,
        consumerKey,
        consumerSecret,
        demo,
        status
    } = params;

    // Correct endpoints for Converge REST API
    const authEndpoint = demo
        ? 'https://elavon.com/oauth/token'
        : 'https://elavon.com/oauth/token';

    const baseUrl = demo
        ? 'https://cert-api.elavon.com/ecomm/billing/v2/invoices'
        : 'https://api.elavon.com/ecomm/billing/v2/invoices';

    try {
        // Get OAuth token
        const basicAuth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

        const authResponse = await fetch(authEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: 'grant_type=client_credentials',
        });

        if (!authResponse.ok) {
            const authErr = await authResponse.text();
            console.error('Auth error:', authErr);
            return {
                success: false,
                error: `OAuth token generation failed: ${authErr}`,
            };
        }

        const authData = await authResponse.json();
        const bearerToken = authData.access_token;

        // Build query parameters
        const queryParams = new URLSearchParams({
            'merchant-id': merchantId,
            'type': 'INVOICE',
            'page': page.toString(),
            'pageSize': pageSize.toString(),
        });

        if (status) {
            queryParams.append('status', status);
        }

        // Fetch invoices
        const response = await fetch(`${baseUrl}?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Application-Key': applicationKey,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Invoice fetch error:', errorDetails);
            return {
                success: false,
                error: `Gateway Error (${response.status}): ${errorDetails}`,
            };
        }

        const data = await response.json();

        return {
            success: true,
            page,
            pageSize,
            data: data.items || data,
            totalCount: data.totalCount || data.total || data.length || 0,
        };

    } catch (error: any) {
        console.error('Elavon invoice fetch error:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch invoice catalog',
        };
    }
}