import { useState } from "react";
import { useRoute } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  ArrowLeft, FileText, AlertTriangle, Info, Send, 
  User, Bot, ShieldAlert, CheckCircle2, ChevronRight 
} from "lucide-react";
import { useDocument } from "@/hooks/use-documents";
import { useQuestions, useAskQuestion } from "@/hooks/use-questions";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const RiskBadge = ({ severity, description }: { severity: string, description: string }) => {
  const styles = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    low: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  }[severity] || "bg-slate-100 text-slate-700 border-slate-200";

  const Icon = severity === 'high' ? ShieldAlert : severity === 'medium' ? AlertTriangle : Info;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${styles} mb-3`}>
      <Icon className="w-5 h-5 mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold capitalize text-sm mb-1">{severity} Risk</p>
        <p className="text-sm leading-relaxed opacity-90">{description}</p>
      </div>
    </div>
  );
};

export default function DocumentDetail() {
  const [, params] = useRoute("/documents/:id");
  const docId = parseInt(params?.id || "0");
  
  const { data: doc, isLoading } = useDocument(docId);
  const { data: questions } = useQuestions(docId);
  const askQuestion = useAskQuestion(docId);
  
  const [questionInput, setQuestionInput] = useState("");

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || askQuestion.isPending) return;
    
    try {
      await askQuestion.mutateAsync({ question: questionInput });
      setQuestionInput("");
    } catch (e) {
      // toast handles error
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8 max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-4 w-24 mb-8" />
          <Skeleton className="h-10 w-1/2 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"><Skeleton className="h-[600px] w-full rounded-3xl" /></div>
            <div className="space-y-6">
              <Skeleton className="h-[300px] w-full rounded-3xl" />
              <Skeleton className="h-[300px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!doc) {
    return (
      <AppLayout>
        <div className="p-8 text-center mt-20">
          <h2 className="text-2xl font-bold">Document not found</h2>
          <Link href="/"><Button className="mt-4">Go Home</Button></Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <header className="mb-8 border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2 text-sm">
            <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
              {doc.language}
            </span>
            <span className="text-slate-400">
              Analyzed on {format(new Date(doc.createdAt), "MMMM d, yyyy")}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 leading-tight">
            {doc.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area - Text & Chat */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Document Viewer */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
              <Tabs defaultValue="simplified" className="w-full flex flex-col h-full">
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Comparison View</span>
                  </div>
                  <TabsList className="bg-slate-200/50 p-1 rounded-lg">
                    <TabsTrigger value="simplified" className="rounded-md px-6 font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                      Simplified
                    </TabsTrigger>
                    <TabsTrigger value="original" className="rounded-md px-6 font-semibold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                      Original
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <TabsContent value="simplified" className="m-0 h-full">
                    {doc.simplifiedText ? (
                      <div className="markdown-body text-slate-700 text-lg">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {doc.simplifiedText}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400">
                        Simplification not available.
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="original" className="m-0 h-full">
                    <div className="whitespace-pre-wrap text-slate-600 font-mono text-sm leading-relaxed">
                      {doc.originalText}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Q&A Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <MessageSquareIcon className="w-5 h-5 text-primary" />
                  Ask Questions
                </h3>
                <p className="text-sm text-slate-500">Ask anything about this document in plain language.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                {questions?.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-3">
                    <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
                      <Bot className="w-8 h-8 text-primary/40" />
                    </div>
                    <p>No questions asked yet.<br/>Try asking "Can I terminate this agreement early?"</p>
                  </div>
                ) : (
                  questions?.map((q) => (
                    <motion.div 
                      key={q.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex gap-3 justify-end">
                        <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                          <p className="text-sm">{q.question}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                      </div>
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                          <div className="markdown-body text-sm text-slate-700">
                            <ReactMarkdown>{q.answer}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                
                {askQuestion.isPending && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm flex space-x-2">
                       <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                       <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                       <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleAsk} className="flex gap-2 relative">
                  <Input
                    placeholder="Type your question..."
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    className="flex-1 py-6 pl-5 pr-14 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-primary/20 text-base"
                    disabled={askQuestion.isPending}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute right-2 top-2 h-10 w-10 rounded-xl shadow-md hover:shadow-lg transition-all"
                    disabled={!questionInput.trim() || askQuestion.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Insights & Risks */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Risks Panel */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-destructive" />
                Detected Risks
              </h3>
              
              {!doc.risks || doc.risks.length === 0 ? (
                <div className="text-slate-500 text-sm p-4 bg-slate-50 rounded-xl text-center">
                  No significant risks detected in this document.
                </div>
              ) : (
                <div className="space-y-1">
                  {doc.risks.map((risk, idx) => (
                    <RiskBadge key={idx} severity={risk.severity} description={risk.description} />
                  ))}
                </div>
              )}
            </div>

            {/* Key Info Panel */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Key Information
              </h3>
              
              {!doc.keyInfo || doc.keyInfo.length === 0 ? (
                <div className="text-slate-500 text-sm p-4 bg-slate-50 rounded-xl text-center">
                  No key information extracted.
                </div>
              ) : (
                <ul className="space-y-4">
                  {doc.keyInfo.map((info, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 text-sm block mb-0.5">{info.type}</span>
                        <span className="text-slate-600 text-sm leading-tight">{info.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Quick inline icon component to avoid adding more imports
function MessageSquareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
