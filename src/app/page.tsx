import Link from "next/link";

const MARKETS = [
  {
    id: "market-20261024",
    title: "樂天桃園棒球場｜野餐趴市集",
    date: "2026.10.24 (六)",
    time: "10:30 – 18:00",
    location: "桃園市中壢區芝芭里領航北路一段1號",
    city: "桃園",
    status: "招募中",
    category: "餐車 / 文創手作",
    feeNote: "登入後查看攤位費用",
    highlight: "球場內野餐趴・限定 20 台餐車！開放草皮區野餐",
  },
  {
    id: "market-20261107",
    title: "駁二港灣文創日落市集",
    date: "2026.11.07 (六) - 11.08 (日)",
    time: "14:00 – 20:30",
    location: "高雄市鹽埕區大勇路1號",
    city: "高雄",
    status: "即將截止",
    category: "文創手作 / 街頭藝人 / 甜點",
    feeNote: "登入後查看攤位費用",
    highlight: "港灣海風夕陽場，預期人流 5,000+ 人次",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* 頂部導航列 */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-neutral-800">
              CIRCLE MARKET <span className="text-xs text-neutral-500 font-normal">市集招商平台</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-neutral-600 hover:text-black">
              市集活動
            </button>
            <button className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition">
              攤商登入
            </button>
          </div>
        </div>
      </header>

      {/* 主視覺 Banner */}
      <section className="bg-white border-b py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            為城市週末挑選值得出門的相遇
          </h1>
          <p className="text-neutral-500 max-w-xl mx-auto text-sm md:text-base">
            尋找最合適的擺攤場次，透明的報名審核流程與品牌媒合服務。
          </p>
        </div>
      </section>

      {/* 活動列表主區塊 */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">近期招商活動</h2>
          <span className="text-sm text-neutral-500">共 {MARKETS.length} 場活動</span>
        </div>

        {/* 活動卡片網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MARKETS.map((market) => (
            <div
              key={market.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    {market.status}
                  </span>
                  <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                    {market.city}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  {market.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-1 mb-4">
                  {market.highlight}
                </p>

                <div className="space-y-1.5 text-xs text-neutral-600 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-12 text-neutral-400">日期</span>
                    <span>{market.date} ({market.time})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-12 text-neutral-400">地點</span>
                    <span className="truncate">{market.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-12 text-neutral-400">招募</span>
                    <span>{market.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-12 text-neutral-400">費用</span>
                    <span className="text-amber-700 font-medium">{market.feeNote}</span>
                  </div>
                </div>
              </div>

              {/* 底部按鈕 */}
              <div className="px-6 py-4 bg-neutral-50 border-t flex justify-end">
                <Link
                  href={`/markets/${market.id}`}
                  className="inline-flex items-center justify-center text-sm font-semibold bg-neutral-900 text-white px-5 py-2 rounded-xl hover:bg-neutral-800 transition"
                >
                  查看詳情與報名 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}