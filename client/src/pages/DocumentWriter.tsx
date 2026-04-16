import { useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine, Loader2, Copy, Check, Download, Sparkles, ChevronLeft,
  Home, Briefcase, ShieldOff, FileSignature, Users, ScrollText,
  Scale, FileText, ArrowRight, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─── Document Types ──────────────────────────────────────────────────────────

interface Field {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
}

interface DocType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  fields: Field[];
}

const documentTypes: DocType[] = [
  {
    id: "rental",
    name: "Rental Agreement",
    description: "Residential/commercial lease between landlord and tenant",
    icon: Home,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    fields: [
      { key: "landlordName", label: "Landlord Full Name", placeholder: "e.g. Ramesh Kumar", required: true },
      { key: "tenantName", label: "Tenant Full Name", placeholder: "e.g. Priya Sharma", required: true },
      { key: "propertyAddress", label: "Property Address", placeholder: "e.g. 12, Gandhi Nagar, Chennai – 600034", required: true, type: "textarea" },
      { key: "monthlyRent", label: "Monthly Rent (₹)", placeholder: "e.g. 18,000", required: true },
      { key: "securityDeposit", label: "Security Deposit (₹)", placeholder: "e.g. 54,000" },
      { key: "tenurMonths", label: "Tenure (months)", placeholder: "e.g. 11", required: true },
      { key: "startDate", label: "Start Date", placeholder: "e.g. 1st June 2025", required: true },
      { key: "noticePeriod", label: "Notice Period (days)", placeholder: "e.g. 60" },
      { key: "maintenanceCharges", label: "Maintenance Charges (₹/month)", placeholder: "e.g. 2,000" },
      { key: "state", label: "State (for jurisdiction)", placeholder: "e.g. Tamil Nadu", required: true },
    ],
  },
  {
    id: "employment",
    name: "Employment Contract",
    description: "Offer letter / employment agreement for full-time employees",
    icon: Briefcase,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    fields: [
      { key: "employerName", label: "Employer / Company Name", placeholder: "e.g. Acme Technologies Pvt. Ltd.", required: true },
      { key: "employerAddress", label: "Employer Address", placeholder: "e.g. 4th Floor, Tech Park, Bengaluru", type: "textarea" },
      { key: "employeeName", label: "Employee Full Name", placeholder: "e.g. Arun Prakash", required: true },
      { key: "designation", label: "Designation / Job Title", placeholder: "e.g. Senior Software Engineer", required: true },
      { key: "department", label: "Department", placeholder: "e.g. Engineering" },
      { key: "monthlySalary", label: "Monthly Gross Salary (₹)", placeholder: "e.g. 85,000", required: true },
      { key: "dateOfJoining", label: "Date of Joining", placeholder: "e.g. 1st July 2025", required: true },
      { key: "workLocation", label: "Work Location", placeholder: "e.g. Bengaluru (Hybrid)" },
      { key: "noticePeriod", label: "Notice Period", placeholder: "e.g. 60 days", required: true },
      { key: "probationPeriod", label: "Probation Period", placeholder: "e.g. 6 months" },
      { key: "nonCompeteDuration", label: "Non-Compete Duration (months)", placeholder: "e.g. 12" },
      { key: "state", label: "State (for jurisdiction)", placeholder: "e.g. Karnataka", required: true },
    ],
  },
  {
    id: "nda",
    name: "Non-Disclosure Agreement",
    description: "NDA to protect confidential business information",
    icon: ShieldOff,
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    fields: [
      { key: "disclosingParty", label: "Disclosing Party Name", placeholder: "e.g. Innovate Labs Pvt. Ltd.", required: true },
      { key: "receivingParty", label: "Receiving Party Name", placeholder: "e.g. Ravi Mehta", required: true },
      { key: "purpose", label: "Purpose of Disclosure", placeholder: "e.g. Evaluation of a potential business partnership", required: true, type: "textarea" },
      { key: "duration", label: "Confidentiality Duration (years)", placeholder: "e.g. 3", required: true },
      { key: "effectiveDate", label: "Effective Date", placeholder: "e.g. 1st June 2025" },
      { key: "typeOfInfo", label: "Type of Confidential Information", placeholder: "e.g. business plans, trade secrets, financial data", type: "textarea" },
      { key: "state", label: "State (for jurisdiction)", placeholder: "e.g. Maharashtra", required: true },
    ],
  },
  {
    id: "sale",
    name: "Sale Agreement",
    description: "Property or asset sale agreement between buyer and seller",
    icon: FileSignature,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    fields: [
      { key: "sellerName", label: "Seller Full Name", placeholder: "e.g. Suresh Patel", required: true },
      { key: "sellerAddress", label: "Seller Address", placeholder: "e.g. 5, MG Road, Pune", type: "textarea" },
      { key: "buyerName", label: "Buyer Full Name", placeholder: "e.g. Deepa Iyer", required: true },
      { key: "buyerAddress", label: "Buyer Address", placeholder: "e.g. 8, Anna Salai, Chennai", type: "textarea" },
      { key: "propertyDescription", label: "Property / Asset Description", placeholder: "e.g. Plot No. 45, Survey No. 123, measuring 1200 sq.ft., located at...", required: true, type: "textarea" },
      { key: "salePrice", label: "Total Sale Price (₹)", placeholder: "e.g. 45,00,000", required: true },
      { key: "advanceAmount", label: "Advance / Token Amount Paid (₹)", placeholder: "e.g. 5,00,000" },
      { key: "completionDate", label: "Completion / Registration Date", placeholder: "e.g. within 3 months from today" },
      { key: "state", label: "State (for jurisdiction)", placeholder: "e.g. Tamil Nadu", required: true },
    ],
  },
  {
    id: "partnership",
    name: "Partnership Deed",
    description: "Business partnership agreement between two or more partners",
    icon: Users,
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-200",
    fields: [
      { key: "firmName", label: "Partnership Firm Name", placeholder: "e.g. M/s Sunrise Traders", required: true },
      { key: "businessNature", label: "Nature of Business", placeholder: "e.g. Trading of textiles and garments", required: true },
      { key: "businessAddress", label: "Principal Place of Business", placeholder: "e.g. 23, Commercial Street, Bengaluru", required: true, type: "textarea" },
      { key: "partner1Name", label: "Partner 1 Full Name", placeholder: "e.g. Vikram Singh", required: true },
      { key: "partner1Capital", label: "Partner 1 Capital Contribution (₹)", placeholder: "e.g. 5,00,000", required: true },
      { key: "partner2Name", label: "Partner 2 Full Name", placeholder: "e.g. Anita Desai", required: true },
      { key: "partner2Capital", label: "Partner 2 Capital Contribution (₹)", placeholder: "e.g. 5,00,000", required: true },
      { key: "profitRatio", label: "Profit & Loss Sharing Ratio", placeholder: "e.g. 50:50 or 60:40", required: true },
      { key: "startDate", label: "Partnership Commencement Date", placeholder: "e.g. 1st June 2025" },
      { key: "state", label: "State (for jurisdiction)", placeholder: "e.g. Karnataka", required: true },
    ],
  },
  {
    id: "poa",
    name: "Power of Attorney",
    description: "Authorise someone to act on your behalf legally",
    icon: ScrollText,
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-200",
    fields: [
      { key: "grantorName", label: "Grantor (Principal) Full Name", placeholder: "e.g. Mohan Lal", required: true },
      { key: "grantorAddress", label: "Grantor Address", placeholder: "e.g. 7, Model Town, Delhi", type: "textarea" },
      { key: "attorneyName", label: "Attorney (Agent) Full Name", placeholder: "e.g. Sunita Lal", required: true },
      { key: "attorneyAddress", label: "Attorney Address", placeholder: "e.g. 7, Model Town, Delhi", type: "textarea" },
      { key: "powersGranted", label: "Powers Granted", placeholder: "e.g. to sell/manage property at 12 MG Road, to execute sale deeds, to appear before authorities...", required: true, type: "textarea" },
      { key: "propertyDetails", label: "Specific Property / Asset Details (if any)", placeholder: "e.g. House No. 12, MG Road, New Delhi", type: "textarea" },
      { key: "poaType", label: "POA Type", type: "select", placeholder: "Select type", options: ["General Power of Attorney", "Special/Limited Power of Attorney", "Revocable Power of Attorney"] },
      { key: "state", label: "State (for jurisdiction)", placeholder: "e.g. Delhi", required: true },
    ],
  },
  {
    id: "affidavit",
    name: "Affidavit",
    description: "Sworn statement of facts before a magistrate or notary",
    icon: Scale,
    color: "text-teal-600",
    bg: "bg-teal-50 border-teal-200",
    fields: [
      { key: "deponentName", label: "Deponent Full Name", placeholder: "e.g. Rajesh Sharma", required: true },
      { key: "deponentAge", label: "Deponent Age", placeholder: "e.g. 35" },
      { key: "deponentAddress", label: "Deponent Address", placeholder: "e.g. 15, Shivaji Nagar, Pune – 411005", required: true, type: "textarea" },
      { key: "purpose", label: "Purpose of Affidavit", placeholder: "e.g. Lost original documents, change of name, income declaration", required: true },
      { key: "statements", label: "Key Facts / Statements to Declare", placeholder: "List the facts you want to swear/affirm...", required: true, type: "textarea" },
      { key: "state", label: "State (for jurisdiction)", placeholder: "e.g. Maharashtra", required: true },
    ],
  },
  {
    id: "service",
    name: "Service Agreement",
    description: "Contract between a service provider and client",
    icon: FileText,
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
    fields: [
      { key: "providerName", label: "Service Provider Name", placeholder: "e.g. DesignCraft Studio", required: true },
      { key: "providerAddress", label: "Provider Address", placeholder: "e.g. 22, HSR Layout, Bengaluru", type: "textarea" },
      { key: "clientName", label: "Client Name", placeholder: "e.g. FreshBrand Marketing Pvt. Ltd.", required: true },
      { key: "clientAddress", label: "Client Address", placeholder: "e.g. 8, Andheri East, Mumbai", type: "textarea" },
      { key: "servicesDescription", label: "Services to be Provided", placeholder: "Describe the scope of work in detail...", required: true, type: "textarea" },
      { key: "totalFee", label: "Total Fee / Contract Value (₹)", placeholder: "e.g. 1,20,000", required: true },
      { key: "paymentTerms", label: "Payment Terms", placeholder: "e.g. 50% advance, 50% on delivery", required: true },
      { key: "projectDuration", label: "Project Duration", placeholder: "e.g. 3 months from signing", required: true },
      { key: "deliverables", label: "Key Deliverables", placeholder: "e.g. website design, logo, brand kit", type: "textarea" },
      { key: "state", label: "State (for jurisdiction)", placeholder: "e.g. Karnataka", required: true },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function DocumentWriter() {
  const { toast } = useToast();
  const outputRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<"select" | "form" | "output">("select");
  const [selectedType, setSelectedType] = useState<DocType | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState("English");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [copied, setCopied] = useState(false);

  const selectDocType = (dt: DocType) => {
    setSelectedType(dt);
    setFieldValues({});
    setGeneratedDoc("");
    setStep("form");
  };

  const handleGenerate = async () => {
    if (!selectedType) return;
    const missing = selectedType.fields
      .filter((f) => f.required && !fieldValues[f.key]?.trim())
      .map((f) => f.label);
    if (missing.length > 0) {
      toast({ title: "Please fill required fields", description: missing.slice(0, 3).join(", "), variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          documentType: selectedType.name,
          fields: fieldValues,
          language,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Generation failed");
      }

      const data = await res.json();
      setGeneratedDoc(data.document);
      setStep("output");
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDoc], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedType?.name.replace(/\s+/g, "_")}_LegalSaga.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToSelect = () => {
    setStep("select");
    setSelectedType(null);
    setGeneratedDoc("");
    setFieldValues({});
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <PenLine className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-slate-900">Legal Document Writer</h1>
              <p className="text-slate-500 text-sm mt-0.5">AI-powered — generates complete, legally sound Indian documents</p>
            </div>
          </div>
          <p className="text-slate-600 text-lg max-w-3xl">
            Choose a document type, fill in your details, and the AI will draft a complete professional document ready for review and signing.
          </p>
        </div>

        {/* ── STEP 1: Select Document Type ── */}
        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div key="select" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">Choose Document Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {documentTypes.map((dt) => (
                  <button
                    key={dt.id}
                    type="button"
                    data-testid={`doctype-${dt.id}`}
                    onClick={() => selectDocType(dt)}
                    className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all text-left"
                  >
                    <div className={`p-3 rounded-xl border flex-shrink-0 ${dt.bg} group-hover:scale-110 transition-transform`}>
                      <dt.icon className={`w-5 h-5 ${dt.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base">{dt.name}</h3>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5 leading-snug">{dt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Fill Form ── */}
          {step === "form" && selectedType && (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              {/* Breadcrumb */}
              <button
                type="button"
                onClick={resetToSelect}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back to document types
              </button>

              <div className="bg-white rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-200/40 overflow-hidden">
                {/* Card top bar */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

                <div className="p-8 md:p-10">
                  {/* Doc type badge */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-2.5 rounded-xl border ${selectedType.bg}`}>
                      <selectedType.icon className={`w-5 h-5 ${selectedType.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">{selectedType.name}</h2>
                      <p className="text-slate-500 text-sm">{selectedType.description}</p>
                    </div>
                  </div>

                  {/* Language selector */}
                  <div className="mb-8 pb-8 border-b border-slate-100">
                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 block">Output Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger data-testid="select-language" className="w-64 rounded-xl bg-slate-50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                        <SelectItem value="Tamil">Tamil (தமிழ்)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dynamic Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedType.fields.map((field) => (
                      <div
                        key={field.key}
                        className={field.type === "textarea" ? "md:col-span-2" : ""}
                      >
                        <Label
                          htmlFor={field.key}
                          className="text-sm font-semibold text-slate-700 mb-2 block"
                        >
                          {field.label}
                          {field.required && <span className="text-red-400 ml-1">*</span>}
                        </Label>

                        {field.type === "textarea" ? (
                          <Textarea
                            id={field.key}
                            data-testid={`field-${field.key}`}
                            placeholder={field.placeholder}
                            value={fieldValues[field.key] || ""}
                            onChange={(e) => setFieldValues((p) => ({ ...p, [field.key]: e.target.value }))}
                            className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus-visible:ring-primary/20 resize-none min-h-[90px]"
                          />
                        ) : field.type === "select" ? (
                          <Select
                            value={fieldValues[field.key] || ""}
                            onValueChange={(v) => setFieldValues((p) => ({ ...p, [field.key]: v }))}
                          >
                            <SelectTrigger data-testid={`field-${field.key}`} className="rounded-xl bg-slate-50 border-slate-200">
                              <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {field.options?.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={field.key}
                            data-testid={`field-${field.key}`}
                            placeholder={field.placeholder}
                            value={fieldValues[field.key] || ""}
                            onChange={(e) => setFieldValues((p) => ({ ...p, [field.key]: e.target.value }))}
                            className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus-visible:ring-primary/20 py-5"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Generate Button */}
                  <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                    <Button
                      type="button"
                      data-testid="button-generate"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="px-10 py-7 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all gap-3 bg-primary hover:bg-primary/90"
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Drafting Document...</>
                      ) : (
                        <><Sparkles className="w-5 h-5" /> Generate Document</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Generated Output ── */}
          {step === "output" && generatedDoc && (
            <motion.div key="output" ref={outputRef} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              {/* Back & doc type */}
              <button
                type="button"
                onClick={() => setStep("form")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back to form
              </button>

              {/* Action bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  {selectedType && (
                    <div className={`p-2 rounded-xl border ${selectedType.bg}`}>
                      <selectedType.icon className={`w-4 h-4 ${selectedType.color}`} />
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">{selectedType?.name}</h2>
                    <p className="text-xs text-slate-400">Generated in {language} · Review before use</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    data-testid="button-regenerate"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="rounded-xl gap-2 border-slate-200"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Regenerate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    data-testid="button-download"
                    onClick={handleDownload}
                    className="rounded-xl gap-2 border-slate-200"
                  >
                    <Download className="w-4 h-4" /> Download
                  </Button>
                  <Button
                    type="button"
                    data-testid="button-copy"
                    onClick={handleCopy}
                    className="rounded-xl gap-2 bg-primary hover:bg-primary/90"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* Document Preview */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-100 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
                <div className="p-8 md:p-12 prose prose-slate max-w-none
                  prose-headings:font-display prose-headings:text-slate-900
                  prose-h1:text-2xl prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
                  prose-p:text-slate-700 prose-p:leading-relaxed
                  prose-li:text-slate-700 prose-strong:text-slate-900
                  prose-hr:border-slate-200">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {generatedDoc}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>Disclaimer:</strong> This document is AI-generated for reference purposes only. Please review it carefully, adapt it to your specific circumstances, and have it verified by a licensed legal professional before signing or using it for legal purposes.
                </p>
              </div>

              {/* Start Over */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  data-testid="button-start-over"
                  onClick={resetToSelect}
                  className="text-sm text-slate-400 hover:text-primary transition-colors font-medium"
                >
                  ← Draft another document
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generating overlay */}
        <AnimatePresence>
          {isGenerating && step === "form" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm"
            >
              <div className="bg-white rounded-3xl p-10 shadow-2xl flex flex-col items-center max-w-sm mx-4">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center relative z-10">
                    <Loader2 className="w-9 h-9 text-primary animate-spin" />
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Drafting Your Document</h3>
                <p className="text-slate-500 text-center text-sm leading-relaxed">
                  Our AI legal expert is writing your complete {selectedType?.name}, including all standard Indian law clauses…
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
