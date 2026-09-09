import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Home, Compass, Layers, PhoneCall, ArrowLeft, ArrowRight } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-sand-50">
      <div className="max-w-2xl w-full bg-white border border-sand-200 rounded-[12px] p-8 sm:p-12 shadow-elevation-2 text-center space-y-8">
        <div className="space-y-4">
          <Badge variant="copper">404 ERROR — PAGE NOT FOUND</Badge>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold text-basalt-950 tracking-tight font-mono">
            404
          </h1>

          <h2 className="text-xl sm:text-2xl font-bold text-basalt-900">
            {isAr ? "الصفحة المطلوبة غير موجودة" : "Document or Resource Not Found"}
          </h2>

          <p className="text-sm sm:text-base text-basalt-600 max-w-lg mx-auto leading-relaxed">
            {isAr
              ? "عذراً، الرابط الذي تحاول الوصول إليه قد تم نقله، تغييره، أو لم يعد متاحاً على المنصة الرقمية لشركة الهضب."
              : "The page or engineering asset you requested cannot be located. It may have been updated, relocated, or archived."}
          </p>
        </div>

        {/* Suggested Portals */}
        <div className="border-t border-sand-200 pt-6 text-start">
          <h3 className="text-xs font-bold text-basalt-500 uppercase tracking-wider mb-4 px-1">
            {isAr ? "روابط سريعة للمنصة" : "Recommended Portals"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/capabilities"
              className="p-3.5 rounded-[6px] border border-sand-200 hover:border-copper-500/40 hover:bg-sand-50 transition-colors flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded bg-sand-100 flex items-center justify-center text-copper-600 shrink-0">
                <Compass className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-basalt-900 truncate">
                  {isAr ? "القدرات الهندسية" : "Capabilities"}
                </div>
                <div className="text-[11px] text-basalt-500 truncate">
                  {isAr ? "8 قطاعات تخصصية" : "8 Key Disciplines"}
                </div>
              </div>
            </Link>

            <Link
              to="/projects"
              className="p-3.5 rounded-[6px] border border-sand-200 hover:border-copper-500/40 hover:bg-sand-50 transition-colors flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded bg-sand-100 flex items-center justify-center text-copper-600 shrink-0">
                <Layers className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-basalt-900 truncate">
                  {isAr ? "سجل المشاريع" : "Projects Vault"}
                </div>
                <div className="text-[11px] text-basalt-500 truncate">
                  {isAr ? "أبرز إنجازاتنا الوطنية" : "National Portfolio"}
                </div>
              </div>
            </Link>

            <Link
              to="/contact"
              className="p-3.5 rounded-[6px] border border-sand-200 hover:border-copper-500/40 hover:bg-sand-50 transition-colors flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded bg-sand-100 flex items-center justify-center text-copper-600 shrink-0">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-basalt-900 truncate">
                  {isAr ? "المناقصات والتواصل" : "Tenders & RFPs"}
                </div>
                <div className="text-[11px] text-basalt-500 truncate">
                  {isAr ? "طلب دراسة أو عرض فني" : "Direct Inquiries"}
                </div>
              </div>
            </Link>

            <Link
              to="/"
              className="p-3.5 rounded-[6px] border border-sand-200 hover:border-copper-500/40 hover:bg-sand-50 transition-colors flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded bg-sand-100 flex items-center justify-center text-copper-600 shrink-0">
                <Home className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-basalt-900 truncate">
                  {isAr ? "الرئيسية" : "Home Portal"}
                </div>
                <div className="text-[11px] text-basalt-500 truncate">
                  {isAr ? "بوابة الشركة الرسمية" : "Main Gateway"}
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="md" iconEnd={<Arrow className="h-4 w-4" />}>
              {isAr ? "العودة إلى الصفحة الرئيسية" : "Return to Homepage"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
