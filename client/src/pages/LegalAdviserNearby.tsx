import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Phone, ExternalLink, ChevronDown, ChevronUp,
  HeartHandshake, Building2, Map,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const helplines = [
  { name: "NALSA Toll-Free Helpline", number: "15100", desc: "National Legal Services Authority — free legal aid across India, 24×7", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { name: "Women Helpline", number: "181", desc: "For women facing domestic violence, harassment, or legal trouble", color: "bg-pink-50 border-pink-200 text-pink-800" },
  { name: "Police Emergency", number: "100", desc: "Emergency police assistance — also for crime-related legal situations", color: "bg-red-50 border-red-200 text-red-800" },
  { name: "Child Helpline (CHILDLINE)", number: "1098", desc: "For legal aid and protection for children in distress", color: "bg-blue-50 border-blue-200 text-blue-800" },
  { name: "Senior Citizen Helpline", number: "14567", desc: "Legal rights and support for senior citizens", color: "bg-amber-50 border-amber-200 text-amber-800" },
];

export default function LegalAdviserNearby() {
  const [expandedHelpline, setExpandedHelpline] = useState(false);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-slate-900">Legal Adviser Near You</h1>
              <p className="text-slate-500 text-sm mt-0.5">Find lawyers, legal aid offices, and helplines across India</p>
            </div>
          </div>
          <p className="text-slate-600 text-lg max-w-3xl">
            Access government legal aid contacts, emergency helplines, and free legal services available across all Indian states.
          </p>
        </div>

        {/* ── Emergency Helplines ── */}
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedHelpline((p) => !p)}
            className="w-full flex items-center justify-between p-5 text-left"
            data-testid="toggle-helplines"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-bold text-red-800">Emergency Legal Helplines</p>
                <p className="text-xs text-red-600">Always free · Available 24×7</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-700 border-red-200 font-bold text-sm px-3">15100 — NALSA</Badge>
              {expandedHelpline ? <ChevronUp className="w-5 h-5 text-red-500" /> : <ChevronDown className="w-5 h-5 text-red-500" />}
            </div>
          </button>
          <AnimatePresence>
            {expandedHelpline && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-5 pb-5">
                  {helplines.map((h) => (
                    <a key={h.number} href={`tel:${h.number}`} data-testid={`helpline-${h.number}`}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${h.color} hover:shadow-sm transition-all`}>
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                        <span className="font-bold text-lg">{h.number}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm">{h.name}</p>
                        <p className="text-xs leading-snug mt-0.5">{h.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Google Maps Quick Links ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <a href="https://www.google.com/maps/search/lawyers+advocates+India" target="_blank" rel="noopener noreferrer" data-testid="link-find-lawyers-maps"
            className="group flex items-center gap-4 p-5 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-blue-900">Find Lawyers on Google Maps</p>
              <p className="text-sm text-blue-700">Search for advocates and lawyers near you</p>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-400 ml-auto flex-shrink-0 group-hover:text-blue-600 transition-colors" />
          </a>
          <a href="https://www.google.com/maps/search/District+Legal+Services+Authority+India" target="_blank" rel="noopener noreferrer" data-testid="link-find-dlsa-maps"
            className="group flex items-center gap-4 p-5 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-emerald-900">Find DLSA Office (Free Aid)</p>
              <p className="text-sm text-emerald-700">District Legal Services Authority near you</p>
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0 group-hover:text-emerald-600 transition-colors" />
          </a>
        </div>

        {/* ── How to Get Free Legal Aid ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-7">
            <h2 className="font-display font-bold text-slate-900 text-xl mb-5 flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-primary" /> How to Get Free Legal Aid in India
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { step: "1", title: "Check Eligibility", desc: "You qualify if your annual income is below ₹3 lakh, you are a woman, child, SC/ST, disabled, or a victim of trafficking or natural disaster." },
                { step: "2", title: "Call NALSA Helpline", desc: "Dial 15100 (toll-free, 24×7) to be connected to the nearest legal services authority. No court visit needed to start." },
                { step: "3", title: "Visit DLSA Office", desc: "Walk into any District Legal Services Authority office in your district. They provide a lawyer, help file FIRs, and guide you through the legal process — completely free." },
                { step: "4", title: "Lok Adalat for Disputes", desc: "If you want to settle a dispute without going to court, request a Lok Adalat. Decisions are final and free from court fees. Common for accident claims and cheque bounce cases." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{s.step}</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{s.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
