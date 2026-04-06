import React, { useState, useEffect, useRef } from 'react';

// ============================================
// TYPES
// ============================================
interface Section {
  id: string;
  label: string;
}

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface TechnicalFeature {
  feature: string;
  specification: string;
  benefit: string;
}

// ============================================
// ICONS (Heroicons-style inline SVGs)
// ============================================
const Icons = {
  Zap: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Droplet: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  ),
  Scale: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 5.25L20.25 18M20.25 5.25L3.75 18M4.5 3.75h15M4.5 20.25h15" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
    </svg>
  ),
  Building: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5M9 12h1.5M9 17.25h1.5M14.25 6.75h1.5M14.25 12h1.5M14.25 17.25h1.5" />
    </svg>
  ),
  Cog: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.25 2.25 0 0020.5 21l2.25-2.25A2.25 2.25 0 0022.5 15.5l-5.83-5.83M11.42 15.17l-5.83-5.83A2.25 2.25 0 014.5 8.75L6.75 6.5A2.25 2.25 0 019.5 6.5l5.83 5.83M11.42 15.17L15.17 11.42" />
    </svg>
  ),
  Document: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  ),
};

// ============================================
// REUSABLE COMPONENTS
// ============================================
const Card: React.FC<CardProps> = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="group border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
  >
    {icon && <div className="mb-4 text-gray-700 group-hover:text-gray-900">{icon}</div>}
    <h3 className="text-lg font-bold tracking-tight text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const Section: React.FC<{ id: string; title: string; children: React.ReactNode; className?: string }> = ({
  id,
  title,
  children,
  className = '',
}) => (
  <section id={id} className={`py-16 md:py-20 border-b border-gray-200 last:border-b-0 ${className}`}>
    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-10 md:mb-12 border-l-4 border-gray-700 pl-5">
        {title}
      </h2>
      {children}
    </div>
  </section>
);

