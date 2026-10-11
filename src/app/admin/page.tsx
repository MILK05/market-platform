"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Market {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
  contact_phone?: string;
  contact_line?: string;
}

interface Application {
  id: string;
  created_at: string;
  market_id: string;
  brand_name: string;
  contact_name: string;
  phone: string;
  line_id?: string;
  line_name?: string;
  category?: string;
  products?: string;
  plan_type: string;
  equipment_needs: string;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
}

const ADMIN_SECRET = "0000";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarketId, setSelectedMarketId] = useState<string>("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 新增檔期 Modal 狀態
  const [showAddMarket, setShowAddMarket] = useState(false);
  const [newMarket, setNewMarket] = useState({
    id: "",
    title: "",
    date: "",
    location: "",
    contact_phone: "0911316970",
    contact_line: "tawto",
  });

  useEffect(() => {
    const isAuthed = sessionStorage.getItem("admin_authenticated") === "true";
    if (isAuthed) {
      setIsAuthenticated(true);
      fetchInitialData();
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
      fetchInitialData();
    } else {
      setAuthError("管理員密碼錯誤，請重新輸入");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const fetchInitialData = async () => {
    setLoading(true);
    // 抓取所有檔期
    const { data: marketData } = await supabase.from("markets").select("*").order("created_at", { ascending: false });
    if (marketData) setMarkets(marketData);

    // 抓取所有報名
    const { data: appData } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    if (appData) setApplications(appData);

    setLoading(false);
  };

  // 審核狀態更新
  const updateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", id);
    if (error) {
      alert("更新失敗：" + error.message);
    } else {
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)));
    }
  };

  // 儲存主辦方備忘錄
  const handleUpdateNotes = async (id: string, notes: string) => {
    await supabase.from("applications").update({ admin_notes: notes }).eq("id", id);
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, admin_notes: notes } : app)));
  };

  // 新增檔期
  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarket.title || !newMarket.id) {
      alert("請填寫檔期代碼與名稱");
      return;
    }
    const { error } = await supabase.from("markets").insert([
      {
        id: newMarket.id.trim(),
        title: newMarket.title.trim(),
        date: newMarket.date.trim(),
        location: newMarket.location.trim(),
        status: "招募中",
        contact_phone: newMarket.contact_phone,
        contact_line: newMarket.contact_line,
      },
    ]);
    if (error) {
      alert("新增檔期失敗：" + error.message);
    } else {
      setShowAddMarket(false);
      setNewMarket({ id: "", title: "", date: "", location: "", contact_phone: "0911316970", contact_line: "tawto" });
      fetchInitialData();
    }
  };

  // 刪除檔期
  const handleDeleteMarket = async (id: string, title: string) => {
    if (!confirm(`確定要刪除「${title}」這個檔期嗎？這不會刪除已報名的資料。`)) return;
    const { error } = await supabase.from("markets").delete().eq("id", id);
    if (error) {
      alert("刪除失敗：" + error.message);
    } else {
      setMarkets((prev) => prev.filter((m) => m.id !== id));
      if (selectedMarketId === id) setSelectedMarketId("all");
    }
  };

  // 匯出 CSV (支援繁體中文 Excel 不亂碼)
  const exportToCSV = () => {
    const dataToExport = filteredApps;
    if (dataToExport.length === 0) {
      alert("目前沒有任何名單可匯出！");
      return;
    }

    const headers = [
      "報名時間",
      "檔期代碼",
      "招募類型",
      "品牌/攤位名稱",
      "販售商品",
      "負責人",
      "行動電話",
      "LINE ID",
      "LINE用戶名",
      "方案規格",
      "設備需求/備註",
      "審核狀態",
      "主辦方備忘錄",
    ];

    const rows = dataToExport.map((app) => [
      `"${new Date(app.created_at).toLocaleString("zh-TW")}"`,
      `"${app.market_id}"`,
      `"${app.category || ""}"`,
      `"${(app.brand_name || "").replace(/"/g, '""')}"`,
      `"${(app.products || "").replace(/"/g, '""')}"`,
      `"${(app.contact_name || "").replace(/"/g, '""')}"`,
      `"${app.phone}"`,
      `"${app.line_id || ""}"`,
      `"${app.line_name || ""}"`,
      `"${app.plan_type || ""}"`,
      `"${(app.equipment_needs || "").replace(/"/g, '""')}"`,
      `"${app.status === "approved" ? "已通過" : app.status === "rejected" ? "已婉拒" : "待審核"}"`,
      `"${(app.admin_notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `市集報名名單_${selectedMarketId === "all" ? "全檔期" : selectedMarketId}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 篩選運算
  const filteredApps = applications.filter((app) => {
    const matchMarket = selectedMarketId === "all" || app.market_id === selectedMarketId;
    const matchStatus = filter === "all" || app.status === filter;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      app.brand_name?.toLowerCase().includes(q) ||
      app.contact_name?.toLowerCase().includes(q) ||
      app.phone?.includes(q) ||
      app.products?.toLowerCase().includes(q) ||
      app.line_id?.toLowerCase().includes(q);
    return matchMarket && matchStatus && matchSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-sm border border-neutral-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              🔒
            </div>
            <h1 className="text-xl font-extrabold text-neutral-900">後台管理員登入</h1>
            <p className="text-xs text-neutral-500 mt-1">請輸入管理密碼以存取檔期與報名系統</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
              ← 返回市集公開頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-neutral-500 hover:text-black">
              ← 前往公開首頁
            </Link>
            <span className="text-neutral-300">|</span>
            <span className="text-sm font-extrabold text-neutral-900">市集檔期與報名總管理</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-neutral-500 hover:text-red-600 border border-neutral-200 px-3 py-1.5 rounded-lg transition"
          >
            登出
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* 檔期切換與新增檔期列 */}
        <div className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 mr-1">選擇檔期：</span>
            <button
              onClick={() => setSelectedMarketId("all")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                selectedMarketId === "all"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              全部檔期
            </button>
            {markets.map((m) => (
              <div key={m.id} className="relative group flex items-center">
                <button
                  onClick={() => setSelectedMarketId(m.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                    selectedMarketId === m.id
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {m.title}
                </button>
                <button
                  onClick={() => handleDeleteMarket(m.id, m.title)}
                  title="刪除此檔期"
                  className="hidden group-hover:inline-block ml-1 text-xs text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddMarket(true)}
              className="text-xs bg-emerald-600 text-white font-semibold px-3.5 py-2 rounded-xl hover:bg-emerald-700 transition flex items-center gap-1"
            >
              ＋ 發布新檔期
            </button>
            <button
              onClick={exportToCSV}
              className="text-xs bg-neutral-900 text-white font-semibold px-3.5 py-2 rounded-xl hover:bg-neutral-800 transition flex items-center gap-1 shadow-sm"
            >
              📥 匯出當前名單 CSV
            </button>
          </div>
        </div>

        {/* 搜尋與狀態過濾區 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="搜尋品牌名、聯絡人、手機、商品或 LINE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            )}
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
                {st === "all" ? "全部狀態" : st === "pending" ? "待審核" : st === "approved" ? "已通過" : "已婉拒"}
              </button>
            ))}
            <span className="text-xs text-neutral-400 ml-2">共 {filteredApps.length} 筆</span>
          </div>
        </div>

        {/* 報名名單表格 */}
        {loading ? (
          <div className="text-center py-20 text-neutral-400 text-sm">正在載入檔期與名單資料...</div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-neutral-400 text-sm">
            找不到符合條件的報名名單
          </div>
        ) : (
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b text-neutral-500">
                  <tr>
                    <th className="py-3 px-3">時間 / 檔期</th>
                    <th className="py-3 px-3">品牌 / 類別</th>
                    <th className="py-3 px-3">商品內容</th>
                    <th className="py-3 px-3">聯絡人 / 聯絡方式</th>
                    <th className="py-3 px-3">方案 / 設備需求</th>
                    <th className="py-3 px-3">審核備忘 (管理員備註)</th>
                    <th className="py-3 px-3">狀態</th>
                    <th className="py-3 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-3 text-neutral-400">
                        <div>
                          {new Date(app.created_at).toLocaleString("zh-TW", {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[120px]">
                          {markets.find((m) => m.id === app.market_id)?.title || app.market_id}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-neutral-900 text-sm">{app.brand_name}</div>
                        {app.category && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px]">
                            {app.category}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-neutral-700 max-w-[150px]">
                        {app.products || "未填寫商品"}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-neutral-800">{app.contact_name}</div>
                        <div className="text-neutral-500">{app.phone}</div>
                        {(app.line_id || app.line_name) && (
                          <div className="text-[11px] text-emerald-600 mt-0.5">
                            LINE: {app.line_id} {app.line_name && `(${app.line_name})`}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-neutral-600 max-w-[150px]">
                        <div className="font-medium text-neutral-800">{app.plan_type}</div>
                        <div className="text-[11px] text-neutral-400 truncate">{app.equipment_needs || "無特別需求"}</div>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          defaultValue={app.admin_notes || ""}
                          placeholder="點此填寫備註..."
                          onBlur={(e) => handleUpdateNotes(app.id, e.target.value)}
                          className="w-full text-xs border border-transparent hover:border-neutral-200 focus:border-neutral-400 focus:bg-white bg-transparent px-2 py-1 rounded"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-medium ${
                            app.status === "approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : app.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {app.status === "approved" ? "已通過" : app.status === "rejected" ? "已婉拒" : "待審核"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => updateStatus(app.id, "approved")}
                            disabled={app.status === "approved"}
                            className="bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700 disabled:opacity-30"
                          >
                            通過
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, "rejected")}
                            disabled={app.status === "rejected"}
                            className="bg-neutral-200 text-neutral-700 px-2 py-1 rounded hover:bg-neutral-300 disabled:opacity-30"
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

      {/* 新增檔期彈出視窗 */}
      {showAddMarket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border">
            <h2 className="text-base font-bold mb-4">發布新市集檔期</h2>
            <form onSubmit={handleCreateMarket} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">檔期名稱 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：大叔檔期-夢時代跨年"
                  value={newMarket.title}
                  onChange={(e) => setNewMarket({ ...newMarket, title: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">網址代碼 (ID) * 英文或數字無空格</label>
                <input
                  type="text"
                  required
                  placeholder="如：nye-2026 或 market-pig"
                  value={newMarket.id}
                  onChange={(e) => setNewMarket({ ...newMarket, id: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">活動日期</label>
                  <input
                    type="text"
                    placeholder="如：2026.12.31 - 01.01"
                    value={newMarket.date}
                    onChange={(e) => setNewMarket({ ...newMarket, date: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">活動地點</label>
                  <input
                    type="text"
                    placeholder="如：時代大道"
                    value={newMarket.location}
                    onChange={(e) => setNewMarket({ ...newMarket, location: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMarket(false)}
                  className="px-4 py-2 border rounded-xl hover:bg-neutral-50"
                >
                  取消
                </button>
                <button type="submit" className="px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800">
                  確定新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}