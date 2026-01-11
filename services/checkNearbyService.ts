// services/checkNearbyService.ts
import { supabase } from '../supabaseClient';

export async function checkNearby(current_user_id: string) {
  const { data, error } = await supabase.functions.invoke('checkNearby', {
    body: { current_user_id },
  });
  console.log('[checkNearbyService] checkNearby response', { data, error });
  return { data, error };
}
