import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PersonalityRow = {
  id: string;
  phone_number: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  interests: string[];
  fun_fact: string;
  spirit_animal: string;
  spirit_animal_reason: string;
  spirit_animal_emoji: string;
  updated_at: string;
};

export type PersonalityJson = {
  ocean: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  interests: string[];
  fun_fact: string;
  spirit_animal: string;
  spirit_animal_reason: string;
  spirit_animal_emoji: string;
  updated_at: string;
};
