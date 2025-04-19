
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userProfile } = await req.json();

    // Validate API key
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create context from user profile
    const userContext = `
      User Information:
      - Name: ${userProfile.name}
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Health Conditions: ${userProfile.healthConditions?.join(", ") || "None"}
      - Fitness Goal: ${userProfile.fitnessGoal}
    `;

    // Define system prompt
    const systemPrompt = `
      You are an AI health and fitness assistant named Verolix. Your purpose is to help users achieve their fitness goals,
      provide health advice, and answer questions related to exercise, nutrition, and wellness.
      
      Keep responses concise, friendly, and helpful. Always be encouraging and supportive.
      Don't provide medical diagnoses or treatment recommendations - suggest consulting healthcare professionals when appropriate.
      
      Here is information about the user you're helping:
      ${userContext}
    `;

    // Make request to Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          },
          {
            role: "model",
            parts: [{ text: "I understand. I'm Verolix, your AI health and fitness assistant. I'll keep my responses helpful and tailored to your profile. How can I help you today?" }]
          },
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();

    // Log response for debugging
    console.log("Gemini API response:", JSON.stringify(data));

    // Extract the response text
    if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return new Response(
        JSON.stringify({ response: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Handle case when the API doesn't return expected format
      console.error("Unexpected API response format:", data);
      return new Response(
        JSON.stringify({ error: "Failed to generate AI response", details: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
