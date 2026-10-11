"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Application {
  id: number;
  created_at: string;
  market_id: string;
  brand_name: string;
  contact_name: string;
  phone: string;
  plan_type: string;
  equipment_needs: string;
  status: string;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // 抓取資料庫所有報名名單
  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("讀取失敗：" + error.message);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // 更新審核狀態 (approved / rejected)
  const updateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("更新狀態失敗：" + error.message);
    } else {
      // 重新整理本地清單
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 pb-20">
      {/* 頂部導航 */}
      <header className="bg-neutral-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg tracking-wide">CIRCLE MARKET 後台管理</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
              主辦審核專用
            </span>
          </div>
          <Link href="/" className="text-xs text-neutral-400 hover:text-white transition">
            返回前台首頁 →
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black">攤商招商報名審核</h1>
            <p className="text-xs text-neutral-500 mt-1">即時檢視所有場次的攤商報名資料與電力設備需求。</p>
          </div>
          <button
            onClick={fetchApplications}
            className="text-xs bg-white border border-neutral-300 font-semibold px-4 py-2 rounded-lg hover:bg-neutral-50 transition"
          >
            🔄 重新整理
          </button>
        </div>

        {/* 報名列表表格 */}
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-sm text-neutral-500">載入報名資料中...</div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center text-sm text-neutral-500">目前尚無攤商報名資料</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead className="bg-neutral-50 border-b text-neutral-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">品牌名稱</th>
                    <th className="px-6 py-4">聯絡人 / 電話</th>
                    <th className="px-6 py-4">場次代碼</th>
                    <th className="px-6 py-4">方案類型</th>
                    <th className="px-6 py-4">設備需求與備註</th>
                    <th className="px-6 py-4">目前狀態</th>
                    <th className="px-6 py-4 text-right">審核操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-neutral-50/60 transition">
                      <td className="px-6 py-4 font-mono font-medium text-neutral-400">#{app.id}</td>
                      <td className="px-6 py-4 font-bold text-neutral-900 text-sm">{app.brand_name}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-800">{app.contact_name}</div>
                        <div className="text-neutral-400 font-mono mt-0.5">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-neutral-500">{app.market_id}</td>
                      <td className="px-6 py-4">
                        <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                          {app.plan_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs text-neutral-700">
                        {app.equipment_needs || <span className="text-neutral-300">無特殊需求</span>}
                      </td>
                      <td className="px-6 py-4">
                        {app.status === "approved" && (
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
                            ✓ 已錄取
                          </span>
                        )}
                        {app.status === "rejected" && (
                          <span className="bg-red-50 text-red-700 font-bold px-2.5 py-1 rounded-full">
                            ✕ 未錄取
                          </span>
                        )}
                        {app.status === "pending" && (
                          <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full">
                            ⏳ 審核中
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => updateStatus(app.id, "approved")}
                          className="bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition"
                        >
                          錄取
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, "rejected")}
                          className="bg-neutral-200 text-neutral-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-100 hover:text-red-700 transition"
                        >
                          婉拒
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}