import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCredentials, logout } from "../app/authSlice";
import { useLoginMutation, useGetInquiriesQuery } from "../services/apiSlice";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  Lock,
  Mail,
  LogOut,
  FileCheck,
  ShieldCheck,
  Users,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const { data: inquiries, isLoading: isLoadingInquiries } = useGetInquiriesQuery(undefined, {
    skip: !isAuthenticated
  });

  const [loginEmail, setLoginEmail] = useState("admin@alhadab.com.sa");
  const [loginPassword, setLoginPassword] = useState("Alhadab@2026!Secure");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await login({ email: loginEmail, password: loginPassword }).unwrap();
      dispatch(setCredentials(response));
    } catch (err: any) {
      setLoginError(err?.data?.error?.message || "Login failed. Please check credentials.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20 max-w-md mx-auto px-4">
        <div className="bg-white border border-sand-300 rounded-[8px] p-8 shadow-elevation-2 space-y-6 text-start">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-basalt-950 text-copper-500 flex items-center justify-center mx-auto">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-basalt-950">
              {isAr ? "بوابة الإدارة الداخلية والرقابة" : "Internal Administration Desk"}
            </h2>
            <p className="text-xs text-basalt-500">
              {isAr ? "تسجيل الدخول للمصرح لهم بمراجعة المناقصات والموردين" : "Authorized personnel access for tender & vendor management"}
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded bg-red-50 text-red-700 text-xs border border-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-basalt-800 mb-1">
                {isAr ? "البريد الإلكتروني *" : "Email Address *"}
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-basalt-800 mb-1">
                {isAr ? "كلمة المرور *" : "Password *"}
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoggingIn}
            >
              {isAr ? "دخول النظام" : "Sign In to Admin Workspace"}
            </Button>
          </form>

          <p className="text-[11px] text-basalt-400 text-center">
            {isAr ? "جلسة مشفرة متوافقة مع ضوابط الأمن السيبراني NCA" : "Encrypted session compliant with NCA ECC controls"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
      {/* Top Header */}
      <div className="bg-white border border-sand-200 rounded-[8px] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-basalt-950">
              {isAr ? "لوحة الإدارة والمتابعة المؤسسية" : "Administrative Governance Command Desk"}
            </h1>
            <Badge variant="copper">{user?.role || "SUPERADMIN"}</Badge>
          </div>
          <p className="text-xs text-basalt-500 mt-1">
            {isAr ? "المستخدم النشط:" : "Logged in as:"} <span className="font-semibold text-basalt-800">{user?.fullName}</span> ({user?.email})
          </p>
        </div>

        <Button
          variant="tectonic"
          size="sm"
          iconStart={<LogOut className="h-4 w-4" />}
          onClick={handleLogout}
        >
          {isAr ? "تسجيل الخروج" : "Sign Out"}
        </Button>
      </div>

      {/* Inquiries Triage Desk */}
      <div className="bg-white border border-sand-200 rounded-[8px] p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-sand-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-basalt-950">
              {isAr ? "طلبات المناقصات والاستفسارات الواردة" : "Incoming Tender Inquiries & RFPs"}
            </h2>
            <p className="text-xs text-basalt-500">
              {isAr ? "إدارة وتوزيع الطلبات على لجان التقدير والتسعير" : "Review, triage, and route incoming leads to chief estimators"}
            </p>
          </div>
          <Badge variant="slate">
            {isAr ? `الإجمالي: ${inquiries?.length || 0}` : `Total Inquiries: ${inquiries?.length || 0}`}
          </Badge>
        </div>

        {isLoadingInquiries ? (
          <p className="text-xs text-basalt-500 py-6 text-center">{isAr ? "جاري تحميل الطلبات..." : "Loading incoming submissions..."}</p>
        ) : inquiries && inquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-sand-100/70 border-b border-sand-200 text-basalt-700">
                <tr>
                  <th className="p-3 font-semibold">{isAr ? "رقم المتابعة" : "Tracking ID"}</th>
                  <th className="p-3 font-semibold">{isAr ? "الجهة / المنشأة" : "Organization"}</th>
                  <th className="p-3 font-semibold">{isAr ? "مقدم الطلب" : "Contact Person"}</th>
                  <th className="p-3 font-semibold">{isAr ? "نوع الطلب" : "Intent Type"}</th>
                  <th className="p-3 font-semibold">{isAr ? "الحالة" : "Status"}</th>
                  <th className="p-3 font-semibold">{isAr ? "التاريخ" : "Received Date"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {inquiries.map((inq: any) => (
                  <tr key={inq.id} className="hover:bg-sand-50/60">
                    <td className="p-3 font-mono font-bold text-copper-600">{inq.trackingId}</td>
                    <td className="p-3 font-semibold text-basalt-900">{inq.organization}</td>
                    <td className="p-3">
                      <p className="font-medium text-basalt-800">{inq.fullName}</p>
                      <p className="text-[11px] text-basalt-500">{inq.email} • {inq.phone}</p>
                    </td>
                    <td className="p-3 font-mono text-basalt-700">{inq.intentType}</td>
                    <td className="p-3">
                      <Badge variant="warning">{inq.workflowStatus}</Badge>
                    </td>
                    <td className="p-3 text-basalt-500 font-mono">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-basalt-500 bg-sand-50 rounded">
            {isAr ? "لا توجد طلبات جديدة واردة حالياً." : "No pending inquiries in the queue."}
          </div>
        )}
      </div>
    </div>
  );
};
