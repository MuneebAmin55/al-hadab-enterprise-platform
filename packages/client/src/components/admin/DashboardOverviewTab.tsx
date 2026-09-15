import React from "react";
import { useGetAdminOverviewStatsQuery } from "../../services/apiSlice";
import { AdminTab } from "./AdminSidebar";
import { Badge, Button } from "../ui";
import {
  FolderKanban,
  Layers,
  Handshake,
  Users,
  Newspaper,
  Briefcase,
  UserCheck,
  FileCheck,
  Truck,
  Plus,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  ShieldCheck,
  Activity,
  AlertCircle,
  RefreshCw,
  Eye,
  CheckCircle2,
  TrendingUp,
  Inbox
} from "lucide-react";

interface DashboardOverviewTabProps {
  onNavigateTab: (tab: AdminTab, action?: string) => void;
  isAr: boolean;
  user: {
    fullName: string;
    role: string;
  } | null;
}

export const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({
  onNavigateTab,
  isAr,
  user
}) => {
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useGetAdminOverviewStatsQuery();

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const todayFormatted = new Intl.DateTimeFormat(isAr ? "ar-SA" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-[12px] bg-sand-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 rounded-[10px] bg-sand-200 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-[10px] bg-sand-200 animate-pulse" />
          <div className="h-64 rounded-[10px] bg-sand-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-8 text-center bg-white border border-sand-200 rounded-[12px] space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-basalt-900">
          {isAr ? "تعذر تحميل إحصائيات لوحة التحكم" : "Unable to Load Dashboard Statistics"}
        </h3>
        <p className="text-xs text-basalt-500 max-w-md mx-auto">
          {isAr
            ? "يرجى التحقق من اتصال الشبكة أو محاولة إعادة التحديث لاحقاً."
            : "Please verify network connectivity or retry loading database metrics."}
        </p>
        <Button
          variant="primary"
          size="sm"
          iconStart={<RefreshCw className="h-3.5 w-3.5" />}
          onClick={() => refetch()}
        >
          {isAr ? "إعادة المحاولة" : "Retry Loading"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-start">
      {/* 1. Executive Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-basalt-950 via-basalt-900 to-basalt-950 text-white rounded-[14px] p-6 sm:p-8 border border-sand-800 shadow-elevation-2">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-copper-500/20 text-copper-300 border border-copper-500/30">
                {isAr ? "نظام إدارة المحتوى المؤسسي" : "Enterprise Governance Portal"}
              </span>
              <span className="text-xs text-sand-400 font-mono">
                {todayFormatted}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-sand-50">
              {isAr
                ? `مرحباً بك، ${user?.fullName || "المشرف التنفيذي"}`
                : `Welcome back, ${user?.fullName || "Executive Administrator"}`}
            </h1>
            <p className="text-xs text-sand-300 max-w-2xl leading-relaxed">
              {isAr
                ? "متابعة شاملة لجميع العمليات الميدانية، المناقصات الواردة، محفظة المشاريع، والكفاءات البشرية لشركة الهضب للتجارة والمقاولات."
                : "Real-time institutional oversight of active civil operations, tender submissions, corporate portfolio, and specialized human capital."}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2.5 rounded-lg bg-sand-800/80 hover:bg-sand-700 text-sand-200 hover:text-white border border-sand-700 transition-all text-xs flex items-center gap-2"
              title={isAr ? "تحديث المؤشرات" : "Refresh Metrics"}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-copper-400" : ""}`} />
              <span className="hidden sm:inline font-medium">{isAr ? "تحديث" : "Refresh"}</span>
            </button>
            <div className="bg-sand-900/90 border border-sand-800 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span className="font-mono text-emerald-400 font-semibold">
                {isAr ? "النظام متصل ونشط" : "Core API Synced"}
              </span>
            </div>
          </div>
        </div>

        {/* Subtle Decorative Gradient Orb */}
        <div className="absolute -end-16 -bottom-16 w-64 h-64 bg-copper-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Quick Action Launchpad */}
      <div className="bg-white border border-sand-200 rounded-[12px] p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-basalt-500 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-copper-500" />
            <span>{isAr ? "إجراءات سريعة ومباشرة" : "Quick Action Launchpad"}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => onNavigateTab("PROJECTS", "CREATE")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-sand-50 hover:bg-copper-50 border border-sand-200 hover:border-copper-300 text-basalt-800 hover:text-copper-700 transition-all text-xs font-semibold group"
          >
            <Plus className="h-3.5 w-3.5 text-copper-600 group-hover:scale-110 transition-transform" />
            <span>{isAr ? "إضافة مشروع" : "Add Project"}</span>
          </button>

          <button
            onClick={() => onNavigateTab("CAREERS", "CREATE")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-sand-50 hover:bg-copper-50 border border-sand-200 hover:border-copper-300 text-basalt-800 hover:text-copper-700 transition-all text-xs font-semibold group"
          >
            <Plus className="h-3.5 w-3.5 text-copper-600 group-hover:scale-110 transition-transform" />
            <span>{isAr ? "طرح وظيفة" : "Post Vacancy"}</span>
          </button>

          <button
            onClick={() => onNavigateTab("NEWS", "CREATE")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-sand-50 hover:bg-copper-50 border border-sand-200 hover:border-copper-300 text-basalt-800 hover:text-copper-700 transition-all text-xs font-semibold group"
          >
            <Plus className="h-3.5 w-3.5 text-copper-600 group-hover:scale-110 transition-transform" />
            <span>{isAr ? "نشر خبر صحفي" : "Publish News"}</span>
          </button>

          <button
            onClick={() => onNavigateTab("INQUIRIES")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-sand-50 hover:bg-copper-50 border border-sand-200 hover:border-copper-300 text-basalt-800 hover:text-copper-700 transition-all text-xs font-semibold group"
          >
            <Inbox className="h-3.5 w-3.5 text-copper-600 group-hover:scale-110 transition-transform" />
            <span>{isAr ? "معالجة المناقصات" : "Review Inquiries"}</span>
          </button>

          <button
            onClick={() => onNavigateTab("CLIENTS", "CREATE")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-sand-50 hover:bg-copper-50 border border-sand-200 hover:border-copper-300 text-basalt-800 hover:text-copper-700 transition-all text-xs font-semibold group"
          >
            <Plus className="h-3.5 w-3.5 text-copper-600 group-hover:scale-110 transition-transform" />
            <span>{isAr ? "إدراج شريك" : "Add Client"}</span>
          </button>

          <button
            onClick={() => onNavigateTab("COMPANY")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-sand-50 hover:bg-copper-50 border border-sand-200 hover:border-copper-300 text-basalt-800 hover:text-copper-700 transition-all text-xs font-semibold group"
          >
            <ArrowIcon className="h-3.5 w-3.5 text-copper-600 group-hover:scale-110 transition-transform" />
            <span>{isAr ? "تحديث الهوية" : "Edit Profile"}</span>
          </button>
        </div>
      </div>

      {/* 3. Database-Backed KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Metric 1: Projects */}
        <div
          onClick={() => onNavigateTab("PROJECTS")}
          className="bg-white border border-sand-200 hover:border-copper-400 rounded-[12px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-copper-50 text-copper-600 flex items-center justify-center group-hover:bg-copper-600 group-hover:text-white transition-colors">
              <FolderKanban className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sand-100 text-basalt-600 group-hover:bg-copper-100 group-hover:text-copper-800 transition-colors">
              {stats.projects.published} {isAr ? "منشور" : "live"}
            </span>
          </div>
          <div>
            <p className="text-xs text-basalt-500 font-medium">
              {isAr ? "سجل ومشاريع الشركة" : "Projects Portfolio"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-basalt-950">
                {stats.projects.total}
              </span>
              <span className="text-[11px] text-basalt-400">
                {isAr ? `(منها ${stats.projects.featured} رئيسي)` : `(${stats.projects.featured} flagship)`}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Services / Capabilities */}
        <div
          onClick={() => onNavigateTab("CAPABILITIES")}
          className="bg-white border border-sand-200 hover:border-copper-400 rounded-[12px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sand-100 text-basalt-600">
              {isAr ? "قطاعات هندسية" : "Verticals"}
            </span>
          </div>
          <div>
            <p className="text-xs text-basalt-500 font-medium">
              {isAr ? "الخدمات والقدرات التنفيذية" : "Services & Capabilities"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-basalt-950">
                {stats.capabilities.total}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">
                {stats.capabilities.active} {isAr ? "نشط" : "active"}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Clients & Strategic Partners */}
        <div
          onClick={() => onNavigateTab("CLIENTS")}
          className="bg-white border border-sand-200 hover:border-copper-400 rounded-[12px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Handshake className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sand-100 text-basalt-600">
              {stats.clients.featured} {isAr ? "مميز" : "featured"}
            </span>
          </div>
          <div>
            <p className="text-xs text-basalt-500 font-medium">
              {isAr ? "العملاء والجهات الحكومية" : "Strategic Clients"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-basalt-950">
                {stats.clients.total}
              </span>
              <span className="text-[11px] text-basalt-400">
                {isAr ? "جهات وطنية معتمدة" : "Verified Partners"}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Workforce */}
        <div
          onClick={() => onNavigateTab("WORKFORCE")}
          className="bg-white border border-sand-200 hover:border-copper-400 rounded-[12px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sand-100 text-basalt-600">
              {stats.workforce.totalCategories} {isAr ? "تخصص" : "trades"}
            </span>
          </div>
          <div>
            <p className="text-xs text-basalt-500 font-medium">
              {isAr ? "الكوادر البشرية والمهندسين" : "Workforce Headcount"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-basalt-950">
                {stats.workforce.totalEmployees.toLocaleString()}
              </span>
              <span className="text-[11px] text-copper-600 font-medium">
                {isAr ? "كادر متخصص" : "specialists"}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 5: Tenders & Inquiries */}
        <div
          onClick={() => onNavigateTab("INQUIRIES")}
          className="bg-white border border-sand-200 hover:border-copper-400 rounded-[12px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileCheck className="h-5 w-5" />
            </div>
            {stats.inquiries.unread > 0 ? (
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-white animate-pulse">
                {stats.inquiries.unread} {isAr ? "غير مقروء" : "unread"}
              </span>
            ) : (
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sand-100 text-basalt-600">
                {stats.inquiries.inProgress} {isAr ? "قيد المتابعة" : "in progress"}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-basalt-500 font-medium">
              {isAr ? "طلبات المناقصات والاستفسارات" : "Tenders & Inquiries"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-basalt-950">
                {stats.inquiries.total}
              </span>
              <span className="text-[11px] text-purple-600 font-medium">
                {stats.inquiries.new} {isAr ? "جديد" : "new"}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 6: News Articles */}
        <div
          onClick={() => onNavigateTab("NEWS")}
          className="bg-white border border-sand-200 hover:border-copper-400 rounded-[12px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Newspaper className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sand-100 text-basalt-600">
              {stats.news.published} {isAr ? "منشور" : "published"}
            </span>
          </div>
          <div>
            <p className="text-xs text-basalt-500 font-medium">
              {isAr ? "المركز الإعلامي والبيانات" : "News & Press Releases"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-basalt-950">
                {stats.news.total}
              </span>
              <span className="text-[11px] text-basalt-400">
                {stats.news.drafts} {isAr ? "مسودات" : "drafts"}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 7: Job Openings */}
        <div
          onClick={() => onNavigateTab("CAREERS")}
          className="bg-white border border-sand-200 hover:border-copper-400 rounded-[12px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sand-100 text-basalt-600">
              {stats.jobOpenings.published} {isAr ? "شاغر نشط" : "open"}
            </span>
          </div>
          <div>
            <p className="text-xs text-basalt-500 font-medium">
              {isAr ? "الوظائف الهندسية المطروحة" : "Engineering Vacancies"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-basalt-950">
                {stats.jobOpenings.total}
              </span>
              <span className="text-[11px] text-orange-600 font-medium">
                {stats.jobOpenings.published > 0 ? (isAr ? "استقبال الطلبات متاح" : "Accepting CVs") : (isAr ? "لا توجد شواغر" : "No open roles")}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 8: Job Applications */}
        <div
          onClick={() => onNavigateTab("APPLICATIONS")}
          className="bg-white border border-sand-200 hover:border-copper-400 rounded-[12px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <UserCheck className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sand-100 text-basalt-600">
              {stats.jobApplications.interview} {isAr ? "مقابلات" : "interviews"}
            </span>
          </div>
          <div>
            <p className="text-xs text-basalt-500 font-medium">
              {isAr ? "طلبات التوظيف المستلمة" : "Candidate Applications"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-basalt-950">
                {stats.jobApplications.total}
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">
                {stats.jobApplications.new} {isAr ? "طلب جديد" : "new"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Live Activity Feeds (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Tenders & Inquiries */}
        <div className="bg-white border border-sand-200 rounded-[12px] p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-copper-600" />
                <h3 className="text-sm font-bold text-basalt-900">
                  {isAr ? "أحدث طلبات المناقصات والاستفسارات" : "Recent Tenders & Inquiries"}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab("INQUIRIES")}
                className="text-xs font-semibold text-copper-600 hover:text-copper-700 flex items-center gap-1"
              >
                <span>{isAr ? "عرض الكل" : "View All"}</span>
                <ArrowIcon className="h-3 w-3" />
              </button>
            </div>

            {stats.recentInquiries.length === 0 ? (
              <div className="py-8 text-center text-basalt-400 text-xs">
                {isAr ? "لا توجد طلبات مناقصات مسجلة حديثاً" : "No recent inquiries recorded yet"}
              </div>
            ) : (
              <div className="divide-y divide-sand-100">
                {stats.recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => onNavigateTab("INQUIRIES")}
                    className="py-3 px-2 rounded-lg hover:bg-sand-50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-copper-700">
                          {inq.trackingCode}
                        </span>
                        <span className="text-xs font-bold text-basalt-900 truncate">
                          {inq.organizationName || inq.contactPerson}
                        </span>
                      </div>
                      <p className="text-[11px] text-basalt-500 truncate">
                        {inq.contactPerson} • {inq.intentType}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={inq.workflowStatus === "NEW" ? "copper" : "basalt"}>
                        {inq.workflowStatus}
                      </Badge>
                      <span className="text-[10px] text-basalt-400 font-mono">
                        {new Date(inq.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
                          month: "numeric",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-sand-100">
            <Button
              variant="tectonic"
              size="sm"
              className="w-full justify-center text-xs"
              onClick={() => onNavigateTab("INQUIRIES")}
              iconEnd={<ArrowIcon className="h-3.5 w-3.5" />}
            >
              {isAr ? "الانتقال إلى منصة المناقصات" : "Open Tenders Desk"}
            </Button>
          </div>
        </div>

        {/* Right Column: Recent Candidate Applications */}
        <div className="bg-white border border-sand-200 rounded-[12px] p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-basalt-900">
                  {isAr ? "أحدث طلبات التوظيف والسير الذاتية" : "Recent Candidate Applications"}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab("APPLICATIONS")}
                className="text-xs font-semibold text-copper-600 hover:text-copper-700 flex items-center gap-1"
              >
                <span>{isAr ? "عرض الكل" : "View All"}</span>
                <ArrowIcon className="h-3 w-3" />
              </button>
            </div>

            {stats.recentApplications.length === 0 ? (
              <div className="py-8 text-center text-basalt-400 text-xs">
                {isAr ? "لا توجد طلبات توظيف مسجلة حديثاً" : "No recent job applications recorded yet"}
              </div>
            ) : (
              <div className="divide-y divide-sand-100">
                {stats.recentApplications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onNavigateTab("APPLICATIONS")}
                    className="py-3 px-2 rounded-lg hover:bg-sand-50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-bold text-basalt-900 truncate">
                        {app.applicantName}
                      </p>
                      <p className="text-[11px] text-copper-700 truncate font-medium">
                        {isAr ? app.jobTitleAr : app.jobTitleEn}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] px-2 py-0.5 rounded font-mono font-semibold bg-sand-100 text-basalt-700">
                        {app.status}
                      </span>
                      <span className="text-[10px] text-basalt-400 font-mono">
                        {new Date(app.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
                          month: "numeric",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-sand-100">
            <Button
              variant="tectonic"
              size="sm"
              className="w-full justify-center text-xs"
              onClick={() => onNavigateTab("APPLICATIONS")}
              iconEnd={<ArrowIcon className="h-3.5 w-3.5" />}
            >
              {isAr ? "الانتقال إلى بوابة الموارد البشرية" : "Open Recruitment Pipeline"}
            </Button>
          </div>
        </div>
      </div>

      {/* 5. Institutional Accreditation & Regulatory Compliance Banner */}
      <div className="bg-sand-100/60 border border-sand-200 rounded-[12px] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-basalt-900">
              {isAr ? "شركة الهضب للمقاولات — التصنيف المعتمد والامتثال الحكومي" : "AL-HADAB Contracting — Certified Classification & Compliance"}
            </p>
            <p className="text-basalt-500 text-[11px]">
              {isAr
                ? "سجل تجاري: 1010183832 • تصنيف درجة أولى (بلدية) • مسجلة على منصة اعتماد الوطنية • متوافقة مع ضوابط الأمن السيبراني NCA"
                : "CR: 1010183832 • Grade 1 Municipal Contractor • Etimad Registered • NCA ECC Cybersecurity Compliant"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="success">
            {isAr ? "نطاق بلاتيني (توطين)" : "Platinum Saudization"}
          </Badge>
          <Badge variant="basalt">
            ISO 9001 / 45001 / 14001
          </Badge>
        </div>
      </div>
    </div>
  );
};
