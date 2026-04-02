import { useState } from "react";

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const residentialContent = {
  intro: "If your California homeowners insurance carrier has sent you an inspection notice or non-renewal warning related to your electrical panel, you are not alone. Thousands of San Francisco homeowners — particularly in neighborhoods with older housing stock like SOMA, the Mission, the Tenderloin, and the Sunset — receive these notices every year. Viva Electric & Solar Inc. (CA License #1147947) has helped over 200 San Francisco homeowners pass insurer-required electrical inspections since 2008.",
  bullets: [
    "Homes built before 1990 with original panels are the most common trigger for insurer inspection notices",
    "Federal Pacific, Zinsco, and split-bus panels are red-flagged by most major California insurers",
    "Roberto personally reviews each inspection report before submission to your insurer",
    "Most residential compliance inspections can be scheduled within 5 business days",
    "We provide a written inspection report formatted for submission to your specific insurer",
    "CA wildfire insurance requirements have accelerated panel inspection mandates statewide",
  ],
  process: [
    { step: "1", title: "Contact Viva Electric", desc: "Call or submit the form below. Roberto or a team member will respond within 2 business hours." },
    { step: "2", title: "On-Site Inspection", desc: "A licensed electrician visits your San Francisco home to assess your panel, wiring, and service entrance. Takes 1–2 hours." },
    { step: "3", title: "Written Report", desc: "You receive a written inspection report within 24 hours of the visit, formatted to your insurer's requirements." },
    { step: "4", title: "Remediation (if needed)", desc: "If your panel needs upgrades to pass, Viva Electric provides a detailed quote. Most residential panel upgrades are completed in 1 day." },
    { step: "5", title: "Pass & Submit", desc: "Once remediation is complete, we provide updated documentation. You submit to your insurer and maintain coverage." },
  ],
};

const commercialContent = {
  intro: "California commercial property insurers — including Travelers, Hartford, CNA, and regional carriers — are increasingly requiring Tier 1–4 electrical inspections before renewing coverage on hotels, multi-unit residential buildings, warehouses, and commercial office space. Viva Electric & Solar Inc. (CA License #1147947) has completed over 150 commercial compliance inspections in San Francisco, including for hotels in SOMA like Inn On Folsom (1188 Folsom St, San Francisco).",
  bullets: [
    "Tier 1–4 inspections are required by most major commercial CA insurers for properties over 5,000 sq ft",
    "Hotels and multi-unit buildings with panels older than 20 years are most commonly flagged",
    "Roberto's team provides written Tier 1–4 reports in the format required by your specific insurer",
    "We coordinate with SFDBI (San Francisco Department of Building Inspection) for permit pull and final sign-off",
    "PG&E coordination included for service upgrade projects",
    "Most commercial inspections can be scheduled within 7 business days",
  ],
  tiers: [
    {
      tier: "Tier 1",
      price: "$550+",
      includes: ["Visual panel inspection", "Breaker condition assessment", "Basic written report"],
    },
    {
      tier: "Tier 2",
      price: "$750+",
      includes: ["Tier 1 scope", "Electrical load study", "Service entrance assessment"],
    },
    {
      tier: "Tier 3",
      price: "$1,100+",
      includes: ["Tier 2 scope", "Full electrical system evaluation", "Insurer-formatted compliance report"],
    },
    {
      tier: "Tier 4",
      price: "$1,800+",
      includes: ["Tier 3 scope", "AFCI/GFCI audit", "Complete code compliance documentation", "Multi-unit systems review"],
    },
  ],
  process: [
    { step: "1", title: "Request a Tier Inspection", desc: "Submit the form below or call Roberto directly. Specify your property type and insurer." },
    { step: "2", title: "Site Assessment", desc: "Roberto's commercial team visits your San Francisco property to assess all relevant electrical systems." },
    { step: "3", title: "Tier Report Delivery", desc: "Written Tier 1–4 inspection report delivered within 48 hours, formatted for your insurer." },
    { step: "4", title: "Remediation (if required)", desc: "Viva Electric provides a full-scope remediation quote. We prioritize properties with insurer deadlines." },
    { step: "5", title: "Compliance Sign-Off", desc: "Final inspection, permit close-out, and updated insurer documentation provided to you." },
  ],
};

