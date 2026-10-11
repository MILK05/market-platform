"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ApplicationForm({ marketId }: { marketId: string }) {
  const [formData, setFormData] = useState({
    brandName: "",
    contactName: "",
    phone: "",
    planType: "風格餐車",
    equipmentNeeds: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.from("applications").insert([
        {
          market_id: marketId,
          brand_name: formData.brandName,
          contact_name: formData.contactName,
          phone: formData.phone,
          plan_type: formData.planType,
          equipment_needs: formData.equipmentNeeds,
          status: "pending",
        },
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage("報名送出失敗：" + err.message);
      } else {
        setErrorMessage("報名送出失敗，請稍後再試。");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center">
        <h3 className="font-bold text-base mb-1">🎉 報名已成功寫入資料庫！</h3>
        <p className="text-xs text-emerald-700">專員將會審核您的品牌資料，請留意審核通知。</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-xs font-semibold underline"
        >
          再次提交另一品牌
        </button>
      </div>
    );
  }

  return (
    <div>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">品牌 / 攤位名稱 *</label>
          <input
            type="text"
            required
            placeholder="例如：圈圈手作甜點"
            value={formData.brandName}
            onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
            className="w-full text-sm border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">負責人姓名 *</label>
            <input
              type="text"
              required
              placeholder="例如：王小明"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full text-sm border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">聯絡電話 (手機) *</label>
            <input
              type="tel"
              required
              placeholder="例如：0912345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-sm border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">選擇報名方案 *</label>
          <select
            value={formData.planType}
            onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
            className="w-full text-sm border border-neutral-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="風格餐車">風格餐車 (NT$ 2,500)</option>
            <option value="文創手作 (3x3帳篷)">文創手作 (3x3帳篷) (NT$ 1,800)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">設備需求 / 備註</label>
          <textarea
            rows={3}
            placeholder="如：自備發電機、需要額外承租折疊桌椅..."
            value={formData.equipmentNeeds}
            onChange={(e) => setFormData({ ...formData, equipmentNeeds: e.target.value })}
            className="w-full text-sm border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-900 text-white font-semibold py-3 rounded-xl hover:bg-neutral-800 transition text-sm disabled:opacity-50"
        >
          {loading ? "送出資料中..." : "立即提交報名申請"}
        </button>
      </form>
    </div>
  );
}