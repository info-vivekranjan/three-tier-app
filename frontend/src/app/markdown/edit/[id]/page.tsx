"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getMarkdownDoc, updateMarkdownDoc } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Input, Select, Button, CATEGORIES, PageHeader, Skeleton } from "@/components/ui";
import Link from "next/link";

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|l|p])(.+)$/gm, "<p>$1</p>");
}

export default function EditMarkdownPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMarkdownDoc(id).then((res) => {
      setTitle(res.data.title);
      setCategory(res.data.category);
      setContent(res.data.content || "");
    }).finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!title || !category) return setError("Title and category are required");
    setLoading(true);
    setError("");
    try {
      await updateMarkdownDoc(id, { title, category, content });
      router.push("/markdown");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <PageHeader
          title="Edit Markdown"
          subtitle="Update your markdown file"
          action={<Link href="/markdown"><Button variant="ghost">← Back</Button></Link>}
        />

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        {fetching ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-14" />
            <Skeleton className="h-64" />
          </div>
        ) : (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Title" placeholder="File title…" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" disabled>Select a category…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>

            <div className="flex items-center gap-1 bg-stone-950 rounded-xl p-1 self-start">
              <button onClick={() => setPreview(false)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!preview ? "bg-stone-800 text-stone-100" : "text-stone-500 hover:text-stone-300"}`}>
                ✏️ Editor
              </button>
              <button onClick={() => setPreview(true)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${preview ? "bg-stone-800 text-stone-100" : "text-stone-500 hover:text-stone-300"}`}>
                👁 Preview
              </button>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-stone-400 font-mono">Markdown</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all text-sm font-mono resize-none leading-relaxed"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-stone-400">Preview</label>
                <div
                  className="flex-1 px-5 py-4 bg-stone-950 border border-stone-700 rounded-xl text-stone-300 text-sm leading-relaxed overflow-auto prose-dark min-h-[400px]"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
              </div>
            </div>

            <div className="lg:hidden">
              {!preview ? (
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16}
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-sm font-mono resize-none" />
              ) : (
                <div className="px-5 py-4 bg-stone-950 border border-stone-700 rounded-xl text-stone-300 text-sm leading-relaxed min-h-64 prose-dark"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="primary" onClick={handleSubmit} disabled={loading} className="flex-1 py-3">
                {loading ? "Saving…" : "Update File"}
              </Button>
              <Link href="/markdown" className="flex-1">
                <Button variant="secondary" className="w-full py-3">Cancel</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