// ============================================
// STICKY SIDE NAVIGATION
// ============================================
const SideNav: React.FC<{ sections: Section[]; activeSection: string }> = ({ sections, activeSection }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <nav className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40 w-48">
      <div className="border-l border-gray-300 pl-5 space-y-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`block text-left text-sm font-medium transition-all duration-200 hover:text-gray-900 ${
              activeSection === section.id ? 'text-gray-900 border-l-2 border-gray-900 -ml-[1.125rem] pl-4' : 'text-gray-500'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================
const CoolingTowersPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const sections: Section[] = [
    { id: 'hero', label: 'Overview' },
    { id: 'applications', label: 'Applications' },
    { id: 'types', label: 'Types' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'tech-specs', label: 'Technical Specs' },
    { id: 'cta', label: 'Contact' },
  ];

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        sectionRefs.current[section.id] = element;
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Technical features data
  const technicalFeatures: TechnicalFeature[] = [
    { feature: 'Flow Rate', specification: '3,000 – 300,000 GPM', benefit: 'Scalable for industrial demands' },
    { feature: 'Configuration', specification: 'Counterflow / Crossflow', benefit: 'Optimized thermal performance' },
    { feature: 'Material', specification: 'Galvanized steel / FRP', benefit: 'Corrosion resistance & durability' },
    { feature: 'Fan Drive', specification: 'Direct / Gear / Belt', benefit: 'Energy-efficient operation' },
    { feature: 'Plume Abatement', specification: 'Optional hybrid system', benefit: 'Meets environmental regulations' },
  ];

  return (
    <div className="bg-white text-gray-900 font-sans antialiased" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
      {/* Header / Top Bar */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-gray-900">COOLING TOWER DEPOT®</div>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-gray-600">Products</a>
            <a href="#" className="hover:text-gray-600">Services</a>
            <a href="#" className="hover:text-gray-600">Parts</a>
            <a href="#" className="hover:text-gray-600">Contact</a>
          </div>
          <div className="text-sm bg-gray-100 px-3 py-1.5 rounded-none">1-877-243-3945</div>
        </div>
      </header>

      {/* Side Navigation */}
      <SideNav sections={sections} activeSection={activeSection} />

      <main className="relative">
        {/* ===== HERO SECTION ===== */}
        <section id="hero" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                  Cooling Towers
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Industrial heat rejection systems engineered for extreme reliability. From 3,000 to 300,000 GPM — field-erected or packaged.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-gray-900 text-white px-6 py-3 font-medium border border-gray-900 hover:bg-gray-800 transition-colors">
                    Request Quote
                  </button>
                  <button className="bg-white text-gray-900 px-6 py-3 font-medium border border-gray-300 hover:border-gray-900 transition-colors">
                    View Products
                  </button>
                </div>
              </div>
              <div className="bg-gray-100 h-64 flex items-center justify-center border border-gray-200">
                <span className="text-gray-500 text-sm">[Industrial Cooling Tower Diagram]</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== OVERVIEW (short, integrated into hero content above) ===== */}
        <div className="border-t border-gray-200"></div>

        {/* ===== APPLICATIONS ===== */}
        <Section id="applications" title="Applications">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Power Generation" description="Combined cycle, nuclear & thermal plants." icon={<Icons.Zap />} />
            <Card title="Oil & Gas" description="Refineries, petrochemical & LNG terminals." icon={<Icons.Droplet />} />
            <Card title="Manufacturing" description="Steel, automotive, plastics & food processing." icon={<Icons.Cog />} />
            <Card title="HVAC / Commercial" description="Large-scale district cooling & data centers." icon={<Icons.Building />} />
          </div>
        </Section>

        {/* ===== TYPES OF COOLING TOWERS ===== */}
        <Section id="types" title="Types of Cooling Towers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Natural Draft" description="Hyperbolic concrete towers for very high heat loads. Zero fan energy." />
            <Card title="Induced Draft" description="Counterflow or crossflow with fan at discharge. Highest efficiency." />
            <Card title="Dry Cooling" description="Air-cooled condensers, zero water consumption. Ideal for arid regions." />
            <Card title="Hybrid Systems" description="Wet-dry combination for plume abatement and water conservation." />
          </div>
        </Section>

        {/* ===== KEY BENEFITS ===== */}
        <Section id="benefits" title="Key Benefits">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-4 border-l border-gray-200">
              <div className="flex justify-center mb-3 text-gray-800"><Icons.Zap /></div>
              <h3 className="font-bold text-lg mb-1">Energy Efficiency</h3>
              <p className="text-gray-500 text-sm">Low fan power & optimized drift eliminators</p>
            </div>
            <div className="text-center p-4 border-l border-gray-200">
              <div className="flex justify-center mb-3 text-gray-800"><Icons.Droplet /></div>
              <h3 className="font-bold text-lg mb-1">Water Optimization</h3>
              <p className="text-gray-500 text-sm">Reduce make-up & blowdown by up to 30%</p>
            </div>
            <div className="text-center p-4 border-l border-gray-200">
              <div className="flex justify-center mb-3 text-gray-800"><Icons.Scale /></div>
              <h3 className="font-bold text-lg mb-1">Scalability</h3>
              <p className="text-gray-500 text-sm">Modular cells, 3k to 300k GPM range</p>
            </div>
            <div className="text-center p-4 border-l border-gray-200">
              <div className="flex justify-center mb-3 text-gray-800"><Icons.Shield /></div>
              <h3 className="font-bold text-lg mb-1">Reliability</h3>
              <p className="text-gray-500 text-sm">24/7 parts availability & global service</p>
            </div>
          </div>
        </Section>

        {/* ===== TECHNICAL FEATURES TABLE ===== */}
        <Section id="tech-specs" title="Technical Features">
          <div className="overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Specification</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Benefit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {technicalFeatures.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.feature}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{item.specification}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-4 border-l-2 border-gray-300 pl-4">
            * DEPOT™ models include double-wall CFU, low-noise options, and CTI certified performance.
          </p>
        </Section>

        {/* ===== CTA SECTION ===== */}
        <section id="cta" className="py-20 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Ready to optimize your cooling system?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Get a free engineering review or download complete technical specifications.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gray-900 text-white px-8 py-3 font-medium border border-gray-900 hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                <Icons.Phone /> Talk to an expert
              </button>
              <button className="bg-white text-gray-900 px-8 py-3 font-medium border border-gray-300 hover:border-gray-900 transition-colors inline-flex items-center gap-2">
                <Icons.Document /> Download specs (PDF)
              </button>
            </div>
            <div className="mt-12 text-sm text-gray-500 border-t border-gray-200 pt-8">
              <span className="font-mono">1-877-243-3945</span> — 24/7 emergency support & parts hotline
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <p>© 2025 Cooling Tower Depot®. Industrial cooling solutions worldwide.</p>
          <p className="mt-2">Field-erected • Packaged • Parts • Rebuilds</p>
        </div>
      </footer>
    </div>
  );
};

export default CoolingTowersPage;
