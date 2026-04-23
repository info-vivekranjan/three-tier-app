"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const links = [
    { href: "/notes", label: "Notes" },
    { href: "/paragraphix", label: "ParaGraphix" },
    { href: "/markdown", label: "Markdown" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-serif text-stone-950 font-bold text-sm">
            N
          </div>
          <span className="font-serif text-lg text-stone-100 group-hover:text-amber-400 transition-colors">
            NoteMaster
          </span>
        </Link>

        {/* Nav Links */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  pathname.startsWith(l.href)
                    ? "bg-amber-400/10 text-amber-400"
                    : "text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowLogout(!showLogout)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-stone-950 text-xs font-bold">
                  {user.pic ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.pic?.replace("uploads/", "")}`}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    initials
                  )}
                </div>
                <span className="text-sm text-stone-300 hidden sm:block max-w-24 truncate">
                  {user.name}
                </span>
                <svg
                  className="w-3 h-3 text-stone-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showLogout && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl overflow-hidden">
                  <Link
                    href="/profile"
                    onClick={() => setShowLogout(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-stone-300 hover:bg-stone-800 hover:text-stone-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-stone-800 transition-colors border-t border-stone-800"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-stone-400 hover:text-stone-100 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm bg-amber-400 text-stone-950 rounded-lg font-medium hover:bg-amber-300 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
