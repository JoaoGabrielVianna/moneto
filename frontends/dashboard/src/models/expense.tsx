export interface Expense {
    id: string;
    user_id: string;
    category_id: string;
    amount: string;
    description: string;
    date: Date;
    notes: string;
    created_at: Date;
    updated_at: Date;

}