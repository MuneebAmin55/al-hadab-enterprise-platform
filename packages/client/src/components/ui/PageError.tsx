import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { useAppSelector } from "../../app/hooks";

export interface PageErrorProps {
  titleAr?: string;
  titleEn?: string;
  messageAr?: string;
  messageEn?: string;
  onRetry?: () => void;
  className?: string;
}

export const PageError: React.FC<PageErrorProps> = ({
  titleAr = "تعذر تحميل البيانات",
  titleEn = "Unable to Load Content",
  messageAr = "حدث خطأ أثناء محاولة جلب المعلومات من الخادم. يرجى التحقق من اتصالك والمحاولة مجدداً.",
  messageEn = "An error occurred while fetching information from our servers. Please verify your connection and try again.",
  onRetry,
  className = ""
}) => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";

  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[10px] bg-white border border-red-100 shadow-elevation-1 ${className}`}>
      <div className="h-14 w-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4">
        <AlertCircle className="h-7 w-7" />
      </div>

      <h3 className="text-xl font-bold text-basalt-950 mb-2">
        {isAr ? titleAr : titleEn}
      </h3>

      <p className="text-sm text-basalt-600 max-w-md mb-6 leading-relaxed">
        {isAr ? messageAr : messageEn}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          iconStart={<RefreshCw className="h-4 w-4" />}
        >
          {isAr ? "إعادة المحاولة" : "Retry Request"}
        </Button>
      )}
    </div>
  );
};
