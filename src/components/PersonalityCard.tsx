"use client";

import dynamic from "next/dynamic";
import { PersonalityRow } from "@/lib/supabase";

const RadarChart = dynamic(() => import("./RadarChart"), { ssr: false });

type Props = {
  person: PersonalityRow;
  rank: number;
};

export default function PersonalityCard({ person, rank }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-3xl select-none">
          {person.spirit_animal_emoji}
        </div>
        <div>
          <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider">
            Match #{rank}
          </p>
          <p className="text-sm text-gray-300 font-semibold capitalize">
            {person.spirit_animal}
          </p>
          <p className="text-xs text-gray-500">{person.phone_number}</p>
        </div>
      </div>

      <div className="w-full max-w-[220px] mx-auto">
        <RadarChart
          openness={person.openness}
          conscientiousness={person.conscientiousness}
          extraversion={person.extraversion}
          agreeableness={person.agreeableness}
          neuroticism={person.neuroticism}
        />
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">
          Interests
        </p>
        <div className="flex flex-wrap gap-1.5">
          {person.interests.map((interest) => (
            <span
              key={interest}
              className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-700/50"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">
          Fun Fact
        </p>
        <p className="text-sm text-gray-300 italic">&ldquo;{person.fun_fact}&rdquo;</p>
      </div>
    </div>
  );
}
