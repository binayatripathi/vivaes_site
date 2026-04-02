import { useState } from "react";

const CheckIcon = () => (
  <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const services = [
  {
    icon: "☀️",
    title: "Commercial Solar Installation",
    desc: "Rooftop and ground-mount commercial solar for warehouses, office buildings, and multi-unit properties in San Francisco and the Bay Area. Roberto sizes systems to maximize your PG&E demand charge savings.",
    badge: null,
  },
  {
    icon: "🚌",
    title: "EV Fleet Charging Infrastructure",
    desc: "Level 2 and DC Fast Charging station installation for commercial fleets, parking structures, and mixed-use properties. Includes load management systems to prevent demand charge spikes.",
    badge: null,
  },
  {
    icon: "⚡",
    title: "Service Panel Upgrade",
    desc: "800A, 1200A, and 2000A commercial service upgrades for hotels, warehouses, and multi-unit buildings. Permit coordination, PG&E interconnection, and structural coordination included.",
    badge: null,
  },
  {
    icon: "🏢",
    title: "Commercial Electrical",
    desc: "Full-scope commercial electrical — tenant buildouts, lighting systems, dedicated circuits, emergency power, and code compliance work throughout SOMA, the Financial District, and the Mission.",
    badge: null,
  },
  {
    icon: "💡",
    title: "Lighting Retrofits",
    desc: "LED retrofit projects for commercial buildings that reduce energy bills by 30–60%. PG&E rebate coordination available. Viva Electric & Solar Inc. handles everything from assessment to final inspection.",
    badge: null,
  },
  {
    icon: "🛡️",
    title: "Insurance Compliance Inspections",
    desc: "California commercial insurers require Tier 1–4 electrical inspections before renewing coverage on hotels, multi-unit buildings, and commercial properties. Roberto's team has completed over 150 commercial compliance inspections in San Francisco.",
    badge: "Tier 1–4 Inspections",
    elevated: true,
  },
];

const faqs = [
  {
    q: "Which electrician in San Francisco handles commercial insurance compliance inspections?",
    a: "Viva Electric & Solar Inc. (CA License #1147947) is one of the most experienced commercial electrical contractors in San Francisco for insurer-required Tier 1–4 panel inspections. Roberto has personally overseen over 150 commercial compliance inspections across SOMA, the Financial District, Mission District, and the greater Bay Area. We provide written inspection reports in the format required by major California commercial insurers including Travelers, Hartford, and CNA.",
  },
  {
    q: "What is required for a Tier 3 or Tier 4 electrical inspection in California?",
    a: "California Tier 3 and Tier 4 commercial electrical inspections involve a licensed electrician's assessment of the main service panel (including breaker condition, conductor sizing, and grounding), a panel load study, documentation of any Federal Pacific or Zinsco equipment, and a written report submitted to the insurer. Tier 4 inspections also require documentation of arc-fault and ground-fault protection. Viva Electric & Solar Inc. provides all components of a Tier 1–4 inspection for properties in San Francisco and throughout the Bay Area. Fees start at $550.",
  },
  {
    q: "Does Viva Electric work with hotels and multi-unit commercial properties?",
    a: "Yes. Viva Electric & Solar Inc. regularly works with hotel operators, property managers, and building owners in San Francisco — especially in SOMA, the Financial District, and the Mission District. Roberto has direct experience with the unique electrical demands of historic commercial buildings, including coordination with the San Francisco Department of Building Inspection (SFDBI) and PG&E for service upgrades. Inn On Folsom (1188 Folsom St, SOMA) is one of our commercial clients.",
  },
];

export default function CommercialHomepage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="font-sans text-gray-900 bg-white min-w-[1100px]">
      {/* JSON-LD Schema Comment */}
      {/* 
        RECOMMENDED JSON-LD SCHEMA FOR THIS PAGE:
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "LocalBusiness",
            "name": "Viva Electric & Solar Inc.",
            "telephone": "+1-415-555-0100",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "San Francisco",
              "addressLocality": "San Francisco",
              "addressRegion": "CA"
            }
          },
          "author": {
            "@type": "Organization",
            "name": "Inn On Folsom",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1188 Folsom St",
              "addressLocality": "San Francisco",
              "addressRegion": "CA",
              "postalCode": "94103"
            }
          },
          "reviewBody": "We had a decades-old panel in a historic SF building. Roberto from Viva Electric came in, assessed everything, coordinated the upgrade, and made sure we passed the insurer's inspection on the first try. Our insurance premium dropped noticeably after.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          }
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
          <a href="#" className="text-white font-semibold border-b-2 border-yellow-400 pb-0.5">Commercial</a>
          <a href="#" className="text-gray-300 hover:text-white">Solar & Storage</a>
          <a href="#" className="text-gray-300 hover:text-white">Insurance Compliance</a>
          <a href="#" className="text-gray-300 hover:text-white">About</a>
        </div>
        <div className="flex gap-3">
          <button className="bg-transparent border border-yellow-400 text-yellow-400 px-4 py-2 rounded text-sm font-medium hover:bg-yellow-400 hover:text-gray-900 transition-colors">Book Inspection</button>
          <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded text-sm font-bold hover:bg-yellow-300 transition-colors">Get a Custom Quote</button>
        </div>
      </nav>

      {/* Trust Bar */}
      <div className="bg-gray-800 text-gray-200 text-center py-2 text-sm font-medium tracking-wide">
        CA License #1147947 &nbsp;|&nbsp; Tier 1–4 Commercial Inspections &nbsp;|&nbsp; SOMA · Financial District · Mission · Bay Area &nbsp;|&nbsp; Roberto — Direct Line Available
      </div>

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80')" }}
        />
        <div className="relative z-20 px-16 py-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-400/20 border border-blue-400/40 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse inline-block" />
            Trusted by SF Hotels, Warehouses & Multi-Unit Properties
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            San Francisco's Trusted<br />
            <span className="text-yellow-400">Commercial Electrician</span> —<br />
            Panels, Solar & Insurance Compliance
          </h1>
          <p className="text-lg text-gray-300 mb-4 leading-relaxed">
            for Hotels, Warehouses & Multi-Unit Properties
          </p>
          <p className="text-base text-gray-400 mb-8 leading-relaxed">
            Viva Electric & Solar Inc. — CA License #1147947 — Roberto and his team serve SOMA, Financial District, Mission, and the greater Bay Area. From Tier 1–4 insurance compliance inspections to full commercial service upgrades, we deliver on-time, permit-included, insurer-approved work.
          </p>
          <div className="flex gap-4">
            <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg">
              Get a Commercial Quote
            </button>
            <button className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors">
              Book Tier Inspection
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-16 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Commercial Electrical Services in San Francisco</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Viva Electric & Solar Inc. (CA License #1147947) provides full-scope commercial electrical services throughout SOMA, Financial District, Mission, and the Bay Area.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <div
                key={i}
                className={`rounded-xl p-6 border-2 flex flex-col gap-3 relative ${
                  svc.elevated
                    ? "bg-yellow-50 border-yellow-400 shadow-lg"
                    : "bg-white border-gray-100 hover:border-yellow-300 shadow-sm hover:shadow-md transition-all"
                }`}
              >
                {svc.badge && (
                  <div className={`absolute -top-3 left-6 text-xs font-bold px-3 py-1 rounded-full ${
                    svc.elevated ? "bg-yellow-400 text-gray-900" : "bg-gray-700 text-white"
                  }`}>
                    {svc.badge}
                  </div>
                )}
                <div className="text-3xl">{svc.icon}</div>
                <h3 className={`font-bold text-lg ${svc.elevated ? "text-yellow-800" : "text-gray-900"}`}>
                  {svc.title}
                </h3>
                <p className={`text-sm leading-relaxed ${svc.elevated ? "text-yellow-900" : "text-gray-600"}`}>
                  {svc.desc}
                </p>
                <button className={`mt-auto text-sm font-semibold ${svc.elevated ? "text-yellow-700 hover:text-yellow-900" : "text-blue-600 hover:text-blue-800"}`}>
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial — Inn On Folsom */}
      <section className="px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-yellow-600 font-semibold text-sm uppercase tracking-wider mb-3">Featured Client — SOMA, San Francisco</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How Viva Electric Helped Inn On Folsom Pass Their Insurance Inspection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Roberto's team completed a full commercial panel upgrade and Tier 3 insurance compliance inspection for one of SOMA's most beloved boutique hotels.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 items-center bg-gray-50 rounded-2xl p-10 border border-gray-100">
            <div>
              <img
                src="/inn-on-folsom.png"
                alt="Inn On Folsom — Boutique Hotel, 1188 Folsom St, SOMA, San Francisco"
                className="rounded-xl w-full object-cover shadow-md"
                style={{ maxHeight: 300 }}
              />
              <div className="mt-4 text-center">
                <a
                  href="https://www.innonfolsom.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-gray-900 hover:text-blue-700 text-lg"
                >
                  Inn On Folsom
                </a>
                <div className="text-sm text-gray-500">1188 Folsom St, San Francisco, CA 94103 — SOMA</div>
                <div className="text-sm text-gray-500">(415) 529-1369</div>
              </div>
            </div>
            <div>
              <div className="flex mb-4">
                {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
                <span className="ml-2 text-sm font-semibold text-gray-700">5.0 — Verified Review</span>
              </div>
              <blockquote className="text-gray-800 text-lg leading-relaxed italic mb-6">
                "We had a decades-old panel in a historic SF building. Roberto from Viva Electric came in, assessed everything, coordinated the upgrade, and made sure we passed the insurer's inspection on the first try. Our insurance premium dropped noticeably after. If you're a hotel or property owner in San Francisco dealing with insurance pressure on your electrical, call Roberto."
              </blockquote>
              <div className="border-t border-gray-200 pt-4">
                <div className="font-bold text-gray-900">Hotel Manager</div>
                <div className="text-sm text-gray-600">
                  <a href="https://www.innonfolsom.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                    Inn On Folsom
                  </a>
                  {" "}— SOMA, San Francisco
                </div>
                <div className="text-xs text-gray-500 mt-1">25-room historic European boutique hotel at 1188 Folsom St, San Francisco, CA 94103</div>
              </div>
              <div className="mt-6 flex gap-3">
                <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full">✓ Passed Inspection First Try</div>
                <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">✓ Premium Dropped</div>
                <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full">✓ Full Panel Upgrade</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-gray-900 text-white px-16 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-yellow-400 mb-2">150+</div>
            <div className="text-sm text-gray-300">Commercial Inspections Completed in SF</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-yellow-400 mb-2">$550+</div>
            <div className="text-sm text-gray-300">Starting Price for Tier 1 Inspection</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-yellow-400 mb-2">Tier 1–4</div>
            <div className="text-sm text-gray-300">All CA Commercial Inspection Levels Covered</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-yellow-400 mb-2">15+</div>
            <div className="text-sm text-gray-300">Years Serving Bay Area Commercial Properties</div>
          </div>
        </div>
      </section>

      {/* Why Commercial Clients Choose Viva */}
      <section className="px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-yellow-500 font-semibold text-sm uppercase tracking-wider mb-3">Why Commercial Properties Trust Viva Electric</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Roberto Has Completed Over 150 Commercial Compliance Inspections in San Francisco
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              When California insurers send inspection notices to commercial property owners — hotels, warehouses, apartment buildings — the clock starts ticking. Viva Electric & Solar Inc. (CA License #1147947) responds within 24 hours, provides a written Tier 1–4 inspection report, and coordinates all permit and insurer documentation.
            </p>
            <ul className="space-y-3">
              {[
                "CA License #1147947 — verifiable at CSLB.ca.gov",
                "Tier 1–4 commercial panel inspection reports",
                "Hotel, warehouse, and multi-unit property experience",
                "PG&E coordination and utility interconnection management",
                "SFDBI permit coordination in San Francisco",
                "Roberto personally oversees all commercial projects",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Tier Inspection Pricing</h3>
            <div className="space-y-3">
              {[
                { tier: "Tier 1", price: "$550+", desc: "Basic panel condition assessment" },
                { tier: "Tier 2", price: "$750+", desc: "Panel + load study + breaker assessment" },
                { tier: "Tier 3", price: "$1,100+", desc: "Full electrical system + insurer report" },
                { tier: "Tier 4", price: "$1,800+", desc: "Complete code compliance + AFCI/GFCI audit" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <div className="font-semibold text-gray-900">{row.tier}</div>
                    <div className="text-xs text-gray-500">{row.desc}</div>
                  </div>
                  <div className="text-lg font-bold text-yellow-600">{row.price}</div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
              Request a Tier Inspection Quote
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-16 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Commercial Electrical FAQ</h2>
            <p className="text-gray-600">Real answers to questions commercial property owners and hotel operators in San Francisco ask about electrical compliance and Viva Electric.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
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

      {/* CTA Banner */}
      <section className="bg-gray-900 px-16 py-14 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-3">Commercial Electrical — San Francisco</div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Need a Commercial Electrical Inspection or Upgrade in San Francisco?</h2>
          <p className="text-gray-400 mb-6">
            Viva Electric & Solar Inc. (CA License #1147947) — Roberto and his team serve SOMA, Financial District, Mission, and the greater Bay Area. Contact us for a same-week commercial inspection or project quote.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg">
              Get a Commercial Quote
            </button>
            <button className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-colors">
              Call Roberto Now
            </button>
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
            <div className="text-white font-semibold mb-3 text-sm">Commercial Services</div>
            <div className="text-sm space-y-2">
              <div>Commercial Solar</div>
              <div>EV Fleet Charging</div>
              <div>Panel Upgrade</div>
              <div>Insurance Compliance</div>
              <div>Lighting Retrofits</div>
            </div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3 text-sm">Service Areas</div>
            <div className="text-sm space-y-2">
              <div>SOMA — San Francisco</div>
              <div>Financial District</div>
              <div>Mission District</div>
              <div>Bay Area & Central Valley</div>
            </div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3 text-sm">Commercial Contact</div>
            <div className="text-sm space-y-2">
              <div>24/7 Emergency Line</div>
              <div>Tier 1–4 Inspections</div>
              <div>Permit Coordination</div>
              <div>cslb.ca.gov — #1147947</div>
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
