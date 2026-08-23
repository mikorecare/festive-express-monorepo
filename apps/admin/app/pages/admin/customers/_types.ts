export interface Review {
    id: string;
    order_id: string;
    order_number: string;
    customer_email: string;
    customer_name: string;
    rating_overall: number;
    rating_installation: number | null;
    rating_technicians: number | null;
    comments_installation: string | null;
    comments_technicians: string | null;
    comments_additional: string | null;
    would_recommend: boolean | null;
    status: 'pending' | 'completed' | 'expired';
    survey_token: string;
    token_expires_at: string;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
}