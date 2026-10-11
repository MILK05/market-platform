"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ApplicationForm({
  marketId,
  marketTitle,
  contactPhone = "0911316970",
  contactLine = "tawto",
}: {
  marketId: string;
  marketTitle?: string;
  contactPhone?: string;
  contactLine?: string;
}) {
  const [formData, setFormData] = useState({
    category: "特色美食",
    brandName: "",
    products: "",
    contactName: "",
    phone: "",
    lineId: "",
    lineName: "",
    planType: "風格餐車 / 特色攤位",
    equipmentNeeds: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.from("applications").insert([
        {
          market_id: marketId,
          category: formData.category,
          brand_name: formData.brandName,
          products: formData.products,
          contact_name: formData.contactName,
          phone: formData.phone,
          line_id: formData.lineId,
          line_name: formData.lineName,
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

  const autoMessage = `大叔您好，我是「${formData.brandName}」的負責人 ${formData.contactName}，剛在招商網站送出【${marketTitle || marketId}】報名表！我的LINE名稱是「${formData.lineName}」，想確認審核與攤位報價。`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(autoMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 md:p-8 text-neutral-800 space-y-5">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold shadow-sm">
            ✓
          </div>
          <h3 className="font-extrabold text-lg text-emerald-950">報名資料已成功送出！</h3>
          <p className="text-xs text-emerald-800 mt-1">
            請務必完成以下步驟加大叔 LINE，以利核對品類、用電規格並取得正式報價。
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-xs space-y-3">
          <div className="text-xs font-bold text-neutral-700 flex items-center justify-between">
            <span>加 LINE 後建議傳送的核對文字：</span>
            <button
              onClick={handleCopyMessage}
              className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-1 rounded transition"
            >
              {copied ? "已複製到剪貼簿！" : "複製此訊息"}
            </button>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600 border border-neutral-100 leading-relaxed font-mono">
            {autoMessage}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <a
            href={`https://line.me/ti/p/~${contactLine}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>💬 點此直接加大叔 LINE (ID: {contactLine})</span>
          </a>
          <a
            href={`tel:${contactPhone}`}
            className="text-center bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold py-3 px-4 rounded-xl text-xs transition"
          >
            📞 電話洽詢：{contactPhone}
          </a>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs text-neutral-400 hover:text-neutral-700 underline"
          >
            填寫下一筆品牌資料
          </button>
        </div>
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
          <label className="block text-xs font-bold text-neutral-700 mb-1">招募類型 *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full text-xs border border-neutral-300 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="特色美食">特色美食</option>
            <option value="飲品甜點">飲品甜點</option>
            <option value="文創好物">文創好物</option>
            <option value="市集品牌">市集品牌</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">品牌 / 攤位名稱 *</label>
            <input
              type="text"
              required
              placeholder="例如：脆皮五花豬"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full text-xs border border-neutral-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">販售商品項目 *</label>
            <input
              type="text"
              required
              placeholder="例如：脆皮豬肉、特調冷飲"
              value={formData.products}
              onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              className="w-full text-xs border border-neutral-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
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
              className="w-full text-xs border border-neutral-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">行動電話 *</label>
            <input
              type="tel"
              required
              placeholder="例如：0912345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-xs border border-neutral-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">LINE ID *</label>
            <input
              type="text"
              required
              placeholder="供大叔加好友核對"
              value={formData.lineId}
              onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
              className="w-full text-xs border border-neutral-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">LINE 用戶名字 *</label>
            <input
              type="text"
              required
              placeholder="加好友後核對身分用"
              value={formData.lineName}
              onChange={(e) => setFormData({ ...formData, lineName: e.target.value })}
              className="w-full text-xs border border-neutral-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">攤位設備需求 / 自備規格備註</label>
          <textarea
            rows={2}
            placeholder="如：用電瓦數、需自備發電機、車長米數或特殊需求..."
            value={formData.equipmentNeeds}
            onChange={(e) => setFormData({ ...formData, equipmentNeeds: e.target.value })}
            className="w-full text-xs border border-neutral-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl hover:bg-neutral-800 transition text-sm disabled:opacity-50 shadow-sm"
        >
          {loading ? "傳送報名資料中..." : "下一步：提交報名並加 LINE 獲取報價"}
        </button>
      </form>
    </div>
  );
}