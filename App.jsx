import { useState, useEffect, useRef } from "react";

const FIREBASE_URL = "https://huamei-pos-default-rtdb.asia-southeast1.firebasedatabase.app";

const DEFAULT_ADMIN_PASSWORD = "HuaMei2026";

const SAMPLE_PRODUCTS = [];

// 員工購物頁左側品牌情境圖：請將圖片放在 public 資料夾
// 目前使用 public/hero-sale.png；若之後要輪播，請依序上傳 hero-sale-2.png、hero-sale-3.png...，再把路徑加入下方陣列
const HERO_IMAGES = [
  { src: "/hero-sale-10.png", position: "center center", mobilePosition: "center 38%" }, // 新增第一張

  { src: "/hero-sale.png", position: "center center" },
  { src: "/hero-sale-2.jpg", position: "60% center" },
  { src: "/hero-sale-3.png", position: "58% center" },
  { src: "/hero-sale-4.png", position: "55% center" },
  { src: "/hero-sale-5.jpg", position: "52% center" },

  { src: "/hero-sale-7.png",  position: "80% 50%", mobilePosition: "68% 40%" } // 新增最後一張
];

function useStorage(key, defaultVal) {
  const [val, setVal] = useState(defaultVal);
  const [loaded, setLoaded] = useState(false);
  const dbKey = key.replace(/[:.]/g, "_");
  const intervalRef = useRef(null);
  const localRef = useRef(null); // Track local version to avoid overwrite

  useEffect(() => {
    let cancelled = false;

    const load = async (isInitial = false) => {
      try {
        const res = await fetch(`${FIREBASE_URL}/${dbKey}.json`, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) {
          // Only update from remote if no recent local change (within 5 seconds)
          const now = Date.now();
          if (isInitial || !localRef.current || (now - localRef.current > 5000)) {
            setVal(data !== null && data !== undefined ? data : defaultVal);
          }
          if (isInitial) setLoaded(true);
        }
      } catch {
        if (!cancelled && isInitial) {
          setVal(defaultVal);
          setLoaded(true);
        }
      }
    };

    load(true);

    // Poll every 10 seconds
    intervalRef.current = setInterval(() => {
      if (!cancelled) load(false);
    }, 10000);

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dbKey]);

  const save = async (v) => {
    localRef.current = Date.now(); // Mark local change time
    setVal(v);
    try {
      const res = await fetch(`${FIREBASE_URL}/${dbKey}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v)
      });
      if (!res.ok) throw new Error("Save failed");
    } catch (e) {
      console.error("Firebase error:", e);
    }
  };

  return [val, save, loaded];
}

// ─── Icon Components ───────────────────────────────────────────────────────────
const IconCart = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconTrash = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconPackage = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconOrders = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconUpload = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const IconCheck = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconEdit = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// ─── Image Placeholder ─────────────────────────────────────────────────────────
const GlassesPlaceholder = ({ name }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #e8f4f8 0%, #d1e8f0 100%)", gap: 8 }}>
    <svg width="64" height="32" viewBox="0 0 80 40" fill="none">
      <rect x="2" y="10" width="28" height="18" rx="9" stroke="#94b8c8" strokeWidth="2.5" fill="white" fillOpacity="0.5"/>
      <rect x="50" y="10" width="28" height="18" rx="9" stroke="#94b8c8" strokeWidth="2.5" fill="white" fillOpacity="0.5"/>
      <line x1="30" y1="19" x2="50" y2="19" stroke="#94b8c8" strokeWidth="2.5"/>
      <line x1="2" y1="19" x2="0" y2="24" stroke="#94b8c8" strokeWidth="2"/>
      <line x1="78" y1="19" x2="80" y2="24" stroke="#94b8c8" strokeWidth="2"/>
    </svg>
    <span style={{ fontSize: 11, color: "#94b8c8", fontWeight: 500 }}>{name}</span>
  </div>
);

// ─── EMPLOYEE VIEW ─────────────────────────────────────────────────────────────
function EmployeeView({ products, onOrder }) {
  const [cart, setCartState] = useState(() => {
    try { const s = sessionStorage.getItem("glasses:cart"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const setCart = (v) => {
    const next = typeof v === "function" ? v(cart) : v;
    setCartState(next);
    try { sessionStorage.setItem("glasses:cart", JSON.stringify(next)); } catch {}
  };
  const [page, setPage] = useState("shop");
  const [form, setForm] = useState({ name: "", employeeId: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef(null);

  // 購物車有商品時啟動倒數
  useEffect(() => {
    if (cart.length > 0 && timeLeft === null) {
      setTimeLeft(600); // 10分鐘
    }
    if (cart.length === 0) {
      setTimeLeft(null);
      clearInterval(timerRef.current);
    }
  }, [cart]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setCart([]);
      setTimeLeft(null);
      setPage("shop");
      setTimerExpired(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const addToCart = (p) => {
    if (p.stock <= 0) return;
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id);
      if (ex) {
        if (ex.qty >= p.stock) return prev; // 不超過庫存
        return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.qty * c.price, 0);

  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const submitOrder = () => {
    if (!form.name.trim() || !form.employeeId.trim()) return;
    if (submitting) return;
    setSubmitting(true);
    const orderData = { items: cart, ...form, total: cartTotal, date: new Date().toLocaleString("zh-TW") };
    const orderNo = onOrder(orderData);
    setLastOrder({ ...orderData, orderNo });
    setCart([]);
    setForm({ name: "", employeeId: "" });
    setPage("done");
    setSubmitting(false);
  };

  // 即時剩餘庫存 = 實際庫存 - 購物車中的數量
  const getAvailableStock = (p) => {
    const inCart = cart.find(c => c.id === p.id);
    return p.stock - (inCart ? inCart.qty : 0);
  };

  const [category, setCategory] = useState("adult"); // adult | kids
  const [isMobileHero, setIsMobileHero] = useState(() => typeof window !== "undefined" ? window.innerWidth <= 560 : false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [prevHeroIndex, setPrevHeroIndex] = useState(null);
  const heroAnimTimerRef = useRef(null);
  const activeHeroDot = heroIndex;

  useEffect(() => {
    HERO_IMAGES.forEach(img => {
      const preload = new Image();
      preload.src = img.src;
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileHero(window.innerWidth <= 560);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getHeroPosition = (index) => {
    const item = HERO_IMAGES[index];
    return isMobileHero ? (item.mobilePosition || item.position) : item.position;
  };

  const switchHeroSlide = (nextIndex) => {
    if (!HERO_IMAGES.length || nextIndex === heroIndex) return;
    if (heroAnimTimerRef.current) clearTimeout(heroAnimTimerRef.current);
    setPrevHeroIndex(heroIndex);
    setHeroIndex(nextIndex);
    heroAnimTimerRef.current = setTimeout(() => setPrevHeroIndex(null), 850);
  };

  useEffect(() => {
    if (!HERO_IMAGES.length) return;
    const timer = setInterval(() => {
      switchHeroSlide((heroIndex + 1) % HERO_IMAGES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [heroIndex]);

  useEffect(() => {
    return () => {
      if (heroAnimTimerRef.current) clearTimeout(heroAnimTimerRef.current);
    };
  }, []);

  const goHeroSlide = (i) => {
    switchHeroSlide(i);
  };

  const inStock = products.filter(p => getAvailableStock(p) > 0 || cart.find(c => c.id === p.id));

  if (page === "done") return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, animation: "fadeInUp 0.5s ease" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { 0% { transform:scale(0); } 60% { transform:scale(1.2); } 100% { transform:scale(1); } }
        @keyframes confetti { 0% { transform:translateY(0) rotate(0); opacity:1; } 100% { transform:translateY(-60px) rotate(360deg); opacity:0; } }
      `}</style>
      <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #4CAF50, #81C784)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(76,175,80,0.4)", animation: "popIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275)" }}>
        <IconCheck />
      </div>
      <div style={{ fontSize: 32, animation: "confetti 1s ease 0.3s both" }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1a2b3c", margin: 0 }}>訂單已送出！</h2>

      {/* 訂單明細卡片 */}
      <div style={{ background: "white", borderRadius: 20, padding: "22px 24px", width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.12)", border: "2px solid #e8f5e9" }}>

        {/* 訂單編號 - 超大顯示 */}
        <div style={{ textAlign: "center", marginBottom: 16, background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, color: "#78909c", marginBottom: 6, letterSpacing: 1.5, fontWeight: 600 }}>訂 單 編 號</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#1a2b3c", letterSpacing: 3, fontFamily: "monospace" }}>{lastOrder?.orderNo || "—"}</div>
          <div style={{ fontSize: 11, color: "#4CAF50", marginTop: 4, fontWeight: 600 }}>📸 請截圖保存此編號作為領取憑證</div>
        </div>

        <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#475569", marginBottom: 6 }}>
            <span style={{ color: "#78909c" }}>姓名</span><span style={{ fontWeight: 700, color: "#1a2b3c" }}>{lastOrder?.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#475569" }}>
            <span style={{ color: "#78909c" }}>工號</span><span style={{ fontWeight: 700, color: "#1a2b3c" }}>{lastOrder?.employeeId}</span>
          </div>
        </div>

        <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 12, marginBottom: 12 }}>
          {lastOrder?.items?.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#475569", padding: "4px 0" }}>
              <span>{item.name} × {item.qty}</span><span style={{ fontWeight: 600 }}>${item.price * item.qty}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #e2e8f0", fontWeight: 900, color: "#e53935", fontSize: 20 }}>
            <span>總計</span><span>${lastOrder?.total}</span>
          </div>
        </div>

        <div style={{ background: "#fff8e1", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#795548", lineHeight: 1.9, borderLeft: "3px solid #FFC107" }}>
          🙏 感謝您的購買！商品備齊後，我們將主動通知您領取時間與地點，屆時請以<span style={{ color: "#e53935", fontWeight: 800, textDecoration: "underline" }}>『現金』</span>付款，謝謝您的配合。
        </div>
        <div style={{ background: "#e3f2fd", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#1565c0", lineHeight: 1.9, marginTop: 8, borderLeft: "3px solid #1976D2" }}>
          📞 如訂單有任何問題，請聯繫<span style={{ textDecoration: "underline", fontWeight: 700 }}>人資單位</span>協助處理：<br/>
          【中崙廠】：2233、2210<br/>
          【樹谷廠】：7324、7322
        </div>
      </div>
      <button onClick={() => setPage("shop")} style={{ ...btnStyle("#2196F3"), marginTop: 4, padding: "12px 32px", fontSize: 15 }}>繼續瀏覽</button>
    </div>
  );

  return (
    <div>
      {page !== "shop" && timerExpired && (
        <div style={{ background: "#ffebee", border: "1.5px solid #ef9a9a", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>⏰</span>
          <div style={{ flex: 1, fontSize: 13, color: "#b71c1c", fontWeight: 600 }}>購物時間已到，購物車已自動清空，請重新選購！</div>
          <button onClick={() => setTimerExpired(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#b71c1c", fontSize: 18 }}>✕</button>
        </div>
      )}

      {/* 倒數計時提示 */}
      {page !== "shop" && timeLeft !== null && (
        <div style={{ background: timeLeft <= 60 ? "#ffebee" : "#fff8e1", border: `1.5px solid ${timeLeft <= 60 ? "#ef9a9a" : "#ffe082"}`, borderRadius: 12, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{timeLeft <= 60 ? "🚨" : "⏰"}</span>
          <div style={{ flex: 1, fontSize: 13, color: "#5d4037" }}>
            <strong>結帳倒數：{formatTime(timeLeft)}</strong>
            <span style={{ color: "#8d6e63", marginLeft: 8 }}>— 時間到未結帳，將自動清空購物車並釋放庫存</span>
          </div>
        </div>
      )}

      {/* Top Bar */}
      {page !== "shop" && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a2b3c" }}>
            {page === "cart" ? "🛒 購物車" : page === "form" ? "📝 填寫資料" : ""}
          </h2>
        </div>
        {page !== "shop" && (
          <button onClick={() => setPage(page === "cart" ? "shop" : "cart")} style={{ ...btnStyle("#6b7f8e", true), fontSize: 13 }}>← 返回</button>
        )}
      </div>}

      {/* Shop */}
      {page === "shop" && (
        <div className="hm-shop-layout">
          <style>{`
            .hm-shop-layout {
              display: grid;
              grid-template-columns: minmax(360px, 40%) minmax(0, 60%);
              height: calc(100vh - 76px);
              min-height: 640px;
              overflow: hidden;
              background: #f3f7f8;
            }
            .hm-brand-hero {
              position: relative;
              height: 100%;
              overflow: hidden;
              background: #f3f7f8;
            }
            .hm-hero-stage {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden;
              background: #f3f7f8;
            }
            .hm-hero-layer {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              will-change: transform, opacity;
            }
            .hm-hero-layer.incoming {
              z-index: 2;
              animation: hmHeroSlideIn 0.78s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
            .hm-hero-layer.outgoing {
              z-index: 1;
              animation: hmHeroSlideOut 0.78s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
            .hm-brand-hero-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
              display: block;
              transform: scale(1.015);
            }
             hmHeroSlideIn {
              from { transform: translateX(100%); opacity: 1; }
              to { transform: translateX(0); opacity: 1; }
            }
             hmHeroSlideOut {
              from { transform: translateX(0); opacity: 1; }
              to { transform: translateX(-24%); opacity: .92; }
            }
.hm-hero-dots {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}
.hm-hero-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: none;
  background: rgba(255,255,255,.55);
  cursor: pointer;
  transition: all .2s ease;
  padding: 0;
}
.hm-hero-dot.active {
  width: 22px;
  background: #ffffff;
}
.hm-products-panel {
              height: 100%;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              background: linear-gradient(180deg, #ffffff 0%, #f5f8fa 100%);
            }
            .hm-products-fixed {
              flex: 0 0 auto;
              padding: 18px clamp(22px, 2.5vw, 38px) 8px;
              background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,.96) 100%);
              border-bottom: 1px solid rgba(226,232,240,.72);
              box-shadow: 0 8px 24px rgba(15,23,42,.04);
              z-index: 30;
            }
            .hm-product-scroll {
              flex: 1 1 auto;
              overflow-y: auto;
              padding: 18px clamp(22px, 2.5vw, 38px) 110px;
            }
            .hm-product-scroll::-webkit-scrollbar { width: 10px; }
            .hm-product-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; border: 3px solid #f5f8fa; }
            .hm-shop-heading {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              gap: 16px;
              margin-bottom: 12px;
            }
            .hm-shop-eyebrow {
              color: #64748b;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .hm-shop-title {
              margin: 0;
              color: #101827;
              font-size: clamp(22px, 2vw, 30px);
              font-weight: 950;
              letter-spacing: .5px;
            }
            .hm-shop-count {
              color: #64748b;
              font-size: 12px;
              white-space: nowrap;
              font-weight: 700;
            }
            .hm-category-tabs {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              padding: 4px 0 6px;
              margin-bottom: 0;
              background: transparent;
            }
            .hm-category-btn {
              padding: 12px 10px;
              border-radius: 16px;
              border: 2px solid #e2e8f0;
              cursor: pointer;
              font-weight: 950;
              font-size: 15px;
              letter-spacing: 1px;
              transition: all .2s ease;
              background: #ffffff;
              color: #94a3b8;
              box-shadow: 0 5px 18px rgba(15,23,42,.05);
            }
            .hm-category-btn.active-adult { background: #111827; border-color: #111827; color: #fff; box-shadow: 0 12px 26px rgba(17,24,39,.24); }
            .hm-category-btn.active-kids { background: #111827; border-color: #111827; color: #fff; box-shadow: 0 12px 26px rgba(17,24,39,.24); }
            .hm-product-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
              gap: 22px;
              align-items: stretch;
            }
            .hm-product-card {
              background: white;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 10px 28px rgba(15,23,42,.10);
              transition: transform .2s ease, box-shadow .2s ease;
              border: 1px solid rgba(226,232,240,.9);
              min-height: 340px;
            }
            .hm-product-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 18px 42px rgba(15,23,42,.16);
            }
            .hm-product-img {
              height: 178px;
              padding: 18px 18px 4px;
              position: relative;
              cursor: pointer;
              background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
            }
            .hm-product-img img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              display: block;
            }
            .hm-product-rank {
              position: absolute;
              top: 14px;
              left: 14px;
              z-index: 2;
              background: rgba(15,23,42,.78);
              color: white;
              font-size: 12px;
              font-weight: 900;
              padding: 3px 10px;
              border-radius: 999px;
              backdrop-filter: blur(4px);
            }
            .hm-product-body { padding: 14px 20px 20px; }
            .hm-product-name { font-size: 22px; font-weight: 950; color: #0f172a; line-height: 1.05; margin-bottom: 7px; }
            .hm-product-desc { font-size: 15px; color: #475569; line-height: 1.35; min-height: 40px; margin-bottom: 10px; }
            .hm-product-meta { display: flex; justify-content: space-between; align-items: flex-end; gap: 10px; margin-bottom: 12px; }
            .hm-product-price { font-size: 28px; color: #111827; font-weight: 950; letter-spacing: -.5px; }
            .hm-product-stock { font-size: 12px; color: #64748b; font-weight: 800; white-space: nowrap; }
            .hm-add-btn {
              width: 100%;
              border: none;
              border-radius: 13px;
              background: #4b5563;
              color: white;
              font-size: 15px;
              font-weight: 950;
              padding: 12px 0;
              cursor: pointer;
              transition: all .2s ease;
              letter-spacing: 1px;
            }
            .hm-add-btn:hover { background: #111827; transform: translateY(-1px); }
            .hm-qty-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: #f1f5f9;
              border-radius: 13px;
              overflow: hidden;
              margin-top: 10px;
            }
            .hm-qty-btn {
              background: transparent;
              border: none;
              font-size: 22px;
              font-weight: 900;
              cursor: pointer;
              padding: 9px 18px;
              line-height: 1;
            }
            .hm-empty {
              grid-column: 1/-1;
              min-height: 300px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #94a3b8;
              font-weight: 700;
            }
            @media (min-width: 1500px) {
              .hm-product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            }
            @media (max-width: 1280px) {
              .hm-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
              .hm-product-img { height: 158px; }
              .hm-product-name { font-size: 19px; }
              .hm-product-price { font-size: 24px; }
            }
            @media (max-width: 900px) {
              .hm-shop-layout {
                display: block;
                height: auto;
                min-height: unset;
                overflow: visible;
              }
              .hm-brand-hero {
                height: 360px;
              }
              .hm-products-panel {
                height: auto;
                overflow: visible;
              }
              .hm-products-fixed { padding: 20px 18px 10px; }
              .hm-product-scroll {
                height: auto;
                overflow: visible;
                padding: 18px 18px 110px;
              }
              .hm-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
            }
            @media (max-width: 560px) {
              .hm-brand-hero { height: 420px; }
              .hm-shop-heading { align-items: flex-start; flex-direction: column; }
              .hm-product-grid { grid-template-columns: 1fr; }
              .hm-product-card { min-height: unset; }
              .hm-product-img { height: 190px; }
              .hm-category-btn { font-size: 15px; padding: 13px 8px; }
            }
          `}</style>

          <aside className="hm-brand-hero" aria-label="品牌情境圖">
            <div className="hm-hero-stage">
              {prevHeroIndex !== null && (
                <div className="hm-hero-layer outgoing" key={`prev-${HERO_IMAGES[prevHeroIndex].src}-${prevHeroIndex}`}>
                  <img
                    src={HERO_IMAGES[prevHeroIndex].src}
                    alt="華美光學員工特賣會"
                    className="hm-brand-hero-img"
                    style={{ objectPosition: getHeroPosition(prevHeroIndex) }}
                  />
                </div>
              )}
              <div className="hm-hero-layer incoming" key={`hero-${HERO_IMAGES[heroIndex].src}-${heroIndex}`}>
                <img
                  src={HERO_IMAGES[heroIndex].src}
                  alt="華美光學員工特賣會"
                  className="hm-brand-hero-img"
                  style={{ objectPosition: getHeroPosition(heroIndex) }}
                />
              </div>
            </div>
            <div className="hm-hero-dots">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`hm-hero-dot ${i === activeHeroDot ? "active" : ""}`}
                  onClick={() => goHeroSlide(i)}
                  aria-label={`切換第 ${i + 1} 張圖片`}
                />
              ))}
            </div>
          </aside>

          <section className="hm-products-panel">
            <div className="hm-products-fixed">
            {timerExpired && (
              <div style={{ background: "#ffebee", border: "1.5px solid #ef9a9a", borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>⏰</span>
                <div style={{ flex: 1, fontSize: 13, color: "#b71c1c", fontWeight: 700 }}>購物時間已到，購物車已自動清空，請重新選購！</div>
                <button onClick={() => setTimerExpired(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#b71c1c", fontSize: 18 }}>✕</button>
              </div>
            )}

            {timeLeft !== null && (
              <div style={{ background: timeLeft <= 60 ? "#ffebee" : "#fff8e1", border: `1.5px solid ${timeLeft <= 60 ? "#ef9a9a" : "#ffe082"}`, borderRadius: 14, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{timeLeft <= 60 ? "🚨" : "⏰"}</span>
                <div style={{ flex: 1, fontSize: 13, color: "#5d4037" }}>
                  <strong>結帳倒數：{formatTime(timeLeft)}</strong>
                  <span style={{ color: "#8d6e63", marginLeft: 8 }}>— 時間到未結帳，將自動清空購物車並釋放庫存</span>
                </div>
              </div>
            )}

            <div className="hm-shop-heading">
              <div>
                <div className="hm-shop-eyebrow">Employee Exclusive Offers</div>
                <h1 className="hm-shop-title">員工專屬優惠</h1>
              </div>
              <div className="hm-shop-count">目前 {products.filter(p => (p.category || "adult") === category).length} 款商品</div>
            </div>

            <div className="hm-category-tabs">
              {[ ["adult", "成人款式"], ["kids", "兒童款式"] ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`hm-category-btn ${category === key ? (key === "adult" ? "active-adult" : "active-kids") : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>

            </div>

            <div className="hm-product-scroll">
              <div className="hm-product-grid">
              {products.filter(p => (p.category || "adult") === category).length === 0 && (
                <div className="hm-empty">此分類目前無商品</div>
              )}
              {products.filter(p => (p.category || "adult") === category).map(p => {
                const categoryProducts = products.filter(x => (x.category || "adult") === category);
                const inCart = cart.find(c => c.id === p.id);
                const availableStock = getAvailableStock(p);
                const isLow = availableStock > 0 && availableStock <= 3;
                return (
                  <div key={p.id} className="hm-product-card" style={{ opacity: p.stock <= 0 ? .72 : 1, borderColor: isLow ? "#ff7043" : "rgba(226,232,240,.9)" }}>
                    <div className="hm-product-img" onClick={() => setSelectedProduct(p)}>
                      <div className="hm-product-rank">No.{String(categoryProducts.indexOf(p) + 1).padStart(2, "0")}</div>
                      {p.image
                        ? <img src={p.image} alt={p.name} />
                        : <GlassesPlaceholder name={p.name} />}
                      {p.stock <= 0 && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.58)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ border: "4px solid #c62828", borderRadius: 8, padding: "6px 14px", transform: "rotate(-16deg)", background: "rgba(255,255,255,0.86)", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
                            <span style={{ color: "#c62828", fontWeight: 950, fontSize: 22, letterSpacing: 3, fontFamily: "monospace", display: "block", lineHeight: 1 }}>已售完</span>
                          </div>
                        </div>
                      )}
                      {isLow && (
                        <div style={{ position: "absolute", top: 14, right: 14, background: "#ff7043", color: "white", fontSize: 11, fontWeight: 900, padding: "4px 9px", borderRadius: 999 }}>即將售完</div>
                      )}
                    </div>

                    <div className="hm-product-body">
                      <div className="hm-product-name">{p.name}</div>
                      <div className="hm-product-desc">{p.description || ""}</div>
                      <div className="hm-product-meta">
                        <span className="hm-product-price">${p.price}</span>
                        <span className="hm-product-stock" style={{ color: isLow ? "#ff7043" : "#64748b" }}>剩 {availableStock} 件{isLow ? " ⚠️" : ""}</span>
                      </div>
                      {p.stock > 0 && (
                        inCart ? (
                          <div className="hm-qty-bar">
                            <button className="hm-qty-btn" onClick={() => { if (inCart.qty <= 1) removeFromCart(p.id); else setCart(prev => prev.map(c => c.id === p.id ? { ...c, qty: c.qty - 1 } : c)); }} style={{ color: "#e53935" }}>−</button>
                            <span style={{ fontWeight: 900, color: "#111827", fontSize: 16 }}>{inCart.qty}</span>
                            <button className="hm-qty-btn" onClick={() => { if (availableStock > 0) setCart(prev => prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c)); }} style={{ color: availableStock <= 0 ? "#cbd5e1" : "#111827", cursor: availableStock <= 0 ? "not-allowed" : "pointer" }}>＋</button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(p)} className="hm-add-btn">加入購物車</button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Cart */}
      {page === "cart" && (
        <div>
          <style>{`
            .hm-cart-container {
              width: min(1120px, calc(100vw - 48px));
              margin: 0 auto;
            }
            .hm-cart-main {
              display: grid;
              grid-template-columns: minmax(0, 1.7fr) minmax(280px, .9fr);
              gap: 20px;
              align-items: stretch;
            }
            .hm-cart-left,
            .hm-cart-summary {
              border-radius: 24px;
              box-shadow: 0 14px 36px rgba(15,23,42,.12);
              overflow: hidden;
            }
            .hm-cart-left {
              background: linear-gradient(135deg, #f8fbff 0%, #e6eef5 100%);
              border: 1px solid rgba(203,213,225,.85);
              padding: 22px;
            }
            .hm-cart-summary {
              background: linear-gradient(135deg, #243b55 0%, #141e30 100%);
              color: #fff;
              padding: 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              min-height: 260px;
            }
            .hm-cart-section-title {
              margin: 0 0 16px;
              font-size: 18px;
              font-weight: 950;
              color: #0f172a;
              letter-spacing: .5px;
            }
            .hm-cart-summary .hm-cart-section-title {
              color: #fff;
              margin-bottom: 18px;
            }
            .hm-cart-item {
              display: grid;
              grid-template-columns: 180px minmax(0, 1fr) auto;
              gap: 20px;
              align-items: center;
              background: rgba(255,255,255,.78);
              border: 1px solid rgba(226,232,240,.95);
              border-radius: 20px;
              padding: 18px;
              margin-bottom: 14px;
              box-shadow: 0 8px 22px rgba(15,23,42,.07);
            }
            .hm-cart-imgbox {
              width: 180px;
              height: 132px;
              border-radius: 18px;
              overflow: hidden;
              flex-shrink: 0;
              background: #ffffff;
              border: 1px solid rgba(226,232,240,.9);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .hm-cart-imgbox img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              display: block;
            }
            .hm-cart-info-title {
              font-size: 20px;
              font-weight: 950;
              color: #0f172a;
              margin-bottom: 6px;
            }
            .hm-cart-info-sub {
              font-size: 14px;
              color: #64748b;
              line-height: 1.6;
            }
            .hm-cart-line-price {
              font-size: 22px;
              font-weight: 950;
              color: #111827;
              margin-bottom: 12px;
              text-align: right;
            }
            .hm-cart-actions {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              gap: 8px;
            }
            .hm-cart-qty-btn {
              width: 32px;
              height: 32px;
              border-radius: 999px;
              border: 1.5px solid #cbd5e1;
              background: #fff;
              cursor: pointer;
              font-weight: 900;
              font-size: 17px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .hm-cart-qty-btn:disabled {
              background: #f1f5f9;
              color: #cbd5e1;
              cursor: not-allowed;
            }
            .hm-cart-remove {
              background: rgba(239,68,68,.08);
              border: none;
              cursor: pointer;
              color: #ef5350;
              padding: 7px;
              border-radius: 999px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .hm-cart-summary-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid rgba(255,255,255,.14);
              color: rgba(255,255,255,.82);
              font-size: 14px;
              font-weight: 700;
            }
            .hm-cart-summary-total {
              margin-top: 22px;
            }
            .hm-cart-summary-total-label {
              color: rgba(255,255,255,.72);
              font-size: 13px;
              font-weight: 800;
              letter-spacing: 1.5px;
              margin-bottom: 8px;
            }
            .hm-cart-summary-total-value {
              color: #fff;
              font-size: 40px;
              font-weight: 950;
              line-height: 1;
              letter-spacing: -.5px;
            }
            .hm-cart-cta {
              width: 100%;
              margin-top: 18px;
              border: none;
              border-radius: 18px;
              padding: 16px 0;
              font-size: 17px;
              font-weight: 950;
              letter-spacing: 1px;
              color: #fff;
              cursor: pointer;
              background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
              box-shadow: 0 12px 28px rgba(17,24,39,.28);
              transition: transform .2s ease, box-shadow .2s ease;
            }
            .hm-cart-cta:hover {
              transform: translateY(-1px);
              box-shadow: 0 16px 36px rgba(17,24,39,.34);
            }
            .hm-cart-empty {
              text-align: center;
              padding: 60px;
              color: #94a3b8;
            }
            @media (max-width: 900px) {
              .hm-cart-container {
                width: calc(100% - 24px);
                margin: 0 auto;
              }
              .hm-cart-main {
                display: block;
              }
              .hm-cart-left {
                background: linear-gradient(135deg, #f8fbff 0%, #e6eef5 100%);
                border: 1px solid rgba(203,213,225,.82);
                box-shadow: 0 10px 26px rgba(15,23,42,.08);
                border-radius: 20px;
                padding: 14px;
              }
              .hm-cart-section-title {
                display: block;
                margin: 0 0 12px;
                font-size: 15px;
                font-weight: 950;
                color: #0f172a;
                letter-spacing: .5px;
              }
              .hm-cart-summary .hm-cart-section-title {
                color: #fff;
                margin-bottom: 12px;
              }
              .hm-cart-item {
                display: flex;
                align-items: center;
                gap: 12px;
                background: rgba(255,255,255,.9);
                border-radius: 18px;
                padding: 14px;
                margin-bottom: 12px;
                box-shadow: 0 8px 20px rgba(15,23,42,.08);
                border: 1px solid rgba(226,232,240,.9);
              }
              .hm-cart-item:last-child {
                margin-bottom: 0;
              }
              .hm-cart-imgbox {
                width: 76px;
                height: 76px;
                border-radius: 16px;
                border: 1px solid rgba(226,232,240,.9);
                overflow: hidden;
                background: #fff;
              }
              .hm-cart-imgbox img {
                object-fit: contain;
              }
              .hm-cart-info {
                flex: 1;
                min-width: 0;
              }
              .hm-cart-info-title {
                font-weight: 950;
                color: #0f172a;
                font-size: 15px;
                margin-bottom: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .hm-cart-info-sub {
                font-size: 12px;
                color: #64748b;
                line-height: 1.4;
              }
              .hm-cart-right-mobile {
                display: flex;
                align-items: flex-end;
                gap: 8px;
              }
              .hm-cart-line-price {
                font-weight: 950;
                color: #0f172a;
                margin-right: 0;
                margin-bottom: 8px;
                font-size: 18px;
                text-align: right;
              }
              .hm-cart-actions {
                justify-content: flex-start;
                gap: 7px;
              }
              .hm-cart-qty-btn {
                width: 30px;
                height: 30px;
                font-size: 16px;
                box-shadow: 0 2px 8px rgba(15,23,42,.08);
              }
              .hm-cart-remove {
                background: rgba(239,68,68,.08);
                padding: 6px;
              }
              .hm-cart-summary {
                background: linear-gradient(135deg, #243b55 0%, #141e30 100%);
                border-radius: 20px;
                padding: 18px 20px;
                margin-top: 14px;
                display: block;
                min-height: unset;
                box-shadow: 0 12px 28px rgba(20,30,48,.18);
              }
              .hm-cart-summary-head {
                display: block;
              }
              .hm-cart-summary-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255,255,255,.12);
                color: rgba(255,255,255,.82);
                font-size: 13px;
                font-weight: 700;
              }
              .hm-cart-summary-total {
                margin-top: 14px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
              }
              .hm-cart-summary-total-label {
                color: rgba(255,255,255,.82);
                font-weight: 800;
                font-size: 15px;
                margin-bottom: 3px;
                letter-spacing: 1px;
              }
              .hm-cart-summary-total-value {
                color: white;
                font-size: 28px;
                font-weight: 950;
              }
              .hm-cart-cta {
                background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
                border-radius: 18px;
                box-shadow: 0 12px 28px rgba(17,24,39,.24);
                margin-top: 14px;
                padding: 15px 0;
                font-size: 16px;
              }
            }
          `}</style>
          {cart.length === 0 ? (
            <div className="hm-cart-empty">
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p>購物車是空的，快去挑選吧！</p>
              <button onClick={() => setPage("shop")} style={btnStyle("#2196F3")}>去逛逛</button>
            </div>
          ) : (
            <div className="hm-cart-container">
              <div className="hm-cart-main">
                <section className="hm-cart-left">
                  <h3 className="hm-cart-section-title">商品明細</h3>
                  {cart.map(item => {
                    const product = products.find(p => p.id === item.id);
                    const maxStock = product ? product.stock + item.qty : item.qty;
                    return (
                      <div key={item.id} className="hm-cart-item">
                        <div className="hm-cart-imgbox">
                          {item.image
                            ? <img src={item.image} alt={item.name} />
                            : <GlassesPlaceholder name="" />}
                        </div>
                        <div className="hm-cart-info">
                          <div className="hm-cart-info-title">{item.name}</div>
                          <div className="hm-cart-info-sub">單價 ${item.price} × {item.qty}</div>
                        </div>
                        <div className="hm-cart-right-mobile">
                          <div>
                            <div className="hm-cart-line-price">${item.price * item.qty}</div>
                            <div className="hm-cart-actions">
                              <button
                                className="hm-cart-qty-btn"
                                onClick={() => {
                                  if (item.qty <= 1) removeFromCart(item.id);
                                  else setCart(prev => prev.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c));
                                }}
                                style={{ color: "#ef5350" }}
                              >−</button>
                              <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                              <button
                                className="hm-cart-qty-btn"
                                disabled={item.qty >= maxStock}
                                onClick={() => {
                                  if (item.qty >= maxStock) return;
                                  setCart(prev => prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
                                }}
                                style={{ color: item.qty >= maxStock ? "#cbd5e1" : "#1565C0" }}
                              >+</button>
                              <button onClick={() => removeFromCart(item.id)} className="hm-cart-remove"><IconTrash /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>
                <aside className="hm-cart-summary">
                  <div className="hm-cart-summary-head">
                    <h3 className="hm-cart-section-title">訂單摘要</h3>
                    <div className="hm-cart-summary-row">
                      <span>商品件數</span>
                      <strong>{cartCount} 件</strong>
                    </div>
                    <div className="hm-cart-summary-row">
                      <span>商品款式</span>
                      <strong>{cart.length} 款</strong>
                    </div>
                  </div>
                  <div className="hm-cart-summary-total">
                    <div className="hm-cart-summary-total-label">合計</div>
                    <div className="hm-cart-summary-total-value">${cartTotal}</div>
                  </div>
                </aside>
              </div>
              <button onClick={() => setPage("form")} className="hm-cart-cta">前往填寫資料 →</button>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      {page === "form" && (
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <h3 style={{ margin: "0 0 20px", color: "#1a2b3c", fontSize: 18 }}>填寫員工資訊</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#455a64", marginBottom: 6 }}>姓名 *</label>
              <input
                value={form.name}
                onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                placeholder="請輸入您的姓名"
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#2196F3"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#455a64", marginBottom: 6 }}>工號 * <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>(8碼數字)</span></label>
              <input
                value={form.employeeId}
                onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 8); setForm(f => ({ ...f, employeeId: v })); }}
                placeholder="請輸入8碼員工工號"
                inputMode="numeric"
                maxLength={8}
                style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${form.employeeId.length > 0 && form.employeeId.length < 8 ? "#ff7043" : "#e2e8f0"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", letterSpacing: "2px" }}
                onFocus={e => e.target.style.borderColor = "#2196F3"}
                onBlur={e => e.target.style.borderColor = form.employeeId.length > 0 && form.employeeId.length < 8 ? "#ff7043" : "#e2e8f0"}
              />
              {form.employeeId.length > 0 && form.employeeId.length < 8 && (
                <div style={{ fontSize: 11, color: "#ff7043", marginTop: 4 }}>⚠️ 工號需為8碼，目前已輸入 {form.employeeId.length} 碼</div>
              )}
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px", marginTop: 4, marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>訂單明細：</div>
              {cart.map(c => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#475569", padding: "2px 0" }}>
                  <span>{c.name} × {c.qty}</span><span>${c.price * c.qty}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#1a2b3c" }}>
                <span>總計</span><span>${cartTotal}</span>
              </div>
              <div style={{ marginTop: 12, padding: "12px 14px", background: "#fff3e0", borderRadius: 8, fontSize: 14, color: "#bf360c", lineHeight: 1.9, borderLeft: "3px solid #FF6D00" }}>
                📌 本次活動為員工內部特賣出清，商品均以優惠價提供，<span style={{ fontWeight: 900, textDecoration: "underline", fontSize: 16, color: "#e53935" }}>「售出後恕不提供保固、退換貨服務」</span>，敬請於購買前確認款式，謝謝您的理解與配合。
              </div>
            </div>
            <button
              onClick={submitOrder}
              disabled={!form.name.trim() || form.employeeId.length !== 8 || submitting}
              style={{ ...btnStyle("#e53935"), width: "100%", padding: "14px 0", fontSize: 16, opacity: (!form.name.trim() || form.employeeId.length !== 8 || submitting) ? 0.5 : 1, cursor: (!form.name.trim() || form.employeeId.length !== 8 || submitting) ? "not-allowed" : "pointer" }}>
              {submitting ? "送出中..." : "確認送出訂單"}
            </button>
          </div>
        </div>
      )}

      {/* 浮動結帳按鈕 */}
      {page === "shop" && cartCount > 0 && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 500 }}>
          <style>{`@keyframes floatUp { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
          <button onClick={() => setPage("cart")} style={{ background: "linear-gradient(135deg, #1a2b3c, #2d4a6b)", color: "white", border: "none", borderRadius: 50, padding: "15px 32px", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 28px rgba(26,43,60,0.45)", display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap", animation: "floatUp 0.3s ease" }}>
            <IconCart />
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "2px 10px", fontSize: 14, fontWeight: 900 }}>{cartCount} 件</span>
            <span style={{ fontWeight: 900, color: "#ff8a80" }}>${cartTotal}</span>
            <span>前往結帳 →</span>
          </button>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
          onClick={() => setSelectedProduct(null)}>
          <div style={{ background: "white", borderRadius: 20, maxWidth: 360, width: "100%", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ height: 220, overflow: "hidden" }}>
              {selectedProduct.image
                ? <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <GlassesPlaceholder name={selectedProduct.name} />}
            </div>
            <div style={{ padding: 24 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#1a2b3c" }}>{selectedProduct.name}</h3>
              <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: 14 }}>{selectedProduct.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#e53935" }}>${selectedProduct.price}</span>
                <span style={{ color: "#78909c", fontSize: 14 }}>庫存：{selectedProduct.stock} 件</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setSelectedProduct(null)} style={{ ...btnStyle("#78909c", true), flex: 1 }}>關閉</button>
                {selectedProduct.stock > 0 && (
                  <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} style={{ ...btnStyle("#4b5563"), flex: 2 }}>加入購物車</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN VIEW ────────────────────────────────────────────────────────────────
function AdminView({ products, setProducts, orders, setOrders, adminPwd, setAdminPwd, archiveOrder, archivedOrders, setArchivedOrders, superPwd, setSuperPwd }) {
  const [tab, setTab] = useState("orders");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 100, stock: 1, image: null });
  const [showPwdChange, setShowPwdChange] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [showSuperPwdChange, setShowSuperPwdChange] = useState(false);
  const [newSuperPwd, setNewSuperPwd] = useState("");
  const [confirmSuperPwd, setConfirmSuperPwd] = useState("");
  const [superPwdMsg, setSuperPwdMsg] = useState("");
  const [archiveModal, setArchiveModal] = useState(null);
  // archiveModal: { idx, inputId, error, isBulkDelete, returnStock }
  const [confirmModal, setConfirmModal] = useState(null);
  const [orderFilter, setOrderFilter] = useState("全部");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const fileRef = useRef();
  const editFileRef = useRef();

  const saveSuperPwd = () => {
    if (newSuperPwd.length < 6) { setSuperPwdMsg("超級密碼至少需要 6 個字元"); return; }
    if (newSuperPwd !== confirmSuperPwd) { setSuperPwdMsg("兩次密碼不一致"); return; }
    setSuperPwd(newSuperPwd);
    setNewSuperPwd(""); setConfirmSuperPwd("");
    setSuperPwdMsg("✅ 授權密碼已更新！");
    setTimeout(() => { setSuperPwdMsg(""); setShowSuperPwdChange(false); }, 2000);
  };

  const savePwd = () => {
    if (newPwd.length < 6) { setPwdMsg("密碼至少需要 6 個字元"); return; }
    if (newPwd !== confirmPwd) { setPwdMsg("兩次密碼不一致"); return; }
    setAdminPwd(newPwd);
    setNewPwd(""); setConfirmPwd("");
    setPwdMsg("✅ 密碼已更新！");
    setTimeout(() => { setPwdMsg(""); setShowPwdChange(false); }, 2000);
  };

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (isEdit) setEditingProduct(p => ({ ...p, image: ev.target.result }));
      else setNewProduct(p => ({ ...p, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const addProduct = () => {
    if (!newProduct.name.trim()) return;
    const p = { ...newProduct, id: Date.now(), price: Number(newProduct.price), stock: Number(newProduct.stock) };
    setProducts([...products, p]);
    setNewProduct({ name: "", description: "", price: 100, stock: 1, image: null });
    setShowAddForm(false);
  };

  const saveEdit = () => {
    setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, price: Number(editingProduct.price), stock: Number(editingProduct.stock) } : p));
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    setConfirmModal({
      title: "確定刪除此商品？",
      message: "刪除後無法復原，請確認。",
      onConfirm: () => {
        setProducts(products.filter(p => p.id !== id));
        setConfirmModal(null);
      }
    });
  };

  const updateOrderStatus = (idx, status) => {
    // 選擇「刪除此筆訂單」→ 觸發刪除彈窗
    if (status === "🗑 刪除此筆訂單") {
      setArchiveModal({ idx, inputId: "", error: "", returnStock: false, isBulkDelete: false });
      return;
    }
    const updated = [...orders];
    updated[idx] = { ...updated[idx], status };
    setOrders(updated);
  };

  const statusColor = {
    "待處理": "#FF9800",
    "備貨中": "#2196F3",
    "已完成訂單": "#4CAF50",
    "🗑 刪除此筆訂單": "#455a64"
  };

  const statusBg = {
    "待處理": "#fff8e1",
    "備貨中": "#e3f2fd",
    "已完成訂單": "#e8f5e9",
    "🗑 刪除此筆訂單": "#eceff1"
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1a2b3c" }}>🔧 管理後台</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setShowPwdChange(!showPwdChange); setShowSuperPwdChange(false); }} style={{ ...btnStyle("#78909c", true), fontSize: 12, padding: "6px 12px" }}>🔑 修改密碼</button>
          <button onClick={() => { setShowSuperPwdChange(!showSuperPwdChange); setShowPwdChange(false); }} style={{ ...btnStyle("#c62828", true), fontSize: 12, padding: "6px 12px" }}>⭐ 授權密碼</button>
        </div>
      </div>

      {showSuperPwdChange && (
        <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 18, border: "2px solid #ffcdd2", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h4 style={{ margin: "0 0 6px", color: "#c62828", fontSize: 15 }}>⭐ 修改授權密碼</h4>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#78909c" }}>僅供系統管理員使用。</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>現有授權密碼</label>
              <input type="password" value={newProduct.currentSuperPwd || ""} onChange={e => setNewProduct(p => ({ ...p, currentSuperPwd: e.target.value }))} placeholder="請先輸入現有授權密碼"
                style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #ffcdd2", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>新授權密碼（至少6碼）</label>
              <input type="password" value={newSuperPwd} onChange={e => setNewSuperPwd(e.target.value)} placeholder="輸入新授權密碼"
                style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #ffcdd2", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>確認新授權密碼</label>
              <input type="password" value={confirmSuperPwd} onChange={e => setConfirmSuperPwd(e.target.value)} placeholder="再輸入一次"
                style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #ffcdd2", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={() => {
              if (newProduct.currentSuperPwd !== superPwd) { setSuperPwdMsg("現有授權密碼錯誤"); return; }
              saveSuperPwd();
              setNewProduct(p => ({ ...p, currentSuperPwd: "" }));
            }} style={{ ...btnStyle("#c62828"), padding: "8px 16px", fontSize: 13 }}>儲存</button>
          </div>
          {superPwdMsg && <div style={{ marginTop: 8, fontSize: 13, color: superPwdMsg.startsWith("✅") ? "#4CAF50" : "#e53935" }}>{superPwdMsg}</div>}
        </div>
      )}

      {showPwdChange && (
        <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 18, border: "1.5px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h4 style={{ margin: "0 0 12px", color: "#1a2b3c", fontSize: 15 }}>修改管理員密碼</h4>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>新密碼（至少6碼）</label>
              <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="輸入新密碼"
                style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>確認新密碼</label>
              <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="再輸入一次"
                style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={savePwd} style={{ ...btnStyle("#4CAF50"), padding: "8px 16px", fontSize: 13 }}>儲存</button>
          </div>
          {pwdMsg && <div style={{ marginTop: 8, fontSize: 13, color: pwdMsg.startsWith("✅") ? "#4CAF50" : "#e53935" }}>{pwdMsg}</div>}
        </div>
      )}

      {/* 儀表板 */}
      {(() => {
        const total = orders.length;
        const pending = orders.filter(o => (o.status || "待處理") === "待處理").length;
        const inProgress = orders.filter(o => o.status === "備貨中").length;
        const done = orders.filter(o => o.status === "已完成訂單").length;
        const cancelled = orders.filter(o => o.status === "已取消").length;
        const revenue = orders.filter(o => o.status !== "已取消").reduce((s, o) => s + o.total, 0);
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= 3);
        return (
          <div style={{ background: "linear-gradient(135deg, #0f1f2e 0%, #1a2f45 50%, #0d1e2c 100%)", borderRadius: 20, padding: "16px 18px", marginBottom: 20, boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
            {/* 標題列 + 總營收同一行 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>📊</span>
                <span style={{ color: "#90CAF9", fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>營運總覽</span>
                <span style={{ color: "#ffffff", fontSize: 12, marginLeft: 4, opacity: 0.7 }}>共 {total} 筆</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#ffffff", fontSize: 11, letterSpacing: 1, opacity: 0.7 }}>總營收</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1 }}>${revenue.toLocaleString()}</div>
              </div>
            </div>

            {/* 4個狀態 - 一排顯示 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { label: "待處理", value: pending, color: "#FFD54F", bg: "rgba(255,213,79,0.12)", border: "rgba(255,213,79,0.3)", icon: "⏳" },
                { label: "備貨中", value: inProgress, color: "#4DD0E1", bg: "rgba(77,208,225,0.12)", border: "rgba(77,208,225,0.3)", icon: "📦" },
                { label: "已完成", value: done, color: "#69F0AE", bg: "rgba(105,240,174,0.12)", border: "rgba(105,240,174,0.3)", icon: "✅" },
                { label: "已取消", value: cancelled, color: "#FF8A80", bg: "rgba(255,138,128,0.12)", border: "rgba(255,138,128,0.3)", icon: "❌" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "12px 8px", border: `1.5px solid ${s.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ color: "#B0BEC5", fontSize: 12, marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* 庫存警示 */}
            {lowStock.length > 0 && (
              <div style={{ marginTop: 12, background: "rgba(255,112,67,0.1)", borderRadius: 12, padding: "10px 14px", border: "1.5px solid rgba(255,112,67,0.25)" }}>
                <div style={{ color: "#ff8a65", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>⚠️ 庫存警示 — 剩餘 ≤ 3 件</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {lowStock.map(p => (
                    <span key={p.id} style={{ background: "rgba(255,112,67,0.2)", color: "#ffccbc", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                      {p.name} · 剩 {p.stock} 件
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {[
          ["orders",   <IconOrders />, "訂單管理",    "#ffffff", "#1565C0", "#1976D2"],
          ["top3",     "🏆",          "熱賣TOP3",    "#ffffff", "#E65100", "#F57F17"],
          ["archived", "🗑",          "刪除訂單紀錄","#ffffff", "#37474f", "#546e7a"],
          ["inventory",<IconPackage />,"商品管理",    "#ffffff", "#c62828", "#e53935"],
        ].map(([key, icon, label, textColor, bgColor, activeBg]) => {
          const isInventory = key === "inventory";
          const isActive = tab === key;
          return (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
            padding: "12px 4px", borderRadius: 12,
            border: `2.5px solid ${isActive ? bgColor : isInventory ? bgColor : bgColor + "88"}`,
            cursor: "pointer", fontWeight: 700, transition: "all 0.2s",
            background: isActive ? bgColor : isInventory ? bgColor + "cc" : bgColor + "18",
            color: isActive ? "#ffffff" : isInventory ? "#ffffff" : bgColor,
            boxShadow: isActive ? `0 4px 14px ${bgColor}44` : "none",
            transform: isActive ? "translateY(-2px)" : "none"
          }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: 12, fontWeight: 800, marginTop: 2 }}>{label}</span>
          </button>
          );
        })}
      </div>
      {tab === "orders" && (
        <div>
          {/* 篩選器 + 操作按鈕 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#94a3b8", marginRight: 2 }}>篩選：</span>
              {["全部", "待處理", "備貨中", "已完成訂單"].map(f => {
                const count = f === "全部" ? orders.length : orders.filter(o => (o.status || "待處理") === f).length;
                const isActive = orderFilter === f;
                const color = statusColor[f] || "#1a2b3c";
                return (
                  <button key={f} onClick={() => setOrderFilter(f)}
                    style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${isActive ? color : "#e2e8f0"}`, background: isActive ? color : "white", color: isActive ? "white" : "#94a3b8", fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
                    {f} · {count}
                  </button>
                );
              })}
            </div>

          </div>

          {orders.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>📥 選擇匯出狀態：</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["全部", "待處理", "備貨中", "已完成訂單"].map(status => (
                  <button key={status} onClick={() => {
                    const filtered = status === "全部" ? orders : orders.filter(o => (o.status || "待處理") === status);
                    if (filtered.length === 0) { alert(`目前沒有「${status}」的訂單`); return; }

                    const header = "訂單編號,日期,姓名,工號,商品,數量,總金額,狀態";
                    const rows = filtered.map(o => {
                      return o.items.map((item, i) => {
                        if (i === 0) {
                          // First item - include order info
                          return `${o.orderNo || ""},${o.date},${o.name},${o.employeeId},${item.name},${item.qty},$${o.total},${o.status || "待處理"}`;
                        } else {
                          // Subsequent items - only show product info
                          return `,,,,${item.name},${item.qty},,`;
                        }
                      }).join("\n");
                    }).join("\n");

                    const csv = "\uFEFF" + header + "\n" + rows;
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    const dateStr = new Date().toLocaleDateString("zh-TW").replace(/\//g, "");
                    a.download = `華美光學訂單_${status}_${dateStr}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  }} style={{ ...btnStyle("#4CAF50"), fontSize: 12, padding: "6px 14px", display: "flex", alignItems: "center", gap: 4 }}>
                    📥 {status}
                  </button>
                ))}
              </div>
            </div>
          )}
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <p>目前還沒有訂單</p>
            </div>
          ) : (() => {
            const filtered = orders.map((o, i) => ({ ...o, _idx: i }))
              .filter(o => orderFilter === "全部" || (o.status || "待處理") === orderFilter)
              .sort((a, b) => (a.orderNo || "").localeCompare(b.orderNo || ""));
            if (filtered.length === 0) return (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                <p>此狀態目前沒有訂單</p>
              </div>
            );
            return filtered.map((order) => {
              const idx = order._idx;
              return (
                <div key={idx} style={{ background: "white", borderRadius: 16, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", borderLeft: `5px solid ${statusColor[order.status || "待處理"]}`,  }}>
                  {/* 訂單頂部：編號 + 狀態 */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: statusBg[order.status || "待處理"] }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

                      <div style={{ fontSize: 13, fontWeight: 800, color: statusColor[order.status || "待處理"], letterSpacing: 0.5 }}>#{order.orderNo || "—"}</div>
                    </div>
                    <select value={order.status || "待處理"} onChange={e => updateOrderStatus(idx, e.target.value)}
                      style={{ padding: "6px 12px", borderRadius: 20, border: `2px solid ${statusColor[order.status || "待處理"]}`, color: statusColor[order.status || "待處理"], fontWeight: 800, fontSize: 13, cursor: "pointer", outline: "none", background: "white", minWidth: 120 }}>
                      {["待處理", "備貨中", "已完成訂單", "🗑 刪除此筆訂單"].map(s => (
                        <option key={s} value={s} style={{ color: statusColor[s], background: statusBg[s], fontWeight: 600 }}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* 員工資訊 */}
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 20 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>姓名</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#1a2b3c" }}>{order.name}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>工號</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#1a2b3c" }}>{order.employeeId}</div>
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>下單時間</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{order.date}</div>
                    </div>
                  </div>
                  {order.status === "已取消" && order.cancelledBy && (
                    <div style={{ padding: "8px 16px", background: "#ffebee", borderTop: "1px solid #ffcdd2", display: "flex", gap: 16 }}>
                      <div>
                        <span style={{ fontSize: 11, color: "#e57373" }}>取消者工號：</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#c62828" }}>{order.cancelledBy}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 11, color: "#e57373" }}>取消時間：</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#c62828" }}>{order.cancelledAt}</span>
                      </div>
                    </div>
                  )}

                  {/* 商品明細 */}
                  <div style={{ padding: "10px 16px" }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < order.items.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                        <div style={{ width: 70, height: 70, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                          {item.image
                            ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <GlassesPlaceholder name="" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#1a2b3c" }}>{item.name}</div>
                          <div style={{ fontSize: 13, color: "#78909c", marginTop: 3 }}>數量：{item.qty} 件</div>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: "#e53935" }}>${item.price * item.qty}</div>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ fontWeight: 900, color: "#e53935", fontSize: 18 }}>總計 ${order.total}</div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Inventory Tab */}
      {tab === "inventory" && (
        <div>
          {/* 商品管理警示提示 */}
          <div style={{ background: "linear-gradient(135deg, #fff3e0, #fff8e1)", borderRadius: 14, padding: "12px 16px", marginBottom: 18, border: "2px solid #FFB300", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 800, color: "#E65100", fontSize: 14, marginBottom: 4 }}>商品管理注意事項</div>
              <div style={{ fontSize: 13, color: "#795548", lineHeight: 1.7 }}>
                此頁面僅供新增商品或補貨時調整庫存使用。<br/>
                若非特殊情況，請勿隨意修改庫存數量，以免影響實際銷售紀錄的準確性。
              </div>
            </div>
          </div>

          <button onClick={() => setShowAddForm(!showAddForm)} style={{ ...btnStyle("#2196F3"), display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
            <IconPlus /> 新增商品
          </button>

          {/* Add Form */}
          {showAddForm && (
            <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 18, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", border: "2px solid #e3f2fd" }}>
              <h4 style={{ margin: "0 0 16px", color: "#1a2b3c" }}>新增商品</h4>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>商品分類 *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["adult", "成人款式", "#1565C0", "#e3f2fd"], ["kids", "兒童款式", "#c62828", "#fce4ec"]].map(([val, lbl, activeColor, activeBg]) => (
                    <button key={val} onClick={() => setNewProduct(p => ({ ...p, category: val }))} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `2px solid ${(newProduct.category || "adult") === val ? activeColor : "#e2e8f0"}`, background: (newProduct.category || "adult") === val ? activeBg : "white", color: (newProduct.category || "adult") === val ? activeColor : "#94a3b8", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>{lbl}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                {[
                  { label: "商品名稱 *", key: "name", placeholder: "款式 A" },
                  { label: "說明", key: "description", placeholder: "經典黑框" },
                  { label: "價格", key: "price", placeholder: "100", type: "number" },
                  { label: "庫存", key: "stock", placeholder: "5", type: "number" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>{f.label}</label>
                    <input type={f.type || "text"} value={newProduct[f.key]} onChange={e => setNewProduct(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                      style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>商品圖片</label>
                <input type="file" accept="image/*" ref={fileRef} onChange={(e) => handleImageUpload(e)} style={{ display: "none" }} />
                <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed #cbd5e1", borderRadius: 10, padding: 16, textAlign: "center", cursor: "pointer", background: newProduct.image ? "#f0fdf4" : "#f8fafc" }}>
                  {newProduct.image
                    ? <img src={newProduct.image} alt="preview" style={{ maxHeight: 80, maxWidth: "100%", borderRadius: 6 }} />
                    : <><IconUpload /><div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>點擊上傳圖片</div></>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowAddForm(false)} style={{ ...btnStyle("#78909c", true), flex: 1 }}>取消</button>
                <button onClick={addProduct} style={{ ...btnStyle("#2196F3"), flex: 2 }}>新增</button>
              </div>
            </div>
          )}

          {/* Product List with drag sorting */}
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>☰ 長按拖曳可調整商品順序</div>
          {products.map((p, index) => (
            <div key={p.id}
              draggable
              onDragStart={e => { e.dataTransfer.setData("dragIndex", index); }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                const from = parseInt(e.dataTransfer.getData("dragIndex"));
                const to = index;
                if (from === to) return;
                const newProducts = [...products];
                const [moved] = newProducts.splice(from, 1);
                newProducts.splice(to, 0, moved);
                setProducts(newProducts);
              }}
              style={{ background: "white", borderRadius: 14, padding: "12px 14px", marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14, cursor: "grab", userSelect: "none" }}>
              <div style={{ color: "#cbd5e1", fontSize: 18, flexShrink: 0 }}>⠿</div>
              <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <GlassesPlaceholder name="" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#1a2b3c", fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{p.description}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#e53935" }}>${p.price}</span>
                  <span style={{ fontSize: 12, color: p.stock <= 3 ? "#ff7043" : "#78909c" }}>庫存 {p.stock}{p.stock <= 3 && p.stock > 0 ? " ⚠️" : ""}</span>
                  <span style={{ fontSize: 11, color: p.category === "kids" ? "#c62828" : "#1565C0", fontWeight: 600 }}>{p.category === "kids" ? "兒童" : "成人"}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEditingProduct({ ...p })} style={{ ...btnStyle("#455a64", true), padding: "6px 10px", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><IconEdit />編輯</button>
                <button onClick={() => deleteProduct(p.id)} style={{ ...btnStyle("#ef5350", true), padding: "6px 10px", fontSize: 12 }}>刪除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOP3 Tab */}
      {tab === "top3" && (() => {
        const salesMap = {};
        orders.forEach(o => {
          if (o.status === "已取消") return;
          (o.items || []).forEach(item => {
            salesMap[item.id] = (salesMap[item.id] || { name: item.name, qty: 0, image: item.image });
            salesMap[item.id].qty += item.qty;
          });
        });
        const sorted = Object.values(salesMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
        // Assign ranks handling ties
        let rank = 1;
        const top3 = [];
        for (let i = 0; i < sorted.length; i++) {
          if (i > 0 && sorted[i].qty < sorted[i-1].qty) rank = i + 1;
          if (rank > 3) break;
          top3.push({ ...sorted[i], rank });
        }
        const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
        const medalColors = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
        return (
          <div>
            <div style={{ background: "linear-gradient(135deg, #1a2b3c, #2d4a6b)", borderRadius: 16, padding: "16px 20px", marginBottom: 20, color: "white" }}>
              <div style={{ fontSize: 13, opacity: 0.8 }}>統計自所有已成立訂單（不含已取消）</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>🏆 熱賣商品 TOP 3</div>
            </div>
            {top3.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
                <p>目前還沒有訂單資料</p>
              </div>
            ) : (
              top3.map((item, i) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 16, background: "white", borderRadius: 16, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `2px solid ${medalColors[item.rank]}22` }}>
                  <div style={{ fontSize: 36, width: 44, textAlign: "center" }}>{medals[item.rank]}</div>
                  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <GlassesPlaceholder name="" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#1a2b3c", fontSize: 15 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: "#78909c", marginTop: 2 }}>累計銷售</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: medalColors[item.rank] }}>{item.qty}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>件</div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ position: "absolute" }} />
                </div>
              ))
            )}
            {top3.length > 0 && (
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 16px", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>銷售比例</div>
                {top3.map((item, i) => {
                  const max = top3[0].qty;
                  return (
                    <div key={item.name} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#475569", marginBottom: 4 }}>
                        <span>{medals[item.rank]} {item.name}</span><span>{item.qty} 件</span>
                      </div>
                      <div style={{ background: "#e2e8f0", borderRadius: 99, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${(item.qty / max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${medalColors[item.rank]}, ${medalColors[item.rank]}99)`, borderRadius: 99, transition: "width 0.5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* Archived Tab */}
      {tab === "archived" && (
        <div>
          <div style={{ background: "linear-gradient(135deg, #37474f, #546e7a)", borderRadius: 16, padding: "14px 20px", marginBottom: 20, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>封存的訂單永久保存，不會影響庫存</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>🗑 刪除訂單紀錄（{archivedOrders.length} 筆）</div>
            </div>
            {archivedOrders.length > 0 && (
              <button onClick={() => setConfirmModal({
                title: "清除所有刪除紀錄",
                message: "請輸入超級密碼確認：",
                isPasswordMode: true,
                inputVal: "",
                error: "",
                onConfirm: (pwd) => {
                  if (pwd !== superPwd) {
                    setConfirmModal(m => ({ ...m, error: "授權密碼錯誤，請重試" }));
                    return;
                  }
                  setArchivedOrders([]);
                  setConfirmModal(null);
                }
              })} style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.4)", color: "white", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                🗑 清除所有紀錄
              </button>
            )}
          </div>
          {archivedOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗄</div>
              <p>目前沒有封存的訂單</p>
            </div>
          ) : (
            [...archivedOrders].reverse().map((order, i) => (
              <div key={i} style={{ background: "white", borderRadius: 16, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", borderLeft: "5px solid #b0bec5", opacity: 0.9 }}>
                {/* 頂部：訂單編號 + 已刪除標籤 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#eceff1" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#546e7a" }}>#{order.orderNo || "—"}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {order.stockReturned
                      ? <span style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: "1px solid #a5d6a7" }}>✅ 庫存已退回</span>
                      : <span style={{ background: "#fff3e0", color: "#e65100", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: "1px solid #ffcc80" }}>⛔ 庫存未退回</span>
                    }
                    <span style={{ background: "#cfd8dc", color: "#455a64", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>已刪除</span>
                  </div>
                </div>

                {/* 員工資訊 */}
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 80 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>姓名</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#455a64" }}>{order.name}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 80 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>工號</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#455a64" }}>{order.employeeId}</div>
                  </div>
                  <div style={{ flex: 2, minWidth: 140 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>下單時間</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#78909c" }}>{order.date}</div>
                  </div>
                </div>

                {/* 刪除資訊 */}
                <div style={{ padding: "8px 16px", background: "#fafafa", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>刪除者工號</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e53935" }}>{order.archivedBy}</div>
                  </div>
                  <div style={{ flex: 2, minWidth: 140 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>刪除時間</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#78909c" }}>{order.archivedAt}</div>
                  </div>
                </div>

                {/* 商品明細 */}
                <div style={{ padding: "10px 16px" }}>
                  {order.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0", borderBottom: j < order.items.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <div style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        {item.image
                          ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <GlassesPlaceholder name="" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#546e7a" }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>數量：{item.qty} 件</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#90a4ae" }}>${item.price * item.qty}</div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ fontWeight: 900, color: "#90a4ae", fontSize: 16 }}>總計 ${order.total}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Order Modal */}
      {archiveModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
          onClick={() => setArchiveModal(null)}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, maxWidth: 360, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🗑</div>
              <h3 style={{ margin: 0, color: "#1a2b3c", fontSize: 18 }}>
                {archiveModal.isBulkDelete ? `確定刪除 ${selectedOrders.size} 筆訂單？` : "確認刪除此筆訂單"}
              </h3>
              <p style={{ color: "#78909c", fontSize: 13, marginTop: 6 }}>
                訂單將移至「刪除訂單紀錄」備查
              </p>
            </div>

            {/* 庫存選項 */}
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2b3c", marginBottom: 10 }}>庫存處理方式：</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="radio" name="returnStock" checked={!archiveModal.returnStock}
                    onChange={() => setArchiveModal(m => ({ ...m, returnStock: false }))}
                    style={{ width: 16, height: 16, accentColor: "#1565C0" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2b3c" }}>庫存不退回</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>商品已備貨或其他原因</div>
                  </div>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="radio" name="returnStock" checked={archiveModal.returnStock}
                    onChange={() => setArchiveModal(m => ({ ...m, returnStock: true }))}
                    style={{ width: 16, height: 16, accentColor: "#4CAF50" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2b3c" }}>庫存退回</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>訂單取消，商品放回庫存</div>
                  </div>
                </label>
              </div>
            </div>

            {/* 工號輸入 */}
            <div style={{ marginBottom: 6 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>請輸入您的8碼工號確認身份</label>
              <input
                value={archiveModal.inputId}
                onChange={e => setArchiveModal(m => ({ ...m, inputId: e.target.value.replace(/\D/g, "").slice(0, 8), error: "" }))}
                placeholder="請輸入8碼工號"
                inputMode="numeric"
                maxLength={8}
                style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${archiveModal.error ? "#ef5350" : "#e2e8f0"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", letterSpacing: 2 }}
              />
            </div>
            {archiveModal.error && <div style={{ color: "#ef5350", fontSize: 12, marginBottom: 10 }}>{archiveModal.error}</div>}

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => setArchiveModal(null)} style={{ ...btnStyle("#78909c", true), flex: 1 }}>取消</button>
              <button onClick={() => {
                if (archiveModal.inputId.length !== 8) { setArchiveModal(m => ({ ...m, error: "請輸入完整8碼工號" })); return; }
                const now = new Date().toLocaleString("zh-TW");

                if (archiveModal.isBulkDelete) {
                  const toDelete = [...selectedOrders];
                  // Handle return stock for bulk
                  if (archiveModal.returnStock) {
                    const updatedProducts = [...products];
                    toDelete.forEach(i => {
                      orders[i].items.forEach(item => {
                        const idx2 = updatedProducts.findIndex(p => p.id === item.id);
                        if (idx2 >= 0) updatedProducts[idx2] = { ...updatedProducts[idx2], stock: updatedProducts[idx2].stock + item.qty };
                      });
                    });
                    setProducts(updatedProducts);
                  }
                  const newArchived = toDelete.map(i => ({
                    ...orders[i], archivedAt: now, archivedBy: archiveModal.inputId.trim(),
                    stockReturned: archiveModal.returnStock
                  }));
                  setArchivedOrders([...archivedOrders, ...newArchived]);
                  setOrders(orders.filter((_, i) => !selectedOrders.has(i)));
                  setSelectedOrders(new Set());
                  setSelectMode(false);
                } else {
                  // Single order delete
                  if (archiveModal.returnStock) {
                    const order = orders[archiveModal.idx];
                    const updatedProducts = products.map(p => {
                      const orderItem = order.items.find(item => item.id === p.id);
                      if (orderItem) return { ...p, stock: p.stock + orderItem.qty };
                      return p;
                    });
                    setProducts(updatedProducts);
                  }
                  archiveOrder(archiveModal.idx, archiveModal.inputId.trim(), archiveModal.returnStock);
                }
                setArchiveModal(null);
              }} style={{ ...btnStyle("#ef5350"), flex: 2 }}>確認刪除</button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Confirm Modal */}
      {confirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, maxWidth: 340, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
              <h3 style={{ margin: "0 0 8px", color: "#1a2b3c", fontSize: 17 }}>{confirmModal.title}</h3>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>{confirmModal.message}</p>
            </div>
            {confirmModal.isPasswordMode && (
              <div style={{ marginBottom: 8 }}>
                <input
                  type="password"
                  value={confirmModal.inputVal || ""}
                  onChange={e => setConfirmModal(m => ({ ...m, inputVal: e.target.value, error: "" }))}
                  placeholder="請輸入管理員密碼"
                  style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${confirmModal.error ? "#ef5350" : "#e2e8f0"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
                {confirmModal.error && <div style={{ color: "#ef5350", fontSize: 12, marginTop: 6 }}>{confirmModal.error}</div>}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setConfirmModal(null)} style={{ ...btnStyle("#78909c", true), flex: 1 }}>取消</button>
              <button onClick={() => {
                if (confirmModal.isPasswordMode) {
                  confirmModal.onConfirm(confirmModal.inputVal || "");
                } else {
                  confirmModal.onConfirm();
                }
              }} style={{ ...btnStyle("#ef5350"), flex: 2 }}>確認</button>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
          onClick={() => setEditingProduct(null)}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 18px", color: "#1a2b3c" }}>編輯商品</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>商品分類</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["adult", "成人款式", "#1565C0", "#e3f2fd"], ["kids", "兒童款式", "#c62828", "#fce4ec"]].map(([val, lbl, activeColor, activeBg]) => (
                  <button key={val} onClick={() => setEditingProduct(p => ({ ...p, category: val }))}
                    style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `2px solid ${(editingProduct.category || "adult") === val ? activeColor : "#e2e8f0"}`, background: (editingProduct.category || "adult") === val ? activeBg : "white", color: (editingProduct.category || "adult") === val ? activeColor : "#94a3b8", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>{lbl}</button>
                ))}
              </div>
            </div>
            <input type="file" accept="image/*" ref={editFileRef} onChange={(e) => handleImageUpload(e, true)} style={{ display: "none" }} />
            <div onClick={() => editFileRef.current.click()} style={{ border: "2px dashed #cbd5e1", borderRadius: 10, padding: 10, textAlign: "center", cursor: "pointer", marginBottom: 14, background: "#f8fafc" }}>
              {editingProduct.image
                ? <img src={editingProduct.image} alt="preview" style={{ maxHeight: 80, maxWidth: "100%", borderRadius: 6 }} />
                : <><IconUpload /><div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>點擊更換圖片</div></>}
            </div>
            {[
              { label: "商品名稱", key: "name" },
              { label: "說明", key: "description" },
              { label: "價格", key: "price", type: "number" },
              { label: "庫存數量", key: "stock", type: "number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>{f.label}</label>
                <input type={f.type || "text"} value={editingProduct[f.key] ?? ""} onChange={e => setEditingProduct(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button onClick={() => setEditingProduct(null)} style={{ ...btnStyle("#78909c", true), flex: 1 }}>取消</button>
              <button onClick={saveEdit} style={{ ...btnStyle("#4CAF50"), flex: 2 }}>儲存變更</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared Style Helper ───────────────────────────────────────────────────────
function btnStyle(color, outline = false) {
  return {
    background: outline ? "transparent" : color,
    color: outline ? color : "white",
    border: `2px solid ${color}`,
    borderRadius: 10,
    padding: "9px 18px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "opacity 0.2s",
  };
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProductsRaw, prodLoaded] = useStorage("glasses:products", SAMPLE_PRODUCTS);
  const [orders, setOrdersRaw, ordLoaded] = useStorage("glasses:orders", []);
  const [archivedOrders, setArchivedOrdersRaw, archLoaded] = useStorage("glasses:archived", []);
  const [adminPwd, setAdminPwdRaw, pwdLoaded] = useStorage("glasses:adminpwd", DEFAULT_ADMIN_PASSWORD);
  const [superPwd, setSuperPwdRaw, superPwdLoaded] = useStorage("glasses:superpwd", "HuaMei@Super2026");
  const [view, setView] = useState(() => {
    try { return sessionStorage.getItem("glasses:adminView") === "admin" ? "admin" : "shop"; } catch { return "shop"; }
  });
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState(false);
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingDone(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const switchView = (v) => {
    setView(v);
    try { sessionStorage.setItem("glasses:adminView", v); } catch {}
  };
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminBtn, setShowAdminBtn] = useState(true);
  const logoClickTimer = useRef(null);

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    if (newCount >= 3) {
      setShowAdminBtn(true);
      setLogoClicks(0);
    } else {
      logoClickTimer.current = setTimeout(() => setLogoClicks(0), 2000);
    }
  };

  const setProducts = (v) => setProductsRaw(typeof v === "function" ? v(products) : v);
  const setOrders = (v) => setOrdersRaw(typeof v === "function" ? v(orders) : v);
  const setArchivedOrders = (v) => setArchivedOrdersRaw(typeof v === "function" ? v(archivedOrders) : v);
  const setAdminPwd = (v) => setAdminPwdRaw(v);
  const setSuperPwd = (v) => setSuperPwdRaw(v);

  const handleOrder = (order) => {
    const insufficient = order.items.filter(item => {
      const p = products.find(p => p.id === item.id);
      return !p || p.stock < item.qty;
    });
    if (insufficient.length > 0) {
      alert(`⚠️ 很抱歉，以下商品庫存不足，請重新選購：\n${insufficient.map(i => i.name).join("、")}`);
      return null;
    }
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');
    const todayOrders = orders.filter(o => o.orderNo && o.orderNo.startsWith(dateStr));
    const seq = String(todayOrders.length + 1).padStart(3, '0');
    const orderNo = `${dateStr}-${seq}`;
    const updatedProducts = products.map(p => {
      const orderItem = order.items.find(item => item.id === p.id);
      if (orderItem) return { ...p, stock: Math.max(0, p.stock - orderItem.qty) };
      return p;
    });
    setProducts(updatedProducts);
    setOrders([...orders, { ...order, orderNo, status: "待處理" }]);
    return orderNo;
  };

  const archiveOrder = (idx, confirmedId, stockReturned = false) => {
    const order = orders[idx];
    const archivedAt = new Date().toLocaleString("zh-TW");
    setArchivedOrders([...archivedOrders, { ...order, archivedAt, archivedBy: confirmedId, stockReturned }]);
    setOrders(orders.filter((_, i) => i !== idx));
  };

  const enterAdmin = () => {
    if (pwd === adminPwd) { switchView("admin"); setShowPwdModal(false); setPwd(""); setPwdErr(false); }
    else setPwdErr(true);
  };

  if (!minLoadingDone || !prodLoaded || !ordLoaded || !pwdLoaded || !archLoaded || !superPwdLoaded) return (
    <div className="loading-screen">
      <style>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7f7f5;
          font-family: 'Noto Sans TC', 'PingFang TC', sans-serif;
        }
        .loading-picture {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 1;
        }
        .loading-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          animation: loadingHeroZoom 5s ease-out forwards;
        }
        .loading-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(15,23,42,.18) 0%, rgba(15,23,42,.08) 46%, rgba(15,23,42,.04) 100%);
          z-index: 2;
        }
        .loading-bar {
          position: absolute;
          left: 50%;
          bottom: clamp(36px, 7vh, 76px);
          transform: translateX(-50%);
          width: min(320px, 42vw);
          height: 4px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(15,23,42,.16);
          z-index: 20;
          border: 1px solid rgba(255,255,255,.35);
        }
        .loading-bar::after {
          content: "";
          display: block;
          width: 42%;
          height: 100%;
          border-radius: inherit;
          background: #0f172a;
          animation: loadingBar 1.25s ease-in-out infinite;
        }
        @keyframes loadingHeroZoom {
          from { transform: scale(1.02); }
          to { transform: scale(1); }
        }
        @keyframes loadingBar {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(260%); }
        }
        @media (max-width: 768px) {
          .loading-screen {
            background: #f7f7f5;
          }
          .loading-hero-img {
            object-fit: contain;
            object-position: center center;
            animation: none;
          }
          .loading-overlay {
            display: none;
          }
          .loading-bar {
            display: block !important;
            position: absolute;
            left: 50%;
            bottom: calc(72px + env(safe-area-inset-bottom));
            transform: translateX(-50%);
            width: min(320px, 68vw);
            height: 7px;
            border-radius: 999px;
            background: rgba(15,23,42,.24);
            box-shadow: 0 3px 14px rgba(15,23,42,.18), 0 0 0 1px rgba(255,255,255,.65);
            z-index: 30;
          }
          .loading-bar::after {
            background: #0f172a;
          }
        }
      `}</style>
      <picture className="loading-picture">
        <source media="(max-width: 768px)" srcSet="/loading-hero-mobile.jpg" />
        <img src="/loading-hero.jpg" alt="華美光學員工特賣會" className="loading-hero-img" />
      </picture>
      <div className="loading-overlay" />
      <div className="loading-bar" aria-label="載入中" />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #e8f4f8 0%, #f0f4f8 50%, #fce4ec 100%)", fontFamily: "'Noto Sans TC', 'PingFang TC', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: view === "shop" ? "100%" : 720, margin: "0 auto", padding: view === "shop" ? "14px clamp(18px, 4vw, 54px)" : "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="data:image/png;base64,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" alt="華美光學" style={{ width: 44, height: 44, objectFit: "contain" }} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: 900, fontSize: "clamp(15px, 3.7vw, 19px)", color: "#1a2b3c" }}>華美光學</span>
              <span style={{ fontWeight: 800, fontSize: "clamp(11px, 2.8vw, 14px)", color: "#1a2b3c", letterSpacing: 1 }}>員工特賣會</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {view === "admin" ? (
              <>
                <button onClick={() => { switchView("shop"); }} style={{ ...btnStyle("#2196F3", true), fontSize: 13 }}>← 員工購物頁</button>
                <button onClick={() => { switchView("shop"); }} style={{ ...btnStyle("#ef5350", true), fontSize: 13 }}>登出</button>
              </>
            ) : showAdminBtn ? (
              <button onClick={() => setShowPwdModal(true)} style={{ ...btnStyle("#455a64", true), fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
                🔒 管理後台
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={view === "shop" ? { width: "100%", margin: 0, padding: 0 } : { maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}>
        {view === "shop"
          ? <EmployeeView products={products} onOrder={handleOrder} />
          : <AdminView products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} adminPwd={adminPwd} setAdminPwd={setAdminPwd} archiveOrder={archiveOrder} archivedOrders={archivedOrders} setArchivedOrders={setArchivedOrders} superPwd={superPwd} setSuperPwd={setSuperPwd} />}
      </div>

      {/* Password Modal */}
      {showPwdModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}
          onClick={() => { setShowPwdModal(false); setPwd(""); setPwdErr(false); }}>
          <div style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 320, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔒</div>
              <h3 style={{ margin: 0, color: "#1a2b3c" }}>管理員登入</h3>
            </div>
            <input
              type="password"
              placeholder="請輸入管理員密碼"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setPwdErr(false); }}
              onKeyDown={e => e.key === "Enter" && enterAdmin()}
              style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${pwdErr ? "#ef5350" : "#e2e8f0"}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: pwdErr ? 6 : 16 }}
            />
            {pwdErr && <p style={{ color: "#ef5350", fontSize: 13, margin: "0 0 12px" }}>密碼錯誤，請重試</p>}
            <button onClick={enterAdmin} style={{ ...btnStyle("#1a2b3c"), width: "100%", padding: "12px 0" }}>進入後台</button>
          </div>
        </div>
      )}
    </div>
  );
}
