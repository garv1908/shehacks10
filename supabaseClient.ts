// supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './secrets';

const raw = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function createLoggingProxy<T extends object>(target: T, path: string[] = []): T {
	return new Proxy(target, {
		get(obj: any, prop: string | symbol) {
			const value = obj[prop as any];
			const nextPath = [...path, String(prop)];

			if (typeof value === 'function') {
				return (...args: any[]) => {
					const callId = `${nextPath.join('.')}@${Date.now()}`;
					console.log(`[supabase] call ${callId} ->`, nextPath.join('.'), { args });
					try {
						const result = value.apply(obj, args);
						if (result && typeof result.then === 'function') {
							return result
								.then((res: any) => {
									console.log(`[supabase] result ${callId} <-`, nextPath.join('.'), { res });
									return res;
								})
								.catch((err: any) => {
									console.error(`[supabase] error ${callId} !<-`, nextPath.join('.'), err);
									throw err;
								});
						}
						console.log(`[supabase] sync result ${callId} <-`, nextPath.join('.'), { res: result });
						return result;
					} catch (err) {
						console.error(`[supabase] sync error ${callId} !<-`, nextPath.join('.'), err);
						throw err;
					}
				};
			}

			if (value && typeof value === 'object') {
				return createLoggingProxy(value, nextPath);
			}

			return value;
		},
	}) as T;
}

export const supabase: SupabaseClient = createLoggingProxy(raw) as any;
