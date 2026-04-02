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
    title: "Solar & Battery Storage",
    desc: "Whole-home solar panel installation with Enphase, SunPower, or Tesla Powerwall battery backup. Roberto designs systems sized for your San Francisco home.",
    badge: null,
  },
  {
    icon: "🚗",
    title: "EV Home Charger Installation",
    desc: "Level 2 home EV charger (240V) installed by licensed electricians. Compatible with Tesla, Ford, Rivian, and all major EV brands.",
    badge: null,
  },
  {
    icon: "⚡",
    title: "Panel Upgrade (100A → 200A/400A)",
    desc: "Upgrade your outdated electrical panel to meet modern load demands. Essential for EV chargers, solar, heat pumps, and whole-home electrification.",
    badge: null,
  },
  {
    icon: "🔌",
    title: "General Electrical",
    desc: "Outlets, circuits, wiring, lighting, ceiling fans, and dedicated circuits. All work performed by union-trained electricians with full permit coordination.",
    badge: null,
  },
  {
    icon: "🛡️",
    title: "Insurance Compliance Inspection",
    desc: "California insurers now require electrical panel inspections before renewing homeowners policies — especially for older San Francisco homes. Viva Electric & Solar Inc. (CA License #1147947) helps you pass on the first try.",
    badge: "Required by Insurers",
    elevated: true,
  },
  {
    icon: "🏡",
    title: "Home Electrification Assessment",
    desc: "On-site evaluation ($250) covering your panel capacity, EV readiness, solar potential, and appliance electrification plan. Book with Roberto directly.",
    badge: null,
  },
];

const faqs = [
  {
    q: "What electrician do I need for a California homeowners insurance panel inspection?",
    a: "California insurance carriers — including Farmers, State Farm, and many Bay Area-based insurers — are requiring licensed electricians to inspect residential electrical panels before policy renewal, especially in homes built before 1990. Viva Electric & Solar Inc. (CA License #1147947) provides these inspections across San Francisco, Bay Area, and Central Valley. Roberto has helped over 200 San Francisco homeowners pass insurer-required inspections. We provide a written inspection report you can submit directly to your insurer.",
  },
  {
    q: "How much does a residential panel upgrade cost in San Francisco?",
    a: "A standard 100A to 200A panel upgrade in San Francisco typically costs between $2,500 and $4,500 depending on the age of your home, the condition of your existing wiring, and permit requirements. A 400A service upgrade for whole-home electrification (solar + EV + heat pump) ranges from $5,000 to $9,000. Viva Electric & Solar Inc. includes permit coordination and city inspection scheduling at no additional charge. Contact Roberto for a free on-site estimate.",
  },
  {
    q: "Is Viva Electric licensed and insured in California?",
    a: "Yes. Viva Electric & Solar Inc. holds California Contractor License #1147947 and is fully insured with general liability and workers' compensation coverage. Our electricians are union-trained and hold active journeyman certifications. You can verify our license at CSLB.ca.gov by searching for license number 1147947.",
  },
  {
    q: "Does Viva Electric serve San Francisco neighborhoods like SOMA, Mission, and the Tenderloin?",
    a: "Yes. Viva Electric & Solar Inc. regularly services homes and properties throughout all San Francisco neighborhoods including SOMA, SoMa, Mission District, Tenderloin, Castro, Noe Valley, Pacific Heights, and the Richmond and Sunset Districts. Roberto and his team are familiar with the unique electrical challenges of older SF buildings, including knob-and-tube wiring, Federal Pacific panels, and pre-1960s service infrastructure.",
  },
];

const testimonials = [
  {
    quote: "Roberto and his team upgraded our 1950s panel and handled the insurance inspection paperwork. Our insurer renewed without issue — no premium increase.",
    name: "Sarah L.",
    location: "Noe Valley, San Francisco",
    stars: 5,
  },
  {
    quote: "We had a solar install and EV charger done by Viva Electric. Roberto was on-site every day. Best contractor experience I've had in the Bay Area.",
    name: "Marcus T.",
    location: "Mission District, San Francisco",
    stars: 5,
  },
  {
    quote: "Our insurer flagged our Federal Pacific panel and gave us 30 days. Viva Electric got us scheduled in a week, pulled permits, and we passed inspection.",
    name: "Diana K.",
    location: "Castro, San Francisco",
    stars: 5,
  },
];