const faqs = [
  {
    q: "Why is my California insurer requiring an electrical inspection?",
    a: "California insurance carriers have significantly increased electrical inspection requirements over the past three years, driven by wildfire risk modeling, an aging housing stock, and an increase in electrical fire claims. In San Francisco specifically, a large percentage of residential and commercial properties have panels that are more than 30 years old — many of which use panel brands (Federal Pacific, Zinsco, Pushmatic) that are now flagged by insurers. If you've received a notice, you typically have 30–90 days to provide documentation before your policy is non-renewed. Viva Electric & Solar Inc. (CA License #1147947) can usually schedule your inspection within 5–7 business days.",
  },
  {
    q: "What does a Tier 3 or Tier 4 panel inspection include?",
    a: "A Tier 3 electrical inspection performed by Viva Electric & Solar Inc. includes: (1) a visual and operational assessment of your main service panel, including all breakers and conductors; (2) an electrical load study comparing your actual usage to your panel's rated capacity; (3) documentation of your service entrance condition; and (4) a written report formatted for your specific California insurer. A Tier 4 inspection adds an AFCI (arc-fault circuit interrupter) and GFCI (ground-fault circuit interrupter) audit and, for multi-unit properties, a review of all sub-panels. Roberto personally reviews every Tier 3 and Tier 4 report before delivery.",
  },
  {
    q: "How quickly can Viva Electric schedule a compliance inspection in San Francisco?",
    a: "For residential properties, Viva Electric & Solar Inc. typically schedules inspections within 3–5 business days of contact. For commercial properties requiring Tier 1–4 inspections, scheduling is typically within 5–7 business days. If your insurer has given you a hard deadline (common in non-renewal notices), contact Roberto directly and we will prioritize your scheduling. We serve all San Francisco neighborhoods — SOMA, Mission, Tenderloin, Financial District, and beyond — as well as the broader Bay Area.",
  },
];

type Tab = "residential" | "commercial";

