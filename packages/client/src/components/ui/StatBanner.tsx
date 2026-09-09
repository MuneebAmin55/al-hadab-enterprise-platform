import React from "react";
import { ShieldCheck, HardHat, Truck, Award, CheckCircle2 } from "lucide-react";

export interface StatBannerProps {
  isAr: boolean;
  className?: string;
}

export const StatBanner: React.FC<StatBannerProps> = ({ isAr, className = "" }) => {
  const stats = [
    {
      value: "48+",
      labelAr: "عاماً من التميز الهندسي المتواصل",
      labelEn: "Years of Engineering Excellence",
      subAr: "منذ عام 1396هـ (1976م)",
      subEn: "Since 1396 AH / 1976 G",
      icon: Award
    },
    {
      value: "1,250+",
      labelAr: "كادر هندسي وفني ميداني",
      labelEn: "Skilled Technical Workforce",
      subAr: "كفاءات وطنية وعالمية متخصصة",
      subEn: "Multidisciplinary Engineers & Specialists",
      icon: HardHat
    },
    {
      value: "280+",
      labelAr: "معدة ثقيلة وشاحنة مملوكة",
      labelEn: "Owned Heavy Equipment Fleet",
      subAr: "جاهزية فورية لأكبر المشاريع",
      subEn: "Immediate Mega-Project Deployment",
      icon: Truck
    },
    {
      value: "14.5M+",
      labelAr: "ساعة عمل آمنة دون حوادث",
      labelEn: "Safe Work Hours Logged",
      subAr: "أعلى معايير السلامة المهنية HSE",
      subEn: "Zero-Incident Safety Standard",
      icon: ShieldCheck
    },
    {
      value: "165+",
      labelAr: "مشروع وطني وبنية تحتية منجز",
      labelEn: "Completed National Projects",
      subAr: "في شتى مناطق المملكة",
      subEn: "Across All Saudi Regions",
      icon: CheckCircle2
    }
  ];

  return (
    <div
      className={`bg-basalt-950 text-white border-y border-basalt-800 py-12 px-4 sm:px-6 lg:px-8 shadow-elevation-2 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x lg:rtl:divide-x-reverse divide-basalt-800">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center pt-6 lg:pt-0 px-3 first:pt-0">
                <div className="h-10 w-10 rounded-full bg-basalt-900 border border-basalt-800 flex items-center justify-center text-copper-400 mb-3 shadow-inner">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-copper-400">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-sand-100 mt-1.5 leading-snug">
                  {isAr ? stat.labelAr : stat.labelEn}
                </div>
                <div className="text-[11px] text-sand-400 mt-1">
                  {isAr ? stat.subAr : stat.subEn}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
