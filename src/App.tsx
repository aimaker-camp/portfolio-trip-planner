import { useState } from "react";
import "./App.css";

type Activity = { time: string; title: string; desc: string; cost: number };
type Day = { title: string; activities: Activity[] };

const CITIES: Record<string, { emoji: string; samples: Day[] }> = {
  東京: {
    emoji: "🗼",
    samples: [
      {
        title: "經典淺草・晴空塔",
        activities: [
          { time: "09:00", title: "淺草雷門・仲見世通", desc: "拍門牌、買人形燒、看晴空塔遠景", cost: 0 },
          { time: "12:00", title: "淺草老店午餐", desc: "鰻魚飯 / 天丼 / 蕎麥麵任選", cost: 1200 },
          { time: "14:30", title: "晴空塔登塔", desc: "350m + 450m 觀景台 + 商場逛街", cost: 1500 },
          { time: "19:00", title: "押上居酒屋晚餐", desc: "在地人愛去的小店,串燒 + 啤酒", cost: 1500 },
        ],
      },
      {
        title: "原宿・澀谷",
        activities: [
          { time: "10:00", title: "明治神宮散步", desc: "森林中的神社,日本人結婚熱門地", cost: 0 },
          { time: "12:30", title: "原宿竹下通", desc: "可麗餅、PURIKURA、波卡", cost: 1000 },
          { time: "15:00", title: "表參道咖啡廳", desc: "% Arabica 或藍瓶,拍照超美", cost: 600 },
          { time: "18:00", title: "澀谷十字路口", desc: "全球最有名路口,日落超震撼", cost: 0 },
          { time: "20:00", title: "燒肉 / 拉麵晚餐", desc: "澀谷站附近選一家排隊店", cost: 1800 },
        ],
      },
      {
        title: "迪士尼樂園",
        activities: [
          { time: "08:30", title: "進園 ・ 抓 FastPass", desc: "先衝太空山 / 巴斯光年", cost: 9400 },
          { time: "12:30", title: "園內午餐", desc: "推薦皇家宴會廳 / 帆船餐廳", cost: 800 },
          { time: "20:30", title: "夜間遊行 + 煙火", desc: "Always 遊行 + Sky Full of Colors", cost: 0 },
        ],
      },
    ],
  },
  京都: {
    emoji: "⛩️",
    samples: [
      {
        title: "嵐山・竹林",
        activities: [
          { time: "09:00", title: "嵐山竹林小徑", desc: "晨光透過竹葉,人少又仙", cost: 0 },
          { time: "11:00", title: "渡月橋 + 天龍寺", desc: "世界遺產 + 桂川風景", cost: 500 },
          { time: "13:00", title: "嵐山溫泉湯豆腐", desc: "京都名物,清淡溫和", cost: 1500 },
          { time: "15:30", title: "嵯峨野小火車", desc: "保津川溪谷風景,秋天最美", cost: 880 },
          { time: "19:00", title: "祇園夜散步", desc: "或許看到藝伎走過小巷", cost: 0 },
        ],
      },
      {
        title: "伏見稻荷・清水寺",
        activities: [
          { time: "07:30", title: "伏見稻荷千本鳥居", desc: "早起避人潮,登頂全程約 2 小時", cost: 0 },
          { time: "12:00", title: "稻禾壽司午餐", desc: "鳥居前的稻禾壽司是名物", cost: 700 },
          { time: "14:30", title: "清水寺 + 三年坂", desc: "從清水舞台看京都市景", cost: 400 },
          { time: "17:00", title: "二年坂買伴手禮", desc: "宇治抹茶、八橋、和菓子", cost: 1500 },
        ],
      },
    ],
  },
  台北: {
    emoji: "🌆",
    samples: [
      {
        title: "信義・101 商圈",
        activities: [
          { time: "10:00", title: "象山步道", desc: "看 101 全景,40 分鐘登頂", cost: 0 },
          { time: "12:30", title: "鼎泰豐 101 店", desc: "小籠包配酸辣湯", cost: 800 },
          { time: "14:30", title: "101 觀景台 + 微風南山", desc: "高空俯瞰 + 逛街", cost: 600 },
          { time: "18:00", title: "饒河夜市", desc: "胡椒餅、藥燉排骨、現切水果", cost: 500 },
        ],
      },
      {
        title: "九份・金瓜石",
        activities: [
          { time: "09:00", title: "九份老街", desc: "芋圓、阿妹茶樓拍千與千尋", cost: 200 },
          { time: "12:00", title: "山城海景餐廳午餐", desc: "面對基隆嶼吃海鮮", cost: 1500 },
          { time: "14:30", title: "黃金博物館", desc: "金瓜石煉金歷史 + 礦坑體驗", cost: 80 },
          { time: "18:30", title: "回台北 ・ 信義 ATT 晚餐", desc: "韓式 / 日式 / 義式任選", cost: 1000 },
        ],
      },
    ],
  },
  大阪: {
    emoji: "🏯",
    samples: [
      {
        title: "心齋橋・道頓堀",
        activities: [
          { time: "10:00", title: "大阪城公園", desc: "天守閣 + 護城河,免費入園", cost: 600 },
          { time: "13:00", title: "道頓堀章魚燒", desc: "排隊店:會津屋 / 蛸之徹", cost: 600 },
          { time: "15:00", title: "心齋橋逛街", desc: "藥妝、優衣庫、Tokyu Hands", cost: 3000 },
          { time: "19:00", title: "黑門市場海鮮丼", desc: "新鮮鮪魚海膽蓋飯", cost: 1500 },
        ],
      },
      {
        title: "環球影城",
        activities: [
          { time: "08:30", title: "進園 ・ 哈利波特區", desc: "城堡之旅 / 雷霆雲霄飛車", cost: 8800 },
          { time: "13:00", title: "三人吃巨無霸漢堡", desc: "侏羅紀餐廳 / 餐廳 35", cost: 1200 },
          { time: "20:00", title: "夜間遊行", desc: "瑪利歐 + 哈利波特光雕秀", cost: 0 },
        ],
      },
    ],
  },
};

