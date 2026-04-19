"use client";

import { useState, useRef } from "react";
import { PersonalityJson, PersonalityRow } from "@/lib/supabase";
import PersonalityCard from "./PersonalityCard";

const MAX_OCEAN_DIST = Math.sqrt(5);

function oceanMatchScore(a: PersonalityRow, b: PersonalityJson["ocean"]): number {
  const dist = Math.sqrt(
    (a.openness - b.openness) ** 2 +
    (a.conscientiousness - b.conscientiousness) ** 2 +
    (a.extraversion - b.extraversion) ** 2 +
    (a.agreeableness - b.agreeableness) ** 2 +
    (a.neuroticism - b.neuroticism) ** 2
  );
  return Math.round((1 - dist / MAX_OCEAN_DIST) * 100);
}

type Step = "phone" | "otp" | "form";

export default function UploadForm() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<PersonalityRow[] | null>(null);
  const [myOcean, setMyOcean] = useState<PersonalityJson["ocean"] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!phone.trim()) return setError("Phone number is required.");
    setStep("otp");
  }

  function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!otp.trim()) return setError("Please enter a code.");
    setStep("form");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFriends(null);

    if (!file) return setError("Please select a JSON file.");

    let personality: PersonalityJson;
    try {
      const text = await file.text();
      personality = JSON.parse(text);
    } catch {
      return setError("Could not parse JSON file.");
    }

    if (!personality.ocean) {
      return setError("JSON must contain an `ocean` field with OCEAN scores.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone.trim(), personality }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      setFriends(data.friends);
      setMyOcean(personality.ocean);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {step === "phone" && (
        <form
          onSubmit={handleSendCode}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col gap-5 shadow-xl"
        >
          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-3 transition"
          >
            Send Code
          </button>
        </form>
      )}

      {step === "otp" && (
        <form
          onSubmit={handleVerifyCode}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col gap-5 shadow-xl"
        >
          <p className="text-gray-400 text-sm">
            Enter the code sent to <span className="text-gray-200">{phone}</span>.
          </p>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="otp">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition tracking-widest text-center text-lg"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-3 transition"
          >
            Verify
          </button>

          <button
            type="button"
            onClick={() => { setStep("phone"); setError(null); setOtp(""); }}
            className="text-gray-500 hover:text-gray-300 text-sm transition"
          >
            ← Use a different number
          </button>
        </form>
      )}

      {step === "form" && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col gap-5 shadow-xl"
        >
          <p className="text-green-400 text-sm">✓ Verified: {phone}</p>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Personality JSON
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-gray-600 hover:border-indigo-500 rounded-lg p-6 text-center transition"
            >
              {file ? (
                <p className="text-indigo-300 text-sm">{file.name}</p>
              ) : (
                <p className="text-gray-500 text-sm">
                  Click to select your <span className="text-gray-300">personality.json</span>
                </p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 transition"
          >
            {loading ? "Finding your matches…" : "Upload & Find Friends"}
          </button>
        </form>
      )}

      {friends !== null && (
        <div className="mt-10">
          {friends.length === 0 ? (
            <p className="text-center text-gray-400 text-sm">
              No other personalities in the database yet. Be the first!
            </p>
          ) : (
            <>
              <h2 className="text-center text-gray-300 text-lg font-semibold mb-6">
                Your closest matches
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {friends.map((f, i) => (
                  <PersonalityCard
                    key={f.id}
                    person={f}
                    rank={i + 1}
                    matchScore={myOcean ? oceanMatchScore(f, myOcean) : 0}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
