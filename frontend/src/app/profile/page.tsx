"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.token) router.push("/login");
  }, [user]);

  if (!user) return null;

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stats = [
    { label: "Account type", value: "Pro" },
    { label: "Member since", value: new Date().getFullYear().toString() },
  ];

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-stone-100">Profile</h1>
          <p className="text-stone-500 mt-1 text-sm">Your account details</p>
        </div>

        {/* Avatar card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-amber-500/20 via-stone-800 to-purple-500/20" />

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-12 mb-5">
              <div className="w-20 h-20 rounded-full border-4 border-stone-900 overflow-hidden bg-amber-400 flex items-center justify-center">
                {user.pic ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.pic.replace("uploads/", "")}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-stone-950 text-xl font-bold font-serif">
                    {initials}
                  </span>
                )}
              </div>
            </div>

            <h2 className="font-serif text-2xl text-stone-100 mb-1">
              {user.name}
            </h2>
            <p className="text-stone-500 text-sm mb-6">{user.email}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-4 py-3"
                >
                  <p className="text-xs text-stone-600 mb-0.5">{s.label}</p>
                  <p className="text-sm font-medium text-stone-300">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Link href="/notes">
                <Button variant="primary">Go to Notes</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
