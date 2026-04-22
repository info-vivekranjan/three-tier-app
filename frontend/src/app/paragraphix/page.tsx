"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTextDocs, deleteTextDoc, TextDoc } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { CategoryBadge, Skeleton, EmptyState, Pagination, PageHeader, Button } from "@/components/ui";

export default function ParaGraphixPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [docs, setDocs] = useState<TextDoc[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTextDocs(page, 6);
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
    if (!confirm("Delete this document?")) return;
    await deleteTextDoc(id);
    fetchDocs();
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <PageHeader
          title="ParaGraphix"
          subtitle="Rich text documents"
          action={
            <Link href="/paragraphix/create">
              <Button variant="primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Document
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
            title="No documents yet"
            description="Create your first rich text document"
            action={<Link href="/paragraphix/create"><Button variant="primary">Create document</Button></Link>}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {docs.map((doc) => (
                <DocCard key={doc._id} doc={doc} onDelete={handleDelete} editHref={`/paragraphix/edit/${doc._id}`} />
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

export function DocCard({ doc, onDelete, editHref }: { doc: TextDoc; onDelete: (id: string) => void; editHref: string }) {
  // strip HTML tags for preview
  const stripped = doc.content?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "";

  return (
    <div className="group bg-stone-900 border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-all flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-stone-100 text-base line-clamp-2 flex-1">{doc.title}</h3>
        <CategoryBadge category={doc.category} />
      </div>

      {/* Purple accent line */}
      <div className="w-8 h-0.5 bg-purple-500/40 mb-3 rounded-full" />

      <p className="text-stone-400 text-sm leading-relaxed line-clamp-3 flex-1">{stripped || "No content"}</p>

      <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between">
        <span className="text-xs text-stone-600">{doc.createdAt?.substring(0, 10)}</span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={editHref}
            className="p-2 text-stone-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all">
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
