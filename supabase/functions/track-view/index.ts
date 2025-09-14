import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrackViewRequest {
  profileUserId: string
  viewerUserId?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { profileUserId, viewerUserId }: TrackViewRequest = await req.json()

    if (!profileUserId) {
      return new Response(
        JSON.stringify({ error: 'Profile user ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get client info securely
    const userAgent = req.headers.get('user-agent') || ''
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown'

    console.log(`Tracking view for profile: ${profileUserId}, viewer: ${viewerUserId || 'anonymous'}`)

    // Use the secure tracking function we created
    const { data, error } = await supabase.rpc('track_profile_view', {
      p_profile_user_id: profileUserId,
      p_viewer_user_id: viewerUserId || null,
      p_viewer_ip: clientIP,
      p_user_agent: userAgent
    })

    if (error) {
      console.error('Error tracking view:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to track view' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`View tracked successfully: ${data}`)

    return new Response(
      JSON.stringify({ success: true, viewId: data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})