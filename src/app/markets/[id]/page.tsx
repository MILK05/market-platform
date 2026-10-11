import Link from "next/link";
import ApplicationForm from "./ApplicationForm";

export const instant = false;

const MARKET_DATA = {
  id: "market-20261024",
  title: "樂天桃園棒球場｜野餐趴市集",
  date: "2026.10.24 (六)",
  time: "10:30 – 18:00",
  location: "桃園市中壢區芝芭里領航北路一段1號",
  city: "桃園",
  status: "報名中",
  deadline: "2026.10.23 (五) 23:59",
  coordinator: {
    name: "Clara",
    role: "圈圈市集專員",
    line: "@clara_market",
  },
  plans: [
    { type: "風格餐車", fee: "NT$ 2,500 / 場", deposit: "NT$ 1,000", electricity: "需自備或另租" },
    { type: "文創手作 (3x3帳篷)", fee: "NT$ 1,800 / 場", deposit: "NT$ 500", electricity: "附 110V 基礎用電" },
  ],
  highlight:
    "本次活動於樂天桃園棒球場內舉辦，活動期間開放球迷進入球場紅土區及草皮區野餐，同類型往年活動曾吸引逾 3,000 名球迷參與！限定招募 20 台風格餐車與優質文創手作品牌。",
};

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-neutral-700 hover:text-black">
            ← 返回市集列表
          </Link>
          <span className="text-sm text-neutral-500">場次代碼：{id}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <div className="bg-white border rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
              {MARKET_DATA.status}
            </span>
            <span className="text-xs text-neutral-500">截止時間：{MARKET_DATA.deadline}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold mb-4">{MARKET_DATA.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
            <div>
              <p><span className="font-semibold text-neutral-400">日期時間：</span>{MARKET_DATA.date} {MARKET_DATA.time}</p>
              <p className="mt-1"><span className="font-semibold text-neutral-400">活動地點：</span>{MARKET_DATA.location}</p>
            </div>
            <div>
              <p><span className="font-semibold text-neutral-400">市集專員：</span>{MARKET_DATA.coordinator.name} ({MARKET_DATA.coordinator.role})</p>
              <p className="mt-1"><span className="font-semibold text-neutral-400">專員 LINE：</span>{MARKET_DATA.coordinator.line}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-bold text-neutral-800 mb-2">招商亮點說明</h2>
            <p className="text-sm text-neutral-600 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              {MARKET_DATA.highlight}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">攤位方案規格</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MARKET_DATA.plans.map((plan) => (
              <div key={plan.type} className="border border-neutral-200 rounded-xl p-5 hover:border-neutral-400 transition">
                <h3 className="font-bold text-base mb-2">{plan.type}</h3>
                <div className="text-xs space-y-1 text-neutral-600">
                  <p><span className="text-neutral-400">攤位租金：</span><strong className="text-neutral-900 text-sm">{plan.fee}</strong></p>
                  <p><span className="text-neutral-400">清潔保證金：</span>{plan.deposit}</p>
                  <p><span className="text-neutral-400">電力設備：</span>{plan.electricity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-bold mb-2">攤商線上招募報名</h2>
          <p className="text-xs text-neutral-500 mb-6">送出後市集專員將於 2-3 個工作天內完成資格審核。</p>
          <ApplicationForm marketId={id} />
        </div>
      </main>
    </div>
  );
}