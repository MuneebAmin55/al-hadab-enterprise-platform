import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary caught an unhandled error]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-xl w-full bg-white border border-sand-200 rounded-[12px] p-8 sm:p-10 shadow-elevation-2 text-center space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-basalt-950">
                حدث خطأ غير متوقع / Unexpected Application Error
              </h2>
              <p className="text-sm text-basalt-600 leading-relaxed">
                نعتذر عن هذا الخلل المؤقت. يرجى إعادة تحميل الصفحة أو العودة للصفحة الرئيسية لمتابعة التصفح.
              </p>
              <p className="text-xs text-basalt-500 leading-relaxed">
                We apologize for this inconvenience. Please refresh or return to the homepage.
              </p>
            </div>

            {process.env.NODE_ENV !== "production" && this.state.error && (
              <div className="p-4 bg-sand-100 rounded-[6px] border border-sand-200 text-start font-mono text-xs text-red-800 overflow-x-auto max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[6px] bg-copper-500 hover:bg-copper-600 text-white font-medium text-sm transition-colors shadow-sm focus-ring"
              >
                <RefreshCw className="h-4 w-4" />
                <span>إعادة المحاولة / Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[6px] bg-sand-100 hover:bg-sand-200 text-basalt-900 font-medium text-sm transition-colors border border-sand-300 focus-ring"
              >
                <Home className="h-4 w-4" />
                <span>الصفحة الرئيسية / Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
