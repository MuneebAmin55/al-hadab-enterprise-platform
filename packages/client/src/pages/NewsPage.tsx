import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useGetNewsListQuery } from "../services/apiSlice";
import type { NewsArticleEntity } from "@alhadab/shared";
import {
  Button,
  Badge,
  ScrollReveal,
  SEOHead,
  SectionHeader,
  PageLoader,
  PageError
} from "../components/ui";
import {
  Newspaper,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  Search,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
  Building2,
  FileCheck
} from "lucide-react";

export const NewsPage: React.FC = () => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  const {
    data: newsResponse,
    isLoading,
    isError,
    refetch
  } = useGetNewsListQuery({
    category: selectedCategory,
    search: searchQuery,
    page: currentPage,
    limit: pageSize
  });

  const articles: NewsArticleEntity[] = newsResponse?.data ?? [];
  const totalPages = newsResponse?.meta?.totalPages || 1;

  const categories = [
    { key: "ALL", labelAr: "كافة الأخبار", labelEn: "All Updates" },
    { key: "PROJECT_MILESTONE", labelAr: "إنجازات المشاريع", labelEn: "Project Milestones" },
    { key: "PRESS_RELEASE", labelAr: "بيانات صحفية", labelEn: "Press Releases" },
    { key: "PARTNERSHIP", labelAr: "اتفاقيات وشراكات", labelEn: "Partnerships" },
    { key: "AWARDS", labelAr: "جوائز واعتمادات", labelEn: "Awards & HSE" },
    { key: "CORPORATE", labelAr: "أخبار الشركة", labelEn: "Corporate News" }
  ];

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "PROJECT_MILESTONE":
        return <Badge variant="copper">{isAr ? "إنجاز مشروع" : "Milestone"}</Badge>;
      case "PRESS_RELEASE":
        return <Badge variant="basalt">{isAr ? "بيان صحفي" : "Press Release"}</Badge>;
      case "AWARDS":
        return <Badge variant="success">{isAr ? "اعتماد / سلامة" : "Award / HSE"}</Badge>;
      case "PARTNERSHIP":
        return <Badge variant="warning">{isAr ? "شراكة استراتيجية" : "Partnership"}</Badge>;
      default:
        return <Badge variant="slate">{isAr ? "أخبار عامة" : "Corporate"}</Badge>;
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(isAr ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return isoStr;
    }
  };

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];

  return (
    <div className="space-y-16 pb-20">
      <SEOHead
        titleAr="المركز الإعلامي والأخبار"
        titleEn="Media Center & Corporate News"
        descriptionAr="آخر المستجدات والإنجازات الهندسية وتوقيع العقود والمشاريع الاستراتيجية لشركة الهضب للتجارة والمقاولات."
        descriptionEn="Latest corporate announcements, megaproject milestones, awards, and industry partnerships from AL-HADAB."
        canonicalPath="/news"
      />

      {/* 1. Institutional Hero Header */}
      <section className="bg-gradient-to-b from-basalt-950 via-basalt-900 to-basalt-950 text-white py-16 sm:py-24 border-b border-basalt-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="max-w-3xl space-y-4 text-start">
              <Badge variant="copper">
                {isAr ? "المركز الإعلامي والأنباء" : "Institutional Media Center"}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {isAr
                  ? "أحدث المستجدات والإنجازات الهندسية"
                  : "Engineering Milestones & Corporate Announcements"}
              </h1>
              <p className="text-sm sm:text-base text-sand-300 leading-relaxed">
                {isAr
                  ? "تابع تغطية مشاريع البنية التحتية الوطنية، وتوقيع العقود الاستراتيجية، وتقارير السلامة المهنية ومستجدات أسطول شركة الهضب."
                  : "Explore real-time coverage of our sovereign infrastructure packages, partnership signings, HSE achievements, and equipment fleet expansions."}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 2. Featured Headline Spotlight Card */}
        {featuredArticle && (
          <ScrollReveal direction="up">
            <div className="rounded-[10px] bg-white border border-sand-300 shadow-elevation-3 overflow-hidden hover:border-copper-500/50 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 relative min-h-[260px] lg:min-h-[380px] bg-basalt-900 overflow-hidden">
                  <img
                    src={
                      featuredArticle.featuredImageUrl ||
                      "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={isAr ? featuredArticle.titleAr : featuredArticle.titleEn}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 start-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-copper-500 text-white shadow-sm flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      {isAr ? "الخبر الأبرز" : "Featured Headline"}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-start space-y-6 bg-gradient-to-br from-white to-sand-50/50">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {getCategoryBadge(featuredArticle.category)}
                      <span className="text-xs text-basalt-500 flex items-center gap-1 font-mono">
                        <Calendar className="h-3.5 w-3.5 text-copper-500" />
                        {formatDate(featuredArticle.publishedAt)}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-basalt-950 leading-snug hover:text-copper-600 transition-colors">
                      <Link to={`/news/${featuredArticle.slug}`}>
                        {isAr ? featuredArticle.titleAr : featuredArticle.titleEn}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-basalt-600 line-clamp-4 leading-relaxed">
                      {isAr ? featuredArticle.summaryAr : featuredArticle.summaryEn}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
                    <span className="text-xs text-basalt-500 flex items-center gap-1.5 font-medium">
                      <User className="h-3.5 w-3.5 text-basalt-400" />
                      {featuredArticle.author}
                    </span>

                    <Link
                      to={`/news/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-copper-600 hover:text-copper-700 transition-colors group"
                    >
                      <span>{isAr ? "قراءة الخبر كاملاً" : "Read Full Story"}</span>
                      <Arrow className="h-4 w-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 3. Category Filter & Search Bar */}
        <div className="bg-white border border-sand-200 rounded-[8px] p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-copper-500 text-white shadow-sm"
                        : "bg-sand-100 text-basalt-700 hover:bg-sand-200"
                    }`}
                  >
                    {isAr ? cat.labelAr : cat.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-basalt-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={isAr ? "البحث في الأخبار والبيانات..." : "Search news & releases..."}
                className="w-full h-9 ps-9 pe-3 text-xs border border-sand-300 rounded-[6px] bg-sand-50/50 focus-ring"
              />
            </div>
          </div>
        </div>

        {/* 4. News Grid */}
        {isLoading ? (
          <PageLoader variant="shimmer-list" count={6} />
        ) : isError ? (
          <PageError onRetry={() => refetch()} />
        ) : articles.length === 0 ? (
          <div className="bg-white border border-sand-200 rounded-[8px] p-16 text-center text-basalt-500 space-y-3">
            <Newspaper className="h-10 w-10 mx-auto text-sand-400" />
            <h3 className="text-base font-bold text-basalt-900">
              {isAr ? "لم يتم العثور على أخبار مطابقة" : "No matching articles found"}
            </h3>
            <p className="text-xs text-basalt-500 max-w-sm mx-auto">
              {isAr
                ? "يرجى تجربة كلمات بحث أخرى أو تغيير تصنيف الأخبار."
                : "Try searching with different keywords or choosing another category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {articles.map((article, idx) => (
              <ScrollReveal key={article.id} direction="up" delay={0.05 * (idx + 1)}>
                <article className="group flex flex-col h-full bg-white border border-sand-200 rounded-[8px] overflow-hidden hover:border-copper-500/50 hover:shadow-elevation-3 transition-all duration-300 text-start">
                  {/* Card Image */}
                  <Link to={`/news/${article.slug}`} className="relative h-48 bg-basalt-900 overflow-hidden block">
                    <img
                      src={
                        article.featuredImageUrl ||
                        "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={isAr ? article.titleAr : article.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 start-3">
                      {getCategoryBadge(article.category)}
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-basalt-500 font-mono">
                        <Calendar className="h-3 w-3 text-copper-500" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>

                      <h3 className="text-base font-bold text-basalt-950 group-hover:text-copper-600 transition-colors line-clamp-2 leading-snug">
                        <Link to={`/news/${article.slug}`}>
                          {isAr ? article.titleAr : article.titleEn}
                        </Link>
                      </h3>

                      <p className="text-xs text-basalt-600 line-clamp-3 leading-relaxed">
                        {isAr ? article.summaryAr : article.summaryEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-basalt-400 line-clamp-1">{article.author}</span>
                      <Link
                        to={`/news/${article.slug}`}
                        className="font-bold text-copper-600 hover:text-copper-700 flex items-center gap-1 group/btn"
                      >
                        <span>{isAr ? "التفاصيل" : "Read"}</span>
                        <Arrow className="h-3.5 w-3.5 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* 5. Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <Button
              variant="tectonic"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              iconStart={isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            >
              {isAr ? "السابق" : "Previous"}
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded text-xs font-semibold font-mono transition-colors ${
                    currentPage === i + 1
                      ? "bg-copper-500 text-white font-bold"
                      : "bg-sand-100 text-basalt-700 hover:bg-sand-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="tectonic"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              iconEnd={isAr ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            >
              {isAr ? "التالي" : "Next"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
