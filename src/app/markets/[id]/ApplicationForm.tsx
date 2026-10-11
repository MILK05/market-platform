"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ApplicationFormProps {
  marketId: string;
  marketTitle: string;
  contactPhone: string;
  contactLine: string;
  isWaitlist?: boolean;
}

export default function ApplicationForm({
  marketId,
  marketTitle,
  contactPhone,
  contactLine,
  isWaitlist = false,
}: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    category: "特色美食",
    brand_name: "",
    products: "",
    contact_name: "",
    phone: "",
    line_id: "",
    line_name: "",
    plan_type: "風格餐車",
    equipment_needs: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand_name || !formData.contact_name || !formData.phone) {
      alert("請確實填寫必填欄位！");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("applications").insert([
      {
        market_id: marketId,
        category: formData.category,
        brand_name: formData.brand_name.trim(),
        products: formData.products.trim(),
        contact_name: formData.contact_name.trim(),
        phone: formData.phone.trim(),
        line_id: formData.line_id.trim(),
        line_name: formData.line_name.trim(),
        plan_type: formData.plan_type,
        equipment_needs: formData.equipment_needs.trim(),
        status: isWaitlist ? "waitlist" : "pending",
      },
    ]);

    setSubmitting(false);

    if (error) {
      alert("提交失敗：" + error.message);
    } else {
      setSubmitted(true);
    }
  };

  const copyNoticeText = `【大叔市集${isWaitlist ? "候補登記" : "報名核對"}】
檔期：${marketTitle}
品牌：${formData.brand_name}
品類：${formData.category}
商品：${formData.products || "如表單"}
負責人：${formData.contact_name}
電話：${formData.phone}
LINE ID：${formData.line_id || "同電話"}
規格：${formData.plan_type}
大叔您好，我已完成線上${isWaitlist ? "候補登記" : "報名"}，請協助核對！`;

  const handleCopy = () => {
    navigator.clipboard.writeText(copyNoticeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <div>
          <h3 className="text-lg font-bold text-emerald-900">
            {isWaitlist ? "候補席次登記成功！" : "報名申請資料已成功送出！"}
          </h3>
          <p className="text-xs text-emerald-800/80 mt-1">
            {isWaitlist
              ? "已排入候補名單。請務必加大叔 LINE 傳送核對訊息，若有釋出名額將依序通知。"
              : "請務必加大叔 LINE 並傳送以下核對訊息，以利安排初審與一對一報價。"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 text-left text-xs text-neutral-700 font-mono whitespace-pre-line leading-relaxed">
          {copyNoticeText}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition"
          >
            {copied ? "✓ 已複製訊息！" : "📋 複製核對訊息"}
          </button>
          <a
            href={`https://line.me/ti/p/~${contactLine}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition flex items-center justify-center gap-1"
          >
            💬 加大叔 LINE 傳送訊息
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">攤位類別 *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border rounded-xl px-3 py-2 text-xs bg-white"
          >
            <option value="特色美食">特色美食 / 熟食熱炒</option>
            <option value="甜點飲品">甜點烘焙 / 特色飲品</option>
            <option value="文創手作">文創手作 / 飾品配件</option>
            <option value="生活選物">生活風格 / 特色雜貨</option>
            <option value="互動遊戲">互動娛樂 / 體驗課程</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">品牌 / 攤位名稱 *</label>
          <input
            type="text"
            required
            placeholder="例如：大叔古早味香腸"
            value={formData.brand_name}
            onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
            className="w-full border rounded-xl px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">販售主要商品項目 *</label>
        <input
          type="text"
          required
          placeholder="例如：碳烤黑豬肉香腸、糯米腸、手工泡菜"
          value={formData.products}
          onChange={(e) => setFormData({ ...formData, products: e.target.value })}
          className="w-full border rounded-xl px-3 py-2 text-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold mb-1">聯絡負責人 *</label>
          <input
            type="text"
            required
            placeholder="姓名 / 暱稱"
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            className="w-full border rounded-xl px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">行動電話 *</label>
          <input
            type="tel"
            required
            placeholder="09xx-xxx-xxx"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border rounded-xl px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">LINE ID</label>
          <input
            type="text"
            placeholder="核對與報價通知用"
            value={formData.line_id}
            onChange={(e) => setFormData({ ...formData, line_id: e.target.value })}
            className="w-full border rounded-xl px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">預計設攤規格方案 *</label>
          <select
            value={formData.plan_type}
            onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
            className="w-full border rounded-xl px-3 py-2 text-xs bg-white"
          >
            <option value="風格餐車">風格餐車 / 美式餐車 / 胖卡</option>
            <option value="歐棚攤位">標準歐棚攤位 (3m x 3m)</option>
            <option value="一般陽傘">陽傘展位 / 2米攤位</option>
            <option value="文創小桌">文創小桌 / 半攤 (自備桌椅)</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">設備需求 / 特殊備註</label>
          <input
            type="text"
            placeholder="用電瓦數、明火、車輛長度等"
            value={formData.equipment_needs}
            onChange={(e) => setFormData({ ...formData, equipment_needs: e.target.value })}
            className="w-full border rounded-xl px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-xl font-bold text-white transition text-xs ${
            isWaitlist
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-neutral-900 hover:bg-neutral-800"
          } disabled:opacity-50`}
        >
          {submitting
            ? "正在提交..."
            : isWaitlist
            ? "登記候補席次 →"
            : "提交報名初審申請 →"}
        </button>
      </div>
    </form>
  );
}