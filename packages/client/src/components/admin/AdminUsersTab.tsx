import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminUserEntity,
  AdminRole,
  CreateAdminUserSchema,
  CreateAdminUserInput,
  UpdateAdminUserSchema,
  UpdateAdminUserInput
} from "@alhadab/shared";
import {
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation
} from "../../services/apiSlice";
import { Button, Badge, ModalDialog } from "../ui";
import {
  ShieldCheck,
  UserPlus,
  Search,
  RotateCcw,
  Edit3,
  Trash2,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Key,
  ShieldAlert,
  Clock,
  Check,
  X
} from "lucide-react";

interface AdminUsersTabProps {
  isAr: boolean;
  currentUserId?: string;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({ isAr, currentUserId }) => {
  const { data: users = [], isLoading, isError, refetch } = useGetAdminUsersQuery();

  const [createUser, { isLoading: isCreating }] = useCreateAdminUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation();

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Notifications
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserEntity | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: AdminUserEntity | null }>({
    isOpen: false,
    user: null
  });

  // Create Form
  const {
    register: regCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors }
  } = useForm<CreateAdminUserInput>({
    resolver: zodResolver(CreateAdminUserSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      role: "EDITOR",
      isActive: true
    }
  });

  // Edit Form
  const {
    register: regEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors }
  } = useForm<UpdateAdminUserInput>({
    resolver: zodResolver(UpdateAdminUserSchema)
  });

  const showMsg = (type: "success" | "error", text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 5000);
  };

  const openCreateModal = () => {
    resetCreate({
      email: "",
      fullName: "",
      password: "",
      role: "EDITOR",
      isActive: true
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (user: AdminUserEntity) => {
    resetEdit({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: ""
    });
    setEditingUser(user);
  };

  const onCreateUser = async (data: CreateAdminUserInput) => {
    setActionMsg(null);
    try {
      await createUser(data).unwrap();
      showMsg("success", isAr ? "تم إنشاء الحساب الإداري بنجاح." : "Admin user created successfully.");
      setIsCreateModalOpen(false);
    } catch (err: any) {
      showMsg("error", err?.data?.error?.message || (isAr ? "فشل إنشاء الحساب." : "Failed to create user."));
    }
  };

  const onUpdateUser = async (data: UpdateAdminUserInput) => {
    if (!editingUser) return;
    setActionMsg(null);
    try {
      await updateUser({ id: editingUser.id, ...data }).unwrap();
      showMsg("success", isAr ? "تم تحديث بيانات وصلاحيات المستخدم بنجاح." : "User updated successfully.");
      setEditingUser(null);
    } catch (err: any) {
      showMsg("error", err?.data?.error?.message || (isAr ? "فشل تحديث المستخدم." : "Failed to update user."));
    }
  };

  const onDeleteConfirm = async () => {
    if (!deleteModal.user) return;
    setActionMsg(null);
    try {
      await deleteUser(deleteModal.user.id).unwrap();
      showMsg("success", isAr ? "تم حذف الحساب بنجاح." : "User deleted successfully.");
      setDeleteModal({ isOpen: false, user: null });
    } catch (err: any) {
      showMsg("error", err?.data?.error?.message || (isAr ? "فشل حذف الحساب." : "Failed to delete user."));
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && u.isActive) ||
      (statusFilter === "INACTIVE" && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case "SUPERADMIN":
        return <Badge variant="copper">{isAr ? "مدير تنفيذي أعلى" : "Superadmin"}</Badge>;
      case "EDITOR":
        return <Badge variant="basalt">{isAr ? "محرر محتوى" : "Content Editor"}</Badge>;
      case "ESTIMATOR":
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-100 text-amber-800">{isAr ? "مقدر مناقصات" : "Estimator"}</span>;
      case "AUDITOR":
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-100 text-emerald-800">{isAr ? "مدقق امتثال" : "Auditor"}</span>;
      default:
        return <Badge variant="copper">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-start">
      {/* Alert Banner */}
      {actionMsg && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-xs font-semibold animate-fade-in ${
            actionMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {actionMsg.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Header Toolbar */}
      <div className="bg-white border border-sand-200 rounded-[12px] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-basalt-950">
              {isAr ? "إدارة المستخدمين والصلاحيات المؤسسية" : "Admin Users & Role-Based Access Control"}
            </h2>
            <Badge variant="copper">{users.length} {isAr ? "مستخدم" : "users"}</Badge>
          </div>
          <p className="text-xs text-basalt-500 mt-1">
            {isAr
              ? "التحكم في حسابات مسؤولي النظام، توزيع الصلاحيات، وضبط السياسات الأمنية وفق لوائح NCA."
              : "Governance of staff accounts, RBAC role assignments, and cybersecurity compliance policies."}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          iconStart={<UserPlus className="h-4 w-4" />}
          onClick={openCreateModal}
        >
          {isAr ? "إضافة مستخدم جديد" : "Add Admin User"}
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-sand-200 rounded-[10px] p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-basalt-400" />
            <input
              type="text"
              placeholder={isAr ? "بحث بالاسم أو البريد الإلكتروني..." : "Search by name or email address..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 ps-8 pe-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs focus-ring"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs font-semibold focus-ring"
          >
            <option value="ALL">{isAr ? "جميع الصلاحيات" : "All Roles"}</option>
            <option value="SUPERADMIN">{isAr ? "مدير تنفيذي أعلى (Superadmin)" : "Superadmin"}</option>
            <option value="EDITOR">{isAr ? "محرر محتوى (Editor)" : "Editor"}</option>
            <option value="ESTIMATOR">{isAr ? "مقدر مناقصات (Estimator)" : "Estimator"}</option>
            <option value="AUDITOR">{isAr ? "مدقق امتثال (Auditor)" : "Auditor"}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs font-semibold focus-ring"
          >
            <option value="ALL">{isAr ? "جميع الحالات" : "All Statuses"}</option>
            <option value="ACTIVE">{isAr ? "حساب نشط" : "Active Only"}</option>
            <option value="INACTIVE">{isAr ? "حساب معطل" : "Inactive Only"}</option>
          </select>

          {/* Reset */}
          <Button
            variant="tectonic"
            size="sm"
            iconStart={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={() => {
              setSearch("");
              setRoleFilter("ALL");
              setStatusFilter("ALL");
            }}
          >
            {isAr ? "إعادة ضبط" : "Reset"}
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-sand-200 rounded-[12px] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-sand-100 rounded animate-pulse" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-basalt-400 space-y-2">
            <ShieldAlert className="h-8 w-8 mx-auto text-sand-400" />
            <p className="text-xs">{isAr ? "لم يتم العثور على أي مستخدم مطابق" : "No admin users matched your filter criteria"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-sand-100/70 border-b border-sand-200 text-basalt-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">{isAr ? "المستخدم" : "User"}</th>
                  <th className="px-5 py-3.5">{isAr ? "البريد الإلكتروني" : "Email Address"}</th>
                  <th className="px-5 py-3.5">{isAr ? "الصلاحية" : "Role"}</th>
                  <th className="px-5 py-3.5">{isAr ? "الحالة" : "Status"}</th>
                  <th className="px-5 py-3.5">{isAr ? "آخر دخول" : "Last Login"}</th>
                  <th className="px-5 py-3.5">{isAr ? "تاريخ الإنشاء" : "Created At"}</th>
                  <th className="px-5 py-3.5 text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentUserId;

                  return (
                    <tr key={u.id} className="hover:bg-sand-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-copper-100 text-copper-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {u.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-basalt-900">{u.fullName}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 text-[9px] rounded font-mono font-bold bg-copper-100 text-copper-800">
                                  {isAr ? "حسابك الحالي" : "You"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 font-mono text-basalt-600">
                        {u.email}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        {getRoleBadge(u.role)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              u.isActive ? "bg-emerald-500" : "bg-basalt-300"
                            }`}
                          />
                          <span
                            className={`font-semibold ${
                              u.isActive ? "text-emerald-700" : "text-basalt-400"
                            }`}
                          >
                            {u.isActive ? (isAr ? "نشط" : "Active") : (isAr ? "معطل" : "Inactive")}
                          </span>
                        </div>
                      </td>

                      {/* Last Login */}
                      <td className="px-5 py-4 text-basalt-500 font-mono text-[11px]">
                        {u.lastLoginAt
                          ? new Date(u.lastLoginAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : isAr
                          ? "لم يسجل بعد"
                          : "Never"}
                      </td>

                      {/* Created At */}
                      <td className="px-5 py-4 text-basalt-500 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 text-basalt-500 hover:text-copper-600 hover:bg-copper-50 rounded-md transition-colors"
                            title={isAr ? "تعديل الصلاحيات والحساب" : "Edit User"}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            disabled={isSelf}
                            onClick={() => setDeleteModal({ isOpen: true, user: u })}
                            className={`p-1.5 rounded-md transition-colors ${
                              isSelf
                                ? "text-basalt-300 cursor-not-allowed opacity-40"
                                : "text-basalt-400 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                            title={isSelf ? (isAr ? "لا يمكنك حذف حسابك الحالي" : "Cannot delete your own account") : (isAr ? "حذف الحساب" : "Delete User")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <ModalDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={isAr ? "إضافة حساب مسؤول جديد" : "Create New Admin User"}
      >
        <form onSubmit={handleCreateSubmit(onCreateUser)} className="space-y-4 text-start">
          <div>
            <label className="block text-xs font-semibold text-basalt-700 mb-1">
              {isAr ? "الاسم الكامل" : "Full Name"} *
            </label>
            <input
              type="text"
              {...regCreate("fullName")}
              placeholder={isAr ? "م. فهد السبيعي" : "Eng. Fahad Al-Subaie"}
              className="w-full h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs focus-ring"
            />
            {createErrors.fullName && (
              <p className="text-rose-600 text-[11px] mt-1">{createErrors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-basalt-700 mb-1">
              {isAr ? "البريد الإلكتروني المؤسسي" : "Official Email Address"} *
            </label>
            <input
              type="email"
              {...regCreate("email")}
              placeholder="user@alhadab.com.sa"
              className="w-full h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs font-mono focus-ring"
            />
            {createErrors.email && (
              <p className="text-rose-600 text-[11px] mt-1">{createErrors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-basalt-700 mb-1">
              {isAr ? "الصلاحية الممنوحة" : "Access Role"} *
            </label>
            <select
              {...regCreate("role")}
              className="w-full h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs font-semibold focus-ring"
            >
              <option value="EDITOR">{isAr ? "محرر محتوى (EDITOR) — إدارة المشاريع والأخبار والكوادر" : "EDITOR — Manage Projects, News, Workforce"}</option>
              <option value="ESTIMATOR">{isAr ? "مقدر تكاليف (ESTIMATOR) — مناقصات وعروض أسعار فقط" : "ESTIMATOR — Tenders & Inquiries Only"}</option>
              <option value="AUDITOR">{isAr ? "مدقق امتثال (AUDITOR) — اطلاع وقراءة فقط" : "AUDITOR — Read-Only Audit Access"}</option>
              <option value="SUPERADMIN">{isAr ? "مدير تنفيذي أعلى (SUPERADMIN) — وصول كامل شامل" : "SUPERADMIN — Full Executive Control"}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-basalt-700 mb-1">
              {isAr ? "كلمة المرور الأولية" : "Initial Password"} *
            </label>
            <input
              type="password"
              {...regCreate("password")}
              placeholder="••••••••"
              className="w-full h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs font-mono focus-ring"
            />
            {createErrors.password && (
              <p className="text-rose-600 text-[11px] mt-1">{createErrors.password.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="createUserActive"
              {...regCreate("isActive")}
              className="rounded text-copper-600 focus:ring-copper-500"
            />
            <label htmlFor="createUserActive" className="text-xs font-medium text-basalt-700 cursor-pointer">
              {isAr ? "تفعيل الحساب فور الإنشاء" : "Activate account immediately"}
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-sand-200">
            <Button
              type="button"
              variant="tectonic"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCreating}
            >
              {isAr ? "إنشاء الحساب" : "Create User"}
            </Button>
          </div>
        </form>
      </ModalDialog>

      {/* EDIT MODAL */}
      <ModalDialog
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={isAr ? "تعديل بيانات وصلاحيات المسؤول" : "Edit Admin User"}
      >
        <form onSubmit={handleEditSubmit(onUpdateUser)} className="space-y-4 text-start">
          <div>
            <label className="block text-xs font-semibold text-basalt-700 mb-1">
              {isAr ? "الاسم الكامل" : "Full Name"}
            </label>
            <input
              type="text"
              {...regEdit("fullName")}
              className="w-full h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-basalt-700 mb-1">
              {isAr ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <input
              type="email"
              {...regEdit("email")}
              className="w-full h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs font-mono focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-basalt-700 mb-1">
              {isAr ? "الصلاحية الممنوحة" : "Access Role"}
            </label>
            <select
              {...regEdit("role")}
              disabled={editingUser?.id === currentUserId}
              className="w-full h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs font-semibold focus-ring disabled:opacity-50"
            >
              <option value="SUPERADMIN">{isAr ? "مدير تنفيذي أعلى (SUPERADMIN)" : "SUPERADMIN"}</option>
              <option value="EDITOR">{isAr ? "محرر محتوى (EDITOR)" : "EDITOR"}</option>
              <option value="ESTIMATOR">{isAr ? "مقدر مناقصات (ESTIMATOR)" : "ESTIMATOR"}</option>
              <option value="AUDITOR">{isAr ? "مدقق امتثال (AUDITOR)" : "AUDITOR"}</option>
            </select>
            {editingUser?.id === currentUserId && (
              <p className="text-[10px] text-amber-600 mt-1">
                {isAr ? "لا يمكنك تغيير صلاحية حسابك الحالي." : "You cannot change role of your own logged-in account."}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-basalt-700 mb-1">
              {isAr ? "إعادة تعيين كلمة المرور (اتركه فارغاً للإبقاء على الحالية)" : "Reset Password (leave empty to keep unchanged)"}
            </label>
            <input
              type="password"
              {...regEdit("password")}
              placeholder="••••••••"
              className="w-full h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs font-mono focus-ring"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="editUserActive"
              {...regEdit("isActive")}
              disabled={editingUser?.id === currentUserId}
              className="rounded text-copper-600 focus:ring-copper-500 disabled:opacity-50"
            />
            <label htmlFor="editUserActive" className="text-xs font-medium text-basalt-700 cursor-pointer">
              {isAr ? "الحساب مفعل ونشط" : "Account is active"}
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-sand-200">
            <Button
              type="button"
              variant="tectonic"
              size="sm"
              onClick={() => setEditingUser(null)}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isUpdating}
            >
              {isAr ? "حفظ التعديلات" : "Save Changes"}
            </Button>
          </div>
        </form>
      </ModalDialog>

      {/* DELETE CONFIRMATION MODAL */}
      <ModalDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        title={isAr ? "تأكيد حذف الحساب الإداري" : "Confirm Admin Deletion"}
      >
        <div className="space-y-4 text-start">
          <p className="text-xs text-basalt-700 leading-relaxed">
            {isAr
              ? `هل أنت متأكد من رغبتك في حذف الحساب الإداري للمستخدم "${deleteModal.user?.fullName}" (${deleteModal.user?.email})؟ لن يتمكن هذا المستخدم من الدخول للنظام بعد الحذف.`
              : `Are you sure you want to permanently remove admin access for "${deleteModal.user?.fullName}" (${deleteModal.user?.email})? This action cannot be undone.`}
          </p>

          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{isAr ? "هذا الإجراء نهائي وسيتم توثيقه في سجل التدقيق الأمني." : "This destructive action is permanent and will be logged in the security audit trail."}</span>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-sand-200">
            <Button
              variant="tectonic"
              size="sm"
              onClick={() => setDeleteModal({ isOpen: false, user: null })}
            >
              {isAr ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              isLoading={isDeleting}
              onClick={onDeleteConfirm}
            >
              {isAr ? "نعم، احذف الحساب" : "Yes, Delete User"}
            </Button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
};