export default function ResidentialHomepage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="font-sans text-gray-900 bg-white min-w-[1100px]">
      {/* JSON-LD Schema Comment */}
      {/* 
        RECOMMENDED JSON-LD SCHEMA FOR THIS PAGE:
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Viva Electric & Solar Inc.",
          "telephone": "+1-415-555-0100",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "San Francisco",
            "addressLocality": "San Francisco",
            "addressRegion": "CA",
            "postalCode": "94103",
            "addressCountry": "US"
          },
          "areaServed": ["San Francisco", "Bay Area", "Central Valley", "SOMA", "Mission District"],
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Contractor License",
            "name": "CA Contractor License #1147947"
          },
          "priceRange": "$$",
          "url": "https://vivaelectricandsolar.com"
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
          <a href="#" className="text-white font-semibold border-b-2 border-yellow-400 pb-0.5">Residential</a>
          <a href="#" className="text-gray-300 hover:text-white">Commercial</a>
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
      <div className="bg-yellow-400 text-gray-900 text-center py-2 text-sm font-semibold tracking-wide">
        CA License #1147947 &nbsp;|&nbsp; Union-Trained Electricians &nbsp;|&nbsp; Serving SF, Bay Area & Central Valley &nbsp;|&nbsp; 24/7 Availability
      </div>

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&q=80')" }}
        />
        <div className="relative z-20 px-16 py-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse inline-block" />
            Serving San Francisco Homeowners
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            San Francisco's Top-Rated<br />
            <span className="text-yellow-400">Residential Electrician</span> —<br />
            Solar, Panels & Insurance Compliance
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Viva Electric & Solar Inc. — CA License #1147947 — Serving homeowners across San Francisco, Bay Area & Central Valley since 2008. Roberto and his union-trained team handle everything from panel upgrades and EV charger installation to solar systems and insurer-required compliance inspections.
          </p>
          <div className="flex gap-4">
            <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg">
              Get a Custom Quote
            </button>
            <button className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors">
              Book Inspection
            </button>
          </div>
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
              </div>
              <span className="text-sm text-gray-300">4.9/5 — 200+ Google Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-16 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Residential Electrical Services in San Francisco</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Viva Electric & Solar Inc. provides licensed residential electrical services throughout San Francisco and the Bay Area. CA License #1147947.
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

      {/* Why Choose Roberto / Viva */}
      <section className="px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-yellow-500 font-semibold text-sm uppercase tracking-wider mb-3">Why Homeowners Choose Viva Electric</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Roberto Has Helped Over 200 San Francisco Homeowners Pass Insurance Inspections
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              When your California insurer sends an inspection notice, you have a limited window to respond. Viva Electric & Solar Inc. (CA License #1147947) has helped over 200 property owners in San Francisco pass insurer-required electrical inspections — including homes in SOMA, the Mission, and the Tenderloin where aging panels are common.
            </p>
            <ul className="space-y-3">
              {[
                "CA License #1147947 — verifiable at CSLB.ca.gov",
                "Union-trained journeyman electricians on every job",
                "Permit coordination included — no additional fee",
                "Written inspection reports accepted by major CA insurers",
                "24/7 emergency electrical service in San Francisco",
                "Roberto personally oversees all compliance inspections",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-4">
              <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
                Book Your Inspection
              </button>
              <button className="text-blue-600 font-semibold hover:text-blue-800">
                View Our License →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 text-white rounded-xl p-6 text-center">
              <div className="text-4xl font-extrabold text-yellow-400 mb-2">200+</div>
              <div className="text-sm text-gray-300">SF Homeowners Passed Insurance Inspections</div>
            </div>
            <div className="bg-yellow-400 text-gray-900 rounded-xl p-6 text-center">
              <div className="text-4xl font-extrabold mb-2">15+</div>
              <div className="text-sm font-semibold">Years Serving Bay Area Homeowners</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-extrabold text-gray-900 mb-2">4.9★</div>
              <div className="text-sm text-gray-600">Google Rating — 200+ Reviews</div>
            </div>
            <div className="bg-blue-900 text-white rounded-xl p-6 text-center">
              <div className="text-4xl font-extrabold text-blue-300 mb-2">24/7</div>
              <div className="text-sm text-gray-300">Emergency Electrical Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-16 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">What San Francisco Homeowners Say About Viva Electric</h2>
          <p className="text-center text-gray-600 mb-10">Real reviews from homeowners across San Francisco who trusted Roberto and Viva Electric & Solar Inc. with their homes.</p>
          <div className="grid grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => <StarIcon key={s} />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-16 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-600">Real answers to questions San Francisco homeowners ask about electrical compliance, panel upgrades, and Viva Electric's credentials.</p>
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

      {/* CTA Banner */}
      <section className="bg-yellow-400 px-16 py-14 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Ready to Schedule Your Electrical Inspection or Panel Upgrade?</h2>
        <p className="text-gray-800 mb-6 max-w-xl mx-auto">
          Viva Electric & Solar Inc. (CA License #1147947) — Roberto and his team are available for inspections, panel upgrades, solar installs, and EV charger installation throughout San Francisco and the Bay Area.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-gray-900 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg">
            Get a Custom Quote
          </button>
          <button className="bg-white border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
            Call Roberto Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-16 py-10">
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
            <div className="text-white font-semibold mb-3 text-sm">Residential Services</div>
            <div className="text-sm space-y-2">
              <div>Solar & Battery Storage</div>
              <div>EV Charger Installation</div>
              <div>Panel Upgrade</div>
              <div>Insurance Compliance</div>
            </div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3 text-sm">Service Areas</div>
            <div className="text-sm space-y-2">
              <div>San Francisco</div>
              <div>SOMA, Mission, Tenderloin</div>
              <div>Bay Area</div>
              <div>Central Valley</div>
            </div>
          </div>
          <div>
            <div className="text-white font-semibold mb-3 text-sm">Contact</div>
            <div className="text-sm space-y-2">
              <div>24/7 Emergency Line</div>
              <div>Permit Coordination</div>
              <div>Free Estimates</div>
              <div>cslb.ca.gov — License #1147947</div>
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
