"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getNote, updateNote } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Input, Textarea, Select, Button, CATEGORIES, PageHeader, Skeleton } from "@/components/ui";
import Link from "next/link";

export default function EditNotePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getNote(id).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content);
      setCategory(res.data.category);
    }).finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!title || !content || !category) return setError("All fields required");
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      fd.append("category", category);
      if (file) fd.append("file", file);
      await updateNote(id, fd);
      router.push("/notes");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <PageHeader
          title="Edit Note"
          subtitle="Update your note"
          action={<Link href="/notes"><Button variant="ghost">← Back</Button></Link>}
        />

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        {fetching ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-14" />
            <Skeleton className="h-36" />
            <Skeleton className="h-14" />
          </div>
        ) : (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col gap-5">
            <Input label="Title" placeholder="Note title…" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea label="Content" placeholder="Write your note here…" value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="" disabled>Select a category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-400">Replace attachment <span className="text-stone-600">(optional)</span></label>
              <label htmlFor="file-upload"
                className="flex items-center gap-3 px-4 py-3 bg-stone-950 border border-dashed border-stone-700 rounded-xl cursor-pointer hover:border-amber-400/50 transition-all">
                <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-stone-500">{file ? file.name : "Click to attach a file"}</span>
                <input id="file-upload" type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="primary" onClick={handleSubmit} disabled={loading} className="flex-1 py-3">
                {loading ? "Saving…" : "Update Note"}
              </Button>
              <Link href="/notes" className="flex-1">
                <Button variant="secondary" className="w-full py-3">Cancel</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
