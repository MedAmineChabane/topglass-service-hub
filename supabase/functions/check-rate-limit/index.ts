import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit configuration
const MAX_REQUESTS = 5; // Maximum requests per window
const WINDOW_MINUTES = 15; // Time window in minutes

interface RateLimitRequest {
  endpoint: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from headers (Cloudflare/proxy headers first, then fallback)
    const clientIP = 
      req.headers.get('cf-connecting-ip') || 
      req.headers.get('x-real-ip') || 
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    console.log(`Rate limit check for IP: ${clientIP}`);

    // Parse request body
    const { endpoint }: RateLimitRequest = await req.json();

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Endpoint is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for bypassing RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate window start time
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

    // Clean up old rate limit entries (older than 1 hour)
    await supabase.rpc('cleanup_old_rate_limits');

    // Check existing rate limit entries for this IP and endpoint
    const { data: existingEntries, error: selectError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('ip_address', clientIP)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart);

    if (selectError) {
      console.error('Error checking rate limits:', selectError);
      // On error, allow the request to proceed (fail open for better UX)
      return new Response(
        JSON.stringify({ allowed: true, remaining: MAX_REQUESTS }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate total requests in window
    const totalRequests = existingEntries?.reduce((sum, entry) => sum + (entry.request_count || 1), 0) || 0;

    console.log(`IP ${clientIP} has ${totalRequests} requests for ${endpoint} in the last ${WINDOW_MINUTES} minutes`);

    // Check if rate limit exceeded
    if (totalRequests >= MAX_REQUESTS) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          remaining: 0,
          message: 'Trop de demandes. Veuillez réessayer dans quelques minutes.',
          retryAfter: WINDOW_MINUTES * 60
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(WINDOW_MINUTES * 60)
          } 
        }
      );
    }

    // Record this request
    const { error: insertError } = await supabase
      .from('rate_limits')
      .insert({
        ip_address: clientIP,
        endpoint: endpoint,
        request_count: 1,
        window_start: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error recording rate limit:', insertError);
      // Still allow the request even if we couldn't record it
    }

    const remaining = MAX_REQUESTS - totalRequests - 1;
    console.log(`Request allowed for IP: ${clientIP}, remaining: ${remaining}`);

    return new Response(
      JSON.stringify({ 
        allowed: true, 
        remaining: Math.max(0, remaining)
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow the request to proceed
    return new Response(
      JSON.stringify({ allowed: true, remaining: MAX_REQUESTS }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
