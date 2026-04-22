"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getNotes, deleteNote, Note } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { CategoryBadge, Skeleton, EmptyState, Pagination, PageHeader, Button } from "@/components/ui";

export default function NotesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotes(page, 6);
      setNotes(res.data || []);
      setTotalPages(res.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!user?.token) { router.push("/login"); return; }
    fetch();
  }, [user, fetch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    await deleteNote(id);
    fetch();
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <PageHeader
          title="Notes"
          subtitle={`${notes.length > 0 ? "Your personal notes" : "No notes yet"}`}
          action={
            <Link href="/notes/create">
              <Button variant="primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Note
              </Button>
            </Link>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48" />)}
          </div>
        ) : notes.length === 0 ? (
          <EmptyState
            title="No notes yet"
            description="Create your first note to get started"
            action={
              <Link href="/notes/create">
                <Button variant="primary">Create your first note</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} onDelete={handleDelete} />
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

function NoteCard({ note, onDelete }: { note: Note; onDelete: (id: string) => void }) {
  return (
    <div className="group bg-stone-900 border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-all flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-stone-100 text-base line-clamp-2 flex-1">{note.title}</h3>
        <CategoryBadge category={note.category} />
      </div>
      <p className="text-stone-400 text-sm leading-relaxed line-clamp-3 flex-1">{note.content}</p>
      <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between">
        <span className="text-xs text-stone-600">{note.createdAt?.substring(0, 10)}</span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {note.anyfile && (
            <a
              href={`http://localhost:6800/api/uploads/${note.anyfile.replace("uploads/", "")}`}
              target="_blank" rel="noreferrer"
              className="p-2 text-stone-500 hover:text-stone-300 hover:bg-stone-800 rounded-lg transition-all"
              title="Download attachment"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </a>
          )}
          <Link href={`/notes/edit/${note._id}`}
            className="p-2 text-stone-500 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button onClick={() => onDelete(note._id)}
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
