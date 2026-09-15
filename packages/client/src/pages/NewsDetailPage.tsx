import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useGetNewsBySlugQuery, useGetNewsListQuery } from "../services/apiSlice";
import type { NewsArticleEntity } from "@alhadab/shared";
import {
  Button,
  Badge,
  ScrollReveal,
  SEOHead,
  PageLoader
} from "../components/ui";
import {
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  Share2,
  Check,
  Building2,
  ChevronRight,
  ChevronLeft,
  Newspaper,
  ExternalLink,
  Sparkles,
  FileCheck
} from "lucide-react";

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  const [copied, setCopied] = useState(false);

  const { data: articleData, isLoading, error } = useGetNewsBySlugQuery(slug || "");
  const { data: recentNewsData } = useGetNewsListQuery({ limit: 4 });

  // Direct API data — no static fallback
  const article: NewsArticleEntity | undefined = articleData;

  const relatedArticles: NewsArticleEntity[] = (
    recentNewsData?.data ?? []
  ).filter((a) => a.slug !== slug).slice(0, 3);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (isLoading) {
    return <PageLoader variant="shimmer-article" />;
  }

  if (!article) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center space-y-6">
        <Newspaper className="h-12 w-12 mx-auto text-sand-400" />
        <h2 className="text-2xl font-bold text-basalt-950">
          {isAr ? "الخبر غير موجود أو تم نقله" : "Article Not Found"}
        </h2>
        <p className="text-xs text-basalt-500">
          {isAr
            ? "لم نتمكن من العثور على الخبر المطلوب، ربما تم تغيير الرابط أو حذفه."
            : "The news article you are looking for might have been removed or relocated."}
        </p>
        <Button variant="primary" size="md" onClick={() => navigate("/news")}>
          {isAr ? "العودة للمركز الإعلامي" : "Back to Media Center"}
        </Button>
      </div>
    );
  }

  const title = isAr ? article.titleAr : article.titleEn;
  const summary = isAr ? article.summaryAr : article.summaryEn;
  const content = isAr ? article.contentAr : article.contentEn;

  return (
    <div className="space-y-12 pb-24 text-start">
      <SEOHead
        titleAr={article.seoTitleAr || article.titleAr}
        titleEn={article.seoTitleEn || article.titleEn}
        descriptionAr={article.seoDescAr || article.summaryAr}
        descriptionEn={article.seoDescEn || article.summaryEn}
        canonicalPath={`/news/${article.slug}`}
      />

      {/* 1. Breadcrumbs Bar */}
      <div className="bg-sand-100/60 border-b border-sand-200 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-basalt-500 font-medium">
            <Link to="/" className="hover:text-copper-600 transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <Link to="/news" className="hover:text-copper-600 transition-colors">
              {isAr ? "المركز الإعلامي" : "News & Media"}
            </Link>
            <span>/</span>
            <span className="text-basalt-900 font-bold truncate max-w-xs sm:max-w-md">
              {title}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Article Header & Meta */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal direction="up">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="copper">
                {article.category.replace("_", " ")}
              </Badge>
              {article.isFeatured && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  {isAr ? "خبر بارز" : "Featured"}
                </span>
              )}
              <span className="text-xs text-basalt-500 flex items-center gap-1 font-mono">
                <Calendar className="h-3.5 w-3.5 text-copper-500" />
                {formatDate(article.publishedAt)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-basalt-950 tracking-tight leading-tight">
              {title}
            </h1>

            {/* Sub-headline / Opposite language title */}
            <div className="text-sm font-semibold text-copper-600 border-s-2 border-copper-500 ps-3">
              {isAr ? article.titleEn : article.titleAr}
            </div>

            {/* Author & Share strip */}
            <div className="flex items-center justify-between pt-4 border-t border-sand-200">
              <div className="flex items-center gap-2 text-xs text-basalt-600 font-medium">
                <div className="h-7 w-7 rounded-full bg-basalt-900 text-copper-400 flex items-center justify-center font-bold text-[10px]">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span>{article.author}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="tectonic"
                  size="sm"
                  onClick={handleCopyLink}
                  iconStart={copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Share2 className="h-3.5 w-3.5" />}
                >
                  {copied ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "مشاركة الرابط" : "Share")}
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 3. Hero Image */}
        {article.featuredImageUrl && (
          <ScrollReveal direction="up" delay={0.1}>
            <div className="rounded-[10px] bg-basalt-950 overflow-hidden shadow-elevation-3 border border-sand-300 max-h-[460px]">
              <img
                src={article.featuredImageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        )}

        {/* 4. Article Summary Box */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="p-6 rounded-[8px] bg-sand-100/70 border border-sand-300 text-basalt-900 font-semibold text-sm sm:text-base leading-relaxed">
            {summary}
          </div>
        </ScrollReveal>

        {/* 5. Article Full Content */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="prose prose-sand max-w-none text-basalt-800 text-sm sm:text-base leading-relaxed space-y-4">
            {content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollReveal>

        {/* 6. Return Button */}
        <div className="pt-8 border-t border-sand-200">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-bold text-copper-600 hover:text-copper-700 transition-colors"
          >
            <BackArrow className="h-4 w-4" />
            <span>{isAr ? "العودة لكافة الأخبار والبيانات" : "Back to All News & Releases"}</span>
          </Link>
        </div>
      </article>

      {/* 7. Related News Section */}
      {relatedArticles.length > 0 && (
        <section className="bg-sand-100/60 border-t border-sand-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-basalt-950">
                  {isAr ? "أخبار وبيانات أخرى ذات صلة" : "Related Corporate Updates"}
                </h3>
                <p className="text-xs text-basalt-500 mt-0.5">
                  {isAr ? "أحدث الإصدارات الإعلامية الصادرة عن شركة الهضب" : "Recent media releases from AL-HADAB"}
                </p>
              </div>

              <Link
                to="/news"
                className="text-xs font-bold text-copper-600 hover:text-copper-700 flex items-center gap-1"
              >
                <span>{isAr ? "عرض الكل" : "View All"}</span>
                <Arrow className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <article
                  key={rel.id}
                  className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm hover:border-copper-500/50 hover:shadow-elevation-2 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] text-basalt-400 font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-copper-500" />
                      {formatDate(rel.publishedAt)}
                    </span>
                    <h4 className="text-sm font-bold text-basalt-950 line-clamp-2 leading-snug">
                      <Link to={`/news/${rel.slug}`} className="hover:text-copper-600 transition-colors">
                        {isAr ? rel.titleAr : rel.titleEn}
                      </Link>
                    </h4>
                    <p className="text-xs text-basalt-600 line-clamp-2">
                      {isAr ? rel.summaryAr : rel.summaryEn}
                    </p>
                  </div>

                  <Link
                    to={`/news/${rel.slug}`}
                    className="text-xs font-bold text-copper-600 flex items-center gap-1 pt-2 border-t border-sand-100"
                  >
                    <span>{isAr ? "اقرأ المزيد" : "Read More"}</span>
                    <Arrow className="h-3 w-3" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
