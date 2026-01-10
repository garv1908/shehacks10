import { supabase } from '../supabaseClient';

type ProfilePatch = {
  name?: string | null;
  interests?: string[] | null;
  meeting_places?: string[] | null;
  expo_push_token?: string | null;
  last_seen?: string | null | Date;
  needs_onboarding?: boolean | null;
};

/**
 * Try to upsert a profile. Prefer using `id` column (auth uid) first to match schema
 * `id uuid DEFAULT auth.uid()`. Falls back to `auth_id` if present in schema.
 */
export async function upsertProfileForAuthUser(authUser: any, patch: ProfilePatch) {
  const authId = authUser?.id;
  if (!authId) throw new Error('authUser.id is required');
  // Ensure we never attempt to insert a row with a NULL `name` if the DB requires it.
  // Prefer existing values when patch doesn't include them.
  const existing = await getProfileByAuthId(authId);

  const payload: any = { id: authId };

  // name: use patch if provided, else existing, else empty string to satisfy NOT NULL
  if ('name' in patch) payload.name = patch.name ?? '';
  else payload.name = existing?.name ?? '';

  if ('interests' in patch) payload.interests = patch.interests ?? null;
  else if (existing?.interests) payload.interests = existing.interests;

  if ('meeting_places' in patch) payload.meeting_places = patch.meeting_places ?? null;
  else if (existing?.meeting_places) payload.meeting_places = existing.meeting_places;

  if ('expo_push_token' in patch) payload.expo_push_token = patch.expo_push_token ?? null;
  else if (existing?.expo_push_token) payload.expo_push_token = existing.expo_push_token;

  if ('last_seen' in patch) payload.last_seen = patch.last_seen instanceof Date ? patch.last_seen.toISOString() : patch.last_seen ?? null;
  else if (existing?.last_seen) payload.last_seen = existing.last_seen;

  if ('needs_onboarding' in patch) payload.needs_onboarding = patch.needs_onboarding ?? null;
  else if (existing?.needs_onboarding !== undefined) payload.needs_onboarding = existing.needs_onboarding;

  console.log('[profileService] upsertProfileForAuthUser authId=', authId, 'payload=', payload);
  const { data, error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' }).select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function getProfileByAuthId(authId: string) {
  if (!authId) return null;
  // Query by `id` only
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', authId).maybeSingle();
    return data ?? null;
  } catch (err) {
    return null;
  }
}

// Update an existing profile row only. Returns the updated row or null if no row existed.
export async function updateProfileIfExists(authUser: any, patch: ProfilePatch) {
  const authId = authUser?.id;
  if (!authId) throw new Error('authUser.id is required');

  const updates: any = {};
  if ('name' in patch) updates.name = patch.name ?? null;
  if ('interests' in patch) updates.interests = patch.interests ?? null;
  if ('meeting_places' in patch) updates.meeting_places = patch.meeting_places ?? null;
  if ('expo_push_token' in patch) updates.expo_push_token = patch.expo_push_token ?? null;
  if ('last_seen' in patch) updates.last_seen = patch.last_seen instanceof Date ? patch.last_seen.toISOString() : patch.last_seen ?? null;
  if ('needs_onboarding' in patch) updates.needs_onboarding = patch.needs_onboarding ?? null;

  if (Object.keys(updates).length === 0) return null;

  console.log('[profileService] updateProfileIfExists authId=', authId, 'updates=', updates);
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', authId).select().maybeSingle();
  if (error) throw error;
  return data ?? null;
}
