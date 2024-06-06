import { createClient } from "./server";

const supabase = createClient();

export const fetchHypercerts = async () => {
    const { data, error } = await supabase.from("claims").select(`
    *,
    metadata:metadata!claims_uri_fkey (
        allow_list_uri,
        contributors,
        description,
        external_url,
        id,
        image,
        impact_scope,
        impact_timeframe_from,
        impact_timeframe_to,
        name,
        parsed,
        properties,
        rights,
        uri,
        work_scope,
        work_timeframe_from,
        work_timeframe_to
    )
    `)

return { data, error }
}