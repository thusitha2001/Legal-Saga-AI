import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, ShieldCheck, Zap, Sparkles, UploadCloud, FileText, Image, X, CheckCircle2, ScanText } from "lucide-react";
import { useCreateDocument } from "@/hooks/use-documents";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

type UploadMode = "text" | "pdf" | "ocr";

export default function NewDocument() {
  const [, setLocation] = useLocation();
  const createDocument = useCreateDocument();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("English");
  const [originalText, setOriginalText] = useState("");
  const [uploadMode, setUploadMode] = useState<UploadMode>("text");
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractionDone, setExtractionDone] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !originalText.trim()) return;
    try {
      const doc = await createDocument.mutateAsync({ title, language, originalText });
      setLocation(`/documents/${doc.id}`);
    } catch (error) {
      // Error handled by hook's toast
    }
  };

  const handleFileExtract = useCallback(async (file: File) => {
    setUploadedFile(file);
    setExtractionDone(false);
    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to extract text");
      }

      const data = await res.json();
      setOriginalText(data.text);
      setExtractionDone(true);

      // Auto-suggest a title from filename if blank
      if (!title.trim()) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        setTitle(nameWithoutExt);
      }

      toast({
        title: "Text extracted successfully!",
        description: `${data.text.length.toLocaleString()} characters extracted from "${file.name}"`,
      });
    } catch (err: any) {
      toast({
        title: "Extraction failed",
        description: err.message,
        variant: "destructive",
      });
      setUploadedFile(null);
    } finally {
      setIsExtracting(false);
    }
  }, [title, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileExtract(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileExtract(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setOriginalText("");
    setExtractionDone(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const acceptedTypes = uploadMode === "pdf"
    ? "application/pdf"
    : "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/tiff,image/bmp";

  const isLoading = createDocument.isPending || isExtracting;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <AnimatePresence mode="wait">
          {createDocument.isPending ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm min-h-[60vh] rounded-3xl"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center relative z-10">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              </div>
              <h2 className="mt-8 text-2xl font-display font-bold text-slate-900">Simplifying Document...</h2>
              <p className="mt-2 text-slate-500 max-w-md text-center">
                Our AI is analyzing the legal terminology, extracting key obligations, and identifying potential risks for you.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-10">
                <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Simplify a Document</h1>
                <p className="text-slate-600 text-lg">
                  Upload a PDF, scan a handwritten document, or paste your legal text below.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="flex gap-3 mb-8">
                {[
                  { mode: "text" as UploadMode, icon: FileText, label: "Paste Text" },
                  { mode: "pdf" as UploadMode, icon: UploadCloud, label: "Upload PDF" },
                  { mode: "ocr" as UploadMode, icon: ScanText, label: "Handwritten / Image OCR" },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setUploadMode(mode); clearFile(); }}
                    data-testid={`mode-${mode}`}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      uploadMode === mode
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/60 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary"></div>
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Title + Language */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-3">
                      <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-slate-500">Document Title</Label>
                      <Input
                        id="title"
                        data-testid="input-title"
                        placeholder="e.g. Apartment Rental Agreement"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg py-7 px-5 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus-visible:ring-primary/20 transition-all shadow-sm"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="language" className="text-sm font-bold uppercase tracking-wider text-slate-500">Output Language</Label>
                      <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                        <SelectTrigger data-testid="select-language" className="text-lg py-7 px-5 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-primary/20 shadow-sm">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                          <SelectItem value="English" className="py-3 font-medium">English</SelectItem>
                          <SelectItem value="Hindi" className="py-3 font-medium">Hindi (हिन्दी)</SelectItem>
                          <SelectItem value="Tamil" className="py-3 font-medium">Tamil (தமிழ்)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* File Upload Zone (PDF or OCR mode) */}
                  {uploadMode !== "text" && (
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                        {uploadMode === "pdf" ? "Upload PDF Document" : "Upload Handwritten / Scanned Image"}
                      </Label>

                      <AnimatePresence mode="wait">
                        {!uploadedFile ? (
                          <motion.div
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            data-testid="dropzone"
                            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
                              isDragOver
                                ? "border-primary bg-primary/5 scale-[1.01]"
                                : "border-slate-200 bg-slate-50/50 hover:border-primary/50 hover:bg-primary/3"
                            }`}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept={acceptedTypes}
                              onChange={handleFileInput}
                              className="hidden"
                              data-testid="file-input"
                            />
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragOver ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
                              {uploadMode === "pdf" ? <UploadCloud className="w-8 h-8" /> : <Image className="w-8 h-8" />}
                            </div>
                            <p className="font-semibold text-slate-700 text-lg">
                              {isDragOver ? "Drop it here!" : "Drag & drop or click to upload"}
                            </p>
                            <p className="text-slate-400 text-sm mt-1">
                              {uploadMode === "pdf"
                                ? "Supports PDF files up to 20MB"
                                : "Supports JPG, PNG, WEBP, BMP, TIFF (photos/scans up to 20MB)"}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="file-status"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50"
                          >
                            {isExtracting ? (
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 truncate">{uploadedFile.name}</p>
                              <p className="text-sm text-slate-400">
                                {isExtracting
                                  ? uploadMode === "ocr"
                                    ? "Running AI OCR to extract handwritten text..."
                                    : "Parsing PDF and extracting text..."
                                  : `${originalText.length.toLocaleString()} characters extracted`}
                              </p>
                            </div>
                            {!isExtracting && (
                              <button
                                type="button"
                                onClick={clearFile}
                                data-testid="button-clear-file"
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Legal Text Area */}
                  <div className="space-y-3">
                    <Label htmlFor="content" className="text-sm font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                      <span>Legal Text</span>
                      <span className="text-slate-400 font-normal normal-case italic text-[13px]">
                        {uploadMode === "text"
                          ? "Paste the full contract text below"
                          : extractionDone
                            ? "Extracted text — you can edit before simplifying"
                            : "Text will appear here after extraction"}
                      </span>
                    </Label>
                    <Textarea
                      id="content"
                      data-testid="textarea-content"
                      placeholder={
                        uploadMode === "text"
                          ? "Whereas the party of the first part hereby agrees to..."
                          : isExtracting
                            ? "Extracting text from your file..."
                            : "Extracted text will appear here automatically..."
                      }
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      className="min-h-[300px] text-base p-6 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white focus-visible:ring-primary/20 resize-y shadow-sm leading-relaxed"
                      required={uploadMode === "text"}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Submit Bar */}
                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100">
                    <div className="flex gap-6 text-[13px] font-medium text-slate-500">
                      <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Secure Analysis</span>
                      <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> AI Powered</span>
                    </div>
                    <Button
                      type="submit"
                      data-testid="button-submit"
                      className="w-full sm:w-auto px-10 py-7 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all gap-3 bg-primary hover:bg-primary/90"
                      disabled={!title.trim() || !originalText.trim() || isLoading}
                    >
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                      Simplify Document
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
