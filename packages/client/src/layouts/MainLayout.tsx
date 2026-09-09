import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleLanguage, setPrequalModalOpen } from "../app/uiSlice";
import { PrequalModal } from "../components/prequal/PrequalModal";
import { Button } from "../components/ui/Button";
import { SkipNavLink } from "../components/ui/SkipNavLink";
import {
  Building2,
  Phone,
  Globe,
  FileCheck,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Award,
  Layers,
  Users,
  Briefcase
} from "lucide-react";

export const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { language, prequalModalOpen } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navLinks = [
    { to: "/", labelAr: "الرئيسية", labelEn: "Home" },
    { to: "/about", labelAr: "من نحن", labelEn: "About Us" },
    { to: "/capabilities", labelAr: "قدراتنا الهندسية", labelEn: "Capabilities" },
    { to: "/projects", labelAr: "مشاريعنا", labelEn: "Projects Vault" },
    { to: "/suppliers", labelAr: "الموردون والمقاولون", labelEn: "Subcontractors" },
    { to: "/careers", labelAr: "التوظيف والكفاءات", labelEn: "Careers" },
    { to: "/contact", labelAr: "تواصل معنا والمناقصات", labelEn: "Contact & RFPs" }
  ];

  const handleOpenPrequal = () => {
    dispatch(setPrequalModalOpen(true));
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 text-basalt-950">
      <SkipNavLink />
      {/* 1. Global Minimalist Utility Strip */}
      <div className="bg-basalt-950 text-sand-200 text-xs border-b border-basalt-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium text-copper-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>
                {isAr
                  ? "شركة سعودية مصنفة بالدرجة الأولى | خبرة تمتد منذ 1396هـ (1976م)"
                  : "Saudi Class 1 General Contractor | Building National Infrastructure Since 1976"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="tel:+966112498383"
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-copper-400" />
              <span className="font-mono">+966 11 249 8383</span>
            </a>

            <button
              onClick={() => dispatch(toggleLanguage())}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-basalt-800 hover:border-basalt-700 hover:text-white transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-copper-400" />
              <span className="font-semibold">{isAr ? "English" : "العربية"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Bar */}
      <header className="sticky top-0 z-40 bg-sand-50/95 backdrop-blur-md border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3.5 focus-ring rounded-[6px]">
            <div className="h-11 w-11 rounded-[8px] bg-basalt-950 border border-basalt-800 flex items-center justify-center text-copper-500 shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-lg sm:text-xl font-bold tracking-tight text-basalt-950 leading-none">
                {isAr ? "شركة الهضب" : "AL-HADAB"}
              </span>
              <span className="block text-xs font-semibold text-copper-600 mt-1">
                {isAr ? "للتجارة والمقاولات (تأسست 1396هـ)" : "Trading & Contracting Co. (Est. 1976)"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 text-sm font-medium rounded-[6px] transition-colors focus-ring ${
                    isActive
                      ? "text-copper-600 font-semibold bg-sand-100"
                      : "text-basalt-800 hover:text-basalt-950 hover:bg-sand-100/60"
                  }`}
                >
                  {isAr ? link.labelAr : link.labelEn}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              iconStart={<FileCheck className="h-4 w-4" />}
              onClick={handleOpenPrequal}
            >
              {isAr ? "التأهيل المسبق الفوري" : "Pre-Qualification Vault"}
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 text-basalt-800 hover:text-basalt-950 hover:bg-sand-200/50 rounded-[6px] focus-ring"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileNavOpen && (
          <div className="lg:hidden border-b border-sand-300 bg-white px-5 py-4 space-y-1 shadow-elevation-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={`block px-3 py-2.5 rounded-[6px] text-sm font-medium ${
                    isActive
                      ? "bg-copper-50 text-copper-600 font-bold"
                      : "text-basalt-800 hover:bg-sand-100"
                  }`}
                >
                  {isAr ? link.labelAr : link.labelEn}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-sand-200">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                iconStart={<FileCheck className="h-4 w-4" />}
                onClick={() => {
                  setMobileNavOpen(false);
                  handleOpenPrequal();
                }}
              >
                {isAr ? "التأهيل المسبق الفوري" : "Pre-Qualification Vault"}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* 3. Main Dynamic Content Outlet */}
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>

      {/* 4. Global Pre-qualification Modal */}
      <PrequalModal
        isOpen={prequalModalOpen}
        onClose={() => dispatch(setPrequalModalOpen(false))}
      />

      {/* 5. Institutional Directory Footer */}
      <footer className="bg-basalt-950 text-sand-200 border-t border-basalt-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Col 1: Corporate Pedigree */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-basalt-900 border border-basalt-800 flex items-center justify-center text-copper-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white leading-none">
                    {isAr ? "شركة الهضب للتجارة والمقاولات" : "AL-HADAB Trading & Contracting Co."}
                  </h4>
                  <p className="text-xs text-copper-400 mt-1 font-mono">
                    {isAr ? "تأسست عام 1396هـ (1976م)" : "Established 1396 AH / 1976 G"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-sand-400 leading-relaxed max-w-md">
                {isAr
                  ? "شركة وطنية كبرى بخبرة تقارب خمسة عقود في تشييد البنى التحتية، شبكات المياه والسيول، الطرق والجسور، ومشاريع الطاقة المتجددة للمملكة ضمن مستهدفات رؤية 2030."
                  : "A distinguished national enterprise with five decades of excellence in master civil infrastructure, hydraulic drainage, arterial highways, and municipal works aligned with Saudi Vision 2030."}
              </p>
              <div className="text-xs text-sand-300 space-y-1 font-mono">
                <p>{isAr ? "السجل التجاري:" : "Commercial Registration:"} 1010028491</p>
                <p>{isAr ? "الرقم الضريبي:" : "VAT Identification:"} 300189421500003</p>
                <p>{isAr ? "المقر الرئيسي:" : "Headquarters:"} الرياض - حي غرناطة - شارع الديار</p>
              </div>
            </div>

            {/* Col 2: Engineering Verticals */}
            <div>
              <h5 className="text-sm font-bold text-white mb-3">
                {isAr ? "القدرات الهندسية" : "Capabilities"}
              </h5>
              <ul className="text-xs text-sand-400 space-y-2">
                <li>
                  <Link to="/capabilities" className="hover:text-copper-400 transition-colors">
                    {isAr ? "شبكات المياه والصرف الصحي" : "Water & Wastewater Networks"}
                  </Link>
                </li>
                <li>
                  <Link to="/capabilities" className="hover:text-copper-400 transition-colors">
                    {isAr ? "تصريف السيول ومياه الأمطار" : "Stormwater & Flood Mitigation"}
                  </Link>
                </li>
                <li>
                  <Link to="/capabilities" className="hover:text-copper-400 transition-colors">
                    {isAr ? "الطرق والجسور والأنفاق" : "Roads, Bridges & Interchanges"}
                  </Link>
                </li>
                <li>
                  <Link to="/capabilities" className="hover:text-copper-400 transition-colors">
                    {isAr ? "الأعمال الكهربائية والطاقة" : "Electrical & Renewable Energy"}
                  </Link>
                </li>
                <li>
                  <Link to="/capabilities" className="hover:text-copper-400 transition-colors">
                    {isAr ? "تشجير المدن وشبكات الري" : "Public Parks & Smart Irrigation"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Stakeholder Gateways */}
            <div>
              <h5 className="text-sm font-bold text-white mb-3">
                {isAr ? "بوابات التعامل" : "Stakeholder Portals"}
              </h5>
              <ul className="text-xs text-sand-400 space-y-2">
                <li>
                  <button onClick={handleOpenPrequal} className="hover:text-copper-400 transition-colors text-start">
                    {isAr ? "التأهيل المسبق الفوري" : "Fast-Track Prequalification"}
                  </button>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-copper-400 transition-colors">
                    {isAr ? "تقديم مناقصة أو RFP" : "Submit Tender / RFP"}
                  </Link>
                </li>
                <li>
                  <Link to="/suppliers" className="hover:text-copper-400 transition-colors">
                    {isAr ? "بوابة تسجيل الموردين" : "Vendor & Subcontractor Hub"}
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-copper-400 transition-colors">
                    {isAr ? "بوابة الكفاءات والمهندسين" : "Engineering Careers"}
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-copper-400 transition-colors">
                    {isAr ? "بوابة الإدارة الداخلية" : "Internal Admin Portal"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Quality & Compliance */}
            <div>
              <h5 className="text-sm font-bold text-white mb-3">
                {isAr ? "الجودة والاعتمادات" : "Accreditations"}
              </h5>
              <div className="space-y-3 text-xs text-sand-400">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-copper-400 shrink-0" />
                  <span>ISO 9001:2015 (الجودة)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-copper-400 shrink-0" />
                  <span>ISO 14001:2015 (البيئة)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-copper-400 shrink-0" />
                  <span>ISO 45001:2018 (السلامة)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? "معتمد على منصة اعتماد وبلدي" : "Etimad & Balady Verified"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal Copyright Bar */}
          <div className="border-t border-basalt-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sand-500 gap-4">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              {isAr
                ? "شركة الهضب للتجارة والمقاولات. جميع الحقوق محفوظة."
                : "AL-HADAB Trading & Contracting Co. All rights reserved."}
            </p>
            <p className="font-mono">
              {isAr
                ? "منصة المؤسسة الرقمية 2026-2036 | الرياض، المملكة العربية السعودية"
                : "Enterprise Digital Platform 2026-2036 | Riyadh, Saudi Arabia"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