export default function App() {
  const [city, setCity] = useState<keyof typeof CITIES>("東京");
  const [days, setDays] = useState(2);

  const cityData = CITIES[city];
  const plan = cityData.samples.slice(0, days);
  const totalCost = plan.reduce(
    (sum, day) => sum + day.activities.reduce((s, a) => s + a.cost, 0),
    0
  );

  return (
    <div className="mag">
      {/* Masthead — newspaper / magazine top */}
      <header className="mast">
        <div className="mast-row">
          <a href="https://ai-class-summer.vercel.app/portfolio" className="mast-back">
            ← BACK TO PORTFOLIO
          </a>
          <span className="mast-issue">ISSUE Nº 03 ・ TRAVEL DEPT.</span>
        </div>
        <div className="mast-title">
          <h1>The Journal</h1>
          <p className="mast-sub">A weekend guide to anywhere worth visiting.</p>
        </div>
      </header>

      <main className="content">
        {/* Big feature title */}
        <div className="feature">
          <span className="kicker">FEATURED ITINERARY</span>
          <h2 className="feature-title">
            <span className="feature-city">{cityData.emoji} {city}</span>
            <span className="feature-days">— {days}-day plan</span>
          </h2>
          <p className="feature-meta">
            預估行程花費 (不含機票住宿) ・ <strong>NT$ {totalCost.toLocaleString()}</strong>
          </p>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="ctrl-block">
            <div className="ctrl-label">CITY</div>
            <div className="ctrl-row">
              {Object.keys(CITIES).map((c) => (
                <button
                  key={c}
                  className={`pill ${city === c ? "pill-on" : ""}`}
                  onClick={() => {
                    setCity(c as keyof typeof CITIES);
                    setDays(Math.min(days, CITIES[c as keyof typeof CITIES].samples.length));
                  }}
                >
                  {CITIES[c as keyof typeof CITIES].emoji} {c}
                </button>
              ))}
            </div>
          </div>
          <div className="ctrl-block">
            <div className="ctrl-label">DAYS</div>
            <div className="ctrl-row">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  disabled={d > cityData.samples.length}
                  className={`pill ${days === d ? "pill-on" : ""}`}
                  onClick={() => setDays(d)}
                >
                  {d} 天
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Days as articles */}
        <div className="days">
          {plan.map((day, dayIdx) => {
            const dayTotal = day.activities.reduce((s, a) => s + a.cost, 0);
            return (
              <article key={dayIdx} className="day">
                <div className="day-head">
                  <span className="day-num">DAY {String(dayIdx + 1).padStart(2, "0")}</span>
                  <h3 className="day-title">{day.title}</h3>
                  <span className="day-cost">NT$ {dayTotal.toLocaleString()}</span>
                </div>
                <ul className="acts">
                  {day.activities.map((act, i) => (
                    <li key={i} className="act">
                      <div className="act-time">{act.time}</div>
                      <div className="act-meat">
                        <h4>{act.title}</h4>
                        <p>{act.desc}</p>
                      </div>
                      {act.cost > 0 && <div className="act-cost">NT$ {act.cost}</div>}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <p className="disclaimer">
          ※ 範例行程・實際出國請依季節、天氣、票價即時調整
        </p>
      </main>

      <footer className="mag-footer">
        <p>This work was made by AI. 你的孩子上完 4 週課,也能做出自己的版本。</p>
        <a href="https://ai-class-summer.vercel.app/#register" className="cta">
          看看 AI 造物營 →
        </a>
      </footer>
    </div>
  );
}
