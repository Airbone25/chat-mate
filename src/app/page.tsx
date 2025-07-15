"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [gender, setGender] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("gender");
    if (saved) router.push("/chat");
  }, [router]);

  const chooseGender = (g: string) => {
    localStorage.setItem("gender", g);
    setGender(g);
    router.push("/chat");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#111] text-white px-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-3xl font-semibold">Find a friend who gets you.</h1>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => chooseGender("male")}
            className="px-6 py-2 rounded-full bg-[#2a2a2a] hover:bg-[#444] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Male
          </button>
          <button
            onClick={() => chooseGender("female")}
            className="px-6 py-2 rounded-full bg-[#2a2a2a] hover:bg-[#444] focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          >
            Female
          </button>
        </div>
        {gender && <p className="text-sm text-gray-400">Redirecting...</p>}
      </div>
    </main>
  );
}
