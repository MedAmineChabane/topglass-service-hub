import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit configuration (same as lead submission)
const MAX_REQUESTS = 10; // Allow more uploads per window since they're part of form submission
const WINDOW_MINUTES = 15;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max file size
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from headers
    const clientIP = 
      req.headers.get('cf-connecting-ip') || 
      req.headers.get('x-real-ip') || 
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    console.log(`Upload request from IP: ${clientIP}`);

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limit
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    
    const { data: existingEntries, error: rateLimitError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('ip_address', clientIP)
      .eq('endpoint', 'upload-lead-photo')
      .gte('window_start', windowStart);

    if (!rateLimitError) {
      const totalRequests = existingEntries?.reduce((sum, entry) => sum + (entry.request_count || 1), 0) || 0;
      
      if (totalRequests >= MAX_REQUESTS) {
        console.log(`Rate limit exceeded for IP: ${clientIP}`);
        return new Response(
          JSON.stringify({ 
            error: 'Trop de fichiers envoyés. Veuillez réessayer dans quelques minutes.',
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
    }

    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const leadId = formData.get('leadId') as string | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!leadId) {
      return new Response(
        JSON.stringify({ error: 'Lead ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Le fichier est trop volumineux. Maximum 5MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file extension
    const fileName = file.name.toLowerCase();
    const extension = fileName.split('.').pop() || '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return new Response(
        JSON.stringify({ error: 'Type de fichier non autorisé. Formats acceptés: JPG, PNG, GIF, WebP.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate content type
    const contentType = file.type;
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(contentType)) {
      return new Response(
        JSON.stringify({ error: 'Type MIME non autorisé.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate secure filename
    const secureFileName = `${leadId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

    // Read file content
    const fileContent = await file.arrayBuffer();

    // Upload to storage using service role (bypasses RLS)
    const { error: uploadError } = await supabase.storage
      .from('lead-attachments')
      .upload(secureFileName, fileContent, {
        contentType: contentType,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Échec de l\'upload du fichier.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record rate limit entry
    await supabase
      .from('rate_limits')
      .insert({
        ip_address: clientIP,
        endpoint: 'upload-lead-photo',
        request_count: 1,
        window_start: new Date().toISOString()
      });

    console.log(`Successfully uploaded file: ${secureFileName}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        path: secureFileName 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors de l\'upload.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
