import React, { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";

export interface SEOHeadProps {
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  canonicalPath?: string;
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  titleAr,
  titleEn,
  descriptionAr = "شركة الهضب للتجارة والمقاولات — مقاول سعودي مصنف بالدرجة الأولى منذ عام 1396هـ (1976م) متخصص في البنية التحتية، شبكات المياه، تصريف السيول، والطرق.",
  descriptionEn = "AL-HADAB Trading & Contracting Co. — Saudi Class 1 General Contractor established 1976 specializing in mega civil infrastructure, water networks, flood mitigation, and highways.",
  canonicalPath = "",
  ogImage = "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1200&auto=format&fit=crop",
  jsonLd
}) => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";

  const title = isAr
    ? `${titleAr} | شركة الهضب للتجارة والمقاولات`
    : `${titleEn} | AL-HADAB Contracting Co.`;

  const description = isAr ? descriptionAr : descriptionEn;
  const baseUrl = window.location.origin;
  const currentUrl = `${baseUrl}${canonicalPath || window.location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (attribute: "name" | "property", value: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Standard Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag(
      "name",
      "keywords",
      isAr
        ? "شركة الهضب, مقاولات عامة, تصنيف الدرجة الأولى, بنية تحتية السعودية, شبكات المياه, درء أخطار السيول, سفلتة الطرق, الرياض, رؤية 2030"
        : "AL-HADAB, Saudi Class 1 Contractor, General Contracting, Civil Infrastructure, Water Networks, Flood Mitigation, Road Construction, Riyadh, Vision 2030"
    );

    // 3. Open Graph
    setMetaTag("property", "og:site_name", isAr ? "شركة الهضب للتجارة والمقاولات" : "AL-HADAB Contracting Co.");
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:locale", isAr ? "ar_SA" : "en_US");

    // 4. Twitter Cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);

    // 5. Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currentUrl);

    // 6. JSON-LD structured data
    let scriptTag = document.getElementById("alhadab-jsonld") as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "alhadab-jsonld";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, currentUrl, ogImage, isAr, jsonLd]);

  return null;
};
