import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Scale, FileText, Plus, ChevronRight, FileX, Trash2 } from "lucide-react";
import { useDocuments } from "@/hooks/use-documents";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const { data: documents, isLoading } = useDocuments();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (e: React.MouseEvent, docId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document?")) return;
    setDeletingId(docId);
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Document deleted", description: "Document removed successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete document", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">My Documents</h1>
            <p className="text-slate-600 text-lg">Understand your legal agreements with clarity.</p>
          </div>
          <Link href="/documents/new" className="inline-block">
            <Button className="rounded-xl px-8 py-7 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all font-bold text-lg gap-3 bg-primary hover:bg-primary/90">
              <Plus className="w-6 h-6" />
              Simplify New Document
            </Button>
          </Link>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : documents?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-sm glass-panel"
          >
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <FileX className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">No documents yet</h2>
            <p className="text-slate-500 max-w-md mb-8">
              Upload your first legal document—like a rental agreement or employment contract—to get a plain-English explanation and risk assessment.
            </p>
            <Link href="/documents/new" className="inline-block">
              <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-semibold px-8 py-6">
                Get Started
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents?.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <button
                  onClick={(e) => handleDelete(e, doc.id)}
                  disabled={deletingId === doc.id}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-lg flex items-center justify-center transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link href={`/documents/${doc.id}`} className="block h-full">
                  <div className="bg-white h-full rounded-2xl p-7 border border-slate-200/60 shadow-sm hover-elevate group cursor-pointer flex flex-col transition-all duration-300 hover:border-primary/30">
                    <div className="flex items-start justify-between mb-5">
                      <div className="p-2.5 bg-slate-50 rounded-xl text-primary group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-wider mr-8">
                        {doc.language}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 font-display group-hover:text-primary transition-colors leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-8 flex-1 line-clamp-3 leading-relaxed">
                      {doc.originalText.substring(0, 140)}...
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                        {format(new Date(doc.createdAt), "MMM d, yyyy")}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}