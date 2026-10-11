"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Market {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
  contact_phone?: string;
}

export default function HomePage() {
  const [marketList, setMarketList] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMarkets() {
      const { data } = await supabase
        .from("markets")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        setMarketList(data);
      }
      setLoading(false);
    }
    loadMarkets();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight">大叔市集招商平台</span>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
              全檔期招募
            </span>
          </div>
          <Link
            href="/admin"
            className="text-xs border border-neutral-200 px-3 py-1.5 rounded-lg text-neutral-600 hover:text-black hover:border-black transition"
          >
            後台管理入口
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">即將登場市集檔期</h1>
          <p className="text-sm text-neutral-500 mt-2">選擇欲報名的檔期，點入填寫線上品牌資料即可完成報名</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-neutral-400 text-sm">載入檔期中...</div>
        ) : marketList.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-neutral-400 text-sm">
            目前暫無開放中的檔期，請至管理後台新增！
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketList.map((m) => (
              <div
                key={m.id}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      {m.status || "招募中"}
                    </span>
                    <span className="text-xs text-neutral-400">代碼: {m.id}</span>
                  </div>
                  <h2 className="text-lg font-bold mb-3">{m.title}</h2>
                  <div className="text-xs text-neutral-600 space-y-1.5 mb-6">
                    <p><span className="text-neutral-400 font-medium">時間：</span>{m.date}</p>
                    <p><span className="text-neutral-400 font-medium">地點：</span>{m.location}</p>
                    {m.contact_phone && (
                      <p><span className="text-neutral-400 font-medium">專員專線：</span>{m.contact_phone}</p>
                    )}
                  </div>
                </div>

                <Link
                  href={`/markets/${m.id}`}
                  className="w-full text-center bg-neutral-900 text-white font-semibold py-2.5 rounded-xl hover:bg-neutral-800 transition text-xs block"
                >
                  查看詳情並立即報名 →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
