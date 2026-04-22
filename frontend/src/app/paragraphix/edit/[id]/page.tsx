"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTextDoc, updateTextDoc } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Input, Select, Button, CATEGORIES, PageHeader, Skeleton } from "@/components/ui";
import Link from "next/link";

export default function EditParaGraphixPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<unknown>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [initialContent, setInitialContent] = useState("");

  useEffect(() => {
    getTextDoc(id).then((res) => {
      setTitle(res.data.title);
      setCategory(res.data.category);
      setInitialContent(res.data.content || "");
    }).finally(() => setFetching(false));
  }, [id]);

  useEffect(() => {
    if (fetching || typeof window === "undefined" || quillRef.current) return;
    import("quill").then(({ default: Quill }) => {
      if (!editorRef.current || quillRef.current) return;
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Start writing…",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            [{ color: [] }, { background: [] }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });
      if (initialContent) quill.root.innerHTML = initialContent;
      quillRef.current = quill;
    });
  }, [fetching, initialContent]);

  const handleSubmit = async () => {
    if (!title || !category) return setError("Title and category are required");
    const quill = quillRef.current as { root: HTMLElement } | null;
    const content = quill?.root?.innerHTML || "";
    setLoading(true);
    setError("");
    try {
      await updateTextDoc(id, { title, category, content });
      router.push("/paragraphix");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <PageHeader
          title="Edit Document"
          subtitle="Update your rich text document"
          action={<Link href="/paragraphix"><Button variant="ghost">← Back</Button></Link>}
        />

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        {fetching ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-64" />
          </div>
        ) : (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Title" placeholder="Document title…" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" disabled>Select a category…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-400">Content</label>
              <div className="rounded-xl overflow-hidden border border-stone-700">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css" />
                <div ref={editorRef} style={{ minHeight: "280px" }} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="primary" onClick={handleSubmit} disabled={loading} className="flex-1 py-3">
                {loading ? "Saving…" : "Update Document"}
              </Button>
              <Link href="/paragraphix" className="flex-1">
                <Button variant="secondary" className="w-full py-3">Cancel</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
