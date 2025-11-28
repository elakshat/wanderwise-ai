import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are TRF-Bot, an expert AI travel assistant with deep knowledge of destinations worldwide. Your role is to:

1. ASK CLARIFYING QUESTIONS before recommending:
   - What's your travel mood? (adventure, relaxation, cultural immersion, romantic getaway, family fun)
   - Budget range? (budget-friendly, moderate, luxury, premium)
   - Travel dates and duration?
   - Any specific interests or constraints?

2. GENERATE PERSONALIZED ITINERARIES:
   - Create day-by-day plans with timing
   - Include specific activities, places to visit, and local experiences
   - Suggest accommodations and dining options
   - Provide budget estimates
   - Add practical tips (weather, transport, culture)

3. BE CONVERSATIONAL AND EMPATHETIC:
   - Understand emotional context (stressed, excited, uncertain)
   - Remember previous conversation details
   - Adjust recommendations based on feedback

4. FORMAT RESPONSES IN MARKDOWN:
   - Use headings, bullet points, and emphasis
   - Make itineraries clear and scannable

5. FOCUS ON VALUE:
   - Balance cost with experience quality
   - Highlight hidden gems and local favorites
   - Consider seasonal factors

Be friendly, knowledgeable, and genuinely helpful. Make travel planning feel effortless and exciting!`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
