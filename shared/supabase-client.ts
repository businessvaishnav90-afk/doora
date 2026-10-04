import { createClient } from '@supabase/supabase-js';

// These would normally be loaded from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Common Authentication Helper Functions
 */

export const signInWithPhone = async (phone: string) => {
  return await supabase.auth.signInWithOtp({
    phone,
  });
};

export const verifyPhoneOtp = async (phone: string, token: string) => {
  return await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return { ...user, profile };
};

/**
 * Database Fetching Helpers
 */

export const getServiceCategories = async () => {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
};

export const getCustomerActiveJobs = async (customerId: string) => {
  const { data, error } = await supabase
    .from('job_requests')
    .select('*, service_categories(name)')
    .eq('customer_id', customerId)
    .neq('job_status', 'completed')
    .neq('job_status', 'cancelled')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customer jobs:', error);
    return [];
  }
  return data;
};

export const getWorkerActiveJobs = async (workerId: string) => {
  const { data, error } = await supabase
    .from('job_requests')
    .select('*, service_categories(name), users!customer_id(full_name, phone_number)')
    .eq('worker_id', workerId)
    .neq('job_status', 'completed')
    .neq('job_status', 'cancelled')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching worker jobs:', error);
    return [];
  }
  return data;
};

/**
 * Realtime Subscriptions & Sync
 */

export const subscribeToJobUpdates = (callback: (payload: any) => void) => {
  return supabase
    .channel('job_updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'job_requests' }, callback)
    .subscribe();
};

export const unsubscribeFromJobUpdates = (channel: any) => {
  supabase.removeChannel(channel);
};

/**
 * Play Store Compliance: Account Deletion API
 */
export const requestAccountDeletion = async (userId: string) => {
  try {
    // Soft delete / anonymize PII
    const { error: profileError } = await supabase
      .from('users')
      .update({
        full_name: 'Deleted User',
        phone_number: '0000000000',
        account_status: 'pending_deletion',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (profileError) throw profileError;

    // Trigger Supabase Auth signOut to kill local session
    await signOut();
    
    return { success: true };
  } catch (err: any) {
    console.error('Account deletion error:', err);
    return { error: err.message };
  }
};
