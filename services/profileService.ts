import { supabase } from '../supabaseClient';

type ProfilePatch = {
  name?: string | null;
  interests?: string[] | null;
  meeting_places?: string[] | null;
  expo_push_token?: string | null;
  last_seen?: string | null | Date;
};

/**
 * Try to upsert a profile. Prefer using `id` column (auth uid) first to match schema
 * `id uuid DEFAULT auth.uid()`. Falls back to `auth_id` if present in schema.
 */
export async function upsertProfileForAuthUser(authUser: any, patch: ProfilePatch) {
  const authId = authUser?.id;
  if (!authId) throw new Error('authUser.id is required');

  const base = {
    name: patch.name ?? null,
    interests: patch.interests ?? null,
    meeting_places: patch.meeting_places ?? null,
    expo_push_token: patch.expo_push_token ?? null,
    last_seen: patch.last_seen instanceof Date ? patch.last_seen.toISOString() : patch.last_seen ?? null,
  } as any;

  // Try upsert by `id` first (recommended for your schema)
  try {
    const byId = { id: authId, ...base } as any;
    const { data, error } = await supabase.from('profiles').upsert(byId, { onConflict: 'id' }).select().maybeSingle();
    if (error) throw error;
    if (data) return data;
  } catch (err) {
    console.warn('id upsert failed, falling back to auth_id upsert', err);
  }

  // Fallback: try to upsert using auth_id column
  try {
    const byAuthId = { auth_id: authId, ...base } as any;
    const { data, error } = await supabase.from('profiles').upsert(byAuthId, { onConflict: 'auth_id' }).select().maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('auth_id upsert failed', err);
    throw err;
  }
}

export async function getProfileByAuthId(authId: string) {
  if (!authId) return null;
  // Try auth_id first
  try {
    const { data } = await supabase.from('profiles').select('*').eq('auth_id', authId).maybeSingle();
    if (data) return data;
  } catch (err) {
    // ignore
  }

  // Fallback: try id
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', authId).maybeSingle();
    return data ?? null;
  } catch (err) {
    return null;
  }
}
