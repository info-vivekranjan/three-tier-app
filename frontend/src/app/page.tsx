"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.token) router.push("/notes");
  }, [user]);

  const features = [
    {
      icon: "📝",
      title: "Note Maker",
      description: "Create and organize notes with file attachments. Keep everything from images to PDFs in one place.",
      href: "/notes",
      color: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/20",
    },
    {
      icon: "✦",
      title: "ParaGraphix",
      description: "Rich text editor with formatting, image insertion, and PDF export for polished documents.",
      href: "/paragraphix",
      color: "from-purple-500/20 to-purple-600/5",
      border: "border-purple-500/20",
    },
    {
      icon: "#",
      title: "Markdown Editor",
      description: "Full markdown support with live preview. Edit, preview, and download your .md files effortlessly.",
      href: "/markdown",
      color: "from-cyan-500/20 to-cyan-600/5",
      border: "border-cyan-500/20",
    },
  ];

  return (
    <main className="min-h-screen bg-stone-950 overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-serif text-stone-950 font-bold text-sm">N</div>
          <span className="font-serif text-lg text-stone-100">NoteMaster</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm text-stone-400 hover:text-stone-100 transition-colors">Login</Link>
          <Link href="/register" className="px-4 py-2 text-sm bg-amber-400 text-stone-950 rounded-xl font-medium hover:bg-amber-300 transition-colors">
            Get started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 pt-16 pb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Your productivity companion
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl text-stone-100 leading-tight mb-6">
          Write, think,{" "}
          <span className="italic text-amber-400">create.</span>
        </h1>
        <p className="text-stone-400 text-lg sm:text-xl max-w-xl leading-relaxed mb-10">
          NoteMaster Pro brings together notes, rich text, and markdown in one elegant workspace — everything you need, nothing you don&apos;t.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/register" className="px-6 py-3 bg-amber-400 text-stone-950 rounded-xl font-medium hover:bg-amber-300 transition-all hover:scale-105 text-sm">
            Start for free
          </Link>
          <Link href="/login" className="px-6 py-3 bg-stone-900 border border-stone-700 text-stone-300 rounded-xl hover:bg-stone-800 transition-all text-sm">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`p-6 rounded-2xl bg-gradient-to-b ${f.color} border ${f.border} backdrop-blur-sm`}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-serif text-xl text-stone-100 mb-2">{f.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-800 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-stone-600 text-sm">© 2024 NoteMaster Pro</span>
          <span className="text-stone-700 text-sm font-serif italic">write without limits</span>
        </div>
      </footer>
    </main>
  );
}
