"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ApplicationForm from "./ApplicationForm";

interface Market {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
  contact_phone?: string;
  contact_line?: string;
  description?: string;
  fee_notice?: string;
  power_notice?: string;
  process_notice?: string;
  max_booths?: number;
}

function MarketDetailContent() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [market, setMarket] = useState<Market | null>(null);
  const [approvedCount, setApprovedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [allowWaitlist, setAllowWaitlist] = useState(false);

  useEffect(() => {
    async function loadMarket() {
      if (!id) return;
      
      // 讀取檔期資料
      const { data: marketData } = await supabase
        .from("markets")
        .select("*")
        .eq("id", id)
        .single();

      if (marketData) {
        setMarket(marketData);
      }

      // 統計該檔期目前已通過(approved)的數量
      const { data: apps } = await supabase
        .from("applications")
        .select("id")
        .eq("market_id", id)
        .eq("status", "approved");

      if (apps) {
        setApprovedCount(apps.length);
      }

      setLoading(false);
    }
    loadMarket();
  }, [id]);

  const title = market?.title || id;
  const date = market?.date || "詳情洽詢大叔";
  const location = market?.location || "活動指定場地";
  const status = market?.status || "招募中";
  const contactPhone = market?.contact_phone || "0911316970";
  const contactLine = market?.contact_line || "tawto";
  const description =
    market?.description ||
    "強檔熱門活動招募中！名額有限，報名經初審後將依品類與車型規格由大叔一對一提供正式攤位費報價。";

  const max = market?.max_booths && market.max_booths > 0 ? market.max_booths : 40;
  const isFull = approvedCount >= max || status === "已截止";

  const feeNotice =
    market?.fee_notice ||
    "依【販售品類（特色美食/飲品/文創）】與【攤位尺寸/車型規格】核定，填單初審後由大叔一對一線上報價。";
  const powerNotice =
    market?.power_notice ||
    "高耗電設備（如重型炸爐、大功率冷飲機等）請於備註填明，並依場地規定決定是否需自備靜音發電機。";
  const processNotice =
    market?.process_notice ||
    "填寫下方表單送出 ➔ 加大叔 LINE 傳送核對訊息 ➔ 確認商品與位置方案 ➔ 完成正式錄取。";

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xs font-semibold text-neutral-600 hover:text-black">
            ← 返回所有檔期列表
          </Link>
          <span className="text-xs text-neutral-400">檔期代碼：{id}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {loading ? (
          <div className="text-center py-20 text-neutral-400 text-sm">載入檔期資料中...</div>
        ) : (
          <>
            <div className="bg-white border rounded-2xl p-6 md:p-8 mb-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    isFull ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {isFull ? "🈵 本檔已額滿" : status}
                </span>
                <span className="text-xs text-neutral-400">
                  當前錄取進度：{approvedCount} / {max} 攤
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">{title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-700 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                <div className="space-y-1.5">
                  <p><span className="font-bold text-neutral-400">活動時間：</span>{date}</p>
                  <p><span className="font-bold text-neutral-400">活動地點：</span>{location}</p>
                </div>
                <div className="space-y-1.5">
                  <p><span className="font-bold text-neutral-400">主辦聯絡：</span>大叔 ({contactPhone})</p>
                  <p>
                    <span className="font-bold text-neutral-400">官方 LINE：</span>
                    <span className="text-emerald-700 font-semibold">{contactLine}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-amber-50/60 border border-amber-100/80">
                <h2 className="text-xs font-bold text-amber-900 mb-1">📢 檔期活動招商說明</h2>
                <p className="text-xs text-amber-900/80 leading-relaxed whitespace-pre-line">{description}</p>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6 md:p-8 mb-6 shadow-xs">
              <h2 className="text-base font-bold mb-3">📋 攤商報名與報價須知</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/40">
                  <h3 className="font-bold text-neutral-900 mb-1">💰 攤位費報價說明</h3>
                  <p className="text-neutral-500 leading-relaxed whitespace-pre-line">{feeNotice}</p>
                </div>
                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/40">
                  <h3 className="font-bold text-neutral-900 mb-1">⚡ 用電與明火規範</h3>
                  <p className="text-neutral-500 leading-relaxed whitespace-pre-line">{powerNotice}</p>
                </div>
                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/40">
                  <h3 className="font-bold text-neutral-900 mb-1">🤝 審核確認流程</h3>
                  <p className="text-neutral-500 leading-relaxed whitespace-pre-line">{processNotice}</p>
                </div>
              </div>
            </div>

            {/* 線上報名區塊：具備滿額自動關閉防呆與候補切換 */}
            <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-xs">
              {isFull && !allowWaitlist ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    🈵
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-neutral-900">本檔期席次已全數額滿！</h2>
                    <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                      感謝支持，本檔期錄取名額已滿。若有攤商取消或異動，將依候補登記順序優先通知。
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <button
                      onClick={() => setAllowWaitlist(true)}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition"
                    >
                      填寫候補席次表單
                    </button>
                    <a
                      href={`https://line.me/ti/p/~${contactLine}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition flex items-center justify-center gap-1"
                    >
                      💬 私訊大叔 LINE 詢問保留位
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold">
                        {isFull ? "線上攤位候補登記表" : "線上攤位招募申請表"}
                      </h2>
                      {isFull && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                          候補模式
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {isFull
                        ? "本檔期名額已額滿，填表將列入候補優先排序，送出後請加大叔 LINE 核對。"
                        : "請如實填寫商品內容與聯絡資訊，送出後請依畫面指示加大叔 LINE 核對。"}
                    </p>
                  </div>

                  <ApplicationForm
                    marketId={id}
                    marketTitle={title}
                    contactPhone={contactPhone}
                    contactLine={contactLine}
                  />
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function MarketDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center text-xs text-neutral-400">載入中...</div>}>
      <MarketDetailContent />
    </Suspense>
  );
}