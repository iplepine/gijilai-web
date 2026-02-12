import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

// Type definitions mapped from Supabase types
export type UserProfile = Database['public']['Tables']['profiles']['Row'];
export type ChildProfile = Database['public']['Tables']['children']['Row'];
export type SurveyData = Database['public']['Tables']['surveys']['Row'];
export type ReportData = Database['public']['Tables']['reports']['Row'];

export const db = {
    // --- Profile ---
    getUserProfile: async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data as UserProfile;
    },

    updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
        if (error) throw error;
        return data as UserProfile;
    },

    // --- Children ---
    getChildren: async (userId: string) => {
        const { data, error } = await supabase
            .from('children')
            .select('*')
            .eq('parent_id', userId)
            .order('birth_date', { ascending: false });
        if (error) throw error;
        return data as ChildProfile[];
    },

    createChild: async (child: Omit<ChildProfile, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('children')
            .insert(child)
            .select()
            .single();
        if (error) throw error;
        return data as ChildProfile;
    },

    updateChildProfile: async (childId: string, updates: Partial<ChildProfile>) => {
        const { data, error } = await supabase
            .from('children')
            .update(updates)
            .eq('id', childId)
            .select()
            .single();
        if (error) throw error;
        return data as ChildProfile;
    },

    // --- Surveys ---
    saveSurvey: async (survey: Partial<SurveyData>) => {
        const { data, error } = await supabase
            .from('surveys')
            .upsert(survey)
            .select()
            .single();
        if (error) throw error;
        return data as SurveyData;
    },

    getSurveys: async (userId: string) => {
        const { data, error } = await supabase
            .from('surveys')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as SurveyData[];
    },

    // --- Reports ---
    saveReport: async (report: Partial<ReportData>) => {
        const { data, error } = await supabase
            .from('reports')
            .insert(report)
            .select()
            .single();
        if (error) throw error;
        return data as ReportData;
    },

    getReports: async (userId: string) => {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as ReportData[];
    },

    // --- Dashboard Data Aggregation ---
    getDashboardData: async (userId: string) => {
        const [profile, children, reports, surveys] = await Promise.all([
            db.getUserProfile(userId).catch(() => null),
            db.getChildren(userId).catch(() => []),
            db.getReports(userId).catch(() => []),
            db.getSurveys(userId).catch(() => [])
        ]);

        return {
            profile,
            children,
            reports,
            surveys,
            latestSurvey: surveys.find(s => s.type === 'CHILD') || null,
            parentSurvey: surveys.find(s => s.type === 'PARENT') || null
        };
    },

    // --- Storage ---
    uploadChildAvatar: async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `child-avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        return data.publicUrl;
    },

    resetUserData: async (userId: string) => {
        // Delete all data related to the user
        const resetChildren = supabase.from('children').delete().eq('parent_id', userId);
        const resetSurveys = supabase.from('surveys').delete().eq('user_id', userId);
        const resetReports = supabase.from('reports').delete().eq('user_id', userId);

        const results = await Promise.all([resetChildren, resetSurveys, resetReports]);

        results.forEach(({ error }) => {
            if (error) throw error;
        });
    }
};
