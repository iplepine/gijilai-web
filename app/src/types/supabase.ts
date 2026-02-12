export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    role: string
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    role?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    role?: string
                    created_at?: string
                }
            }
            children: {
                Row: {
                    id: string
                    parent_id: string
                    name: string
                    gender: 'male' | 'female'
                    birth_date: string
                    birth_time: string | null
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    parent_id: string
                    name: string
                    gender: 'male' | 'female'
                    birth_date: string
                    birth_time?: string | null
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    parent_id?: string
                    name?: string
                    gender?: 'male' | 'female'
                    birth_date?: string
                    birth_time?: string | null
                    image_url?: string | null
                    created_at?: string
                }
            }
            surveys: {
                Row: {
                    id: string
                    user_id: string
                    child_id: string | null
                    type: 'PARENT' | 'CHILD' | 'PARENTING_STYLE'
                    answers: Json
                    scores: Json
                    step: number
                    status: 'IN_PROGRESS' | 'COMPLETED'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    child_id?: string | null
                    type: 'PARENT' | 'CHILD' | 'PARENTING_STYLE'
                    answers?: Json
                    scores?: Json
                    step?: number
                    status?: 'IN_PROGRESS' | 'COMPLETED'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    child_id?: string | null
                    type?: 'PARENT' | 'CHILD' | 'PARENTING_STYLE'
                    answers?: Json
                    scores?: Json
                    step?: number
                    status?: 'IN_PROGRESS' | 'COMPLETED'
                    created_at?: string
                    updated_at?: string
                }
            }
            reports: {
                Row: {
                    id: string
                    survey_id: string
                    user_id: string
                    child_id: string | null
                    type: 'PARENT' | 'CHILD'
                    content: string | null
                    analysis_json: Json | null
                    model_used: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    survey_id: string
                    user_id: string
                    child_id?: string | null
                    type: 'PARENT' | 'CHILD'
                    content?: string | null
                    analysis_json?: Json | null
                    model_used?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    survey_id?: string
                    user_id?: string
                    child_id?: string | null
                    type?: 'PARENT' | 'CHILD'
                    content?: string | null
                    analysis_json?: Json | null
                    model_used?: string | null
                    created_at?: string
                }
            }
        }
    }
}
