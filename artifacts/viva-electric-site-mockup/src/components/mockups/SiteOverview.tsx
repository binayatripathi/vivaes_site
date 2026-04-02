import { useState } from "react";

type PanelKey = "residential" | "commercial" | "insurance";

const panels: { key: PanelKey; label: string; icon: string; desc: string; path: string }[] = [
  {
    key: "residential",
    label: "Residential Homepage",
    icon: "🏡",
    desc: "GEO-optimized residential landing page targeting homeowners in San Francisco seeking solar, panel upgrades, and insurance compliance.",
    path: "/preview/ResidentialHomepage",
  },
  {
    key: "commercial",
    label: "Commercial Homepage",
    icon: "🏢",
    desc: "Commercial landing page with Inn On Folsom testimonial, Tier 1–4 inspection pricing, and GEO-optimized FAQ targeting hotel/property owners.",
    path: "/preview/CommercialHomepage",
  },
  {
    key: "insurance",
    label: "Insurance Compliance Page",
    icon: "🛡️",
    desc: "Full insurance compliance page with Residential / Commercial tab switcher, Tier pricing, lead capture form, and FAQPage JSON-LD schema.",
    path: "/preview/InsuranceCompliancePage",
  },
];

export default function SiteOverview() {
  const [active, setActive] = useState<PanelKey>("residential");

  const activePanel = panels.find(p => p.key === active)!;

  return (
    <div className="font-sans bg-gray-950 min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-400 rounded flex items-center justify-center font-bold text-gray-900">VE</div>
          <div>
            <div className="text-white font-bold text-sm">Viva Electric & Solar Inc.</div>
            <div className="text-gray-400 text-xs">Site Mockup — SEO + GEO Optimized — CA License #1147947</div>
          </div>
        </div>
        <div className="text-xs text-gray-500">Desktop preview — 1200px viewport</div>
      </div>

      {/* Panel selector */}
      <div className="bg-gray-900 border-b border-gray-800 px-8 py-3 flex items-center gap-3">
        {panels.map(p => (
          <button
            key={p.key}
            onClick={() => setActive(p.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              active === p.key
                ? "bg-yellow-400 text-gray-900 border-yellow-400"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-400/50 hover:text-white"
            }`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
        <div className="ml-auto">
          <div className="bg-green-900/40 border border-green-700/50 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full">
            ✓ GEO Optimized — JSON-LD Schema Included
          </div>
        </div>
      </div>

      {/* Description bar */}
      <div className="bg-gray-900/60 border-b border-gray-800 px-8 py-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{activePanel.icon}</span>
          <div>
            <div className="text-white font-semibold text-sm">{activePanel.label}</div>
            <div className="text-gray-400 text-xs mt-0.5">{activePanel.desc}</div>
          </div>
          <div className="ml-auto flex gap-2">
            <div className="bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs px-2 py-1 rounded">Named Entity: Roberto</div>
            <div className="bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs px-2 py-1 rounded">Named Entity: CA #1147947</div>
            <div className="bg-purple-900/40 border border-purple-700/50 text-purple-300 text-xs px-2 py-1 rounded">GEO: FAQ Section</div>
            <div className="bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 text-xs px-2 py-1 rounded">JSON-LD in Comments</div>
          </div>
        </div>
      </div>

      {/* Iframe preview */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="w-full h-full rounded-xl overflow-hidden border border-gray-700 shadow-2xl bg-white" style={{ minHeight: "700px" }}>
          <iframe
            key={active}
            src={activePanel.path}
            className="w-full h-full"
            style={{ minHeight: "700px", border: "none" }}
            title={activePanel.label}
          />
        </div>
      </div>

      {/* GEO checklist footer */}
      <div className="bg-gray-900 border-t border-gray-800 px-8 py-4">
        <div className="flex items-center gap-8">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">GEO Checklist</div>
          {[
            "✓ Direct Declarative Answers",
            "✓ Named Entities (Roberto, Inn On Folsom, #1147947)",
            "✓ Specific Geography (SOMA, Mission, SF, Bay Area)",
            "✓ FAQ as AI-typed questions",
            "✓ JSON-LD Schemas in comments",
            "✓ Verifiable authority signals",
            "✓ No lorem ipsum — all copy is citable",
          ].map((item, i) => (
            <div key={i} className="text-green-400 text-xs font-medium whitespace-nowrap">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
