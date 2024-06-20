import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
	const supabaseUrl = process.env.SUPABASE_URL;
	if (!supabaseUrl) {
		throw new Error("Missing SUPABASE_URL environment variable");
	}
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
	if (!supabaseAnonKey) {
		throw new Error("Missing SUPABASE_ANON_KEY environment variable");
	}
	// Create a supabase client on the browser with project's credentials
	return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
