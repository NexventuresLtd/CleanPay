import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Map,
  CreditCard,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Menu,
  X,
  ArrowRight,
  WifiOff,
} from "lucide-react";
import Logo from "../assets/favicon-1.png";
import { Link } from "react-router-dom";

// --- Types ---
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StepProps {
  number: string;
  title: string;
  description: string;
}

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div>
            <img className="h-11" src={Logo} alt="IsukuPay Logo" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            Isuku<span className="text-teal-700">Pay</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-slate-600 hover:text-teal-700 font-medium transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-slate-600 hover:text-teal-700 font-medium transition-colors"
          >
            How it Works
          </a>
          <a
            href="#solutions"
            className="text-slate-600 hover:text-teal-700 font-medium transition-colors"
          >
            Solutions
          </a>
          <Link to="/login" className="text-teal-700 font-semibold hover:bg-teal-50 px-4 py-2 rounded-md transition-colors">
            Login
          </Link>
          <button className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-md font-semibold transition-all shadow-lg shadow-teal-700/20">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-lg py-4 px-6 flex flex-col space-y-4">
          <a href="#features" className="text-slate-600 font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-slate-600 font-medium">
            How it Works
          </a>
          <button className="w-full bg-teal-700 text-white py-3 rounded-md font-semibold">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-teal-50 rounded-full blur-3xl opacity-70 -z-10"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-70 -z-10"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Now Available in Kigali
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Smart Waste <br />
              Collection for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-emerald-600">
                Smart Cities
              </span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Digitize your waste management operations. From NFC card
              collections and route optimization to seamless Mobile Money
              payments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl shadow-teal-700/20 flex items-center justify-center gap-2">
                Request Demo <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white border border-slate-200 hover:border-teal-700 text-slate-700 hover:text-teal-700 px-8 py-4 rounded-lg font-bold text-lg transition-all">
                Partner with Us
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="lg:w-1/2 relative">
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-4 border border-slate-700 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Fake Dashboard UI */}
              <div className="bg-slate-900 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Revenue Today</p>
                    <p className="text-2xl font-bold text-white">RWF 850,000</p>
                    <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 rotate-[-45deg]" /> +12% vs
                      yesterday
                    </p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Active Collectors</p>
                    <p className="text-2xl font-bold text-white">42 / 45</p>
                    <p className="text-teal-400 text-xs mt-1">
                      Currently on route
                    </p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg col-span-2">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-slate-400 text-sm">
                        Live Collection Feed
                      </p>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
                        Live
                      </span>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-slate-700/50 rounded hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-teal-900/50 p-1.5 rounded text-teal-400">
                              <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">
                                Customer #882{i}
                              </p>
                              <p className="text-slate-400 text-xs">
                                Sector {i}, Kigali
                              </p>
                            </div>
                          </div>
                          <span className="text-emerald-400 text-xs font-mono">
                            -1 Credit
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce duration-[3000ms]">
              <div className="bg-orange-100 p-2 rounded-full">
                <WifiOff className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm">Offline Mode</p>
                <p className="text-slate-500 text-xs">
                  Data syncs automatically
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-700 transition-colors">
      <div className="text-teal-700 group-hover:text-white transition-colors">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Seamless Payments",
      description:
        "Integrates directly with MTN Mobile Money & Airtel. Customers pay easily, you get instant reconciliation.",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "NFC 'Tap to Collect'",
      description:
        "Collectors simply tap a customer's NFC card to verify pickup and deduct prepaid credits. Fast and fraud-proof.",
    },
    {
      icon: <WifiOff className="w-8 h-8" />,
      title: "Works Offline",
      description:
        "No internet? No problem. Our collector app stores data locally and syncs automatically when connectivity returns.",
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Route Optimization",
      description:
        "Assign service areas and visualize routes. Ensure every household is served and cut fuel costs.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Secure & Transparent",
      description:
        "Role-based access, audit logs, and secure authentication ensure your data and revenue are always safe.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-Time Analytics",
      description:
        "Monitor collection progress, revenue, and collector performance in real-time from a central dashboard.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-teal-700 font-semibold tracking-wide uppercase text-sm mb-3">
            Core Platform
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to run operations
          </h3>
          <p className="text-slate-600 text-lg">
            From the back-office admin panel to the collector in the field,
            we've covered every touchpoint.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Steps = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Simple for Customers,
              <br />
              Powerful for You.
            </h2>
            <p className="text-slate-600 text-lg mb-12">
              We've simplified the waste management cycle into three easy steps
              using technology everyone already understands.
            </p>

            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Top Up via Mobile Money
                  </h4>
                  <p className="text-slate-600">
                    Customers buy prepaid bundles (e.g., 8 collections) using
                    MTN or Airtel Money via USSD or Web.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Tap Card to Collect
                  </h4>
                  <p className="text-slate-600">
                    The collector arrives, taps the customer's NFC card. One
                    credit is deducted instantly. No cash changes hands.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Track & Manage
                  </h4>
                  <p className="text-slate-600">
                    Admins see the collection populate the dashboard instantly.
                    Missed collections are flagged automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-teal-50 rounded-full blur-[100px] opacity-60"></div>
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Digital Payment"
              className="relative rounded-2xl shadow-2xl z-10 border-4 border-white"
            />
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl z-20 max-w-xs border border-slate-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <CheckCircle2 className="text-emerald-600 w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    Transaction Verified
                  </p>
                  <p className="text-xs text-slate-500">10:42 AM • Kigali</p>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-20 bg-teal-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to modernize your operations?
        </h2>
        <p className="text-teal-100 text-lg mb-10 max-w-2xl mx-auto">
          Join the waste management companies that are saving 30% on operational
          costs and boosting revenue collection with IsukuPay.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-teal-900 hover:bg-teal-50 px-8 py-4 rounded-lg font-bold text-lg transition-colors">
            Get a Quote
          </button>
          <button className="bg-transparent border-2 border-teal-500 text-white hover:bg-teal-800 px-8 py-4 rounded-lg font-bold text-lg transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-teal-600 p-1.5 rounded">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Isuku<span className="text-teal-500">Pay</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-xs">
              The complete operating system for modern waste management
              companies in Rwanda and beyond.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Admin Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Collector App
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Customer Portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  USSD Integration
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} IsukuPay Systems. Built for Kigali.
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div className="font-sans text-slate-900 bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Steps />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
