import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookOpen, Search, ExternalLink, Scale, ShieldAlert, Briefcase, Home, Users, Building2, Gavel, FileCheck, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface LawBook {
  title: string;
  shortName?: string;
  year: number;
  description: string;
  relevance: string;
  link: string;
  tags: string[];
}

interface LawCategory {
  name: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  books: LawBook[];
}

const lawCategories: LawCategory[] = [
  {
    name: "Constitutional Law",
    icon: Scale,
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    books: [
      {
        title: "The Constitution of India",
        year: 1950,
        description: "The supreme law of India, laying down the framework that defines fundamental political principles, establishes the structure, procedures, powers and duties of government institutions, and sets out fundamental rights, directive principles and duties of citizens.",
        relevance: "Fundamental rights under Articles 12–35 protect citizens from exploitation and arbitrary actions. Article 21 (Right to Life), Article 39A (Free Legal Aid), Article 300A (Right to Property) are directly relevant in legal disputes.",
        link: "https://www.indiacode.nic.in/",
        tags: ["Fundamental Rights", "Directive Principles", "Judiciary", "Parliament"],
      },
      {
        title: "Right to Information Act",
        shortName: "RTI Act",
        year: 2005,
        description: "Empowers citizens to request information from any public authority. A cornerstone of transparency and accountability in India.",
        relevance: "Citizens can use RTI to obtain government documents, verify land records, track status of applications, and expose corruption.",
        link: "https://rti.gov.in/rti-act.pdf",
        tags: ["Transparency", "Government", "Citizens' Rights"],
      },
    ],
  },
  {
    name: "Criminal Law",
    icon: ShieldAlert,
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    books: [
      {
        title: "Bharatiya Nyaya Sanhita",
        shortName: "BNS, 2023",
        year: 2023,
        description: "Replaces the Indian Penal Code (IPC) of 1860. The BNS is the primary criminal code of India defining offences and punishments, updated with modern provisions for cybercrimes, organized crime, and terrorism.",
        relevance: "Defines all criminal offences: theft, fraud, assault, cheating, criminal breach of trust, defamation. Essential for understanding your rights if you are a victim or accused.",
        link: "https://indiacode.nic.in/handle/123456789/20062",
        tags: ["Offences", "Punishment", "Criminal Procedure", "IPC Replacement"],
      },
      {
        title: "Bharatiya Nagarik Suraksha Sanhita",
        shortName: "BNSS, 2023",
        year: 2023,
        description: "Replaces the Code of Criminal Procedure (CrPC) of 1973. Governs the procedural aspects of criminal law — arrest, bail, trial, appeals.",
        relevance: "Know your rights during arrest (Section 47: right to know grounds of arrest), bail provisions, right to a speedy trial, and police procedure.",
        link: "https://www.indiacode.nic.in/",
        tags: ["Arrest", "Bail", "Trial", "CrPC Replacement"],
      },
      {
        title: "Bharatiya Sakshya Adhiniyam",
        shortName: "BSA, 2023",
        year: 2023,
        description: "Replaces the Indian Evidence Act of 1872. Governs the rules of evidence in Indian courts, including the admissibility of electronic evidence and documents.",
        relevance: "Determines what evidence is admissible in court. Especially important for digital contracts, WhatsApp messages as evidence, and document authentication.",
        link: "https://www.indiacode.nic.in/",
        tags: ["Evidence", "Digital Evidence", "Court Procedure"],
      },
      {
        title: "Prevention of Corruption Act",
        shortName: "PCA",
        year: 1988,
        description: "Defines and penalizes corruption by public servants. Amended in 2018 to also penalize bribe-givers.",
        relevance: "Protects citizens who are victims of bribery demands. Also holds bribe-givers liable under the 2018 amendment.",
        link: "https://indiacode.nic.in/bitstream/123456789/1848/3/Prevention-of-corruption-Act.pdf",
        tags: ["Anti-Corruption", "Public Servants", "Bribery"],
      },
    ],
  },
  {
    name: "Property & Land Law",
    icon: Home,
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    books: [
      {
        title: "Transfer of Property Act",
        shortName: "TP Act",
        year: 1882,
        description: "Governs the transfer of property (movable and immovable) between living persons. Covers sale, mortgage, lease, exchange, gift, and actionable claims.",
        relevance: "Directly applicable in property sale/purchase. Section 54 (Sale), Section 58 (Mortgage), Section 105 (Lease), Section 122 (Gift) define rights and obligations in property deals.",
        link: "https://www.indiacode.nic.in/",
        tags: ["Property", "Sale", "Lease", "Mortgage", "Gift"],
      },
      {
        title: "Registration Act",
        year: 1908,
        description: "Mandates registration of documents related to immovable property to ensure legal validity and public notice.",
        relevance: "Unregistered property documents (sale deeds, gift deeds, etc.) are legally inadmissible in court. Know which documents require compulsory registration.",
        link: "https://indiacode.nic.in/bitstream/123456789/2320/1/195903.pdf",
        tags: ["Property Registration", "Sale Deed", "Legal Validity"],
      },
      {
        title: "Real Estate (Regulation & Development) Act",
        shortName: "RERA",
        year: 2016,
        description: "Regulates the real estate sector to protect homebuyers from developers. Mandates project registration, timely delivery, and transparency.",
        relevance: "Homebuyers can file complaints against builders for delays, defects, or misrepresentation. RERA Authorities in each state handle such disputes.",
        link: "https://www.indiacode.nic.in/",
        tags: ["Real Estate", "Builder", "Homebuyer Protection", "RERA"],
      },
      {
        title: "The Rent Control Acts (State-wise)",
        year: 1948,
        description: "Each Indian state has its own Rent Control Act governing landlord-tenant relationships, standard rent, eviction grounds, and tenant protections.",
        relevance: "Protects tenants from arbitrary eviction and unfair rent hikes. Tamil Nadu, Maharashtra, Delhi, and Karnataka have their own specific acts. Know your state's act.",
        link: "https://indiacode.nic.in",
        tags: ["Rental", "Landlord", "Tenant Rights", "Eviction"],
      },
    ],
  },
  {
    name: "Labour & Employment Law",
    icon: Briefcase,
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    books: [
      {
        title: "Industrial Disputes Act",
        year: 1947,
        description: "Governs industrial relations including strikes, lockouts, lay-offs, retrenchment, and dispute resolution mechanisms.",
        relevance: "Protects workers from unlawful retrenchment. Employers cannot terminate workers in establishments with 100+ employees without government permission.",
        link: "https://indiacode.nic.in/bitstream/123456789/1483/1/1947__14.pdf",
        tags: ["Employment", "Termination", "Retrenchment", "Labour"],
      },
      {
        title: "Minimum Wages Act",
        year: 1948,
        description: "Mandates minimum wages for workers in scheduled industries. State governments revise minimum wages periodically.",
        relevance: "Any employment contract paying below the notified minimum wage is illegal. Workers can file complaints with Labour Commissioner.",
        link: "https://indiacode.nic.in/bitstream/123456789/1484/1/A1948-11.pdf",
        tags: ["Wages", "Workers", "Labour Rights"],
      },
      {
        title: "Payment of Gratuity Act",
        year: 1972,
        description: "Mandates payment of gratuity to employees who have served at least 5 years, upon superannuation, retirement, resignation, or death.",
        relevance: "Employees are entitled to 15 days' salary per year of service. Common in employment contracts — know your gratuity entitlement.",
        link: "https://indiacode.nic.in/bitstream/123456789/1597/1/197239.pdf",
        tags: ["Gratuity", "Employment Benefits", "Retirement"],
      },
      {
        title: "Sexual Harassment of Women at Workplace Act",
        shortName: "POSH Act",
        year: 2013,
        description: "Mandates prevention, prohibition, and redressal of sexual harassment at workplace. Requires Internal Complaints Committee (ICC) in organizations with 10+ employees.",
        relevance: "Every employee has the right to a safe workplace. Employment contracts must include POSH policy. Complaints can be filed to the ICC or Local Complaints Committee.",
        link: "https://wcd.nic.in/sites/default/files/Sexual%20Harassment%20act.pdf",
        tags: ["Workplace Safety", "Women Rights", "POSH", "Employment"],
      },
      {
        title: "The Code on Wages",
        year: 2019,
        description: "Consolidates four labour laws: Minimum Wages Act, Payment of Wages Act, Payment of Bonus Act, and Equal Remuneration Act.",
        relevance: "Standardizes wage payment, bonus entitlements, and equal pay provisions across all sectors.",
        link: "https://indiacode.nic.in/handle/123456789/14073",
        tags: ["Wages", "Bonus", "Labour Codes"],
      },
    ],
  },
  {
    name: "Consumer & Contract Law",
    icon: FileCheck,
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    books: [
      {
        title: "Consumer Protection Act",
        year: 2019,
        description: "Protects consumers against unfair trade practices, product defects, and deficient services. Establishes Consumer Disputes Redressal Commissions at district, state, and national levels.",
        relevance: "File complaints against businesses for defective products, overcharging, false advertising, or poor service. District Commission handles claims up to ₹50 lakh.",
        link: "https://consumeraffairs.nic.in/sites/default/files/CPA-2019.pdf",
        tags: ["Consumer Rights", "Complaints", "Refund", "Product Defect"],
      },
      {
        title: "Indian Contract Act",
        year: 1872,
        description: "The foundational law governing all contracts in India. Defines what constitutes a valid contract, essential elements, breach, remedies, and void/voidable agreements.",
        relevance: "Every agreement you sign — rental, employment, service — is governed by this Act. Know what makes a contract void, your right to compensation on breach, and limitation periods.",
        link: "https://indiacode.nic.in/bitstream/123456789/2187/1/1872-9.pdf",
        tags: ["Contracts", "Agreements", "Breach", "Remedies"],
      },
      {
        title: "Information Technology Act",
        shortName: "IT Act",
        year: 2000,
        description: "Governs e-commerce, cybercrime, digital signatures, and electronic records. Amended in 2008 to address data protection and cybersecurity offences.",
        relevance: "Digital contracts, e-signatures, and online agreements are legally valid under this Act. Cybercrime provisions protect against online fraud and data theft.",
        link: "https://indiacode.nic.in/bitstream/123456789/1999/3/A2000-21.pdf",
        tags: ["Cybercrime", "Digital Contracts", "E-Signature", "Data Protection"],
      },
      {
        title: "Limitation Act",
        year: 1963,
        description: "Prescribes time limits for filing suits and applications in courts. After the limitation period expires, a legal remedy may be barred.",
        relevance: "Critical for contract disputes — the limitation period for breach of contract is 3 years. Property disputes have a 12-year limitation period.",
        link: "https://indiacode.nic.in/bitstream/123456789/1306/1/1963-36.pdf",
        tags: ["Time Limits", "Contracts", "Property", "Courts"],
      },
    ],
  },
  {
    name: "Family & Personal Law",
    icon: Users,
    color: "text-pink-700",
    bg: "bg-pink-50 border-pink-200",
    books: [
      {
        title: "Hindu Marriage Act",
        year: 1955,
        description: "Governs marriage, divorce, maintenance, and restitution of conjugal rights for Hindus (including Sikhs, Jains, and Buddhists).",
        relevance: "Know grounds for divorce, rights to maintenance (Section 24/25), child custody provisions, and property rights of spouses.",
        link: "https://indiacode.nic.in/bitstream/123456789/1387/3/1955--25.pdf",
        tags: ["Marriage", "Divorce", "Maintenance", "Hindu Law"],
      },
      {
        title: "Hindu Succession Act",
        year: 1956,
        description: "Governs inheritance and succession of property for Hindus. Amended in 2005 to give daughters equal coparcenary rights in ancestral property.",
        relevance: "Daughters have equal right in ancestral property (2005 amendment). Know your share in family property, will enforcement, and intestate succession rules.",
        link: "https://indiacode.nic.in/bitstream/123456789/1388/3/195630.pdf",
        tags: ["Inheritance", "Property", "Succession", "Hindu Law"],
      },
      {
        title: "Protection of Women from Domestic Violence Act",
        shortName: "PWDVA",
        year: 2005,
        description: "Provides civil remedies to women facing domestic violence including physical, sexual, verbal, emotional, and economic abuse.",
        relevance: "Women can apply for protection orders, residence orders, monetary relief, and custody orders through a Magistrate. Does not require a criminal complaint.",
        link: "https://wcd.nic.in/sites/default/files/wdvact.pdf",
        tags: ["Women Rights", "Domestic Violence", "Protection Order"],
      },
      {
        title: "Muslim Personal Law (Shariat) Application Act",
        year: 1937,
        description: "Applies Muslim personal law to matters of marriage, succession, inheritance, and waqf for Muslims in India.",
        relevance: "Governs marriage, divorce (Talaq, Khul), mehr, maintenance (Iddat), and inheritance for Muslim citizens under personal law.",
        link: "https://indiacode.nic.in/bitstream/123456789/2343/1/193726.pdf",
        tags: ["Muslim Law", "Marriage", "Divorce", "Inheritance"],
      },
    ],
  },
  {
    name: "Business & Commercial Law",
    icon: Building2,
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    books: [
      {
        title: "Companies Act",
        year: 2013,
        description: "Governs incorporation, management, directors' duties, investor protection, auditing, and winding-up of companies in India.",
        relevance: "Essential for startups and businesses. Covers shareholder agreements, director liabilities, minority protection, and company governance.",
        link: "https://indiacode.nic.in/handle/123456789/2056",
        tags: ["Companies", "Startup", "Directors", "Shareholders"],
      },
      {
        title: "Insolvency & Bankruptcy Code",
        shortName: "IBC",
        year: 2016,
        description: "Provides time-bound resolution of insolvency for individuals and companies. Replaced multiple earlier insolvency laws.",
        relevance: "If a business owes you money and becomes insolvent, you are a creditor under IBC. Know your rights to file application before NCLT.",
        link: "https://ibbi.gov.in/uploads/legalframwork/f49c7e77a97b4ddf44ae4c00bfd9e69e.pdf",
        tags: ["Insolvency", "Bankruptcy", "NCLT", "Creditors"],
      },
      {
        title: "Arbitration & Conciliation Act",
        year: 1996,
        description: "Governs domestic and international arbitration in India. Provides an alternative to court litigation for commercial disputes.",
        relevance: "Many contracts include arbitration clauses. Know that an arbitral award is enforceable like a court decree. Arbitration is faster and cheaper than court proceedings.",
        link: "https://indiacode.nic.in/bitstream/123456789/1978/3/A1996-26.pdf",
        tags: ["Arbitration", "Dispute Resolution", "Contracts", "Commercial"],
      },
      {
        title: "Negotiable Instruments Act",
        year: 1881,
        description: "Governs cheques, promissory notes, and bills of exchange. Section 138 (cheque dishonour) is one of the most commonly litigated provisions.",
        relevance: "Bounced cheque cases under Section 138 are criminal offences. A creditor has 30 days from bank notice to send a legal notice to the drawer.",
        link: "https://indiacode.nic.in/bitstream/123456789/2157/3/188126.pdf",
        tags: ["Cheque", "Banking", "Dishonour", "Promissory Note"],
      },
    ],
  },
  {
    name: "Special Laws & Tribunals",
    icon: Gavel,
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    books: [
      {
        title: "The Legal Services Authorities Act",
        year: 1987,
        description: "Establishes Legal Services Authorities at National, State, and District levels to provide free legal aid to eligible citizens.",
        relevance: "Citizens below poverty line, women, children, SC/ST, and persons with disabilities are entitled to free legal services including lawyer representation.",
        link: "https://nalsa.gov.in/sites/default/files/lsaa.pdf",
        tags: ["Free Legal Aid", "NALSA", "Legal Services"],
      },
      {
        title: "Scheduled Castes and Tribes (Prevention of Atrocities) Act",
        shortName: "SC/ST Act",
        year: 1989,
        description: "Prevents atrocities and hate crimes against members of Scheduled Castes and Scheduled Tribes. Provides special courts and speedy trial.",
        relevance: "Provides enhanced legal protection to SC/ST communities. Offences are non-bailable, and special courts ensure faster trials.",
        link: "https://indiacode.nic.in/bitstream/123456789/1883/1/198933.pdf",
        tags: ["SC/ST", "Atrocities", "Discrimination", "Social Justice"],
      },
      {
        title: "Right of Children to Free and Compulsory Education Act",
        shortName: "RTE Act",
        year: 2009,
        description: "Guarantees free and compulsory education to all children aged 6–14 years. Mandates 25% reservation for underprivileged children in private schools.",
        relevance: "No child can be denied admission or expelled without due process. Private schools must reserve 25% seats under Section 12(1)(c) for economically weaker sections.",
        link: "https://mhrd.gov.in/sites/upload_files/mhrd/files/upload_document/rte.pdf",
        tags: ["Education", "Children Rights", "School"],
      },
      {
        title: "Persons with Disabilities (Rights of Persons with Disabilities) Act",
        shortName: "RPWD Act",
        year: 2016,
        description: "Ensures equal rights, opportunities, and social participation for persons with disabilities. Expanded list of disabilities from 7 to 21 categories.",
        relevance: "Mandates 4% reservation in government jobs, barrier-free access to public places, reasonable accommodation in employment, and disability certificates.",
        link: "https://disabilityaffairs.gov.in/upload/uploadfiles/files/RPWD%20ACT%202016.pdf",
        tags: ["Disability Rights", "Reservation", "Employment", "Accessibility"],
      },
    ],
  },
];

