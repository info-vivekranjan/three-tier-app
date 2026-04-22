"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMarkdownDocs, deleteMarkdownDoc, MarkdownDoc } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { CategoryBadge, Skeleton, EmptyState, Pagination, PageHeader, Button } from "@/components/ui";

export default function MarkdownPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [docs, setDocs] = useState<MarkdownDoc[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMarkdownDocs(page, 6);
      setDocs(res.data || []);
      setTotalPages(res.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!user?.token) { router.push("/login"); return; }
    fetchDocs();
  }, [user, fetchDocs]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this markdown file?")) return;
    await deleteMarkdownDoc(id);
    fetchDocs();
  };

  const handleDownload = (doc: MarkdownDoc) => {
    const blob = new Blob([doc.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <PageHeader
          title="Markdown Editor"
          subtitle="Write in markdown with live preview"
          action={
            <Link href="/markdown/create">
              <Button variant="primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New File
              </Button>
            </Link>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-44" />)}
          </div>
        ) : docs.length === 0 ? (
          <EmptyState
            title="No markdown files yet"
            description="Create your first markdown document"
            action={<Link href="/markdown/create"><Button variant="primary">Create file</Button></Link>}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {docs.map((doc) => (
                <MarkdownCard key={doc._id} doc={doc} onDelete={handleDelete} onDownload={handleDownload} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function MarkdownCard({
  doc,
  onDelete,
  onDownload,
}: {
  doc: MarkdownDoc;
  onDelete: (id: string) => void;
  onDownload: (doc: MarkdownDoc) => void;
}) {
  // Show raw markdown preview (first ~200 chars)
  const preview = doc.content?.substring(0, 200).replace(/#+\s/g, "").replace(/[*_`]/g, "") || "";

  return (
    <div className="group bg-stone-900 border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-all flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-1.5 py-0.5 rounded">.md</span>
          <h3 className="font-semibold text-stone-100 text-base truncate">{doc.title}</h3>
        </div>
        <CategoryBadge category={doc.category} />
      </div>

      <div className="w-8 h-0.5 bg-cyan-500/40 mb-3 rounded-full" />

      <p className="text-stone-500 text-xs font-mono leading-relaxed line-clamp-4 flex-1">{preview}</p>

      <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between">
        <span className="text-xs text-stone-600">{doc.createdAt?.substring(0, 10)}</span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onDownload(doc)}
            className="p-2 text-stone-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all" title="Download .md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <Link href={`/markdown/edit/${doc._id}`}
            className="p-2 text-stone-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button onClick={() => onDelete(doc._id)}
            className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
