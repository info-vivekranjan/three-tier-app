"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTextDoc } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Input, Select, Button, CATEGORIES, PageHeader } from "@/components/ui";
import Link from "next/link";

export default function CreateParaGraphixPage() {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<unknown>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || quillRef.current) return;
    import("quill").then(({ default: Quill }) => {
      if (!editorRef.current || quillRef.current) return;
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Start writing your document…",
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
      quillRef.current = quill;
    });
  }, []);

  const handleSubmit = async () => {
    if (!title || !category) return setError("Title and category are required");
    const quill = quillRef.current as { root: HTMLElement } | null;
    const content = quill?.root?.innerHTML || "";
    if (!content || content === "<p><br></p>") return setError("Content cannot be empty");
    setLoading(true);
    setError("");
    try {
      await createTextDoc({ title, category, content });
      router.push("/paragraphix");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <PageHeader
          title="New Document"
          subtitle="Rich text editor"
          action={<Link href="/paragraphix"><Button variant="ghost">← Back</Button></Link>}
        />

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
        )}

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
              {loading ? "Saving…" : "Save Document"}
            </Button>
            <Link href="/paragraphix" className="flex-1">
              <Button variant="secondary" className="w-full py-3">Cancel</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
