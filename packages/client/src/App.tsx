import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { MainLayout } from "./layouts/MainLayout";

import { ErrorBoundary } from "./components/ErrorBoundary";

// Route-level code splitting — each page chunk is only loaded when navigated to
const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const CapabilitiesPage = lazy(() => import("./pages/CapabilitiesPage").then((m) => ({ default: m.CapabilitiesPage })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage").then((m) => ({ default: m.ProjectDetailPage })));
const SuppliersPage = lazy(() => import("./pages/SuppliersPage").then((m) => ({ default: m.SuppliersPage })));
const CareersPage = lazy(() => import("./pages/CareersPage").then((m) => ({ default: m.CareersPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

/**
 * PageFallback — Structural skeleton shown during lazy-loaded route transitions.
 * Matches the visual geometry of the target page to prevent layout shift.
 */
const PageFallback: React.FC = () => (
  <div className="min-h-[60vh] max-w-7xl mx-auto px-4 py-16 space-y-6">
    {/* Shimmer skeleton blocks */}
    <div className="h-8 w-1/3 rounded bg-sand-200 animate-pulse" />
    <div className="h-5 w-2/3 rounded bg-sand-200 animate-pulse" />
    <div className="grid grid-cols-3 gap-4 mt-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-48 rounded-[8px] bg-sand-200 animate-pulse" />
      ))}
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <Suspense fallback={<PageFallback />}><HomePage /></Suspense> },
      { path: "about", element: <Suspense fallback={<PageFallback />}><AboutPage /></Suspense> },
      { path: "capabilities", element: <Suspense fallback={<PageFallback />}><CapabilitiesPage /></Suspense> },
      { path: "projects", element: <Suspense fallback={<PageFallback />}><ProjectsPage /></Suspense> },
      { path: "projects/:slug", element: <Suspense fallback={<PageFallback />}><ProjectDetailPage /></Suspense> },
      { path: "suppliers", element: <Suspense fallback={<PageFallback />}><SuppliersPage /></Suspense> },
      { path: "careers", element: <Suspense fallback={<PageFallback />}><CareersPage /></Suspense> },
      { path: "contact", element: <Suspense fallback={<PageFallback />}><ContactPage /></Suspense> },
      { path: "admin", element: <Suspense fallback={<PageFallback />}><AdminDashboardPage /></Suspense> },
      { path: "*", element: <Suspense fallback={<PageFallback />}><NotFoundPage /></Suspense> }
    ]
  }
]);

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};
