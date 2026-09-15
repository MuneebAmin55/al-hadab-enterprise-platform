import React from "react";
import { Link } from "react-router-dom";
import { AdminRole } from "@alhadab/shared";
import { Badge } from "../ui";
import {
  LayoutDashboard,
  Building2,
  Users,
  FolderKanban,
  Layers,
  Handshake,
  Truck,
  Newspaper,
  Briefcase,
  UserCheck,
  FileCheck,
  ShieldCheck,
  Globe,
  LogOut,
  X,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Languages
} from "lucide-react";

export type AdminTab =
  | "OVERVIEW"
  | "COMPANY"
  | "WORKFORCE"
  | "PROJECTS"
  | "CAPABILITIES"
  | "CLIENTS"
  | "VENDORS"
  | "NEWS"
  | "CAREERS"
  | "APPLICATIONS"
  | "INQUIRIES"
  | "USERS";

interface NavItem {
  id: AdminTab;
  labelAr: string;
  labelEn: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeColor?: string;
  allowedRoles?: AdminRole[];
}

interface NavGroup {
  groupTitleAr: string;
  groupTitleEn: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  user: {
    fullName: string;
    email: string;
    role: string;
  } | null;
  counts?: {
    inquiries?: number;
    unreadInquiries?: number;
    projects?: number;
    capabilities?: number;
    clients?: number;
    workforce?: number;
    vendors?: number;
    news?: number;
    jobs?: number;
    applications?: number;
    users?: number;
  };
  isAr: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onToggleLanguage: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  user,
  counts,
  isAr,
  isOpenMobile,
  onCloseMobile,
  onToggleLanguage,
  onLogout
}) => {
  const userRole = (user?.role || "EDITOR") as AdminRole;

  const navGroups: NavGroup[] = [
    {
      groupTitleAr: "نظرة عامة",
      groupTitleEn: "Main Command",
      items: [
        {
          id: "OVERVIEW",
          labelAr: "لوحة التحكم والمؤشرات",
          labelEn: "Dashboard Overview",
          icon: <LayoutDashboard className="h-4 w-4" />
        }
      ]
    },
    {
      groupTitleAr: "الهوية المؤسسية",
      groupTitleEn: "Corporate Identity",
      items: [
        {
          id: "COMPANY",
          labelAr: "ملف وبيانات الشركة",
          labelEn: "Company Profile",
          icon: <Building2 className="h-4 w-4" />,
          allowedRoles: ["SUPERADMIN", "EDITOR", "AUDITOR"]
        },
        {
          id: "WORKFORCE",
          labelAr: "القوى العاملة والكوادر",
          labelEn: "Workforce & Labor",
          icon: <Users className="h-4 w-4" />,
          badge: counts?.workforce ? counts.workforce.toLocaleString() : undefined,
          allowedRoles: ["SUPERADMIN", "EDITOR", "AUDITOR"]
        }
      ]
    },
    {
      groupTitleAr: "العمليات والمشاريع",
      groupTitleEn: "Operations & Portfolio",
      items: [
        {
          id: "PROJECTS",
          labelAr: "المشاريع وسجل الأعمال",
          labelEn: "Projects Portfolio",
          icon: <FolderKanban className="h-4 w-4" />,
          badge: counts?.projects,
          allowedRoles: ["SUPERADMIN", "EDITOR", "AUDITOR"]
        },
        {
          id: "CAPABILITIES",
          labelAr: "القطاعات والخدمات",
          labelEn: "Services & Verticals",
          icon: <Layers className="h-4 w-4" />,
          badge: counts?.capabilities,
          allowedRoles: ["SUPERADMIN", "EDITOR", "AUDITOR"]
        },
        {
          id: "CLIENTS",
          labelAr: "العملاء والشركاء",
          labelEn: "Clients & Partners",
          icon: <Handshake className="h-4 w-4" />,
          badge: counts?.clients,
          allowedRoles: ["SUPERADMIN", "EDITOR", "AUDITOR"]
        },
        {
          id: "VENDORS",
          labelAr: "الموردون ومقاولو الباطن",
          labelEn: "Subcontractors & Vendors",
          icon: <Truck className="h-4 w-4" />,
          badge: counts?.vendors,
          allowedRoles: ["SUPERADMIN", "EDITOR", "ESTIMATOR"]
        }
      ]
    },
    {
      groupTitleAr: "الكفاءات والمركز الإعلامي",
      groupTitleEn: "Talent & Media Hub",
      items: [
        {
          id: "NEWS",
          labelAr: "المركز الإعلامي والأخبار",
          labelEn: "News & Media Center",
          icon: <Newspaper className="h-4 w-4" />,
          badge: counts?.news,
          allowedRoles: ["SUPERADMIN", "EDITOR", "AUDITOR"]
        },
        {
          id: "CAREERS",
          labelAr: "الوظائف والفرص الهندسية",
          labelEn: "Careers & Vacancies",
          icon: <Briefcase className="h-4 w-4" />,
          badge: counts?.jobs,
          allowedRoles: ["SUPERADMIN", "EDITOR", "AUDITOR"]
        },
        {
          id: "APPLICATIONS",
          labelAr: "طلبات التوظيف والسير",
          labelEn: "Job Applications",
          icon: <UserCheck className="h-4 w-4" />,
          badge: counts?.applications,
          badgeColor: counts?.applications && counts.applications > 0 ? "bg-copper-600 text-white" : undefined,
          allowedRoles: ["SUPERADMIN", "EDITOR", "AUDITOR"]
        }
      ]
    },
    {
      groupTitleAr: "التواصل والمناقصات",
      groupTitleEn: "Tenders & Leads",
      items: [
        {
          id: "INQUIRIES",
          labelAr: "المناقصات والاستفسارات",
          labelEn: "Tenders & Inquiries",
          icon: <FileCheck className="h-4 w-4" />,
          badge: (counts?.unreadInquiries ?? 0) > 0 ? `${counts?.unreadInquiries} ${isAr ? "جديد" : "new"}` : counts?.inquiries,
          badgeColor: (counts?.unreadInquiries ?? 0) > 0 ? "bg-amber-500 text-white font-bold animate-pulse" : undefined,
          allowedRoles: ["SUPERADMIN", "EDITOR", "ESTIMATOR", "AUDITOR"]
        }
      ]
    },
    {
      groupTitleAr: "إدارة النظام والحوكمة",
      groupTitleEn: "System Administration",
      items: [
        {
          id: "USERS",
          labelAr: "المستخدمون والصلاحيات",
          labelEn: "Admin Users & Roles",
          icon: <ShieldCheck className="h-4 w-4" />,
          badge: counts?.users,
          allowedRoles: ["SUPERADMIN"]
        }
      ]
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return <Badge variant="copper">{isAr ? "مدير تنفيذي أعلى" : "Superadmin"}</Badge>;
      case "EDITOR":
        return <Badge variant="basalt">{isAr ? "محرر محتوى" : "Editor"}</Badge>;
      case "ESTIMATOR":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">{isAr ? "مقدر مناقصات" : "Estimator"}</span>;
      case "AUDITOR":
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">{isAr ? "مدقق امتثال" : "Auditor"}</span>;
      default:
        return <Badge variant="copper">{role}</Badge>;
    }
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-white border-e border-sand-200 shadow-sm text-start select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-sand-200 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-copper-600 text-white flex items-center justify-center font-black text-sm shadow-md">
            H
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-basalt-950 block">
              {isAr ? "شركة الهضب للتجارة والمقاولات" : "AL-HADAB ENTERPRISE"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-basalt-500">
                CMS v2.6 • KSA Sovereign
              </span>
            </div>
          </div>
        </Link>
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-md text-basalt-400 hover:text-basalt-700 hover:bg-sand-100 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User Identity Dossier */}
      <div className="px-4 py-3.5 bg-sand-50/70 border-b border-sand-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-copper-100 text-copper-700 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-copper-200">
            {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-basalt-900 truncate">
              {user?.fullName || "Administrative Operator"}
            </p>
            <p className="text-[10px] text-basalt-500 truncate font-mono mt-0.5">
              {user?.email || "admin@alhadab.com.sa"}
            </p>
            <div className="mt-1.5">
              {getRoleBadge(userRole)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
        {navGroups.map((group, gIdx) => {
          // Filter items based on user role
          const visibleItems = group.items.filter(
            (item) => !item.allowedRoles || item.allowedRoles.includes(userRole)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-basalt-400">
                {isAr ? group.groupTitleAr : group.groupTitleEn}
              </p>
              <div className="space-y-0.5 mt-1">
                {visibleItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        if (isOpenMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                        isActive
                          ? "bg-copper-50 text-copper-700 border border-copper-200 shadow-sm"
                          : "text-basalt-600 hover:text-basalt-950 hover:bg-sand-100 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`transition-colors ${
                            isActive ? "text-copper-600" : "text-basalt-400 group-hover:text-basalt-700"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">
                          {isAr ? item.labelAr : item.labelEn}
                        </span>
                      </div>

                      {item.badge !== undefined && item.badge !== null && item.badge !== "" && (
                        <span
                          className={`ms-2 px-1.5 py-0.5 text-[10px] font-mono rounded-full flex-shrink-0 ${
                            item.badgeColor
                              ? item.badgeColor
                              : isActive
                              ? "bg-copper-200/80 text-copper-900"
                              : "bg-sand-200 text-basalt-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-sand-200 bg-sand-50/50 space-y-1.5">
        {/* Quick View Public Website */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-basalt-600 hover:text-copper-600 hover:bg-white rounded-md transition-colors"
        >
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-basalt-400" />
            <span>{isAr ? "زيارة البوابة العامة" : "View Public Portal"}</span>
          </div>
          <ExternalLink className="h-3 w-3 text-basalt-400" />
        </Link>

        {/* Language Switcher */}
        <button
          onClick={onToggleLanguage}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-basalt-600 hover:text-copper-600 hover:bg-white rounded-md transition-colors"
        >
          <div className="flex items-center gap-2">
            <Languages className="h-3.5 w-3.5 text-basalt-400" />
            <span>{isAr ? "اللغة (English)" : "Language (العربية)"}</span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-copper-600">
            {isAr ? "EN" : "عربي"}
          </span>
        </button>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-colors text-start"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{isAr ? "تسجيل الخروج الآمن" : "Sign Out Session"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (width 64 = 256px) */}
      <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30">
        {renderNavContent()}
      </aside>

      {/* Mobile Off-Canvas Drawer Backdrop & Container */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-basalt-950/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer panel */}
          <div
            className={`relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slide-in-${
              isAr ? "right" : "left"
            }`}
          >
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
};
