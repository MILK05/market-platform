"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Application {
  id: string;
  created_at: string;
  market_id: string;
  brand_name: string;
  contact_name: string;
  phone: string;
  plan_type: string;
  equipment_needs: string;
  status: "pending" | "approved" | "rejected";
}

// 預設後台管理密碼（您可以修改為您想要的密碼）
const ADMIN_SECRET = "0911316970";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");

  // 檢查是否已在目前瀏覽階段登入過
  useEffect(() => {
    const isAuthed = sessionStorage.getItem("admin_authenticated") === "true";
    if (isAuthed) {
      setIsAuthenticated(true);
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_SECRET) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      setAuthError("");
      fetchApplications();
    } else {
      setAuthError("管理員密碼錯誤，請重新輸入");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("載入報名資料失敗：", error);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("更新狀態失敗：" + error.message);
    } else {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    }
  };

  // --- 尚未驗證：顯示登入鎖定畫面 ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-sm border border-neutral-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              🔒
            </div>
            <h1 className="text-xl font-extrabold text-neutral-900">後台管理員登入</h1>
            <p className="text-xs text-neutral-500 mt-1">請輸入管理員通行密碼以存取審核系統</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="輸入管理密碼 (預設: admin888)"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError("");
                }}
                className="w-full text-sm border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 text-center font-medium">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-neutral-900 text-white font-semibold py-2.5 rounded-xl hover:bg-neutral-800 transition text-sm"
            >
              登入管理後台
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-700">
              ← 返回市集首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- 已驗證：顯示審核管理後台 ---
  const filteredApps = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-neutral-500 hover:text-black">
              ← 前往公開首頁
            </Link>
            <span className="text-neutral-300">|</span>
            <span className="text-sm font-extrabold text-neutral-900">市集管理後台</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-neutral-500 hover:text-red-600 border border-neutral-200 px-3 py-1.5 rounded-lg transition"
          >
            登出
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">攤商招募報名名單</h1>
            <p className="text-xs text-neutral-500 mt-1">
              即時同步 Supabase 資料庫，共有 {applications.length} 筆報名資料
            </p>
          </div>

          <div className="flex items-center gap-2">
            {["all", "pending", "approved", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  filter === st
                    ? "bg-neutral-900 text-white"
                    : "bg-white border text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {st === "all"
                  ? "全部"
                  : st === "pending"
                  ? "待審核"
                  : st === "approved"
                  ? "已通過"
                  : "已婉拒"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-neutral-400 text-sm">載入名單中...</div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-neutral-400 text-sm">
            目前無符合條件的報名資料
          </div>
        ) : (
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b text-neutral-500 text-xs">
                  <tr>
                    <th className="py-3 px-4">報名時間</th>
                    <th className="py-3 px-4">品牌名稱</th>
                    <th className="py-3 px-4">聯絡人 / 電話</th>
                    <th className="py-3 px-4">方案規格</th>
                    <th className="py-3 px-4">設備需求</th>
                    <th className="py-3 px-4">狀態</th>
                    <th className="py-3 px-4 text-right">審核操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-neutral-50/50">
                      <td className="py-3.5 px-4 text-xs text-neutral-400">
                        {new Date(app.created_at).toLocaleString("zh-TW", {
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-neutral-900">{app.brand_name}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-neutral-800">{app.contact_name}</div>
                        <div className="text-xs text-neutral-400">{app.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700">{app.plan_type}</td>
                      <td className="py-3.5 px-4 text-xs text-neutral-500 max-w-[200px] truncate">
                        {app.equipment_needs || "無特別需求"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            app.status === "approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : app.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {app.status === "approved"
                            ? "已通過"
                            : app.status === "rejected"
                            ? "已婉拒"
                            : "待審核"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => updateStatus(app.id, "approved")}
                            disabled={app.status === "approved"}
                            className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded hover:bg-emerald-700 transition disabled:opacity-30"
                          >
                            通過
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, "rejected")}
                            disabled={app.status === "rejected"}
                            className="text-xs bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded hover:bg-neutral-300 transition disabled:opacity-30"
                          >
                            婉拒
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}