export default function InsuranceCompliancePage() {
  const [activeTab, setActiveTab] = useState<Tab>("residential");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    propertyType: "",
    message: "",
  });

  const handleInput = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const content = activeTab === "residential" ? residentialContent : commercialContent;

  return (
    <div className="font-sans text-gray-900 bg-white min-w-[1100px]">
      {/* JSON-LD Schema Comment */}
      {/* 
        RECOMMENDED FAQPage JSON-LD SCHEMA:
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Why is my California insurer requiring an electrical inspection?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "California insurance carriers have significantly increased electrical inspection requirements due to wildfire risk and aging housing stock. Viva Electric & Solar Inc. (CA License #1147947) can schedule your inspection within 5–7 business days."
              }
            },
            {
              "@type": "Question",
              "name": "What does a Tier 3 or Tier 4 panel inspection include?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A Tier 3 inspection includes panel assessment, load study, service entrance documentation, and an insurer-formatted report. Tier 4 adds AFCI/GFCI audit and multi-unit sub-panel review."
              }
            },
            {
              "@type": "Question",
              "name": "How quickly can Viva Electric schedule a compliance inspection in San Francisco?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Residential inspections typically within 3–5 business days. Commercial Tier inspections within 5–7 business days. Contact Roberto directly for urgent deadline cases."
              }
            }
          ]
        }
        </script>
      */}

      {/* Navigation Bar */}
      <nav className="bg-gray-900 text-white px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center font-bold text-gray-900 text-sm">VE</div>
          <div>
            <div className="font-bold text-sm">Viva Electric & Solar Inc.</div>
            <div className="text-xs text-gray-400">CA License #1147947</div>
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="text-gray-300 hover:text-white">Residential</a>
          <a href="#" className="text-gray-300 hover:text-white">Commercial</a>
          <a href="#" className="text-gray-300 hover:text-white">Solar & Storage</a>
          <a href="#" className="text-white font-semibold border-b-2 border-yellow-400 pb-0.5">Insurance Compliance</a>
          <a href="#" className="text-gray-300 hover:text-white">About</a>
        </div>
        <div className="flex gap-3">
          <button className="bg-transparent border border-yellow-400 text-yellow-400 px-4 py-2 rounded text-sm font-medium hover:bg-yellow-400 hover:text-gray-900 transition-colors">Book Inspection</button>
          <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded text-sm font-bold hover:bg-yellow-300 transition-colors">Get a Custom Quote</button>
        </div>
      </nav>

      {/* Trust Bar */}
      <div className="bg-yellow-400 text-gray-900 text-center py-2 text-sm font-semibold tracking-wide">
        CA License #1147947 &nbsp;|&nbsp; Union-Trained &nbsp;|&nbsp; Permit Coordination &nbsp;|&nbsp; Residential & Commercial &nbsp;|&nbsp; Tier 1–4 Inspections
      </div>

      {/* Hero */}
      <section className="bg-gray-900 text-white px-16 py-16">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block" />
            Insurance Compliance — San Francisco & Bay Area
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            California Insurance Compliance<br />
            <span className="text-yellow-400">Electrical Inspections</span> —<br />
            Residential & Commercial
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
            Viva Electric & Solar Inc. helps homeowners and property owners in San Francisco pass insurer-required electrical inspections. CA License #1147947. Roberto and his team provide written inspection reports accepted by major California insurers — for both residential and commercial properties throughout San Francisco, Bay Area, and Central Valley.
          </p>
        </div>
      </section>

      {/* Tab Switcher */}
      <section className="bg-gray-100 px-16 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex rounded-xl overflow-hidden border-2 border-gray-300 bg-white shadow-sm">
            <button
              className={`px-8 py-3 text-sm font-bold transition-colors ${
                activeTab === "residential"
                  ? "bg-yellow-400 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("residential")}
            >
              🏡 Residential Homeowners
            </button>
            <button
              className={`px-8 py-3 text-sm font-bold transition-colors ${
                activeTab === "commercial"
                  ? "bg-yellow-400 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("commercial")}
            >
              🏢 Commercial Properties
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-3">
            {activeTab === "residential"
              ? "For single-family homeowners, condo owners, and landlords of 1–4 unit properties in San Francisco and the Bay Area."
              : "For hotel operators, warehouse owners, and managers of multi-unit commercial properties in San Francisco and the Bay Area."}
          </p>
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-16 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab === "residential"
                  ? "Why San Francisco Homeowners Are Receiving Electrical Inspection Notices"
                  : "Why Commercial Properties in San Francisco Need Tier Inspections"}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">{content.intro}</p>
              <ul className="space-y-3">
                {content.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                    <CheckIcon />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {activeTab === "residential" ? "How the Inspection Process Works" : "Our Commercial Inspection Process"}
              </h3>
              <div className="space-y-4">
                {content.process.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                      {step.step}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{step.title}</div>
                      <div className="text-sm text-gray-600 leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Commercial Tier Pricing Table */}
          {activeTab === "commercial" && "tiers" in content && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Commercial Inspection Tier Pricing</h3>
              <div className="grid grid-cols-4 gap-4">
                {(content as typeof commercialContent).tiers.map((tier, i) => (
                  <div key={i} className="border-2 border-gray-200 rounded-xl p-5 hover:border-yellow-400 transition-colors">
                    <div className="font-bold text-gray-900 text-lg mb-1">{tier.tier}</div>
                    <div className="text-2xl font-extrabold text-yellow-600 mb-3">{tier.price}</div>
                    <ul className="space-y-2">
                      {tier.includes.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                          <CheckIcon />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 px-16 py-8 border-y border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-10">
          {[
            { icon: "🏅", label: "CA License #1147947" },
            { icon: "🔨", label: "Union-Trained Electricians" },
            { icon: "📋", label: "Permit Coordination" },
            { icon: "🏢", label: "Multi-Unit Support" },
            { icon: "⭐", label: "4.9/5 — 200+ Reviews" },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <div className="text-2xl">{badge.icon}</div>
              <div className="text-xs font-semibold text-gray-700">{badge.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-16 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">California Electrical Compliance FAQ</h2>
            <p className="text-gray-600">Questions San Francisco homeowners and property owners ask about electrical inspections and Viva Electric & Solar Inc.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDownIcon open={openFaq === i} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="bg-gray-900 px-16 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-3">Schedule Your Inspection</div>
            <h2 className="text-3xl font-bold text-white mb-3">Request a Compliance Inspection from Viva Electric</h2>
            <p className="text-gray-400">
              Fill out the form below and Roberto or a team member will contact you within 2 business hours. We serve all San Francisco neighborhoods, Bay Area, and Central Valley.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleInput("name")}
                  placeholder="Your name"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleInput("phone")}
                  placeholder="(415) 555-0100"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInput("email")}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Property Type *</label>
                <select
                  value={formData.propertyType}
                  onChange={handleInput("propertyType")}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                >
                  <option value="">Select type...</option>
                  <option value="residential">Residential — Single Family Home</option>
                  <option value="condo">Residential — Condo / Townhome</option>
                  <option value="multi-res">Residential — 2–4 Unit Building</option>
                  <option value="hotel">Commercial — Hotel / Hospitality</option>
                  <option value="warehouse">Commercial — Warehouse / Industrial</option>
                  <option value="multi-commercial">Commercial — Multi-Unit (5+ units)</option>
                  <option value="office">Commercial — Office / Retail</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Property Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={handleInput("address")}
                  placeholder="1188 Folsom St, San Francisco, CA 94103"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message / Additional Details</label>
                <textarea
                  value={formData.message}
                  onChange={handleInput("message")}
                  rows={4}
                  placeholder="Describe your situation — e.g., 'My insurer sent me a 60-day notice and I have a 1960s Federal Pacific panel...' The more detail, the better we can prepare."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>
            </div>
            <button className="mt-4 w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-md">
              Request My Compliance Inspection
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Viva Electric & Solar Inc. — CA License #1147947 — We respond within 2 business hours. No spam, no pressure.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-16 py-10 border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8">
          <div>
            <div className="text-white font-bold mb-3">Viva Electric & Solar Inc.</div>
            <div className="text-sm space-y-1">
              <div>CA License #1147947</div>
              <div>Union-Trained Electricians</div>
              <div>San Francisco, CA</div>
            </div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3 text-sm">Inspection Services</div>
            <div className="text-sm space-y-2">
              <div>Residential Compliance</div>
              <div>Tier 1 Inspection ($550+)</div>
              <div>Tier 2 Inspection ($750+)</div>
              <div>Tier 3 Inspection ($1,100+)</div>
              <div>Tier 4 Inspection ($1,800+)</div>
            </div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3 text-sm">Service Areas</div>
            <div className="text-sm space-y-2">
              <div>SOMA — San Francisco</div>
              <div>Mission, Tenderloin</div>
              <div>Financial District</div>
              <div>Bay Area & Central Valley</div>
            </div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3 text-sm">Credentials</div>
            <div className="text-sm space-y-2">
              <div>CA License #1147947</div>
              <div>Union Journeyman Certified</div>
              <div>General Liability Insured</div>
              <div>SFDBI Permit Ready</div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs">
          © 2024 Viva Electric & Solar Inc. — CA License #1147947 — All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
