import { createSupabaseClient } from "../_shared/supabase.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RICK_AND_MORTY_API_URL = "https://rickandmortyapi.com/api";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { supabase, accessToken } = createSupabaseClient(req);

    const { data: claimsData, error: claimsError } = await supabase.auth
      .getClaims(accessToken);

    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    const { characterId, characterName, characterImage } = await req.json();

    if (!characterId || !characterName) {
      return new Response(
        JSON.stringify({ error: "Character ID and name are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let characterStatus: string | null = null;
    let characterSpecies: string | null = null;

    try {
      const response = await fetch(
        `${RICK_AND_MORTY_API_URL}/character/${characterId}`,
      );
      if (response.ok) {
        const characterData = await response.json();
        characterStatus = characterData.status || null;
        characterSpecies = characterData.species || null;
      }
    } catch (error) {
      console.error("Error fetching character data:", error);
    }

    const { data, error } = await supabase
      .from("favorite_characters")
      .insert({
        user_id: userId,
        character_id: characterId,
        character_name: characterName,
        character_image: characterImage ?? null,
        character_status: characterStatus,
        character_species: characterSpecies,
      })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Failed to add favorite character" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        id: data.id,
        userId: data.user_id,
        characterId: data.character_id,
        characterName: data.character_name,
        characterImage: data.character_image || null,
        characterStatus: data.character_status || null,
        characterSpecies: data.character_species || null,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
