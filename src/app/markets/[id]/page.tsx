import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ApplicationForm from "./ApplicationForm";

export const instant = false;

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 嘗試從資料庫讀取該檔期資料
  const { data: marketData } = await supabase
    .from("markets")
    .select("*")
    .eq("id", id)
    .single();

  const title = marketData?.title || id;
  const date = marketData?.date || "詳情洽詢大叔";
  const location = marketData?.location || "活動指定場地";
  const status = marketData?.status || "招募中";
  const contactPhone = marketData?.contact_phone || "0911316970";
  const contactLine = marketData?.contact_line || "tawto";
  const description =
    marketData?.description ||
    "強檔熱門活動招募中！名額有限，報名經初審後將依品類與車型規格由大叔一對一提供正式攤位費報價。";

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
        {/* 檔期抬頭與基本資訊 */}
        <div className="bg-white border rounded-2xl p-6 md:p-8 mb-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">
              {status}
            </span>
            <span className="text-xs text-neutral-400">名額有限，依填單與核對順序審核</span>
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
            <p className="text-xs text-amber-900/80 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* 報名須知與收費說明（透明規範） */}
        <div className="bg-white border rounded-2xl p-6 md:p-8 mb-6 shadow-xs">
          <h2 className="text-base font-bold mb-3">📋 攤商報名與報價須知</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/40">
              <h3 className="font-bold text-neutral-900 mb-1">💰 攤位費報價說明</h3>
              <p className="text-neutral-500 leading-relaxed">
                依【販售品類（特色美食/飲品/文創）】與【攤位尺寸/車型規格】核定，填單初審後由大叔一對一線上報價。
              </p>
            </div>
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/40">
              <h3 className="font-bold text-neutral-900 mb-1">⚡ 用電與明火規範</h3>
              <p className="text-neutral-500 leading-relaxed">
                高耗電設備（如重型炸爐、大功率冷飲機等）請於備註填明，並依場地規定決定是否需自備靜音發電機。
              </p>
            </div>
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/40">
              <h3 className="font-bold text-neutral-900 mb-1">🤝 審核確認流程</h3>
              <p className="text-neutral-500 leading-relaxed">
                填寫下方表單送出 ➔ 加大叔 LINE 傳送核對訊息 ➔ 確認商品與位置方案 ➔ 完成正式錄取。
              </p>
            </div>
          </div>
        </div>

        {/* 線上報名表單 */}
        <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base font-bold mb-1">線上攤位招募申請表</h2>
          <p className="text-xs text-neutral-400 mb-6">
            請如實填寫商品內容與聯絡資訊，送出後請依畫面指示加大叔 LINE 核對。
          </p>
          <ApplicationForm
            marketId={id}
            marketTitle={title}
            contactPhone={contactPhone}
            contactLine={contactLine}
          />
        </div>
      </main>
    </div>
  );
}