import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PersonalityJson, PersonalityRow } from "@/lib/supabase";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const { phoneNumber, personality } = (await req.json()) as {
    phoneNumber: string;
    personality: PersonalityJson;
  };

  if (!phoneNumber || !personality?.ocean) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = getSupabase();

  const row = {
    phone_number: phoneNumber,
    openness: personality.ocean.openness,
    conscientiousness: personality.ocean.conscientiousness,
    extraversion: personality.ocean.extraversion,
    agreeableness: personality.ocean.agreeableness,
    neuroticism: personality.ocean.neuroticism,
    interests: personality.interests,
    fun_fact: personality.fun_fact,
    spirit_animal: personality.spirit_animal,
    spirit_animal_reason: personality.spirit_animal_reason,
    spirit_animal_emoji: personality.spirit_animal_emoji,
    updated_at: new Date().toISOString(),
  };

  const { error: upsertError } = await supabase
    .from("personalities")
    .upsert(row, { onConflict: "phone_number" });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  const { data: matches, error: matchError } = await supabase.rpc(
    "find_closest_friends",
    {
      p_phone: phoneNumber,
      p_openness: row.openness,
      p_conscientiousness: row.conscientiousness,
      p_extraversion: row.extraversion,
      p_agreeableness: row.agreeableness,
      p_neuroticism: row.neuroticism,
    }
  );

  if (matchError) {
    return NextResponse.json({ error: matchError.message }, { status: 500 });
  }

  return NextResponse.json({ friends: matches as PersonalityRow[] });
}