export default function LawLibrary() {
  const [search, setSearch] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const normalize = (s: string) => s.toLowerCase();

  const filteredCategories = lawCategories
    .map((cat) => ({
      ...cat,
      books: cat.books.filter(
        (b) =>
          !search ||
          normalize(b.title).includes(normalize(search)) ||
          normalize(b.description).includes(normalize(search)) ||
          normalize(b.relevance).includes(normalize(search)) ||
          b.tags.some((t) => normalize(t).includes(normalize(search)))
      ),
    }))
    .filter((cat) => cat.books.length > 0);

  const totalBooks = lawCategories.reduce((sum, c) => sum + c.books.length, 0);

  const toggleCategory = (name: string) => {
    setExpandedCategory((prev) => (prev === name ? null : name));
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-slate-900">Indian Law Library</h1>
              <p className="text-slate-500 text-sm mt-0.5">{totalBooks} key laws across {lawCategories.length} categories</p>
            </div>
          </div>
          <p className="text-slate-600 text-lg max-w-3xl">
            A curated reference library of important Indian laws, acts, and codes — with plain-language explanations of why they matter to you as a citizen.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            data-testid="input-law-search"
            placeholder="Search laws, acts, your rights... e.g. 'rent', 'cheque', 'divorce'"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 py-6 rounded-2xl border-slate-200 bg-white shadow-sm text-base focus-visible:ring-primary/20"
          />
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No laws found for "{search}"</p>
            <p className="text-sm mt-1">Try searching for "property", "labour", "consumer" or "family"</p>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-4">
          {filteredCategories.map((cat) => {
            const isOpen = expandedCategory === cat.name || !!search;
            return (
              <div
                key={cat.name}
                className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all`}
                data-testid={`category-${cat.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl border ${cat.bg}`}>
                      <cat.icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-slate-900">{cat.name}</h2>
                      <p className="text-sm text-slate-500">{cat.books.length} law{cat.books.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {/* Books */}
                {isOpen && (
                  <div className="border-t border-slate-100 divide-y divide-slate-100">
                    {cat.books.map((book) => (
                      <div key={book.title} className="p-6" data-testid={`book-${book.title.replace(/\s+/g, "-").toLowerCase()}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-bold text-slate-900 text-base">
                                {book.shortName ? (
                                  <>
                                    <span className="text-primary">{book.shortName}</span>
                                    <span className="text-slate-400 font-normal text-sm ml-2">— {book.title}</span>
                                  </>
                                ) : (
                                  book.title
                                )}
                              </h3>
                              <Badge variant="outline" className="text-xs text-slate-400 border-slate-200 font-medium">
                                {book.year}
                              </Badge>
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed mb-3">{book.description}</p>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Why It Matters to You</p>
                              <p className="text-sm text-amber-900 leading-relaxed">{book.relevance}</p>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {book.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <a
                            href={book.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={`link-read-${book.title.replace(/\s+/g, "-").toLowerCase()}`}
                            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/8 hover:bg-primary/12 px-3 py-2 rounded-lg transition-all border border-primary/20"
                          >
                            Read Full Act
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-100 border border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            All law texts link to official government sources (India Code, Ministry websites). This library is for educational reference only and does not constitute legal advice.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
