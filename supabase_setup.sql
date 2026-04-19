-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS personalities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  openness FLOAT NOT NULL,
  conscientiousness FLOAT NOT NULL,
  extraversion FLOAT NOT NULL,
  agreeableness FLOAT NOT NULL,
  neuroticism FLOAT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  fun_fact TEXT NOT NULL DEFAULT '',
  spirit_animal TEXT NOT NULL DEFAULT '',
  spirit_animal_reason TEXT NOT NULL DEFAULT '',
  spirit_animal_emoji TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Euclidean distance search, excluding the caller's own email, returns top 4
CREATE OR REPLACE FUNCTION find_closest_friends(
  p_email TEXT,
  p_openness FLOAT,
  p_conscientiousness FLOAT,
  p_extraversion FLOAT,
  p_agreeableness FLOAT,
  p_neuroticism FLOAT
)
RETURNS SETOF personalities
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM personalities
  WHERE email <> p_email
  ORDER BY
    SQRT(
      POW(openness           - p_openness, 2) +
      POW(conscientiousness  - p_conscientiousness, 2) +
      POW(extraversion       - p_extraversion, 2) +
      POW(agreeableness      - p_agreeableness, 2) +
      POW(neuroticism        - p_neuroticism, 2)
    ) ASC
  LIMIT 4;
$$;

-- Migration: run these if you already have the table with phone_number
-- ALTER TABLE personalities RENAME COLUMN phone_number TO email;
DROP FUNCTION IF EXISTS find_closest_friends(TEXT,FLOAT,FLOAT,FLOAT,FLOAT,FLOAT);
